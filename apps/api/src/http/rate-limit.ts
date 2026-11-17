import type { MiddlewareHandler } from "hono";
import { HttpError } from "./errors";

/**
 * Fixed-window, in-process rate limiter for /api/v1. Authentication endpoints are limited by Better Auth
 * (database-backed, shared across instances); this limiter only adds a per-process guard on business endpoints.
 */
export function rateLimit(options: { windowMs: number; max: number; key: (c: Parameters<MiddlewareHandler>[0]) => string | null }): MiddlewareHandler {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return async (c, next) => {
    const key = options.key(c);
    if (key) {
      const now = Date.now();
      if (hits.size > 10_000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
      const entry = hits.get(key);
      if (!entry || entry.resetAt <= now) hits.set(key, { count: 1, resetAt: now + options.windowMs });
      else if (++entry.count > options.max) {
        c.header("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
        throw new HttpError("RATE_LIMITED", "Demasiadas solicitudes, inténtalo más tarde");
      }
    }
    await next();
  };
}
