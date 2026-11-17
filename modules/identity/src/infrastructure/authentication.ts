import { eq } from "drizzle-orm";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { accounts, rateLimits, sessions, users, verifications, type Database } from "@wasiyuq/db";
import type { AccountStatus, PlatformRole } from "@wasiyuq/validation";
import type { EmailOutbox } from "../domain/ports";
import type { IdentityUser } from "../domain/user";
import { CLIENT_IP_HEADER, type AuthConfig } from "./auth-config";
import { emailTemplates } from "./email/templates";
import { createPasswordHasher, type PasswordHasher } from "./password-hasher";

export interface AuthenticatedSession {
  session: { id: string; expiresAt: Date; createdAt: Date };
  user: IdentityUser;
}

export interface AuthenticationHooks {
  /** Called after any user is created (email sign-up or OAuth). Must be idempotent. */
  onUserCreated?: (user: { id: string; name: string; email: string }) => Promise<void>;
  /** Structured logger (no secrets). Also receives Better Auth's own log lines, redacted. */
  log?: (level: "info" | "warn" | "error", message: string, meta: Record<string, unknown>) => void;
  /** Override the password hasher (tests). Defaults to the bounded scrypt hasher. */
  passwordHasher?: PasswordHasher;
}

export interface Authentication {
  /** Fetch handler for every `/api/auth/*` route (sign-up, sign-in, sign-out, verification, reset, OAuth). */
  handler(request: Request): Promise<Response>;
  /** Resolve the session from request headers (cookie). Returns null when absent, expired or revoked. */
  getSession(headers: Headers): Promise<AuthenticatedSession | null>;
  readonly basePath: string;
}

export const AUTH_BASE_PATH = "/api/auth";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const ONE_DAY = 60 * 60 * 24;

/**
 * Better Auth adapter. Provider details stay here: the rest of the system only sees `Authentication`
 * and `IdentityUser`.
 */
