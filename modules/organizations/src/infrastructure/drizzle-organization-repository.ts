import { and, asc, eq, gt, isNull, like, or, sql } from "drizzle-orm";
import {
  organizationContexts,
  organizationInvitations,
  organizationMemberships,
  organizations,
  users,
  type Database,
} from "@wasiyuq/db";
import type { OrganizationKind, OrganizationRole } from "@wasiyuq/validation";
import {
  SlugTakenError,
  type AcceptInvitationOutcome,
  type CreateInvitationOutcome,
  type InvitationRecord,
  type MemberRecord,
  type OrganizationProfileChanges,
  type OrganizationRecord,
  type OrganizationRepository,
} from "../application/ports";

type OrganizationRow = typeof organizations.$inferSelect;
type InvitationRow = typeof organizationInvitations.$inferSelect;

const toOrganization = (row: OrganizationRow): OrganizationRecord => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  kind: row.kind as OrganizationKind,
  bio: row.bio,
  website: row.website,
  phone: row.phone,
  address: row.address,
  city: row.city,
  region: row.region,
  createdAt: row.createdAt,
});

const toInvitation = (row: InvitationRow): InvitationRecord => ({
  id: row.id,
  organizationId: row.organizationId,
  email: row.email,
  role: row.role as OrganizationRole,
  invitedBy: row.invitedBy,
  expiresAt: row.expiresAt,
  acceptedAt: row.acceptedAt,
  cancelledAt: row.cancelledAt,
  createdAt: row.createdAt,
});

const active = isNull(organizations.archivedAt);

function isSlugViolation(error: unknown): boolean {
  const cause = ((error as { cause?: unknown }).cause ?? error) as { code?: string; constraint_name?: string };
  return cause.code === "23505" && cause.constraint_name === "organizations_slug_unique";
}

