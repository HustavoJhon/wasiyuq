/**
 * Apply Drizzle migrations to the development or test database.
 *
 *   bun run db:migrate        # DATABASE_URL       (development)
 *   bun run db:migrate:test   # TEST_DATABASE_URL  (test)
 *
 * Refuses to run unless the target passes every safeguard in ../safety.ts.
 */
import { DatabaseConfigError, databaseTargets, describeDatabase, loadDatabaseConfig, type DatabaseTarget } from "../config";
import { runMigrations } from "../migrate";
import { UnsafeDatabaseTargetError } from "../safety";

function log(level: "info" | "error", message: string, meta: Record<string, unknown> = {}) {
  const line = JSON.stringify({ level, message, timestamp: new Date().toISOString(), ...meta });
  (level === "error" ? console.error : console.log)(line);
}

const arg = (process.argv[2] ?? "development") as DatabaseTarget;
if (!databaseTargets.includes(arg)) {
  log("error", "unknown migration target", { target: arg, allowed: databaseTargets });
  process.exit(2);
}

try {
  const config = loadDatabaseConfig(arg);
  log("info", "migrations starting", describeDatabase(config));
  const result = await runMigrations(config);
  log("info", result.status === "applied" ? "migrations applied" : "migrations skipped", { ...result });
} catch (error) {
  if (error instanceof DatabaseConfigError) {
    log("error", "invalid database configuration", { issues: error.issues });
  } else if (error instanceof UnsafeDatabaseTargetError) {
    log("error", "migration refused by safety checks", { reasons: error.reasons });
  } else {
    log("error", "migration failed", { error: error instanceof Error ? error.message : String(error) });
  }
  process.exit(1);
}
