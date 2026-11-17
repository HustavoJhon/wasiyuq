import { afterAll, describe, expect, spyOn, test } from "bun:test";
import { checkDatabaseHealth, createDatabase, loadDatabaseConfig, type DatabaseHandle } from "@wasiyuq/db";
import { readinessResponseSchema } from "@wasiyuq/validation";
import { createApp } from "../app";
import { startServer } from "../server";

const unreachableUrl = "postgres://wasiyuq:topsecret@127.0.0.1:1/wasiyuq_test";

async function reachableTestDatabase(): Promise<boolean> {
  if (!process.env.TEST_DATABASE_URL) return false;
  const probe = createDatabase({ ...loadDatabaseConfig("test"), connectTimeoutSeconds: 2 });
  const health = await checkDatabaseHealth(probe, 3000);
  await probe.close();
  return health.status === "up";
}

const hasTestDatabase = await reachableTestDatabase();

describe("GET /ready (readiness)", () => {
  test("reports not_configured without a database", async () => {
    const res = await createApp({ database: null }).request("/ready");
    expect(res.status).toBe(503);
    const body = readinessResponseSchema.parse(await res.json());
    expect(body).toMatchObject({ status: "not_ready", checks: { database: { status: "not_configured" } } });
  });

  test("reports down with a code, logs details, and never leaks credentials", async () => {
    const errors = spyOn(console, "error").mockImplementation(() => {});
    const database = createDatabase(
      loadDatabaseConfig("test", { TEST_DATABASE_URL: unreachableUrl, DB_CONNECT_TIMEOUT_SECONDS: "1" }),
    );
    const res = await createApp({ database }).request("/ready");
    await database.close();

    expect(res.status).toBe(503);
    const text = await res.text();
    expect(text).not.toContain("topsecret");
    const body = readinessResponseSchema.parse(JSON.parse(text));
    expect(body.checks.database.status).toBe("down");
    expect(body.checks.database.code).toBeString();

    const logged = errors.mock.calls.map((args) => String(args[0]));
    errors.mockRestore();
    const entry = JSON.parse(logged.find((line) => line.includes("database readiness check failed")) ?? "{}");
    expect(entry).toMatchObject({ level: "error", database: "wasiyuq_test", port: 1 });
    expect(logged.join()).not.toContain("topsecret");
  });

  test("reports not_ready while shutting down", async () => {
    const database = createDatabase(loadDatabaseConfig("test", { TEST_DATABASE_URL: unreachableUrl }));
    const res = await createApp({ database, isShuttingDown: () => true }).request("/ready");
    await database.close();
    expect(res.status).toBe(503);
    expect((await res.json()).checks.database.code).toBe("SHUTTING_DOWN");
  });
});

describe.skipIf(!hasTestDatabase)("readiness with the isolated test database", () => {
  let database: DatabaseHandle;
  afterAll(async () => database?.close());

  test("reports ready when PostgreSQL is reachable", async () => {
    database = createDatabase(loadDatabaseConfig("test"));
    const res = await createApp({ database }).request("/ready");
    expect(res.status).toBe(200);
    const body = readinessResponseSchema.parse(await res.json());
    expect(body.status).toBe("ready");
    expect(body.checks.database.status).toBe("up");
  });

  test("server starts on the test database and shuts down gracefully", async () => {
    const logs = spyOn(console, "log").mockImplementation(() => {});
    const server = await startServer({ port: 0, handleSignals: false, env: { ...process.env, NODE_ENV: "test" } });
    try {
      expect(server.database?.config.database).toBe("wasiyuq_test");
      // Connection: close so the post-shutdown request below cannot reuse this keep-alive socket.
      const res = await fetch(`http://127.0.0.1:${server.port}/ready`, { headers: { Connection: "close" } });
      expect(res.status).toBe(200);
    } finally {
      await server.shutdown("test");
      await server.shutdown("test"); // idempotent
      logs.mockRestore();
    }
    expect(server.database?.closed).toBe(true);
    // The listener is closed: new connections are refused.
    await expect(fetch(`http://127.0.0.1:${server.port}/health`)).rejects.toThrow();
  });
});