/** Escape LIKE wildcards in user-derived values. */
const likePrefix = (value: string) => `${value.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;

export class DrizzleOrganizationRepository implements OrganizationRepository {
  constructor(private readonly db: Database) {}

  async findOrganization(id: string) {
    const [row] = await this.db.select().from(organizations).where(and(eq(organizations.id, id), active)).limit(1);
    return row ? toOrganization(row) : null;
  }

  async findPersonalOrganization(userId: string) {
    const [row] = await this.db.select().from(organizations).where(eq(organizations.personalOwnerId, userId)).limit(1);
    return row ? toOrganization(row) : null;
  }

  async findMembershipRole(organizationId: string, userId: string) {
    const [row] = await this.db
      .select({ role: organizationMemberships.role })
      .from(organizationMemberships)
      .innerJoin(organizations, eq(organizations.id, organizationMemberships.organizationId))
      .where(and(eq(organizationMemberships.organizationId, organizationId), eq(organizationMemberships.userId, userId), active))
      .limit(1);
    return (row?.role as OrganizationRole | undefined) ?? null;
  }

  async listMembershipsForUser(userId: string) {
    const rows = await this.db
      .select({
        organizationId: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        kind: organizations.kind,
        role: organizationMemberships.role,
      })
      .from(organizationMemberships)
      .innerJoin(organizations, eq(organizations.id, organizationMemberships.organizationId))
      .where(and(eq(organizationMemberships.userId, userId), active))
      .orderBy(sql`${organizations.kind} = 'organization'`, asc(sql`lower(${organizations.name})`));
    return rows.map((row) => ({ ...row, kind: row.kind as OrganizationKind, role: row.role as OrganizationRole }));
  }

  async slugsStartingWith(base: string) {
    const rows = await this.db
      .select({ slug: organizations.slug })
      .from(organizations)
      .where(or(eq(organizations.slug, base), like(organizations.slug, likePrefix(`${base}-`))));
    return rows.map((row) => row.slug);
  }

  async createWithOwner(input: { name: string; slug: string; kind: OrganizationKind; ownerUserId: string }) {
    try {
      return await this.db.transaction(async (tx) => {
        const [row] = await tx
          .insert(organizations)
          .values({
            name: input.name,
            slug: input.slug,
            kind: input.kind,
            personalOwnerId: input.kind === "personal" ? input.ownerUserId : null,
          })
          .returning();
        await tx.insert(organizationMemberships).values({ organizationId: row!.id, userId: input.ownerUserId, role: "owner" });
        return toOrganization(row!);
      });
    } catch (error) {
      if (isSlugViolation(error)) throw new SlugTakenError();
      throw error;
    }
  }

  async update(id: string, changes: OrganizationProfileChanges) {
    try {
      const [row] = await this.db.update(organizations).set(changes).where(and(eq(organizations.id, id), active)).returning();
      return toOrganization(row!);
    } catch (error) {
      if (isSlugViolation(error)) throw new SlugTakenError();
      throw error;
    }
  }

  async archive(id: string) {
    return this.db.transaction(async (tx) => {
      const now = new Date();
      await tx.update(organizations).set({ archivedAt: now }).where(and(eq(organizations.id, id), active));
      const removed = await tx
        .delete(organizationMemberships)
        .where(eq(organizationMemberships.organizationId, id))
        .returning({ userId: organizationMemberships.userId });
      await tx
        .update(organizationInvitations)
        .set({ cancelledAt: now })
        .where(
          and(eq(organizationInvitations.organizationId, id), isNull(organizationInvitations.acceptedAt), isNull(organizationInvitations.cancelledAt)),
        );
      // Contexts pointing at the archived organization are cleared; /me falls back to the personal organization.
      await tx.delete(organizationContexts).where(eq(organizationContexts.organizationId, id));
      return removed.map((row) => row.userId);
    });
  }

  async getContext(userId: string) {
    const [row] = await this.db
      .select({ organizationId: organizationContexts.organizationId })
      .from(organizationContexts)
      .where(eq(organizationContexts.userId, userId))
      .limit(1);
    return row?.organizationId ?? null;
  }

  async setContext(userId: string, organizationId: string) {
    await this.db
      .insert(organizationContexts)
      .values({ userId, organizationId })
      .onConflictDoUpdate({ target: organizationContexts.userId, set: { organizationId, updatedAt: new Date() } });
  }

  async clearContext(userId: string) {
    await this.db.delete(organizationContexts).where(eq(organizationContexts.userId, userId));
  }

  private memberQuery(organizationId: string) {
    return this.db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        role: organizationMemberships.role,
        joinedAt: organizationMemberships.createdAt,
      })
      .from(organizationMemberships)
      .innerJoin(users, eq(users.id, organizationMemberships.userId))
      .where(eq(organizationMemberships.organizationId, organizationId))
      .$dynamic();
  }

  async listMembers(organizationId: string): Promise<MemberRecord[]> {
    const rows = await this.memberQuery(organizationId).orderBy(asc(organizationMemberships.createdAt));
    return rows.map((row) => ({ ...row, role: row.role as OrganizationRole }));
  }

  async findMember(organizationId: string, userId: string) {
    const [row] = await this.memberQuery(organizationId).where(
      and(eq(organizationMemberships.organizationId, organizationId), eq(organizationMemberships.userId, userId)),
    );
    return row ? { ...row, role: row.role as OrganizationRole } : null;
  }

  async updateMemberRole(organizationId: string, userId: string, role: OrganizationRole) {
    await this.db
      .update(organizationMemberships)
      .set({ role })
      .where(and(eq(organizationMemberships.organizationId, organizationId), eq(organizationMemberships.userId, userId)));
  }

  async removeMember(organizationId: string, userId: string) {
    await this.db.transaction(async (tx) => {
      await tx
        .delete(organizationMemberships)
        .where(and(eq(organizationMemberships.organizationId, organizationId), eq(organizationMemberships.userId, userId)));
      await tx
        .delete(organizationContexts)
        .where(and(eq(organizationContexts.userId, userId), eq(organizationContexts.organizationId, organizationId)));
    });
  }

  async listPendingInvitations(organizationId: string, now: Date) {
    const rows = await this.db
      .select()
      .from(organizationInvitations)
      .where(
        and(
          eq(organizationInvitations.organizationId, organizationId),
          isNull(organizationInvitations.acceptedAt),
          isNull(organizationInvitations.cancelledAt),
          gt(organizationInvitations.expiresAt, now),
        ),
      )
      .orderBy(asc(organizationInvitations.createdAt));
    return rows.map(toInvitation);
  }

  async findInvitation(organizationId: string, invitationId: string) {
    const [row] = await this.db
      .select()
      .from(organizationInvitations)
      .where(and(eq(organizationInvitations.id, invitationId), eq(organizationInvitations.organizationId, organizationId)))
      .limit(1);
    return row ? toInvitation(row) : null;
  }

  async findInvitationByTokenHash(tokenHash: string) {
    const [row] = await this.db
      .select({ invitation: organizationInvitations, organizationName: organizations.name })
      .from(organizationInvitations)
      .innerJoin(organizations, eq(organizations.id, organizationInvitations.organizationId))
      .where(and(eq(organizationInvitations.tokenHash, tokenHash), active))
      .limit(1);
    return row ? { ...toInvitation(row.invitation), organizationName: row.organizationName } : null;
  }

  async createInvitation(input: {
    organizationId: string;
    email: string;
    role: OrganizationRole;
    tokenHash: string;
    invitedBy: string;
    expiresAt: Date;
    now: Date;
  }): Promise<CreateInvitationOutcome> {
    return this.db.transaction(async (tx) => {
      // Serialize invitation creation per organization so duplicate checks are race-free.
      await tx.select({ id: organizations.id }).from(organizations).where(eq(organizations.id, input.organizationId)).for("update");

      const [member] = await tx
        .select({ id: organizationMemberships.id })
        .from(organizationMemberships)
        .innerJoin(users, eq(users.id, organizationMemberships.userId))
        .where(and(eq(organizationMemberships.organizationId, input.organizationId), eq(users.email, input.email)))
        .limit(1);
      if (member) return { ok: false, reason: "already_member" } as const;

      const [pending] = await tx
        .select({ id: organizationInvitations.id })
        .from(organizationInvitations)
        .where(
          and(
            eq(organizationInvitations.organizationId, input.organizationId),
            eq(organizationInvitations.email, input.email),
            isNull(organizationInvitations.acceptedAt),
            isNull(organizationInvitations.cancelledAt),
            gt(organizationInvitations.expiresAt, input.now),
          ),
        )
        .limit(1);
      if (pending) return { ok: false, reason: "already_invited" } as const;

      const [row] = await tx
        .insert(organizationInvitations)
        .values({
          organizationId: input.organizationId,
          email: input.email,
          role: input.role,
          tokenHash: input.tokenHash,
          invitedBy: input.invitedBy,
          expiresAt: input.expiresAt,
        })
        .returning();
      return { ok: true, invitation: toInvitation(row!) } as const;
    });
  }

  async cancelInvitation(invitationId: string, now: Date) {
    const rows = await this.db
      .update(organizationInvitations)
      .set({ cancelledAt: now })
      .where(and(eq(organizationInvitations.id, invitationId), isNull(organizationInvitations.acceptedAt), isNull(organizationInvitations.cancelledAt)))
      .returning({ id: organizationInvitations.id });
    return rows.length > 0;
  }

  async acceptInvitation(input: {
    invitationId: string;
    userId: string;
    now: Date;
    inviterCanGrant: (inviterRole: OrganizationRole | null, invitedRole: OrganizationRole) => boolean;
  }): Promise<AcceptInvitationOutcome> {
    return this.db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(organizationInvitations)
        .where(eq(organizationInvitations.id, input.invitationId))
        .for("update");
      if (!row) return { ok: false, reason: "not_found" } as const;
      if (row.acceptedAt || row.cancelledAt || row.expiresAt <= input.now) return { ok: false, reason: "not_pending" } as const;

      // Re-validate the grant at use time: the inviter may have been removed or demoted since inviting.
      const [inviter] = row.invitedBy
        ? await tx
            .select({ role: organizationMemberships.role })
            .from(organizationMemberships)
            .where(and(eq(organizationMemberships.organizationId, row.organizationId), eq(organizationMemberships.userId, row.invitedBy)))
            .for("share")
        : [];
      if (!input.inviterCanGrant((inviter?.role as OrganizationRole | undefined) ?? null, row.role as OrganizationRole)) {
        await tx.update(organizationInvitations).set({ cancelledAt: input.now }).where(eq(organizationInvitations.id, row.id));
        return { ok: false, reason: "inviter_lost_rights" } as const;
      }

      // Legacy firstOrCreate: an existing membership keeps its current role.
      await tx
        .insert(organizationMemberships)
        .values({ organizationId: row.organizationId, userId: input.userId, role: row.role })
        .onConflictDoNothing({ target: [organizationMemberships.organizationId, organizationMemberships.userId] });
      await tx
        .update(organizationInvitations)
        .set({ acceptedAt: input.now, acceptedBy: input.userId })
        .where(eq(organizationInvitations.id, row.id));
      return { ok: true, organizationId: row.organizationId } as const;
    });
  }
}

