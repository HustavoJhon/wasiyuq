/**
 * Integration tests against the isolated test database (TEST_DATABASE_URL, e.g. wasiyuq_test).
 * Skipped automatically when TEST_DATABASE_URL is not set or the server is unreachable.
 * They never touch the development database: every object created lives in per-run schemas
 * (`probe_<random>` and its `_journal`) that are removed at the end.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createDatabase, type DatabaseHandle } from "../client";
import { loadDatabaseConfig, type DatabaseConfig } from "../config";
import { checkDatabaseHealth } from "../health";
import { runMigrations } from "../migrate";
import { assertMigrationTargetAllowed } from "../safety";

const packageDir = resolve(import.meta.dir, "../..");

async function resolveTestConfig(): Promise<DatabaseConfig | null> {
  if (!process.env.TEST_DATABASE_URL) return null;
  const config = loadDatabaseConfig("test");
  assertMigrationTargetAllowed(config); // never run integration tests against a non-test database
  const probe = createDatabase({ ...config, connectTimeoutSeconds: 2 });
  const health = await checkDatabaseHealth(probe, 3000);
  await probe.close();
  return health.status === "up" ? config : null;
}

const testConfig = await resolveTestConfig();
if (!testConfig) console.warn("[db] integration tests skipped: TEST_DATABASE_URL not set or unreachable");

describe("connection failures (no server required)", () => {
  test("health check reports refused connections without throwing", async () => {
    const config = loadDatabaseConfig("test", { TEST_DATABASE_URL: "postgres://wasiyuq:x@127.0.0.1:1/wasiyuq_test", DB_CONNECT_TIMEOUT_SECONDS: "1" });
    const handle = createDatabase(config);
    const health = await checkDatabaseHealth(handle, 3000);
    await handle.close();
    expect(health.status).toBe("down");
    if (health.status === "down") expect(health.error.length).toBeGreaterThan(0);
  });

  test("close() is idempotent", async () => {
    const handle = createDatabase(loadDatabaseConfig("test", { TEST_DATABASE_URL: "postgres://wasiyuq:x@127.0.0.1:1/wasiyuq_test" }));
    await handle.close();
    await handle.close();
    expect(handle.closed).toBe(true);
  });
});

describe.skipIf(!testConfig)("test database", () => {
  const config = testConfig as DatabaseConfig;
  const runId = `probe_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const journalSchema = `${runId}_journal`;
  const workDir = join(packageDir, ".tmp", runId);
  let handle: DatabaseHandle;

  beforeAll(() => {
    handle = createDatabase(config);
  });

  afterAll(async () => {
    // Remove only the schemas this run created, in the isolated test database.
    if (config.database.endsWith("_test")) {
      await handle.sql`drop schema if exists ${handle.sql(runId)} cascade`;
      await handle.sql`drop schema if exists ${handle.sql(journalSchema)} cascade`;
    }
    await handle.close();
    rmSync(workDir, { recursive: true, force: true });
  });

  test("connects and reports the configured database", async () => {
    const health = await checkDatabaseHealth(handle);
    expect(health).toMatchObject({ status: "up", database: config.database });
    const [row] = await handle.sql<{ one: number }[]>`select 1 as one`;
    expect(row?.one).toBe(1);
  });

  test("flags a server that reports a different database than configured", async () => {
    const mismatched = createDatabase({ ...config, database: "wasiyuq_other_test" });
    const health = await checkDatabaseHealth(mismatched);
    await mismatched.close();
    expect(health).toMatchObject({ status: "down", code: "UNEXPECTED_DATABASE" });
  });

  test("generates a migration with Drizzle Kit and applies it to the test database", async () => {
    mkdirSync(workDir, { recursive: true });
    writeFileSync(
      join(workDir, "schema.ts"),
      `import { pgSchema, serial, text } from "drizzle-orm/pg-core";
export const probe = pgSchema("${runId}");
export const probeItems = probe.table("probe_items", { id: serial("id").primaryKey(), label: text("label").notNull() });
`,
    );
    writeFileSync(
      join(workDir, "drizzle.config.ts"),
      `export default { schema: "${join(workDir, "schema.ts")}", out: "${join(workDir, "migrations")}", dialect: "postgresql" };\n`,
    );

    const generate = Bun.spawnSync(["bun", "x", "drizzle-kit", "generate", `--config=${join(workDir, "drizzle.config.ts")}`], {
      cwd: packageDir,
      stdout: "pipe",
      stderr: "pipe",
    });
    expect(generate.exitCode).toBe(0);

    const migrationsFolder = join(workDir, "migrations");
    const first = await runMigrations(config, { migrationsFolder, migrationsSchema: journalSchema });
    expect(first).toMatchObject({ status: "applied", database: config.database, appliedTotal: 1 });

    const tables = await handle.sql<{ table_name: string }[]>`
      select table_name from information_schema.tables where table_schema = ${runId} order by table_name
    `;
    expect(tables.map((t) => t.table_name)).toEqual(["probe_items"]);

    // Re-running is a no-op: migrations are applied exactly once.
    const second = await runMigrations(config, { migrationsFolder, migrationsSchema: journalSchema });
    expect(second).toMatchObject({ status: "applied", appliedTotal: 1 });
  });
});
