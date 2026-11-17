import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import {
  assertMigrationTargetAllowed,
  checkDatabaseHealth,
  createDatabase,
  loadDatabaseConfig,
  organizationInvitations,
  runMigrations,
  users,
  type DatabaseConfig,
  type DatabaseHandle,
} from "@wasiyuq/db";
import type { OrganizationRole } from "@wasiyuq/validation";
import { OrganizationService, type Actor } from "../application/organization-service";
import type { InvitationNotifier } from "../application/ports";
import { OrganizationError } from "../domain/errors";
import { INVITATION_TTL_MS } from "../domain/invitation";
import { DrizzleOrganizationRepository } from "../infrastructure/drizzle-organization-repository";

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
const run = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
let seq = 0;

class CapturingNotifier implements InvitationNotifier {
  readonly sent: { email: string; token: string; organizationName: string }[] = [];
  async sendInvitation(input: { email: string; organizationName: string; role: OrganizationRole; token: string }) {
    this.sent.push(input);
  }
  tokenFor(email: string) {
    return [...this.sent].reverse().find((s) => s.email === email)!.token;
  }
}

async function failure(promise: Promise<unknown>): Promise<string> {
  try {
    await promise;
    return "ok";
  } catch (error) {
    if (error instanceof OrganizationError) return `${error.code}:${error.reason ?? ""}`;
    throw error;
  }
}

