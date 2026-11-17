import { z } from "zod";

/**
 * Authentication configuration, validated from the environment.
 *
 * AUTH_BASE_URL is the public origin that serves `/api/auth` to browsers (the web app origin when the API is
 * reverse-proxied under it, e.g. Vite's dev proxy). Links in emails and OAuth callbacks are built from it.
 */
export interface AuthConfig {
  secret: string;
  baseUrl: string;
  webAppUrl: string;
  trustedOrigins: string[];
  production: boolean;
  rateLimit: boolean;
  /**
   * When true, the client IP is the rightmost X-Forwarded-For entry (appended by our single trusted reverse
   * proxy). When false, it is the socket address. Either way the server writes it into CLIENT_IP_HEADER.
   */
  trustProxy: boolean;
  google: { clientId: string; clientSecret: string } | null;
  mailTransport: "console" | "memory";
}

export class AuthConfigError extends Error {
  constructor(readonly issues: string[]) {
    super(`Invalid authentication configuration: ${issues.join("; ")}`);
    this.name = "AuthConfigError";
  }
}

/** Header the API server always overwrites with the resolved client IP. Better Auth reads only this header. */
export const CLIENT_IP_HEADER = "x-wasiyuq-client-ip";

/**
 * Resolve the client IP for rate limiting. Never trusts client-supplied values unless a proxy is configured,
 * and then only the rightmost X-Forwarded-For hop (the one our proxy appended), never the leftmost.
 */
export function resolveClientIp(headers: Headers, socketIp: string | null | undefined, trustProxy: boolean): string {
  if (trustProxy) {
    const hops = (headers.get("x-forwarded-for") ?? "")
      .split(",")
      .map((hop) => hop.trim())
      .filter(Boolean);
    const last = hops.at(-1);
    if (last) return last;
  }
  return socketIp || "unknown";
}

const url = z
  .string()
  .trim()
  .url()
  .transform((value) => value.replace(/\/+$/, ""));

const schema = z
  .object({
    NODE_ENV: z.string().optional(),
    AUTH_SECRET: z.string().min(32, "must be at least 32 characters (use `openssl rand -base64 48`)"),
    AUTH_BASE_URL: url,
    WEB_APP_URL: url,
    AUTH_TRUSTED_ORIGINS: z.string().optional(),
    AUTH_RATE_LIMIT: z.enum(["on", "off"]).default("on"),
    AUTH_TRUST_PROXY: z.enum(["true", "false"]).default("false"),
    GOOGLE_CLIENT_ID: z.string().trim().optional(),
    GOOGLE_CLIENT_SECRET: z.string().trim().optional(),
    MAIL_TRANSPORT: z.enum(["console", "memory"]).default("console"),
  })
  .superRefine((env, ctx) => {
    const production = env.NODE_ENV === "production";
    if (Boolean(env.GOOGLE_CLIENT_ID) !== Boolean(env.GOOGLE_CLIENT_SECRET)) {
      ctx.addIssue({ code: "custom", path: ["GOOGLE_CLIENT_ID"], message: "set both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET or neither" });
    }
    if (production) {
      ctx.addIssue({
        code: "custom",
        path: ["MAIL_TRANSPORT"],
        message: "no production email transport is implemented yet; refusing to start with a development transport",
      });
      if (env.AUTH_RATE_LIMIT === "off") ctx.addIssue({ code: "custom", path: ["AUTH_RATE_LIMIT"], message: "cannot be off in production" });
      for (const key of ["AUTH_BASE_URL", "WEB_APP_URL"] as const) {
        if (!env[key].startsWith("https://")) ctx.addIssue({ code: "custom", path: [key], message: "must use https in production" });
      }
    }
  });

export function loadAuthConfig(env: Record<string, string | undefined> = process.env): AuthConfig {
  const result = schema.safeParse(env);
  if (!result.success) {
    throw new AuthConfigError(result.error.issues.map((issue) => `${issue.path.join(".")} ${issue.message}`));
  }
  const data = result.data;
  const extra = (data.AUTH_TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  return {
    secret: data.AUTH_SECRET,
    baseUrl: data.AUTH_BASE_URL,
    webAppUrl: data.WEB_APP_URL,
    trustedOrigins: [...new Set([data.WEB_APP_URL, data.AUTH_BASE_URL, ...extra])],
    production: data.NODE_ENV === "production",
    rateLimit: data.AUTH_RATE_LIMIT === "on",
    trustProxy: data.AUTH_TRUST_PROXY === "true",
    google:
      data.GOOGLE_CLIENT_ID && data.GOOGLE_CLIENT_SECRET
        ? { clientId: data.GOOGLE_CLIENT_ID, clientSecret: data.GOOGLE_CLIENT_SECRET }
        : null,
    mailTransport: data.MAIL_TRANSPORT,
  };
}
