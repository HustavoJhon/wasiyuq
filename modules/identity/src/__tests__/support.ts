import { assertMigrationTargetAllowed, checkDatabaseHealth, createDatabase, loadDatabaseConfig, runMigrations, type DatabaseConfig } from "@wasiyuq/db";

/** Resolve the isolated test database (migrated), or null to skip integration suites. */
export async function resolveTestDatabase(): Promise<DatabaseConfig | null> {
  if (!process.env.TEST_DATABASE_URL) return null;
  const config = loadDatabaseConfig("test");
  assertMigrationTargetAllowed(config);
  const probe = createDatabase({ ...config, connectTimeoutSeconds: 2 });
  const health = await checkDatabaseHealth(probe, 3000);
  await probe.close();
  if (health.status !== "up") return null;
  await runMigrations(config);
  return config;
}

const run = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
let seq = 0;
export const uniqueEmail = (prefix = "user") => `${prefix}-${run}-${++seq}@example.test`;
/** Distinct fake client IP per test so rate limits don't leak between tests. */
export const uniqueIp = () => `10.${(seq >> 8) & 255}.${seq & 255}.${Math.floor(Math.random() * 250) + 1}`;