describe.skipIf(!testDb)("OrganizationService (PostgreSQL)", () => {
  let handle: DatabaseHandle;
  let service: OrganizationService;
  let now = new Date();
  const notifier = new CapturingNotifier();

  beforeAll(() => {
    handle = createDatabase(testDb as DatabaseConfig);
    service = new OrganizationService(new DrizzleOrganizationRepository(handle.db), notifier, () => now);
  });
  afterAll(async () => handle?.close());

  const newActor = async (name = "Usuario"): Promise<Actor> => {
    const email = `org-${run}-${++seq}@example.test`;
    const [row] = await handle.db.insert(users).values({ name, email, emailVerified: true }).returning();
    await service.ensurePersonalOrganization({ id: row!.id, name });
    return { userId: row!.id, email, name };
  };

  /** Owner + organization + a member with the given role (via the real invitation flow). */
  const orgWith = async (role?: OrganizationRole) => {
    const owner = await newActor("Owner");
    const org = await service.createOrganization(owner, `Albergue ${run} ${++seq}`);
    if (!role) return { owner, org };
    const member = await newActor("Member");
    await service.invite(owner, org.id, member.email, role);
    await service.acceptInvitation(member, notifier.tokenFor(member.email));
    return { owner, org, member };
  };

  test("every user gets exactly one personal organization, idempotently, as active context", async () => {
    const actor = await newActor("Ana");
    const again = await service.ensurePersonalOrganization({ id: actor.userId, name: "Ana" });
    const { memberships, activeOrganizationId } = await service.listMemberships(actor.userId);
    expect(memberships).toHaveLength(1);
    expect(memberships[0]).toMatchObject({ kind: "personal", role: "owner", organizationId: again.id, isActive: true });
    expect(activeOrganizationId).toBe(again.id);
  });

  test("creating an organization makes the creator its owner and switches context to it", async () => {
    const { owner, org } = await orgWith();
    const { memberships, activeOrganizationId } = await service.listMemberships(owner.userId);
    expect(memberships.map((m) => m.kind).sort()).toEqual(["organization", "personal"]);
    expect(activeOrganizationId).toBe(org.id);
    const detail = await service.getOrganization(owner, org.id);
    expect(detail.role).toBe("owner");
    expect(detail.permissions).toContain("team:delete");
  });

  test("slugs are unique and reserved names rejected", async () => {
    const owner = await newActor();
    const name = `Patitas ${run}`;
    const a = await service.createOrganization(owner, name);
    const b = await service.createOrganization(owner, name);
    expect(b.slug).toBe(`${a.slug}-1`);
    expect(await failure(service.createOrganization(owner, "Admin"))).toBe("VALIDATION_FAILED:reserved_name");
  });

  test("cross-organization isolation: non-members cannot see or act on another organization", async () => {
    const { org } = await orgWith();
    const outsider = await newActor("Outsider");
    expect(await failure(service.getOrganization(outsider, org.id))).toBe("NOT_FOUND:");
    expect(await failure(service.listMembers(outsider, org.id))).toBe("NOT_FOUND:");
    expect(await failure(service.updateOrganization(outsider, org.id, { name: "Hijacked" }))).toBe("NOT_FOUND:");
    expect(await failure(service.invite(outsider, org.id, "x@example.test", "viewer"))).toBe("NOT_FOUND:");
    expect(await failure(service.switchOrganization(outsider, org.id))).toBe("NOT_FOUND:");
    expect(await failure(service.authorize(outsider.userId, org.id, "pets:view"))).toBe("NOT_FOUND:");
    expect(await service.permissionsIn(outsider.userId, org.id)).toEqual([]);
  });

  test("role permissions are enforced server-side", async () => {
    const { org, member } = await orgWith("viewer");
    expect(await failure(service.updateOrganization(member!, org.id, { bio: "x" }))).toBe("FORBIDDEN:missing_permission:team:update");
    expect(await failure(service.invite(member!, org.id, `v-${run}@example.test`, "viewer"))).toBe(
      "FORBIDDEN:missing_permission:invitation:create",
    );
    expect(await failure(service.authorize(member!.userId, org.id, "pets:create"))).toBe("FORBIDDEN:missing_permission:pets:create");
    expect(await failure(service.authorize(member!.userId, org.id, "pets:view"))).toBe("ok");
  });

  test("organization managers can update the profile but not delete the organization", async () => {
    const { org, member } = await orgWith("organization_manager");
    const updated = await service.updateOrganization(member!, org.id, { bio: "Refugio en Cusco", city: "Cusco" });
    expect(updated).toMatchObject({ bio: "Refugio en Cusco", city: "Cusco" });
    expect(await failure(service.archiveOrganization(member!, org.id, org.name))).toBe("FORBIDDEN:missing_permission:team:delete");
  });

  test("renaming regenerates the slug (legacy behaviour)", async () => {
    const { owner, org } = await orgWith();
    const renamed = await service.updateOrganization(owner, org.id, { name: `Renombrado ${run} ${++seq}` });
    expect(renamed.slug).not.toBe(org.slug);
    expect(renamed.slug.startsWith("renombrado-")).toBe(true);
  });

  test("no privilege escalation: managers cannot invite or promote to admin, nobody can assign owner", async () => {
    const { owner, org, member } = await orgWith("organization_manager");
    expect(await failure(service.invite(member!, org.id, `esc-${run}@example.test`, "admin"))).toBe("FORBIDDEN:role_escalation");
    const target = (await orgWithMember(owner, org.id, "viewer"))!;
    expect(await failure(service.changeMemberRole(member!, org.id, target.userId, "admin"))).toBe("FORBIDDEN:role_escalation");
    expect(await failure(service.changeMemberRole(owner, org.id, target.userId, "owner"))).toBe("VALIDATION_FAILED:owner_not_assignable");
    await service.changeMemberRole(member!, org.id, target.userId, "pet_manager");
    expect((await service.getOrganization(target, org.id)).role).toBe("pet_manager");
  });

  async function orgWithMember(owner: Actor, organizationId: string, role: OrganizationRole) {
    const member = await newActor("Extra");
    await service.invite(owner, organizationId, member.email, role);
    await service.acceptInvitation(member, notifier.tokenFor(member.email));
    return member;
  }

  test("the owner cannot be removed or demoted; members above the actor are protected; no self-management", async () => {
    const { owner, org, member } = await orgWith("organization_manager");
    const admin = await orgWithMember(owner, org.id, "admin");
    expect(await failure(service.removeMember(admin, org.id, owner.userId))).toBe("FORBIDDEN:target_is_owner");
    expect(await failure(service.changeMemberRole(admin, org.id, owner.userId, "viewer"))).toBe("FORBIDDEN:target_is_owner");
    expect(await failure(service.removeMember(member!, org.id, admin.userId))).toBe("FORBIDDEN:target_above_actor");
    expect(await failure(service.changeMemberRole(admin, org.id, admin.userId, "viewer"))).toBe("FORBIDDEN:self_management");
  });

  test("removing a member revokes access immediately and clears their context", async () => {
    const { owner, org, member } = await orgWith("pet_manager");
    await service.switchOrganization(member!, org.id);
    await service.removeMember(owner, org.id, member!.userId);
    expect(await failure(service.getOrganization(member!, org.id))).toBe("NOT_FOUND:");
    const { activeOrganizationId, memberships } = await service.listMemberships(member!.userId);
    expect(memberships.find((m) => m.kind === "personal")!.organizationId).toBe(activeOrganizationId!);
  });

  test("invitation lifecycle: hashed token, email-bound, single use, duplicate checks", async () => {
    const { owner, org } = await orgWith();
    const invitee = await newActor("Invitee");
    const other = await newActor("Other");
    const invitation = await service.invite(owner, org.id, invitee.email.toUpperCase(), "blog_editor");
    expect(invitation).toMatchObject({ email: invitee.email, role: "blog_editor", status: "pending" });
    expect(invitation.expiresAt.getTime() - now.getTime()).toBe(INVITATION_TTL_MS);

    const token = notifier.tokenFor(invitee.email);
    const [stored] = await handle.db.select().from(organizationInvitations).where(eq(organizationInvitations.id, invitation.id));
    expect(stored!.tokenHash).not.toBe(token);
    expect(stored!.tokenHash).toHaveLength(64);

    expect(await failure(service.invite(owner, org.id, invitee.email, "viewer"))).toBe("CONFLICT:already_invited");
    expect((await service.previewInvitation(other, token)).emailMatches).toBe(false);
    expect(await failure(service.acceptInvitation(other, token))).toBe("FORBIDDEN:email_mismatch");
    expect(await failure(service.acceptInvitation(other, "forged-token"))).toBe("NOT_FOUND:");

    const preview = await service.previewInvitation(invitee, token);
    expect(preview).toMatchObject({ emailMatches: true, status: "pending", role: "blog_editor" });
    await service.acceptInvitation(invitee, token);
    expect((await service.getOrganization(invitee, org.id)).role).toBe("blog_editor");
    expect(await failure(service.acceptInvitation(invitee, token))).toBe("CONFLICT:already_accepted");
    expect(await failure(service.invite(owner, org.id, invitee.email, "viewer"))).toBe("CONFLICT:already_member");
    expect((await service.listMemberships(invitee.userId)).activeOrganizationId).toBe(org.id);
  });

  test("expired and cancelled invitations cannot be accepted", async () => {
    const { owner, org } = await orgWith();
    const late = await newActor("Late");
    await service.invite(owner, org.id, late.email, "viewer");
    const lateToken = notifier.tokenFor(late.email);
    const saved = now;
    now = new Date(saved.getTime() + INVITATION_TTL_MS + 1);
    expect(await failure(service.acceptInvitation(late, lateToken))).toBe("CONFLICT:expired");
    // An expired invitation no longer blocks a new one.
    await service.invite(owner, org.id, late.email, "viewer");
    now = saved;

    const cancelled = await newActor("Cancelled");
    const invitation = await service.invite(owner, org.id, cancelled.email, "viewer");
    await service.cancelInvitation(owner, org.id, invitation.id);
    expect(await failure(service.acceptInvitation(cancelled, notifier.tokenFor(cancelled.email)))).toBe("CONFLICT:cancelled");
    expect(await failure(service.cancelInvitation(owner, org.id, invitation.id))).toBe("CONFLICT:not_pending");
  });

  test("invitations of one organization cannot be cancelled through another", async () => {
    const a = await orgWith();
    const b = await orgWith();
    const invitation = await service.invite(a.owner, a.org.id, `iso-${run}@example.test`, "viewer");
    expect(await failure(service.cancelInvitation(b.owner, b.org.id, invitation.id))).toBe("NOT_FOUND:");
  });

  test("personal organizations cannot receive members or be deleted", async () => {
    const actor = await newActor();
    const personal = (await service.listMemberships(actor.userId)).memberships[0]!;
    expect(await failure(service.invite(actor, personal.organizationId, "x@example.test", "viewer"))).toBe(
      "FORBIDDEN:personal_organization:invite",
    );
    expect(await failure(service.archiveOrganization(actor, personal.organizationId, personal.name))).toBe(
      "FORBIDDEN:personal_organization:delete",
    );
  });

  test("archiving requires the exact name, removes access and pending invitations, keeps the record", async () => {
    const { owner, org, member } = await orgWith("admin");
    const pending = await service.invite(owner, org.id, `arch-${run}@example.test`, "viewer");
    expect(await failure(service.archiveOrganization(owner, org.id, "wrong"))).toBe("VALIDATION_FAILED:name_mismatch");
    await service.archiveOrganization(member!, org.id, org.name);
    expect(await failure(service.getOrganization(owner, org.id))).toBe("NOT_FOUND:");
    expect((await service.listMemberships(owner.userId)).memberships.some((m) => m.organizationId === org.id)).toBe(false);
    const [inv] = await handle.db.select().from(organizationInvitations).where(eq(organizationInvitations.id, pending.id));
    expect(inv!.cancelledAt).not.toBeNull();
    // The slug stays reserved after archiving.
    const again = await service.createOrganization(owner, org.name);
    expect(again.slug).not.toBe(org.slug);
  });
});
