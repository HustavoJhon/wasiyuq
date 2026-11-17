/**
 * Constraint and relationship tests for the identity/organizations schema, on the isolated test database.
 * Uses unique per-run data instead of truncating tables (no destructive operations).
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { createDatabase, type DatabaseHandle } from "../client";
import { loadDatabaseConfig, type DatabaseConfig } from "../config";
import { checkDatabaseHealth } from "../health";
import { runMigrations } from "../migrate";
import { assertMigrationTargetAllowed } from "../safety";
import {
  accounts,
  organizationContexts,
  organizationInvitations,
  organizationMemberships,
  organizations,
  sessions,
  users,
} from "../schema";

async function resolveTestConfig(): Promise<DatabaseConfig | null> {
  if (!process.env.TEST_DATABASE_URL) return null;
  const config = loadDatabaseConfig("test");
  assertMigrationTargetAllowed(config);
  const probe = createDatabase({ ...config, connectTimeoutSeconds: 2 });
  const health = await checkDatabaseHealth(probe, 3000);
  await probe.close();
  return health.status === "up" ? config : null;
}

const testConfig = await resolveTestConfig();
const run = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
let seq = 0;
const unique = (prefix: string) => `${prefix}-${run}-${++seq}`;

async function pgCode(promise: Promise<unknown>): Promise<string> {
  try {
    await promise;
    return "ok";
  } catch (error) {
    const cause = (error as { cause?: { code?: string } }).cause ?? (error as { code?: string });
    return (cause as { code?: string }).code ?? "unknown";
  }
}

describe.skipIf(!testConfig)("identity and organizations schema", () => {
  let handle: DatabaseHandle;

  beforeAll(async () => {
    await runMigrations(testConfig as DatabaseConfig);
    handle = createDatabase(testConfig as DatabaseConfig);
  });
  afterAll(async () => handle?.close());

  const newUser = async (overrides: Partial<typeof users.$inferInsert> = {}) => {
    const [row] = await handle.db
      .insert(users)
      .values({ name: "Test", email: `${unique("user")}@example.test`, ...overrides })
      .returning();
    return row!;
  };
  const newOrg = async (overrides: Partial<typeof organizations.$inferInsert> = {}) => {
    const [row] = await handle.db
      .insert(organizations)
      .values({ name: "Org", slug: unique("org"), ...overrides })
      .returning();
    return row!;
  };

  test("users: email unique and lower-case, DNI format and uniqueness, enumerated roles/status", async () => {
    const user = await newUser({ dni: String(10_000_000 + Math.floor(Math.random() * 89_999_999)).slice(0, 8) });
    expect(user.platformRole).toBe("user");
    expect(user.status).toBe("active");
    expect(await pgCode(newUser({ email: user.email }))).toBe("23505");
    expect(await pgCode(newUser({ email: "UPPER@Example.test" }))).toBe("23514");
    expect(await pgCode(newUser({ dni: user.dni }))).toBe("23505");
    expect(await pgCode(newUser({ dni: "123" }))).toBe("23514");
    expect(await pgCode(newUser({ platformRole: "root" }))).toBe("23514");
    expect(await pgCode(newUser({ status: "deleted" }))).toBe("23514");
    // Many users without DNI are allowed.
    expect(await pgCode(newUser())).toBe("ok");
    expect(await pgCode(newUser())).toBe("ok");
  });

  test("organizations: slug format/uniqueness and personal ownership consistency", async () => {
    const owner = await newUser();
    const org = await newOrg();
    expect(await pgCode(newOrg({ slug: org.slug }))).toBe("23505");
    expect(await pgCode(newOrg({ slug: "Bad Slug" }))).toBe("23514");
    expect(await pgCode(newOrg({ kind: "personal" }))).toBe("23514");
    expect(await pgCode(newOrg({ kind: "organization", personalOwnerId: owner.id }))).toBe("23514");
    expect(await pgCode(newOrg({ kind: "personal", personalOwnerId: owner.id }))).toBe("ok");
    expect(await pgCode(newOrg({ kind: "personal", personalOwnerId: owner.id }))).toBe("23505");
  });

  test("memberships: one per user and organization, single owner, valid roles", async () => {
    const [a, b] = [await newUser(), await newUser()];
    const org = await newOrg();
    await handle.db.insert(organizationMemberships).values({ organizationId: org.id, userId: a.id, role: "owner" });
    expect(
      await pgCode(handle.db.insert(organizationMemberships).values({ organizationId: org.id, userId: a.id, role: "admin" })),
    ).toBe("23505");
    expect(
      await pgCode(handle.db.insert(organizationMemberships).values({ organizationId: org.id, userId: b.id, role: "owner" })),
    ).toBe("23505");
    expect(
      await pgCode(handle.db.insert(organizationMemberships).values({ organizationId: org.id, userId: b.id, role: "root" })),
    ).toBe("23514");
    expect(
      await pgCode(handle.db.insert(organizationMemberships).values({ organizationId: org.id, userId: b.id, role: "viewer" })),
    ).toBe("ok");
  });

  test("invitations: owner role forbidden, lower-case email, unique token, single outcome", async () => {
    const org = await newOrg();
    const base = { organizationId: org.id, email: "invitee@example.test", role: "viewer", expiresAt: new Date(Date.now() + 1000) };
    const tokenHash = unique("hash");
    expect(await pgCode(handle.db.insert(organizationInvitations).values({ ...base, tokenHash }))).toBe("ok");
    expect(await pgCode(handle.db.insert(organizationInvitations).values({ ...base, tokenHash }))).toBe("23505");
    expect(await pgCode(handle.db.insert(organizationInvitations).values({ ...base, role: "owner", tokenHash: unique("h") }))).toBe("23514");
    expect(
      await pgCode(handle.db.insert(organizationInvitations).values({ ...base, email: "Invitee@Example.test", tokenHash: unique("h") })),
    ).toBe("23514");
    expect(
      await pgCode(
        handle.db
          .insert(organizationInvitations)
          .values({ ...base, tokenHash: unique("h"), acceptedAt: new Date(), cancelledAt: new Date() }),
      ),
    ).toBe("23514");
  });

  test("deleting a user cascades to identity data and personal organization, never to shared organizations", async () => {
    const user = await newUser();
    const other = await newUser();
    const personal = await newOrg({ kind: "personal", personalOwnerId: user.id });
    const shared = await newOrg();
    await handle.db.insert(organizationMemberships).values([
      { organizationId: personal.id, userId: user.id, role: "owner" },
      { organizationId: shared.id, userId: other.id, role: "owner" },
      { organizationId: shared.id, userId: user.id, role: "member" },
    ]);
    await handle.db.insert(organizationContexts).values({ userId: user.id, organizationId: shared.id });
    await handle.db.insert(sessions).values({ token: unique("tok"), userId: user.id, expiresAt: new Date(Date.now() + 60_000) });
    await handle.db.insert(accounts).values({ accountId: user.id, providerId: "credential", userId: user.id, password: "hash" });
    const invitation = await handle.db
      .insert(organizationInvitations)
      .values({ organizationId: shared.id, email: "x@example.test", role: "viewer", tokenHash: unique("h"), invitedBy: user.id, expiresAt: new Date() })
      .returning();

    await handle.db.delete(users).where(eq(users.id, user.id));

    expect(await handle.db.select().from(sessions).where(eq(sessions.userId, user.id))).toHaveLength(0);
    expect(await handle.db.select().from(accounts).where(eq(accounts.userId, user.id))).toHaveLength(0);
    expect(await handle.db.select().from(organizations).where(eq(organizations.id, personal.id))).toHaveLength(0);
    expect(await handle.db.select().from(organizationContexts).where(eq(organizationContexts.userId, user.id))).toHaveLength(0);
    const sharedMembers = await handle.db.select().from(organizationMemberships).where(eq(organizationMemberships.organizationId, shared.id));
    expect(sharedMembers.map((m) => m.userId)).toEqual([other.id]);
    expect(await handle.db.select().from(organizations).where(eq(organizations.id, shared.id))).toHaveLength(1);
    const [kept] = await handle.db.select().from(organizationInvitations).where(eq(organizationInvitations.id, invitation[0]!.id));
    expect(kept?.invitedBy).toBeNull();
  });
});
