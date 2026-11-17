import { expect, type Browser, type BrowserContext, type Page } from "@playwright/test";

const MAILPIT_API = process.env.MAILPIT_API_URL ?? "http://127.0.0.1:58025";
export const PASSWORD = "correct-horse-battery-9";

const run = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
let seq = 0;
export const uniqueEmail = (prefix: string) => `e2e-${prefix}-${run}-${++seq}@example.test`;
const octet = () => Math.floor(Math.random() * 254) + 1;

/** A browser context with its own cookies and a unique client IP (see AUTH_TRUST_PROXY in playwright.config). */
export async function newClient(browser: Browser, options: { viewport?: { width: number; height: number } } = {}) {
  const context = await browser.newContext({
    viewport: options.viewport,
    extraHTTPHeaders: { "x-forwarded-for": `10.${octet()}.${octet()}.${octet()}` },
  });
  return { context, page: await context.newPage() };
}

interface MailpitSummary {
  ID: string;
  Subject: string;
}

/** Wait for the newest email to `to` whose subject matches, and return the first link in its text body. */
export async function linkFromEmail(to: string, subject: RegExp): Promise<string> {
  let found: MailpitSummary | undefined;
  await expect
    .poll(
      async () => {
        const res = await fetch(`${MAILPIT_API}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}`);
        const body = (await res.json()) as { messages: MailpitSummary[] };
        found = body.messages.find((m) => subject.test(m.Subject));
        return Boolean(found);
      },
      { timeout: 15_000, message: `email to ${to} matching ${subject}` },
    )
    .toBe(true);
  const message = (await (await fetch(`${MAILPIT_API}/api/v1/message/${found!.ID}`)).json()) as { Text: string };
  const link = message.Text.match(/https?:\/\/\S+/)?.[0];
  if (!link) throw new Error("email has no link");
  return link;
}

export async function emailCount(to: string, subject: RegExp): Promise<number> {
  const res = await fetch(`${MAILPIT_API}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}`);
  const body = (await res.json()) as { messages: MailpitSummary[] };
  return body.messages.filter((m) => subject.test(m.Subject)).length;
}

export async function register(page: Page, name: string, email: string) {
  await page.goto("/register");
  await page.getByLabel("Nombre completo").fill(name);
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Confirmar contraseña").fill(PASSWORD);
  await page.getByRole("button", { name: "Crear cuenta" }).click();
  await expect(page.getByText("Revisa tu correo")).toBeVisible();
}

export async function login(page: Page, email: string, password = PASSWORD) {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Ingresar" }).click();
}

/** Register, verify through the real email link (signs in), and land on the dashboard. */
export async function verifiedUser(browser: Browser, name: string, viewport?: { width: number; height: number }) {
  const { context, page } = await newClient(browser, { viewport });
  const email = uniqueEmail(name.toLowerCase());
  await register(page, name, email);
  await page.goto(await linkFromEmail(email, /Verifica tu correo/));
  await expect(page.getByRole("heading", { name: `Hola, ${name}` })).toBeVisible();
  return { context, page, email };
}

export async function sessionCookie(context: BrowserContext) {
  return (await context.cookies()).find((c) => c.name.endsWith("session_token"));
}
