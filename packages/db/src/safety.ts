import type { DatabaseConfig } from "./config";

/**
 * Safeguards for anything that changes a database schema (migrations).
 *
 * A migration target is accepted only when ALL of these hold:
 *  - NODE_ENV is not `production`;
 *  - the database name is explicitly listed in DB_MIGRATION_ALLOWED_DATABASES (no implicit default);
 *  - the test target uses a database whose name ends in `_test`, and the development target does not;
 *  - the host is local (localhost / 127.0.0.1 / ::1 / the compose service name `postgres`);
 *  - nothing points at the legacy stack (SQL Server port 1433, legacy/sqlserver/mssql/sqlite names).
 */

export class UnsafeDatabaseTargetError extends Error {
  constructor(readonly reasons: string[]) {
    super(`Refusing to run against this database: ${reasons.join("; ")}`);
    this.name = "UnsafeDatabaseTargetError";
  }
}

export const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "postgres"] as const;

/** Ports and name fragments that identify the legacy Laravel/SQL Server stack. */
const LEGACY_PORTS = [1433, 1434];
const LEGACY_NAME_PATTERN = /(legacy|laravel|sqlserver|mssql|sqlite|forge|homestead)/i;

type Env = Record<string, string | undefined>;

export function parseAllowedDatabases(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

/** Return every reason the target is unsafe for migrations (empty array means allowed). */
export function migrationTargetViolations(
  config: Pick<DatabaseConfig, "target" | "host" | "port" | "database" | "user">,
  env: Env = process.env,
): string[] {
  const reasons: string[] = [];
  const allowed = parseAllowedDatabases(env.DB_MIGRATION_ALLOWED_DATABASES);

  if (env.NODE_ENV === "production") {
    reasons.push("NODE_ENV=production; migrations are restricted to development and test databases");
  }

  if (allowed.length === 0) {
    reasons.push("DB_MIGRATION_ALLOWED_DATABASES is empty; list the databases migrations may target");
  } else if (!allowed.includes(config.database)) {
    reasons.push(`database "${config.database}" is not listed in DB_MIGRATION_ALLOWED_DATABASES`);
  }

  if (config.target === "test" && !config.database.endsWith("_test")) {
    reasons.push(`test target must use a database whose name ends in "_test" (got "${config.database}")`);
  }
  if (config.target === "development" && config.database.endsWith("_test")) {
    reasons.push(`development target must not use a test database ("${config.database}")`);
  }

  if (!(LOCAL_HOSTS as readonly string[]).includes(config.host)) {
    reasons.push(`host "${config.host}" is not local (${LOCAL_HOSTS.join(", ")})`);
  }

  if (LEGACY_PORTS.includes(config.port)) {
    reasons.push(`port ${config.port} belongs to SQL Server (legacy stack)`);
  }
  if (LEGACY_NAME_PATTERN.test(config.database) || LEGACY_NAME_PATTERN.test(config.user)) {
    reasons.push("database or user name matches a legacy stack identifier");
  }

  return reasons;
}

/** Throw `UnsafeDatabaseTargetError` unless the target passes every safeguard. */
export function assertMigrationTargetAllowed(
  config: Pick<DatabaseConfig, "target" | "host" | "port" | "database" | "user">,
  env: Env = process.env,
): void {
  const reasons = migrationTargetViolations(config, env);
  if (reasons.length > 0) throw new UnsafeDatabaseTargetError(reasons);
}
