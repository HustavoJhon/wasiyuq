import { afterAll, beforeAll, describe, expect, spyOn, test } from "bun:test";
import { eq } from "drizzle-orm";
import {
  assertMigrationTargetAllowed,
  checkDatabaseHealth,
  createDatabase,
  loadDatabaseConfig,
  runMigrations,
  users,
  type DatabaseConfig,
  type DatabaseHandle,
} from "@wasiyuq/db";
import { CLIENT_IP_HEADER, loadAuthConfig, MemoryEmailSender } from "@wasiyuq/module-identity";
import { apiErrorSchema, meResponseSchema } from "@wasiyuq/validation";
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
let seq = 0;
const email = (p = "api") => `${p}-${run}-${++seq}@example.test`;
/** Random fake client IPs: rate-limit counters persist in the test database across runs. */
const octet = () => Math.floor(Math.random() * 254) + 1;
const ip = () => `10.${octet()}.${octet()}.${octet()}`;

describe.skipIf(!testDb)("identity & organizations HTTP API", () => {
  let handle: DatabaseHandle;
  let app: ReturnType<typeof createApp>;
  const mailer = new MemoryEmailSender();

  beforeAll(() => {
    handle = createDatabase(testDb as DatabaseConfig);
    const config = loadAuthConfig({ AUTH_SECRET: "api-test-secret-api-test-secret-123456", AUTH_BASE_URL: ORIGIN, WEB_APP_URL: ORIGIN, MAIL_TRANSPORT: "memory" });
    app = createApp({ database: handle, services: createServices(handle, config, mailer) });
  });
  afterAll(async () => handle?.close());

  type Init = { method?: string; body?: unknown; cookie?: string; origin?: string | null; ip?: string };
  const request = (path: string, init: Init = {}) => {
    const headers: Record<string, string> = { [CLIENT_IP_HEADER]: init.ip ?? ip() };
    if (init.origin !== null) headers.origin = init.origin ?? ORIGIN;
    if (init.cookie) headers.cookie = init.cookie;
    if (init.body !== undefined) headers["content-type"] = "application/json";
    return app.request(path, {
      method: init.method ?? (init.body !== undefined ? "POST" : "GET"),
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  };
  const cookieOf = (res: Response) =>
    res.headers
      .getSetCookie()
      .map((c) => c.split(";")[0])
      .join("; ");
  const linkIn = (to: string, kind: "email_verification" | "password_reset" | "organization_invitation") =>
    mailer.last(to, kind)!.text.match(/https?:\/\/\S+/)![0];

  async function signUp(name = "Usuario", address = email()) {
    const res = await request("/api/auth/sign-up/email", { body: { name, email: address, password: "correct-horse-battery" } });
    expect(res.status).toBe(200);
    return { email: address, cookie: cookieOf(res) };
  }
  async function verify(address: string) {
    const url = new URL(linkIn(address, "email_verification"));
    const res = await request(`${url.pathname}${url.search}`, { origin: null });
    expect([200, 302]).toContain(res.status);
  }
  async function verifiedUser(name = "Usuario") {
    const user = await signUp(name);
    await verify(user.email);
    const me = await (await request("/api/v1/me", { cookie: user.cookie })).json();
    return { ...user, id: me.user.id as string, personalOrgId: me.activeOrganizationId as string };
  }
  async function createOrg(cookie: string, name = `Albergue ${run} ${++seq}`) {
    const res = await request("/api/v1/organizations", { cookie, body: { name } });
    expect(res.status).toBe(201);
    return (await res.json()).organization as { id: string; name: string; slug: string };
  }
  async function join(owner: { cookie: string }, orgId: string, role: string) {
    const member = await verifiedUser("Miembro");
    expect((await request(`/api/v1/organizations/${orgId}/invitations`, { cookie: owner.cookie, body: { email: member.email, role } })).status).toBe(201);
    const token = new URL(linkIn(member.email, "organization_invitation")).pathname.split("/").pop()!;
    expect((await request(`/api/v1/invitations/${token}/accept`, { cookie: member.cookie, body: {} })).status).toBe(200);
    return member;
  }

  test("unauthenticated requests get a 401 error envelope", async () => {
    const res = await request("/api/v1/me");
    expect(res.status).toBe(401);
    expect(apiErrorSchema.parse(await res.json()).error.code).toBe("UNAUTHENTICATED");
  });

  test("public auth providers reflect configuration (Google disabled without credentials)", async () => {
    const res = await request("/api/public/auth-providers");
    expect(await res.json()).toEqual({ emailPassword: true, google: false });
  });

  test("security headers are set", async () => {
    const res = await request("/health");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-frame-options")).toBeTruthy();
  });

  test("sign-up → /me returns the profile and a personal organization, never secrets", async () => {
    const { cookie, email: address } = await signUp("Ana");
    const res = await request("/api/v1/me", { cookie });
    const text = await res.text();
    const me = meResponseSchema.parse(JSON.parse(text));
    expect(me.user).toMatchObject({ email: address, emailVerified: false, platformRole: "user", status: "active" });
    expect(me.memberships).toHaveLength(1);
    expect(me.memberships[0]).toMatchObject({ kind: "personal", role: "owner", isActive: true });
    for (const secret of ["password", "token", "hash", "secret"]) expect(text.toLowerCase()).not.toContain(secret);
  });

  test("organization features require a verified email", async () => {
    const { cookie, email: address } = await signUp();
    const blocked = await request("/api/v1/organizations", { cookie, body: { name: "Mi albergue" } });
    expect(blocked.status).toBe(403);
    expect((await blocked.json()).error.code).toBe("EMAIL_NOT_VERIFIED");
    await verify(address);
    expect((await request("/api/v1/organizations", { cookie, body: { name: `Mi albergue ${run}` } })).status).toBe(201);
  });

  test("input validation: field issues, unknown fields and malformed ids", async () => {
    const user = await verifiedUser();
    const bad = await request("/api/v1/organizations", { cookie: user.cookie, body: { name: "x" } });
    expect(bad.status).toBe(400);
    const error = apiErrorSchema.parse(await bad.json()).error;
    expect(error.code).toBe("VALIDATION_FAILED");
    expect(error.issues?.[0]?.path).toBe("name");
    expect((await request("/api/v1/me", { method: "PATCH", cookie: user.cookie, body: { platformRole: "platform_admin" } })).status).toBe(400);
    expect((await request("/api/v1/organizations/not-a-uuid", { cookie: user.cookie })).status).toBe(404);
    const notJson = await app.request("/api/v1/organizations", {
      method: "POST",
      headers: { cookie: user.cookie, origin: ORIGIN, "content-type": "application/json", [CLIENT_IP_HEADER]: ip() },
      body: "{",
    });
    expect(notJson.status).toBe(400);
  });

  test("profile update validates DNI/WhatsApp and reports DNI conflicts", async () => {
    const a = await verifiedUser();
    const b = await verifiedUser();
    const dni = String(Math.floor(10_000_000 + Math.random() * 89_999_999));
    const ok = await request("/api/v1/me", { method: "PATCH", cookie: a.cookie, body: { dni, whatsapp: "+51987654321" } });
    expect(ok.status).toBe(200);
    expect((await ok.json()).user).toMatchObject({ dni, whatsapp: "+51987654321" });
    const taken = await request("/api/v1/me", { method: "PATCH", cookie: b.cookie, body: { dni } });
    expect(taken.status).toBe(409);
  });

  test("cross-organization isolation over HTTP", async () => {
    const owner = await verifiedUser("Owner");
    const outsider = await verifiedUser("Outsider");
    const org = await createOrg(owner.cookie);
    for (const [method, path, body] of [
      ["GET", `/api/v1/organizations/${org.id}`],
      ["PATCH", `/api/v1/organizations/${org.id}`, { bio: "hacked" }],
      ["GET", `/api/v1/organizations/${org.id}/members`],
      ["POST", `/api/v1/organizations/${org.id}/invitations`, { email: email(), role: "viewer" }],
      ["POST", `/api/v1/organizations/${org.id}/switch`, {}],
      ["DELETE", `/api/v1/organizations/${org.id}`, { confirmName: org.name }],
    ] as const) {
      const res = await request(path, { method, cookie: outsider.cookie, body });
      expect([method, path, res.status]).toEqual([method, path, 404]);
    }
    // The owner's organization is untouched.
    const detail = await (await request(`/api/v1/organizations/${org.id}`, { cookie: owner.cookie })).json();
    expect(detail.organization.bio).toBeNull();
  });

  test("invitation flow and role enforcement over HTTP", async () => {
    const owner = await verifiedUser("Owner");
    const org = await createOrg(owner.cookie);
    const viewer = await join(owner, org.id, "viewer");

    const detail = await (await request(`/api/v1/organizations/${org.id}`, { cookie: viewer.cookie })).json();
    expect(detail.role).toBe("viewer");
    expect(detail.permissions).toEqual(expect.arrayContaining(["pets:view", "follow-ups:view"]));
    expect(detail.permissions).not.toContain("team:update");

    expect((await request(`/api/v1/organizations/${org.id}`, { method: "PATCH", cookie: viewer.cookie, body: { bio: "x" } })).status).toBe(403);
    expect((await request(`/api/v1/organizations/${org.id}/invitations`, { cookie: viewer.cookie })).status).toBe(403);
    expect((await request(`/api/v1/organizations/${org.id}/members`, { cookie: viewer.cookie })).status).toBe(200);

    const members = (await (await request(`/api/v1/organizations/${org.id}/members`, { cookie: owner.cookie })).json()).members;
    expect(members.map((m: { role: string }) => m.role).sort()).toEqual(["owner", "viewer"]);

    expect((await request(`/api/v1/organizations/${org.id}/members/${viewer.id}`, { method: "PATCH", cookie: owner.cookie, body: { role: "owner" } })).status).toBe(400);
    expect((await request(`/api/v1/organizations/${org.id}/members/${viewer.id}`, { method: "PATCH", cookie: owner.cookie, body: { role: "pet_manager" } })).status).toBe(204);
    expect((await request(`/api/v1/organizations/${org.id}/members/${owner.id}`, { method: "DELETE", cookie: owner.cookie })).status).toBe(403);
  });

  test("invitation acceptance requires the invited email, and tokens never reach logs or responses", async () => {
    const owner = await verifiedUser("Owner");
    const org = await createOrg(owner.cookie);
    const invitee = await verifiedUser("Invitee");
    const intruder = await verifiedUser("Intruder");
    const created = await request(`/api/v1/organizations/${org.id}/invitations`, { cookie: owner.cookie, body: { email: invitee.email, role: "member" } });
    const createdText = await created.text();
    const token = new URL(linkIn(invitee.email, "organization_invitation")).pathname.split("/").pop()!;
    expect(createdText).not.toContain(token);

    const logs = spyOn(console, "log");
    try {
      const preview = await (await request(`/api/v1/invitations/${token}`, { cookie: intruder.cookie })).json();
      expect(preview).toMatchObject({ emailMatches: false, status: "pending", organizationName: org.name });
      expect(JSON.stringify(preview)).not.toContain(invitee.email);
      expect((await request(`/api/v1/invitations/${token}/accept`, { cookie: intruder.cookie, body: {} })).status).toBe(403);
      expect((await request(`/api/v1/invitations/${token}/accept`, { cookie: invitee.cookie, body: {} })).status).toBe(200);
      expect(logs.mock.calls.flat().join("\n")).not.toContain(token);
    } finally {
      logs.mockRestore();
    }
  });

  test("switching the active organization requires membership", async () => {
    const owner = await verifiedUser();
    const org = await createOrg(owner.cookie);
    await request(`/api/v1/organizations/${owner.personalOrgId}/switch`, { cookie: owner.cookie, body: {} });
    expect((await (await request("/api/v1/me", { cookie: owner.cookie })).json()).activeOrganizationId).toBe(owner.personalOrgId);
    expect((await request(`/api/v1/organizations/${org.id}/switch`, { cookie: owner.cookie, body: {} })).status).toBe(200);
    expect((await (await request("/api/v1/me", { cookie: owner.cookie })).json()).activeOrganizationId).toBe(org.id);
  });

  test("CSRF: mutations from untrusted origins or cookie requests without Origin are rejected", async () => {
    const user = await verifiedUser();
    const evil = await request("/api/v1/organizations", { cookie: user.cookie, origin: "https://evil.example", body: { name: "Evil org" } });
    expect(evil.status).toBe(403);
    expect((await evil.json()).error.code).toBe("INVALID_ORIGIN");
    expect((await request("/api/v1/organizations", { cookie: user.cookie, origin: null, body: { name: "No origin" } })).status).toBe(403);
  });

  test("session management: list without tokens, revoke others, revoke by id is owner-scoped", async () => {
    const user = await verifiedUser();
    const second = cookieOf(await request("/api/auth/sign-in/email", { body: { email: user.email, password: "correct-horse-battery" } }));
    const list = await request("/api/v1/me/sessions", { cookie: user.cookie });
    const text = await list.text();
    const sessions = JSON.parse(text).sessions as { id: string; current: boolean }[];
    expect(sessions.length).toBeGreaterThanOrEqual(2);
    expect(sessions.filter((s) => s.current)).toHaveLength(1);
    expect(text).not.toContain("token");

    const other = await verifiedUser();
    const foreign = sessions.find((s) => !s.current)!;
    expect((await request(`/api/v1/me/sessions/${foreign.id}`, { method: "DELETE", cookie: other.cookie })).status).toBe(404);

    expect((await request("/api/v1/me/sessions/revoke-others", { cookie: user.cookie, body: {} })).status).toBe(200);
    expect((await request("/api/v1/me", { cookie: second })).status).toBe(401);
    expect((await request("/api/v1/me", { cookie: user.cookie })).status).toBe(200);
  });

  test("logout invalidates the session", async () => {
    const user = await verifiedUser();
    expect((await request("/api/auth/sign-out", { cookie: user.cookie, body: {} })).status).toBe(200);
    expect((await request("/api/v1/me", { cookie: user.cookie })).status).toBe(401);
  });

  test("platform administration: explicit role, no organization bypass, suspension revokes access", async () => {
    const admin = await verifiedUser("Admin");
    const regular = await verifiedUser("Regular");
    const owner = await verifiedUser("Owner");
    const org = await createOrg(owner.cookie);

    expect((await request("/api/v1/admin/users", { cookie: regular.cookie })).status).toBe(403);
    await handle.db.update(users).set({ platformRole: "platform_admin" }).where(eq(users.id, admin.id));
    const list = await request("/api/v1/admin/users?limit=5", { cookie: admin.cookie });
    expect(list.status).toBe(200);
    expect((await list.text()).toLowerCase()).not.toContain("password");

    // Platform admins do not inherit organization permissions (ADR-011).
    expect((await request(`/api/v1/organizations/${org.id}`, { cookie: admin.cookie })).status).toBe(404);

    expect((await request(`/api/v1/admin/users/${admin.id}/status`, { method: "PATCH", cookie: admin.cookie, body: { status: "suspended" } })).status).toBe(403);
    const suspend = await request(`/api/v1/admin/users/${regular.id}/status`, { method: "PATCH", cookie: admin.cookie, body: { status: "suspended" } });
    expect(suspend.status).toBe(200);
    expect((await request("/api/v1/me", { cookie: regular.cookie })).status).toBe(401);
    const signIn = await request("/api/auth/sign-in/email", { body: { email: regular.email, password: "correct-horse-battery" } });
    expect(signIn.status).toBe(403);
  });

  test("password recovery over HTTP", async () => {
    const user = await verifiedUser();
    expect((await request("/api/auth/request-password-reset", { body: { email: user.email, redirectTo: `${ORIGIN}/reset-password` } })).status).toBe(200);
    const token = new URL(linkIn(user.email, "password_reset")).pathname.split("/").pop()!;
    expect((await request("/api/auth/reset-password", { body: { token, newPassword: "a-new-password-123" } })).status).toBe(200);
    expect((await request("/api/v1/me", { cookie: user.cookie })).status).toBe(401);
    expect((await request("/api/auth/sign-in/email", { body: { email: user.email, password: "a-new-password-123" } })).status).toBe(200);
  });

  test("role catalog is served from the central policy", async () => {
    const user = await verifiedUser();
    const { roles } = await (await request("/api/v1/roles", { cookie: user.cookie })).json();
    expect(roles).toHaveLength(8);
    expect(roles.find((r: { role: string }) => r.role === "owner").assignable).toBe(false);
  });

  test("archiving an organization over HTTP", async () => {
    const owner = await verifiedUser();
    const org = await createOrg(owner.cookie);
    expect((await request(`/api/v1/organizations/${org.id}`, { method: "DELETE", cookie: owner.cookie, body: { confirmName: "nope" } })).status).toBe(400);
    expect((await request(`/api/v1/organizations/${org.id}`, { method: "DELETE", cookie: owner.cookie, body: { confirmName: org.name } })).status).toBe(204);
    expect((await request(`/api/v1/organizations/${org.id}`, { cookie: owner.cookie })).status).toBe(404);
    expect((await request(`/api/v1/organizations/${owner.personalOrgId}`, { method: "DELETE", cookie: owner.cookie, body: { confirmName: "x" } })).status).toBe(403);
  });
});
