import { describe, expect, test } from "bun:test";
import { DatabaseConfigError, describeDatabase, loadDatabaseConfig, targetFromNodeEnv } from "../config";

const devUrl = "postgresql://wasiyuq:secret@127.0.0.1:55432/wasiyuq_dev";
const testUrl = "postgres://wasiyuq:secret@localhost:55432/wasiyuq_test";

function configError(fn: () => unknown): DatabaseConfigError {
  try {
    fn();
  } catch (error) {
    if (error instanceof DatabaseConfigError) return error;
    throw error;
  }
  throw new Error("expected DatabaseConfigError");
}

describe("loadDatabaseConfig", () => {
  test("parses the development target from DATABASE_URL", () => {
    const config = loadDatabaseConfig("development", { DATABASE_URL: devUrl });
    expect(config).toMatchObject({
      target: "development",
      host: "127.0.0.1",
      port: 55432,
      database: "wasiyuq_dev",
      user: "wasiyuq",
      poolMax: 10,
      connectTimeoutSeconds: 5,
    });
  });

  test("uses TEST_DATABASE_URL for the test target, never DATABASE_URL", () => {
    const config = loadDatabaseConfig("test", { DATABASE_URL: devUrl, TEST_DATABASE_URL: testUrl });
    expect(config.database).toBe("wasiyuq_test");
    expect(() => loadDatabaseConfig("test", { DATABASE_URL: devUrl })).toThrow(DatabaseConfigError);
  });

  test("reports a missing URL with the variable name", () => {
    const error = configError(() => loadDatabaseConfig("development", {}));
    expect(error.issues.join()).toContain("DATABASE_URL is required");
  });

  test("rejects non-PostgreSQL URLs such as the legacy SQL Server or SQLite", () => {
    for (const url of ["sqlserver://sa:pw@localhost:1433/wasiyuq", "mysql://u:p@localhost/db", "sqlite:///tmp/db.sqlite"]) {
      const error = configError(() => loadDatabaseConfig("development", { DATABASE_URL: url }));
      expect(error.issues.join()).toContain("PostgreSQL only");
    }
  });

  test("rejects URLs without a database name and malformed values", () => {
    expect(configError(() => loadDatabaseConfig("development", { DATABASE_URL: "postgres://u:p@localhost:5432" })).issues.join()).toContain(
      "database name",
    );
    expect(configError(() => loadDatabaseConfig("development", { DATABASE_URL: "not a url" })).issues.join()).toContain("valid URL");
  });

  test("validates and coerces pool settings", () => {
    const config = loadDatabaseConfig("development", { DATABASE_URL: devUrl, DB_POOL_MAX: "3", DB_CONNECT_TIMEOUT_SECONDS: "2" });
    expect(config.poolMax).toBe(3);
    expect(config.connectTimeoutSeconds).toBe(2);
    const error = configError(() => loadDatabaseConfig("development", { DATABASE_URL: devUrl, DB_POOL_MAX: "0" }));
    expect(error.issues.join()).toContain("DB_POOL_MAX");
  });

  test("describeDatabase never exposes credentials", () => {
    const description = JSON.stringify(describeDatabase(loadDatabaseConfig("development", { DATABASE_URL: devUrl })));
    expect(description).not.toContain("secret");
    expect(description).toContain("wasiyuq_dev");
  });

  test("targetFromNodeEnv maps test to the test database only", () => {
    expect(targetFromNodeEnv("test")).toBe("test");
    expect(targetFromNodeEnv("development")).toBe("development");
    expect(targetFromNodeEnv(undefined)).toBe("development");
  });
});
