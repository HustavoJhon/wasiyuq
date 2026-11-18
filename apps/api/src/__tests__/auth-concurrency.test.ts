import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
  assertMigrationTargetAllowed,
  checkDatabaseHealth,
  createDatabase,
  loadDatabaseConfig,
  runMigrations,
  type DatabaseConfig,
  type DatabaseHandle,
} from "@wasiyuq/db";
import { CLIENT_IP_HEADER, loadAuthConfig, MemoryEmailSender } from "@wasiyuq/module-identity";
import { createApp } from "../app";
import { createServices } from "../services";

async function resolveTestDatabase(): Promise<DatabaseConfig | null> {
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

const testDb = await resolveTestDatabase();
const ORIGIN = "http://localhost:5173";
const run = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const octet = () => Math.floor(Math.random() * 254) + 1;
const ip = () => `10.${octet()}.${octet()}.${octet()}`;

describe.skipIf(!testDb)("authentication under concurrency", () => {
  let handle: DatabaseHandle;
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    handle = createDatabase({ ...(testDb as DatabaseConfig), poolMax: 20 });
    const config = loadAuthConfig({ AUTH_SECRET: "concurrency-test-secret-0123456789abcdef", AUTH_BASE_URL: ORIGIN, WEB_APP_URL: ORIGIN, MAIL_TRANSPORT: "memory" });
    app = createApp({ database: handle, services: createServices(handle, config, { sender: new MemoryEmailSender(), retryBaseDelayMs: 0, signUpMinDurationMs: 0 }) });
  });
  afterAll(async () => handle?.close());

  const post = (path: string, body: unknown) =>
    app.request(path, {
      method: "POST",
      headers: { "content-type": "application/json", origin: ORIGIN, [CLIENT_IP_HEADER]: ip() },
      body: JSON.stringify(body),
    });

  test("concurrent sign-ups and sign-ins all succeed while other requests stay responsive", async () => {
    const accounts = Array.from({ length: 12 }, (_, i) => ({ name: `Concurrente ${i}`, email: `conc-${run}-${i}@example.test`, password: `password-${run}-${i}` }));

    // Probe /health continuously while password hashing runs. Hashing on the event loop would push these
    // latencies to hundreds of milliseconds per derivation.
    const latencies: number[] = [];
    let busy = true;
    const probe = (async () => {
      while (busy) {
        const started = performance.now();
        const res = await app.request("/health");
        latencies.push(performance.now() - started);
        expect(res.status).toBe(200);
        await Bun.sleep(5);
      }
    })();

    const signUps = await Promise.all(accounts.map((a) => post("/api/auth/sign-up/email", a)));
    const signIns = await Promise.all(accounts.map((a) => post("/api/auth/sign-in/email", { email: a.email, password: a.password })));
    busy = false;
    await probe;

    expect(signUps.map((r) => r.status)).toEqual(accounts.map(() => 200));
    expect(signIns.map((r) => r.status)).toEqual(accounts.map(() => 200));
    expect(signIns.every((r) => r.headers.getSetCookie().some((c) => c.includes("session_token=")))).toBe(true);

    expect(latencies.length).toBeGreaterThan(5);
    const sorted = [...latencies].sort((a, b) => a - b);
    const p95 = sorted[Math.floor(sorted.length * 0.95)]!;
    expect(p95).toBeLessThan(150);
  }, 30_000);
});
