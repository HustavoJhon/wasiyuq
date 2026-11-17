import type { Context, MiddlewareHandler } from "hono";
import { log } from "../logger";
import type { ApiServices, AppEnv, AuthState } from "./context";
import { HttpError, httpError } from "./errors";

/** Remove secrets from paths before logging (invitation tokens). */
export const redactPath = (path: string) => path.replace(/(\/invitations\/)[A-Za-z0-9_-]{20,}/, "$1:token");

export const requestContext: MiddlewareHandler<AppEnv> = async (c, next) => {
  const requestId = crypto.randomUUID();
  c.set("requestId", requestId);
  c.header("X-Request-Id", requestId);
  const started = performance.now();
  await next();
  const status = c.res.status;
  log(status >= 500 ? "error" : "info", "request", {
    requestId,
    method: c.req.method,
    path: redactPath(new URL(c.req.url).pathname),
    status,
    durationMs: Math.round(performance.now() - started),
    userId: c.get("auth")?.user.id,
  });
};

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * CSRF protection for cookie-authenticated /api/v1 mutations: the Origin must be trusted. A cookie-bearing
 * mutation without Origin is rejected (browsers always send it on cross-site POST/PATCH/DELETE).
 */
export function originGuard(services: Pick<ApiServices, "trustedOrigins">): MiddlewareHandler<AppEnv> {
  const trusted = new Set(services.trustedOrigins);
  return async (c, next) => {
    if (!SAFE_METHODS.has(c.req.method)) {
      const origin = c.req.header("origin");
      const hasCookie = Boolean(c.req.header("cookie"));
      if ((origin && !trusted.has(origin)) || (!origin && hasCookie)) {
        throw new HttpError("INVALID_ORIGIN", "Origen de la solicitud no permitido");
      }
    }
    await next();
  };
}

export function requireAuth(services: Pick<ApiServices, "auth">): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const session = await services.auth.getSession(c.req.raw.headers);
    if (!session) throw httpError.unauthenticated();
    c.set("auth", { user: session.user, sessionId: session.session.id });
    await next();
  };
}

/** Legacy `verified` middleware: organization features require a verified email. */
export const requireVerifiedEmail: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (!currentAuth(c).user.emailVerified) throw httpError.emailNotVerified();
  await next();
};

export function currentAuth(c: Context<AppEnv>): AuthState {
  const auth = c.get("auth");
  if (!auth) throw httpError.unauthenticated();
  return auth;
}

export const actorOf = (c: Context<AppEnv>) => {
  const { user } = currentAuth(c);
  return { userId: user.id, email: user.email, name: user.name };
};
