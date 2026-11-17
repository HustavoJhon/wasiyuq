import {
  checkDatabaseHealth,
  createDatabase,
  DatabaseConfigError,
  describeDatabase,
  loadDatabaseConfig,
  targetFromNodeEnv,
  type DatabaseHandle,
} from "@wasiyuq/db";
import { AuthConfigError, CLIENT_IP_HEADER, loadAuthConfig, resolveClientIp, type AuthConfig } from "@wasiyuq/module-identity";
import { createApp } from "./app";
import type { ApiServices } from "./http/context";
import { log } from "./logger";
import { createServices } from "./services";

type Env = Record<string, string | undefined>;

export interface StartServerOptions {
  env?: Env;
  /** Overrides PORT. Use 0 for a random free port (tests). */
  port?: number;
  /** Register SIGINT/SIGTERM handlers that shut down and exit the process. Default: true. */
  handleSignals?: boolean;
}

export interface RunningServer {
  readonly port: number;
  readonly database: DatabaseHandle | null;
  /** Stop accepting requests, finish in-flight ones, then close database connections. Idempotent. */
  shutdown(reason?: string): Promise<void>;
}

function openDatabase(env: Env): DatabaseHandle | null {
  try {
    const config = loadDatabaseConfig(targetFromNodeEnv(env.NODE_ENV), env);
    return createDatabase(config);
  } catch (error) {
    if (error instanceof DatabaseConfigError) {
      log("error", "database configuration invalid; readiness will report not_configured", { issues: error.issues });
      return null;
    }
    throw error;
  }
}

export async function startServer(options: StartServerOptions = {}): Promise<RunningServer> {
  const env = options.env ?? process.env;
  const database = openDatabase(env);

  if (database) {
    const health = await checkDatabaseHealth(database);
    const target = describeDatabase(database.config);
    if (health.status === "up") {
      log("info", "database connected", { ...target, latencyMs: health.latencyMs });
    } else {
      // Keep running: liveness stays OK and readiness reports the outage until PostgreSQL is reachable.
      log("error", "database connection failed", { ...target, error: health.error, code: health.code });
    }
  }

  let authConfig: AuthConfig | null = null;
  let services: ApiServices | undefined;
  try {
    authConfig = loadAuthConfig(env);
  } catch (error) {
    if (!(error instanceof AuthConfigError)) throw error;
    log("error", "authentication configuration invalid; identity endpoints disabled", { issues: error.issues });
  }
  if (database && authConfig) {
    services = createServices(database, authConfig);
    log("info", "identity services enabled", { googleOAuth: Boolean(authConfig.google), rateLimit: authConfig.rateLimit });
  }

  let shuttingDown = false;
  const app = createApp({ database, services, isShuttingDown: () => shuttingDown });
  const trustProxy = authConfig?.trustProxy ?? false;
  const server = Bun.serve({
    port: options.port ?? Number(env.PORT ?? 3001),
    fetch(request, bunServer) {
      // Always overwrite the client IP header: clients can never choose the key used for rate limiting.
      const headers = new Headers(request.headers);
      headers.set(CLIENT_IP_HEADER, resolveClientIp(request.headers, bunServer.requestIP(request)?.address, trustProxy));
      return app.fetch(new Request(request, { headers }));
    },
  });
  log("info", "api started", { port: server.port });

  let stopping: Promise<void> | null = null;
  const shutdown = (reason = "shutdown") => {
    stopping ??= (async () => {
      shuttingDown = true;
      log("info", "api shutting down", { reason });
      try {
        await server.stop();
        await database?.close();
        log("info", "api stopped", { reason });
      } catch (error) {
        log("error", "error during shutdown", { error: error instanceof Error ? error.message : String(error) });
        throw error;
      }
    })();
    return stopping;
  };

  if (options.handleSignals ?? true) {
    for (const signal of ["SIGINT", "SIGTERM"] as const) {
      process.once(signal, () => {
        shutdown(signal).then(
          () => process.exit(0),
          () => process.exit(1),
        );
      });
    }
  }

  return { port: server.port ?? 0, database, shutdown };
}
