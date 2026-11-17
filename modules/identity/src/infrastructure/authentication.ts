import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { accounts, rateLimits, sessions, users, verifications, type Database } from "@wasiyuq/db";
import type { AccountStatus, PlatformRole } from "@wasiyuq/validation";
import type { EmailSender } from "../domain/ports";
import type { IdentityUser } from "../domain/user";
import type { AuthConfig } from "./auth-config";
import { emailTemplates } from "./email/templates";

export interface AuthenticatedSession {
  session: { id: string; expiresAt: Date; createdAt: Date };
  user: IdentityUser;
}

export interface AuthenticationHooks {
  /** Called after any user is created (email sign-up or OAuth). Must be idempotent. */
  onUserCreated?: (user: { id: string; name: string; email: string }) => Promise<void>;
  /** Structured logger for non-fatal failures inside auth callbacks (no secrets). */
  logError?: (message: string, meta: Record<string, unknown>) => void;
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
export function createAuthentication(db: Database, config: AuthConfig, mailer: EmailSender, hooks: AuthenticationHooks = {}): Authentication {
  const logError = hooks.logError ?? (() => {});

  const auth = betterAuth({
    appName: "WASIYUQ",
    baseURL: config.baseUrl,
    basePath: AUTH_BASE_PATH,
    secret: config.secret,
    trustedOrigins: config.trustedOrigins,
    telemetry: { enabled: false },
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
      autoSignIn: true,
      // Legacy parity: unverified users may sign in, but organization features require a verified email.
      requireEmailVerification: false,
      resetPasswordTokenExpiresIn: 60 * 60,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        await mailer.send(emailTemplates.passwordReset(user.email, user.name, url));
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      expiresIn: ONE_DAY,
      sendVerificationEmail: async ({ user, url }) => {
        await mailer.send(emailTemplates.verification(user.email, user.name, url));
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
    disabledPaths: ["/update-user", "/change-email", "/delete-user"],
    advanced: {
      // Explicit: Better Auth silently skips origin/CSRF checks when it detects a test environment. Keeping them
      // on everywhere means tests exercise the same protection as production.
      disableOriginCheck: false,
      disableCSRFCheck: false,
      cookiePrefix: "wasiyuq",
      useSecureCookies: config.production,
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
      ipAddress: { ipAddressHeaders: [config.clientIpHeader] },
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
              logError("post sign-up hook failed", { userId: user.id, error: error instanceof Error ? error.message : String(error) });
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
    handler: (request) => auth.handler(request),
    async getSession(headers) {
      const result = await auth.api.getSession({ headers, query: { disableRefresh: false } });
      if (!result) return null;
      const u = result.user as typeof result.user & Record<string, unknown>;
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
          status: ((u.status as string | undefined) ?? "active") as AccountStatus,
          createdAt: new Date(u.createdAt),
        },
      };
    },
  };
}
