import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { assertMigrationTargetAllowed, checkDatabaseHealth, createDatabase, loadDatabaseConfig, runMigrations } from "@wasiyuq/db";
import { CLIENT_IP_HEADER } from "@wasiyuq/module-identity";
import { startServer, type RunningServer } from "../server";

/**
 * Regression tests that need the real HTTP server (Bun.serve), not just the Hono app:
 * the client IP used for rate limiting is decided in server.ts.
 */
async function testDatabaseReachable(): Promise<boolean> {
  if (!process.env.TEST_DATABASE_URL) return false;
  const config = loadDatabaseConfig("test");
  assertMigrationTargetAllowed(config);
  const probe = createDatabase({ ...config, connectTimeoutSeconds: 2 });
  const health = await checkDatabaseHealth(probe, 3000);
  await probe.close();
  if (health.status !== "up") return false;
  await runMigrations(config);
  return true;
}

const reachable = await testDatabaseReachable();
const ORIGIN = "http://localhost:5173";

describe.skipIf(!reachable)("security regressions (real server)", () => {
  let server: RunningServer;
  let base: string;

  beforeAll(async () => {
    server = await startServer({
      port: 0,
      handleSignals: false,
      env: {
        ...process.env,
        NODE_ENV: "test",
        AUTH_SECRET: "regression-test-secret-0123456789abcdefgh",
        AUTH_BASE_URL: ORIGIN,
        WEB_APP_URL: ORIGIN,
        AUTH_RATE_LIMIT: "on",
        AUTH_TRUST_PROXY: "false",
        MAIL_TRANSPORT: "memory",
        LOG_LEVEL: "error",
      },
    });
    base = `http://127.0.0.1:${server.port}`;
  });
  afterAll(async () => server?.shutdown("test"));

  test("clients cannot choose their rate-limit key by spoofing IP headers", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) {
      const res = await fetch(`${base}/api/auth/sign-in/email`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: ORIGIN,
          // Each attempt claims a different client IP; the server must ignore both headers.
          [CLIENT_IP_HEADER]: `203.0.113.${i + 1}`,
          "x-forwarded-for": `198.51.100.${i + 1}`,
        },
        body: JSON.stringify({ email: `spoof-${crypto.randomUUID()}@example.test`, password: "wrong-password-123" }),
      });
      statuses.push(res.status);
    }
    // 5 attempts per minute per real (socket) IP: spoofed headers must not reset the counter.
    expect(statuses).toContain(429);
  });

  test("no CORS: cross-origin preflights get no Access-Control-Allow-Origin", async () => {
    const res = await fetch(`${base}/api/v1/me`, {
      method: "OPTIONS",
      headers: { origin: "https://evil.example", "access-control-request-method": "GET", "access-control-request-headers": "content-type" },
    });
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
    expect(res.headers.get("access-control-allow-credentials")).toBeNull();
    const get = await fetch(`${base}/api/v1/me`, { headers: { origin: "https://evil.example" } });
    expect(get.headers.get("access-control-allow-origin")).toBeNull();
  });

  test("readiness reports the database and a coarse email status", async () => {
    const body = await (await fetch(`${base}/ready`)).json();
    expect(body.status).toBe("ready");
    expect(body.checks.email).toEqual({ status: "ok" });
  });
});

describe("production startup guards", () => {
  test("refuses to start in production with an incomplete authentication/email configuration", async () => {
    const attempt = startServer({
      port: 0,
      handleSignals: false,
      env: {
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://user:pass@127.0.0.1:1/never_connected",
        AUTH_SECRET: "x".repeat(40),
        AUTH_BASE_URL: "https://app.wasiyuq.org",
        WEB_APP_URL: "https://app.wasiyuq.org",
        MAIL_TRANSPORT: "console",
        LOG_LEVEL: "error",
      },
    });
    await expect(attempt).rejects.toThrow(/MAIL_TRANSPORT/);
  });

  test("refuses to start in production without a valid database configuration", async () => {
    await expect(
      startServer({ port: 0, handleSignals: false, env: { NODE_ENV: "production", DATABASE_URL: "mssql://legacy/db", LOG_LEVEL: "error" } }),
    ).rejects.toThrow();
  });
});
