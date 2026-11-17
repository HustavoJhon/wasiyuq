import { defineConfig, devices } from "@playwright/test";

/**
 * Browser end-to-end tests (apps/web/e2e).
 *
 * Isolation: the suite starts its own API (port 3101, NODE_ENV=test → TEST_DATABASE_URL, i.e. `wasiyuq_test`)
 * and its own Vite dev server (port 5273), so it never touches the development database or running dev servers.
 * Emails really go through SMTP to Mailpit (docker compose service) and links are read from Mailpit's API.
 *
 * Prerequisites: PostgreSQL + Mailpit running (`docker compose ... up -d`), migrations applied to the test
 * database (`bun run --filter @wasiyuq/db db:migrate:test`), and a Chromium: either `bunx playwright install
 * chromium` or E2E_CHROMIUM_PATH pointing at a system Chromium.
 */
const API_PORT = Number(process.env.E2E_API_PORT ?? 3101);
const WEB_PORT = Number(process.env.E2E_WEB_PORT ?? 5273);
const WEB_URL = `http://localhost:${WEB_PORT}`;
const MAILPIT_SMTP_PORT = process.env.MAILPIT_SMTP_PORT ?? "51025";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: WEB_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    locale: "es-PE",
    launchOptions: process.env.E2E_CHROMIUM_PATH ? { executablePath: process.env.E2E_CHROMIUM_PATH } : {},
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "bun --env-file=../../.env run ../api/src/index.ts",
      url: `http://localhost:${API_PORT}/ready`,
      reuseExistingServer: false,
      timeout: 60_000,
      env: {
        NODE_ENV: "test",
        PORT: String(API_PORT),
        AUTH_BASE_URL: WEB_URL,
        WEB_APP_URL: WEB_URL,
        AUTH_RATE_LIMIT: "on",
        // The Vite proxy forwards the browser's X-Forwarded-For untouched; each test sets a unique fake client IP
        // so database-backed rate limits stay active without tests throttling each other.
        AUTH_TRUST_PROXY: "true",
        MAIL_TRANSPORT: "smtp",
        MAIL_FROM_ADDRESS: "no-reply@wasiyuq.test",
        SMTP_HOST: "127.0.0.1",
        SMTP_PORT: MAILPIT_SMTP_PORT,
        SMTP_SECURITY: "none",
        MAIL_RETRY_BASE_DELAY_MS: "200",
        LOG_LEVEL: "warn",
      },
    },
    {
      command: `bunx vite --port ${WEB_PORT} --strictPort`,
      url: WEB_URL,
      reuseExistingServer: false,
      timeout: 60_000,
      env: { VITE_API_PROXY_TARGET: `http://localhost:${API_PORT}` },
    },
  ],
});
