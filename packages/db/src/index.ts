// Public API of @wasiyuq/db. Import only from this entry point.
export {
  databaseTargets,
  databaseUrlVariables,
  DatabaseConfigError,
  describeDatabase,
  loadDatabaseConfig,
  targetFromNodeEnv,
  type DatabaseConfig,
  type DatabaseTarget,
} from "./config";
export { createDatabase, type Database, type DatabaseHandle, type Schema } from "./client";
export { checkDatabaseHealth, type DatabaseHealth } from "./health";
export {
  defaultMigrationsFolder,
  hasMigrations,
  runMigrations,
  type MigrationResult,
  type RunMigrationsOptions,
} from "./migrate";
export {
  assertMigrationTargetAllowed,
  LOCAL_HOSTS,
  migrationTargetViolations,
  parseAllowedDatabases,
  UnsafeDatabaseTargetError,
} from "./safety";
export * as schema from "./schema";
export * from "./schema";
