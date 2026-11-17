import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { createDatabase, sessions, users, type DatabaseConfig, type DatabaseHandle } from "@wasiyuq/db";
import { CLIENT_IP_HEADER, loadAuthConfig } from "../infrastructure/auth-config";
import { createAuthentication, type Authentication } from "../infrastructure/authentication";
import { EmailDispatcher } from "../infrastructure/email/dispatcher";
import { MemoryEmailSender } from "../infrastructure/email/senders";
import { resolveTestDatabase, uniqueEmail, uniqueIp } from "./support";

const testDb = await resolveTestDatabase();
const BASE = "http://localhost:5173";

describe.skipIf(!testDb)("authentication (Better Auth adapter)", () => {
  let handle: DatabaseHandle;
  let auth: Authentication;
  const mailer = new MemoryEmailSender();
  const created: string[] = [];
  const config = loadAuthConfig({
    AUTH_SECRET: "test-secret-test-secret-test-secret-123",
    AUTH_BASE_URL: BASE,
    WEB_APP_URL: BASE,
    MAIL_TRANSPORT: "memory",
  });

  beforeAll(() => {
    handle = createDatabase(testDb as DatabaseConfig);
    auth = createAuthentication(handle.db, config, new EmailDispatcher(mailer), { onUserCreated: async (u) => void created.push(u.id) });
  });
  afterAll(async () => handle?.close());

  const call = (path: string, init: { body?: unknown; cookie?: string; ip?: string; method?: string; origin?: string } = {}) =>
    auth.handler(
      new Request(`${BASE}/api/auth${path}`, {
        method: init.method ?? (init.body ? "POST" : "GET"),
        headers: {
          "content-type": "application/json",
          origin: init.origin ?? BASE,
          [CLIENT_IP_HEADER]: init.ip ?? uniqueIp(),
          ...(init.cookie ? { cookie: init.cookie } : {}),
        },
        body: init.body ? JSON.stringify(init.body) : undefined,
        redirect: "manual",
      }),
    );
  const cookieOf = (res: Response) =>
    res.headers
      .getSetCookie()
      .map((c) => c.split(";")[0])
      .join("; ");
  /** Sign up, then sign in (sign-up never opens a session) and return the session cookie. */
  const signUp = async (email = uniqueEmail(), password = "correct-horse-battery") => {
    const res = await call("/sign-up/email", { body: { name: "Ana Test", email, password } });
    const signIn = await call("/sign-in/email", { body: { email, password } });
    return { res, signIn, email, password, cookie: cookieOf(signIn) };
  };

  test("sign-up creates an unverified user and a verification email, but no session", async () => {
    const { res, signIn, email, cookie } = await signUp();
    expect(res.status).toBe(200);
    expect(res.headers.getSetCookie().join("\n")).not.toContain("session_token");
    const body = await res.clone().text();
    expect(body).not.toContain("password");
    expect(body).not.toContain('"token"');

    expect(signIn.status).toBe(200);
    const setCookie = signIn.headers.getSetCookie().join("\n");
    expect(setCookie).toContain("wasiyuq.session_token=");
    expect(setCookie.toLowerCase()).toContain("httponly");
    expect(setCookie.toLowerCase()).toContain("samesite=lax");
    expect(setCookie.toLowerCase()).not.toContain("secure"); // development config; production adds Secure

    const session = await auth.getSession(new Headers({ cookie }));
    expect(session?.user).toMatchObject({ email, emailVerified: false, platformRole: "user", status: "active" });
    expect(created).toContain(session!.user.id);
    expect(mailer.last(email, "email_verification")).toBeDefined();
  });

  test("passwords are stored hashed and never echoed", async () => {
    const { email, password } = await signUp();
    const [user] = await handle.db.select().from(users).where(eq(users.email, email));
    const rows = await handle.sql<{ password: string }[]>`select password from accounts where user_id = ${user!.id}`;
    expect(rows[0]!.password).not.toContain(password);
    expect(rows[0]!.password.length).toBeGreaterThan(40);
  });

  test("sign-up with an existing email is indistinguishable from a new sign-up (no enumeration)", async () => {
    const { email, password } = await signUp();
    const fresh = await call("/sign-up/email", { body: { name: "Other", email: uniqueEmail(), password: "another-password-1" } });
    const again = await call("/sign-up/email", { body: { name: "Other", email, password: "another-password-1" } });
    expect(again.status).toBe(fresh.status);
    expect(again.headers.getSetCookie()).toEqual([]);
    const keys = (body: { user: Record<string, unknown> }) => Object.keys(body.user).sort();
    expect(keys(await again.json())).toEqual(keys(await fresh.json()));
    // The real owner is told by email; their account and password are untouched.
    expect(mailer.last(email, "account_exists")?.text).toContain(`${BASE}/login`);
    expect((await call("/sign-in/email", { body: { email, password } })).status).toBe(200);
    expect((await call("/sign-in/email", { body: { email, password: "another-password-1" } })).status).toBe(401);
  });

  test("weak passwords are rejected", async () => {
    const res = await call("/sign-up/email", { body: { name: "Weak", email: uniqueEmail(), password: "short" } });
    expect(res.status).toBe(400);
  });

  test("email verification link verifies the user", async () => {
    const { email } = await signUp();
    const link = mailer.last(email, "email_verification")!.text.match(/https?:\/\/\S+/)![0];
    const url = new URL(link);
    const res = await call(`${url.pathname.replace("/api/auth", "")}${url.search}`);
    expect([200, 302]).toContain(res.status);
    const [user] = await handle.db.select().from(users).where(eq(users.email, email));
    expect(user!.emailVerified).toBe(true);

    // Reusing the link does not sign anyone in again.
    const reuse = await call(`${url.pathname.replace("/api/auth", "")}${url.search}`);
    expect(reuse.headers.getSetCookie().join("")).not.toContain("session_token=");
  });

  test("tampered verification links are rejected", async () => {
    const { email } = await signUp();
    const link = new URL(mailer.last(email, "email_verification")!.text.match(/https?:\/\/\S+/)![0]);
    link.searchParams.set("token", `${link.searchParams.get("token")}x`);
    const res = await call(`${link.pathname.replace("/api/auth", "")}${link.search}`);
    expect(res.headers.getSetCookie().join("")).not.toContain("session_token=");
    const [user] = await handle.db.select().from(users).where(eq(users.email, email));
    expect(user!.emailVerified).toBe(false);
  });

  test("invalid credentials return a generic 401 for unknown email and wrong password alike", async () => {
    const { email } = await signUp();
    const wrong = await call("/sign-in/email", { body: { email, password: "wrong-password-123" } });
    const unknown = await call("/sign-in/email", { body: { email: uniqueEmail("ghost"), password: "wrong-password-123" } });
    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect((await wrong.json()).message).toBe((await unknown.json()).message);
  });

  test("sign-in is rate limited to 5 attempts per minute per client", async () => {
    const ip = uniqueIp();
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      const res = await call("/sign-in/email", { ip, body: { email: uniqueEmail("rl"), password: "wrong-password-123" } });
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 5).every((s) => s === 401)).toBe(true);
    expect(statuses[5]).toBe(429);
  });

  test("sign-out revokes the session server-side", async () => {
    const { cookie } = await signUp();
    expect(await auth.getSession(new Headers({ cookie }))).not.toBeNull();
    const out = await call("/sign-out", { body: {}, cookie });
    expect(out.status).toBe(200);
    expect(await auth.getSession(new Headers({ cookie }))).toBeNull();
  });

  test("expired sessions are rejected", async () => {
    const { cookie, email } = await signUp();
    const [user] = await handle.db.select().from(users).where(eq(users.email, email));
    await handle.db.update(sessions).set({ expiresAt: new Date(Date.now() - 1000) }).where(eq(sessions.userId, user!.id));
    expect(await auth.getSession(new Headers({ cookie }))).toBeNull();
  });

  test("password reset: email link, new password works, old sessions revoked, token single-use", async () => {
    const { email, cookie } = await signUp();
    const request = await call("/request-password-reset", { body: { email, redirectTo: `${BASE}/reset-password` } });
    expect(request.status).toBe(200);
    const link = mailer.last(email, "password_reset")!.text.match(/https?:\/\/\S+/)![0];
    const token = new URL(link).pathname.split("/").pop()!;

    const reset = await call("/reset-password", { body: { token, newPassword: "brand-new-password-9" } });
    expect(reset.status).toBe(200);
    expect(await auth.getSession(new Headers({ cookie }))).toBeNull();

    const reuse = await call("/reset-password", { body: { token, newPassword: "another-password-9" } });
    expect(reuse.status).toBe(400);
    const signIn = await call("/sign-in/email", { body: { email, password: "brand-new-password-9" } });
    expect(signIn.status).toBe(200);
    expect(mailer.last(email, "password_changed")).toBeDefined();
  });

  test("password reset tokens expire", async () => {
    const { email } = await signUp();
    await call("/request-password-reset", { body: { email, redirectTo: `${BASE}/reset-password` } });
    const token = new URL(mailer.last(email, "password_reset")!.text.match(/https?:\/\/\S+/)![0]).pathname.split("/").pop()!;
    // Identifiers are stored hashed, so expire every pending reset token of this test run's user via its value row.
    const [user] = await handle.db.select().from(users).where(eq(users.email, email));
    await handle.sql`update verifications set expires_at = now() - interval '1 minute' where value = ${user!.id}`;
    const reset = await call("/reset-password", { body: { token, newPassword: "brand-new-password-9" } });
    expect(reset.status).toBe(400);
  });

  test("password reset for unknown emails responds identically (no account enumeration)", async () => {
    const { email } = await signUp();
    const known = await call("/request-password-reset", { body: { email, redirectTo: `${BASE}/reset-password` } });
    const unknown = await call("/request-password-reset", { body: { email: uniqueEmail("nobody"), redirectTo: `${BASE}/reset-password` } });
    expect(unknown.status).toBe(200);
    expect(known.status).toBe(200);
    expect(await unknown.text()).toBe(await known.text());
  });

  test("email provider failures never change auth responses or leak tokens into logs", async () => {
    const logs: string[] = [];
    const failing = new EmailDispatcher(
      { send: async () => Promise.reject(Object.assign(new Error("550 rejected"), { code: "EENVELOPE", responseCode: 550 })) },
      { log: (level, message, meta) => void logs.push(JSON.stringify({ level, message, meta })) },
    );
    const broken = createAuthentication(handle.db, config, failing);
    const req = (path: string, body: unknown) =>
      broken.handler(
        new Request(`${BASE}/api/auth${path}`, {
          method: "POST",
          headers: { "content-type": "application/json", origin: BASE, [CLIENT_IP_HEADER]: uniqueIp() },
          body: JSON.stringify(body),
        }),
      );
    const email = uniqueEmail("mailfail");
    expect((await req("/sign-up/email", { name: "Mail Fail", email, password: "correct-horse-battery" })).status).toBe(200);
    expect((await req("/request-password-reset", { email, redirectTo: `${BASE}/reset-password` })).status).toBe(200);
    await failing.drain(2000);
    expect(failing.health().failed).toBe(2);
    const joined = logs.join("\n");
    expect(joined).toContain("email delivery failed");
    expect(joined).not.toContain(email);
    expect(joined).not.toContain("token");
    expect(joined).not.toContain("reset-password");
  });

  test("suspending an account invalidates its existing sessions immediately (fail closed)", async () => {
    const { email, cookie } = await signUp();
    expect(await auth.getSession(new Headers({ cookie }))).not.toBeNull();
    await handle.db.update(users).set({ status: "suspended" }).where(eq(users.email, email));
    expect(await auth.getSession(new Headers({ cookie }))).toBeNull();
    const [user] = await handle.db.select().from(users).where(eq(users.email, email));
    expect(await handle.db.select().from(sessions).where(eq(sessions.userId, user!.id))).toHaveLength(0);
  });

  test("suspended accounts cannot sign in", async () => {
    const { email, password } = await signUp();
    await handle.db.update(users).set({ status: "suspended" }).where(eq(users.email, email));
    const res = await call("/sign-in/email", { body: { email, password } });
    expect(res.status).toBe(403);
  });

  test("cookie-authenticated requests from untrusted origins are rejected (CSRF)", async () => {
    const { cookie } = await signUp();
    const res = await call("/sign-out", { origin: "https://evil.example", cookie, body: {} });
    expect(res.status).toBe(403);
    expect(await auth.getSession(new Headers({ cookie }))).not.toBeNull();
  });

  test("redirect targets outside trusted origins are rejected (no open redirect)", async () => {
    const { email } = await signUp();
    const res = await call("/request-password-reset", { body: { email, redirectTo: "https://evil.example/steal" } });
    expect(res.status).toBe(403);
  });

  test("session tokens never appear in JSON bodies (sign-in, get-session)", async () => {
    const { email, password } = await signUp();
    const signIn = await call("/sign-in/email", { body: { email, password } });
    const cookie = cookieOf(signIn);
    const rawToken = decodeURIComponent(cookie.split("=")[1]!).split(".")[0]!;
    expect(await signIn.text()).not.toContain(rawToken);
    const session = await call("/get-session", { cookie });
    const text = await session.text();
    expect(text).toContain(email);
    expect(text).not.toContain(rawToken);
    expect(text).not.toContain('"token"');
  });

  test("production cookies are Secure, httpOnly, SameSite=Lax and __Secure- prefixed", async () => {
    const httpsBase = "https://app.wasiyuq.org";
    const prodConfig = loadAuthConfig({
      NODE_ENV: "production",
      AUTH_SECRET: "prod-like-test-secret-0123456789abcdefghij",
      AUTH_BASE_URL: httpsBase,
      WEB_APP_URL: httpsBase,
      MAIL_TRANSPORT: "smtp",
      MAIL_FROM_ADDRESS: "no-reply@wasiyuq.org",
      SMTP_HOST: "smtp.provider.example",
      SMTP_SECURITY: "tls",
      SMTP_USER: "user",
      SMTP_PASSWORD: "password",
    });
    const prodAuth = createAuthentication(handle.db, prodConfig, new EmailDispatcher(new MemoryEmailSender()));
    const post = (path: string, body: unknown) =>
      prodAuth.handler(
        new Request(`${httpsBase}/api/auth${path}`, {
          method: "POST",
          headers: { "content-type": "application/json", origin: httpsBase, [CLIENT_IP_HEADER]: uniqueIp() },
          body: JSON.stringify(body),
        }),
      );
    const email = uniqueEmail("prodcookie");
    await post("/sign-up/email", { name: "Prod", email, password: "correct-horse-battery" });
    const signIn = await post("/sign-in/email", { email, password: "correct-horse-battery" });
    expect(signIn.status).toBe(200);
    const sessionCookie = signIn.headers.getSetCookie().find((c) => c.includes("session_token="))!;
    expect(sessionCookie).toStartWith("__Secure-wasiyuq.session_token=");
    const flags = sessionCookie.toLowerCase();
    for (const flag of ["secure", "httponly", "samesite=lax", "path=/"]) expect(flags).toContain(flag);
  });

  test("profile/email/deletion/session-listing endpoints of the provider are disabled", async () => {
    const { cookie } = await signUp();
    for (const path of ["/update-user", "/change-email", "/delete-user", "/list-sessions"]) {
      const res = await call(path, { cookie, method: path === "/list-sessions" ? "GET" : "POST", body: path === "/list-sessions" ? undefined : { name: "Hacked", newEmail: "x@example.test" } });
      expect([path, res.status]).toEqual([path, 404]);
    }
  });
});