export function createAuthentication(db: Database, config: AuthConfig, outbox: EmailOutbox, hooks: AuthenticationHooks = {}): Authentication {
  const log = hooks.log ?? (() => {});
  const passwordHasher = hooks.passwordHasher ?? createPasswordHasher({ concurrency: config.passwordHashConcurrency });
  const loginUrl = `${config.webAppUrl}/login`;

  const auth = betterAuth({
    appName: "WASIYUQ",
    baseURL: config.baseUrl,
    basePath: AUTH_BASE_PATH,
    secret: config.secret,
    trustedOrigins: config.trustedOrigins,
    telemetry: { enabled: false },
    // Better Auth logs errors with raw arguments (database errors can carry emails and SQL parameters). Route its
    // lines through the structured logger with emails redacted and arguments reduced to their error type.
    logger: {
      level: "warn",
      log: (level, message, ...args) => {
        log(level === "debug" ? "info" : level, "better-auth", { detail: redactEmails(message), errorTypes: args.map(describeArgument) });
      },
    },
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: { user: users, session: sessions, account: accounts, verification: verifications, rateLimit: rateLimits },
    }),
    user: {
      additionalFields: {
        dni: { type: "string", required: false, input: false },
        whatsapp: { type: "string", required: false, input: false },
        platformRole: { type: "string", required: false, defaultValue: "user", input: false },
        status: { type: "string", required: false, defaultValue: "active", input: false },
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      // No session on sign-up: Better Auth then answers a sign-up for an existing email exactly like a new one
      // (same status, same body shape, password hashed in both paths), so the endpoint cannot enumerate accounts.
      // The owner of the existing account is told by email instead (onExistingUserSignUp).
      autoSignIn: false,
      // Legacy parity: unverified users may sign in, but organization features require a verified email.
      requireEmailVerification: false,
      password: {
        hash: (password) => passwordHasher.hash(password),
        verify: (input) => passwordHasher.verify(input),
      },
      resetPasswordTokenExpiresIn: 60 * 60,
      revokeSessionsOnPasswordReset: true,
      // Emails go to the background outbox: responses never wait for (or reveal) delivery.
      sendResetPassword: async ({ user, url }) => {
        outbox.dispatch(emailTemplates.passwordReset(user.email, user.name, url));
      },
      onPasswordReset: async ({ user }) => {
        outbox.dispatch(emailTemplates.passwordChanged(user.email, user.name, loginUrl));
      },
      onExistingUserSignUp: async ({ user }) => {
        outbox.dispatch(emailTemplates.accountExists(user.email, user.name, loginUrl));
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      expiresIn: ONE_DAY,
      sendVerificationEmail: async ({ user, url }) => {
        outbox.dispatch(emailTemplates.verification(user.email, user.name, url));
      },
    },
    verification: { storeIdentifier: "hashed" },
    session: {
      expiresIn: SESSION_TTL_SECONDS,
      updateAge: ONE_DAY,
      // No cookie cache: every request is checked against the database so revocation is immediate.
      cookieCache: { enabled: false },
    },
    account: {
      accountLinking: {
        enabled: true,
        // Legacy parity (Socialite): a Google sign-in links to an existing account with the same verified email.
        trustedProviders: ["google"],
        // Never attach Google to a local account whose email was not verified (pre-registration takeover).
        requireLocalEmailVerified: true,
      },
    },
    socialProviders: config.google
      ? { google: { clientId: config.google.clientId, clientSecret: config.google.clientSecret, prompt: "select_account" } }
      : {},
    rateLimit: {
      enabled: config.rateLimit,
      storage: "database",
      window: 60,
      max: 100,
      customRules: {
        // Legacy Fortify: 5 login attempts per minute.
        "/sign-in/email": { window: 60, max: 5 },
        "/sign-up/email": { window: 60, max: 5 },
        "/request-password-reset": { window: 300, max: 3 },
        "/reset-password": { window: 300, max: 5 },
        "/send-verification-email": { window: 300, max: 3 },
      },
    },
    // Profile, email and deletion changes go through the identity module (validated, audited rules), not Better Auth.
    // `/list-sessions` returns every session token to JavaScript; the API exposes /api/v1/me/sessions instead.
    disabledPaths: ["/update-user", "/change-email", "/delete-user", "/list-sessions"],
    advanced: {
      // Explicit: Better Auth silently skips origin/CSRF checks when it detects a test environment. Keeping them
      // on everywhere means tests exercise the same protection as production.
      disableOriginCheck: false,
      disableCSRFCheck: false,
      cookiePrefix: "wasiyuq",
      useSecureCookies: config.production,
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
      // Only our server-written header is read; see resolveClientIp.
      ipAddress: { ipAddressHeaders: [CLIENT_IP_HEADER] },
      database: { generateId: false },
    },
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            try {
              await hooks.onUserCreated?.({ id: user.id, name: user.name, email: user.email });
            } catch (error) {
              // The account exists; the personal organization is re-ensured on the next /me request.
              log("error", "post sign-up hook failed", { userId: user.id, errorType: describeArgument(error) });
            }
          },
        },
      },
      session: {
        create: {
          before: async (session) => {
            const [row] = await db.query.users.findMany({ where: (u, { eq }) => eq(u.id, session.userId), columns: { status: true }, limit: 1 });
            if (row && row.status !== "active") {
              throw new APIError("FORBIDDEN", { message: "Tu cuenta está suspendida", code: "ACCOUNT_SUSPENDED" });
            }
          },
        },
      },
    },
  });

  return {
    basePath: AUTH_BASE_PATH,
    handler: async (request) => stripSessionTokens(await auth.handler(request)),
    async getSession(headers) {
      const result = await auth.api.getSession({ headers, query: { disableRefresh: false } });
      if (!result) return null;
      const u = result.user as typeof result.user & Record<string, unknown>;
      // Fail closed: only explicitly active accounts get a session. Suspended (or malformed) accounts lose it.
      if (u.status !== "active") {
        await db.delete(sessions).where(eq(sessions.id, result.session.id));
        return null;
      }
      return {
        session: { id: result.session.id, expiresAt: new Date(result.session.expiresAt), createdAt: new Date(result.session.createdAt) },
        user: {
          id: u.id,
          name: u.name,
          email: u.email,
          emailVerified: u.emailVerified,
          image: u.image ?? null,
          dni: (u.dni as string | null | undefined) ?? null,
          whatsapp: (u.whatsapp as string | null | undefined) ?? null,
          platformRole: ((u.platformRole as string | undefined) ?? "user") as PlatformRole,
          status: "active" satisfies AccountStatus,
          createdAt: new Date(u.createdAt),
        },
      };
    },
  };
}

/**
 * Better Auth includes the session token in some JSON bodies (sign-up, sign-in, get-session) for bearer-token
 * clients. Browsers authenticate with the httpOnly cookie only, so the token is removed from every JSON body to
 * keep it out of reach of JavaScript. (Mobile clients will use a dedicated flow; see docs.)
 */
export async function stripSessionTokens(response: Response): Promise<Response> {
  if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
  const text = await response.text();
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return new Response(text, response);
  }
  const scrub = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(scrub);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).filter(([key]) => key !== "token").map(([key, v]) => [key, scrub(v)]));
    }
    return value;
  };
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(JSON.stringify(scrub(body)), { status: response.status, statusText: response.statusText, headers });
}

const EMAIL_PATTERN = /[^\s@<>"'(),;:]+@[^\s@<>"'(),;:]+/g;

/** Replace anything that looks like an email address. */
export function redactEmails(text: string): string {
  return text.replace(EMAIL_PATTERN, "[email]");
}

/** Safe description of a log argument: its type and, for errors, the PostgreSQL SQLSTATE. Never the message. */
function describeArgument(value: unknown): string {
  if (value instanceof Error) {
    const code = (value as { code?: unknown }).code;
    return typeof code === "string" && /^[A-Z0-9_]{2,32}$/.test(code) ? `${value.name}:${code}` : value.name;
  }
  return typeof value;
}
