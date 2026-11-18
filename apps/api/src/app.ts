import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { secureHeaders } from "hono/secure-headers";
import { checkDatabaseHealth, describeDatabase, type DatabaseHandle } from "@wasiyuq/db";
import { healthResponseSchema, readinessResponseSchema, type DependencyCheck } from "@wasiyuq/validation";
import type { ApiServices, AppEnv } from "./http/context";
import { errorResponse, HttpError, httpError } from "./http/errors";
import { originGuard, requestContext, requireAuth, requireVerifiedEmail } from "./http/middleware";
import { rateLimit } from "./http/rate-limit";
import { log } from "./logger";
import { adminRoutes } from "./routes/admin";
import { invitationRoutes } from "./routes/invitations";
import { meRoutes } from "./routes/me";
import { organizationRoutes } from "./routes/organizations";
import { roleRoutes } from "./routes/roles";

export interface AppOptions {
  /** Database handle, or null when the database is not configured. */
  database: DatabaseHandle | null;
  /** Identity/organization services. When absent only /health and /ready are served. */
  services?: ApiServices;
  /** Returns true once graceful shutdown has started; readiness then reports not_ready. */
  isShuttingDown?: () => boolean;
  readinessTimeoutMs?: number;
}

const SERVICE = "api";

export function createApp(options: AppOptions) {
  const { database, services, isShuttingDown = () => false, readinessTimeoutMs = 2000 } = options;
  const app = new Hono<AppEnv>();

  app.use("*", requestContext);
  app.use("*", secureHeaders());

  // Liveness: the process is running. Deliberately does not touch the database.
  app.get("/health", (c) =>
    c.json(healthResponseSchema.parse({ status: "ok", service: SERVICE, timestamp: new Date().toISOString() })),
  );

  // Readiness: the API can serve traffic that needs PostgreSQL.
  app.get("/ready", async (c) => {
    let check: DependencyCheck;

    if (!database) {
      check = { status: "not_configured" };
    } else if (isShuttingDown()) {
      check = { status: "down", code: "SHUTTING_DOWN" };
    } else {
      const health = await checkDatabaseHealth(database, readinessTimeoutMs);
      if (health.status === "up") {
        check = { status: "up", latencyMs: health.latencyMs };
      } else {
        check = { status: "down", latencyMs: health.latencyMs, code: health.code ?? "UNAVAILABLE" };
        log("error", "database readiness check failed", {
          ...describeDatabase(database.config),
          error: health.error,
          code: health.code,
          latencyMs: health.latencyMs,
        });
      }
    }

    const ready = check.status === "up";
    const body = readinessResponseSchema.parse({
      status: ready ? "ready" : "not_ready",
      service: SERVICE,
      timestamp: new Date().toISOString(),
      // Email delivery state is deliberately absent: any per-message signal on a public endpoint can reveal
      // whether a request (e.g. a password reset for some address) produced an email. See /api/v1/admin/email-health.
      checks: { database: check },
    });
    return c.json(body, ready ? 200 : 503);
  });

  if (services) {
    // Authentication (Better Auth): sign-up/in/out, verification, password reset, OAuth. Responses use Better Auth's format.
    app.on(["GET", "POST"], `${services.auth.basePath}/*`, (c) => services.auth.handler(c.req.raw));

    // Public: which sign-in methods the UI should offer.
    app.get("/api/public/auth-providers", (c) => c.json(services.providers));

    const v1 = new Hono<AppEnv>();
    // Bounded request bodies (defence in depth against oversized payloads reaching validation).
    v1.use(
      "*",
      bodyLimit({
        maxSize: 64 * 1024,
        onError: (c) => errorResponse(c, new HttpError("PAYLOAD_TOO_LARGE", "La solicitud es demasiado grande")),
      }),
    );
    v1.use("*", originGuard(services));
    v1.use("*", requireAuth(services));
    v1.use("*", rateLimit({ windowMs: 60_000, max: 120, key: (c) => c.get("auth")?.user.id ?? null }));
    v1.route("/me", meRoutes(services));
    v1.route("/roles", roleRoutes());
    for (const path of ["/organizations", "/organizations/*", "/invitations/*"]) v1.use(path, requireVerifiedEmail);
    v1.use("/invitations/*", rateLimit({ windowMs: 60_000, max: 20, key: (c) => `inv:${c.get("auth")?.user.id ?? ""}` }));
    v1.route("/organizations", organizationRoutes(services));
    v1.route("/invitations", invitationRoutes(services));
    v1.route("/admin", adminRoutes(services));
    app.route("/api/v1", v1);
  }

  app.notFound((c) => errorResponse(c, httpError.notFound()));
  app.onError((error, c) => errorResponse(c, error));

  return app;
}
