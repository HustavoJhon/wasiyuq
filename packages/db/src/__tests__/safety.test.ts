import { describe, expect, test } from "bun:test";
import { loadDatabaseConfig } from "../config";
import { runMigrations } from "../migrate";
import { assertMigrationTargetAllowed, migrationTargetViolations, UnsafeDatabaseTargetError } from "../safety";

const allowEnv = { DB_MIGRATION_ALLOWED_DATABASES: "wasiyuq_dev,wasiyuq_test" };
const dev = (url: string) => loadDatabaseConfig("development", { DATABASE_URL: url });
const tst = (url: string) => loadDatabaseConfig("test", { TEST_DATABASE_URL: url });

describe("migration safeguards", () => {
  test("allows explicitly listed local development and test databases", () => {
    expect(migrationTargetViolations(dev("postgres://wasiyuq:x@127.0.0.1:55432/wasiyuq_dev"), allowEnv)).toEqual([]);
    expect(migrationTargetViolations(tst("postgres://wasiyuq:x@localhost:55432/wasiyuq_test"), allowEnv)).toEqual([]);
  });

  test("refuses when no databases are explicitly authorized", () => {
    const reasons = migrationTargetViolations(dev("postgres://wasiyuq:x@127.0.0.1:55432/wasiyuq_dev"), {});
    expect(reasons.join()).toContain("DB_MIGRATION_ALLOWED_DATABASES is empty");
  });

  test("refuses databases that are not listed", () => {
    const reasons = migrationTargetViolations(dev("postgres://wasiyuq:x@127.0.0.1:5432/akil_transportes"), allowEnv);
    expect(reasons.join()).toContain('"akil_transportes" is not listed');
  });

  test("refuses production", () => {
    const reasons = migrationTargetViolations(dev("postgres://wasiyuq:x@127.0.0.1:55432/wasiyuq_dev"), {
      ...allowEnv,
      NODE_ENV: "production",
    });
    expect(reasons.join()).toContain("NODE_ENV=production");
  });

  test("keeps development and test databases apart", () => {
    expect(migrationTargetViolations(tst("postgres://wasiyuq:x@localhost:55432/wasiyuq_dev"), allowEnv).join()).toContain('ends in "_test"');
    expect(migrationTargetViolations(dev("postgres://wasiyuq:x@localhost:55432/wasiyuq_test"), allowEnv).join()).toContain(
      "must not use a test database",
    );
  });

  test("refuses remote hosts", () => {
    const reasons = migrationTargetViolations(dev("postgres://wasiyuq:x@db.example.com:5432/wasiyuq_dev"), allowEnv);
    expect(reasons.join()).toContain("is not local");
  });

  test("refuses anything that looks like the legacy SQL Server stack", () => {
    const env = { DB_MIGRATION_ALLOWED_DATABASES: "wasiyuq_dev,wasiyuq_legacy" };
    expect(migrationTargetViolations(dev("postgres://wasiyuq:x@localhost:1433/wasiyuq_dev"), env).join()).toContain("SQL Server");
    expect(migrationTargetViolations(dev("postgres://sa:x@localhost:55432/wasiyuq_legacy"), env).join()).toContain("legacy");
  });

  test("assertMigrationTargetAllowed throws with every reason", () => {
    const config = dev("postgres://wasiyuq:x@db.example.com:1433/other");
    expect(() => assertMigrationTargetAllowed(config, allowEnv)).toThrow(UnsafeDatabaseTargetError);
    try {
      assertMigrationTargetAllowed(config, allowEnv);
    } catch (error) {
      expect((error as UnsafeDatabaseTargetError).reasons.length).toBeGreaterThanOrEqual(3);
    }
  });

  test("runMigrations refuses before opening any connection", async () => {
    // Port 9 (discard) would hang/fail if a connection were attempted; the guard must reject first.
    const config = dev("postgres://wasiyuq:x@127.0.0.1:9/not_allowed");
    await expect(runMigrations(config, { env: allowEnv })).rejects.toBeInstanceOf(UnsafeDatabaseTargetError);
  });
});
