import { Hono } from "hono";
import { checkDatabaseHealth, describeDatabase, type DatabaseHandle } from "@wasiyuq/db";
import { healthResponseSchema, readinessResponseSchema, type DependencyCheck } from "@wasiyuq/validation";
import { log } from "./logger";

export interface AppOptions {
  /** Database handle, or null when the database is not configured. */
  database: DatabaseHandle | null;
  /** Returns true once graceful shutdown has started; readiness then reports not_ready. */
  isShuttingDown?: () => boolean;
  readinessTimeoutMs?: number;
}

const SERVICE = "api";

export function createApp(options: AppOptions) {
  const { database, isShuttingDown = () => false, readinessTimeoutMs = 2000 } = options;
  const app = new Hono();

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
      checks: { database: check },
    });
    return c.json(body, ready ? 200 : 503);
  });

  return app;
}
