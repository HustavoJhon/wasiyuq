import { createHash, randomBytes } from "node:crypto";
import type { MembershipSummary, OrganizationPermission, OrganizationRole } from "@wasiyuq/validation";
import { conflict, forbidden, invalid, notFound } from "../domain/errors";
import { INVITATION_TTL_MS, invitationMatchesEmail, invitationStatus, normalizeEmail, type InvitationStatus } from "../domain/invitation";
import {
  assertCanGrantRole,
  assertCanManageMember,
  assertNotPersonal,
  requirePermission,
  type ActorMembership,
} from "../domain/policy";
import { permissionsFor, roleHasPermission, roleLevels } from "../domain/roles";
import { isReservedSlug, nextAvailableSlug, slugify } from "../domain/slug";
import {
  SlugTakenError,
  type InvitationNotifier,
  type InvitationRecord,
  type MemberRecord,
  type OrganizationProfileChanges,
  type OrganizationRecord,
  type OrganizationRepository,
} from "./ports";

export interface Actor {
  userId: string;
  email: string;
  name: string;
}

export interface OrganizationDetail {
  organization: OrganizationRecord;
  role: OrganizationRole;
  permissions: OrganizationPermission[];
}

export interface InvitationView extends InvitationRecord {
  status: InvitationStatus;
}

export const hashInvitationToken = (token: string) => createHash("sha256").update(token).digest("hex");

/**
 * Organization use cases. Every operation re-reads the caller's membership in the target organization and
 * authorizes it server-side (deny by default). Platform roles are deliberately not consulted here.
 */
export class OrganizationService {
  constructor(
    private readonly repo: OrganizationRepository,
    private readonly notifier: InvitationNotifier,
    private readonly clock: () => Date = () => new Date(),
  ) {}

  private async actorMembership(organizationId: string, userId: string): Promise<ActorMembership | null> {
    const role = await this.repo.findMembershipRole(organizationId, userId);
    return role ? { userId, role } : null;
  }

  private async requireOrganization(organizationId: string): Promise<OrganizationRecord> {
    const organization = await this.repo.findOrganization(organizationId);
    if (!organization) throw notFound("Organización no encontrada");
    return organization;
  }

  /** Non-members get NOT_FOUND (not FORBIDDEN) so organization ids cannot be probed. */
  private async memberContext(organizationId: string, userId: string) {
    const organization = await this.repo.findOrganization(organizationId);
    const actor = organization ? await this.actorMembership(organizationId, userId) : null;
    if (!organization || !actor) throw notFound("Organización no encontrada");
    return { organization, actor };
  }

  private async uniqueSlug(name: string, excludeSlug?: string): Promise<string> {
    const base = slugify(name) || "organizacion";
    if (isReservedSlug(base)) throw invalid("Ese nombre está reservado y no se puede usar", "reserved_name");
    const existing = (await this.repo.slugsStartingWith(base)).filter((slug) => slug !== excludeSlug);
    return nextAvailableSlug(base, existing);
  }

  private async createWithRetry(name: string, kind: "personal" | "organization", ownerUserId: string) {
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const slug = await this.uniqueSlug(name);
        return await this.repo.createWithOwner({ name, slug, kind, ownerUserId });
      } catch (error) {
        if (!(error instanceof SlugTakenError)) throw error;
      }
    }
    throw conflict("No se pudo generar un identificador único, inténtalo de nuevo", "slug_retry_exhausted");
  }

  /** Legacy CreateNewUser/Socialite: every user owns a personal organization. Idempotent. */
  async ensurePersonalOrganization(user: { id: string; name: string }): Promise<OrganizationRecord> {
    const existing = await this.repo.findPersonalOrganization(user.id);
    if (existing) return existing;
    try {
      const created = await this.createWithRetry(`${user.name} (personal)`, "personal", user.id);
      if (!(await this.repo.getContext(user.id))) await this.repo.setContext(user.id, created.id);
      return created;
    } catch (error) {
      const raced = await this.repo.findPersonalOrganization(user.id);
      if (raced) return raced;
      throw error;
    }
  }

  async listMemberships(userId: string): Promise<{ memberships: MembershipSummary[]; activeOrganizationId: string | null }> {
    const memberships = await this.repo.listMembershipsForUser(userId);
    let active = await this.repo.getContext(userId);
    if (!active || !memberships.some((m) => m.organizationId === active)) {
      active = memberships.find((m) => m.kind === "personal")?.organizationId ?? memberships[0]?.organizationId ?? null;
      if (active) await this.repo.setContext(userId, active);
      else await this.repo.clearContext(userId);
    }
    return {
      memberships: memberships.map((m) => ({ ...m, isActive: m.organizationId === active })),
      activeOrganizationId: active,
    };
  }

  async createOrganization(actor: Actor, name: string): Promise<OrganizationRecord> {
    const organization = await this.createWithRetry(name.trim(), "organization", actor.userId);
    // Legacy CreateTeam switched the creator into the new team.
    await this.repo.setContext(actor.userId, organization.id);
    return organization;
  }

  async getOrganization(actor: Actor, organizationId: string): Promise<OrganizationDetail> {
    const { organization, actor: member } = await this.memberContext(organizationId, actor.userId);
    return { organization, role: member.role, permissions: [...permissionsFor(member.role)] };
  }

  /** Effective permissions of the caller in an organization (empty when not a member). */
  async permissionsIn(userId: string, organizationId: string): Promise<OrganizationPermission[]> {
    const role = await this.repo.findMembershipRole(organizationId, userId);
    return role ? [...permissionsFor(role)] : [];
  }

  /** Generic organization-scoped guard for other modules (pets, adoptions...). */
  async authorize(userId: string, organizationId: string, permission: OrganizationPermission): Promise<ActorMembership> {
    const { actor } = await this.memberContext(organizationId, userId);
    return requirePermission(actor, permission);
  }

  async updateOrganization(actor: Actor, organizationId: string, changes: Omit<OrganizationProfileChanges, "slug">): Promise<OrganizationRecord> {
    const { organization, actor: member } = await this.memberContext(organizationId, actor.userId);
    requirePermission(member, "team:update");
    const next: OrganizationProfileChanges = { ...changes };
    if (changes.name !== undefined && changes.name.trim() !== organization.name) {
      next.name = changes.name.trim();
      // Legacy behaviour: renaming regenerates the slug. Personal organizations keep theirs.
      if (organization.kind === "organization") next.slug = await this.uniqueSlug(next.name, organization.slug);
    }
    try {
      return await this.repo.update(organizationId, next);
    } catch (error) {
      if (error instanceof SlugTakenError) throw conflict("Ese nombre acaba de ser usado, inténtalo de nuevo", "slug_taken");
      throw error;
    }
  }

  /** Legacy DeleteTeamRequest: requires `team:delete`, a non-personal team and typing the exact name. */
  async archiveOrganization(actor: Actor, organizationId: string, confirmName: string): Promise<void> {
    const { organization, actor: member } = await this.memberContext(organizationId, actor.userId);
    assertNotPersonal(organization.kind, "delete");
    requirePermission(member, "team:delete");
    if (confirmName !== organization.name) throw invalid("El nombre no coincide", "name_mismatch");
    await this.repo.archive(organizationId);
  }

  async switchOrganization(actor: Actor, organizationId: string): Promise<void> {
    await this.memberContext(organizationId, actor.userId);
    await this.repo.setContext(actor.userId, organizationId);
  }

  async listMembers(actor: Actor, organizationId: string): Promise<MemberRecord[]> {
    await this.memberContext(organizationId, actor.userId);
    return this.repo.listMembers(organizationId);
  }

  async changeMemberRole(actor: Actor, organizationId: string, targetUserId: string, role: OrganizationRole): Promise<void> {
    const { organization, actor: member } = await this.memberContext(organizationId, actor.userId);
    assertNotPersonal(organization.kind, "manage_members");
    requirePermission(member, "member:update");
    const target = await this.actorMembership(organizationId, targetUserId);
    if (!target) throw notFound("Miembro no encontrado");
    assertCanManageMember(member, target);
    assertCanGrantRole(member, role);
    await this.repo.updateMemberRole(organizationId, targetUserId, role);
  }

  async removeMember(actor: Actor, organizationId: string, targetUserId: string): Promise<void> {
    const { organization, actor: member } = await this.memberContext(organizationId, actor.userId);
    assertNotPersonal(organization.kind, "manage_members");
    requirePermission(member, "member:remove");
    const target = await this.actorMembership(organizationId, targetUserId);
    if (!target) throw notFound("Miembro no encontrado");
    assertCanManageMember(member, target);
    await this.repo.removeMember(organizationId, targetUserId);
  }

  /**
   * Pending invitations expose invitee emails, so listing requires an invitation-management permission
   * (hardening vs legacy, where any member saw them on the team settings page).
   */
  async listInvitations(actor: Actor, organizationId: string): Promise<InvitationView[]> {
    const { actor: member } = await this.memberContext(organizationId, actor.userId);
    if (!roleHasPermission(member.role, "invitation:cancel")) requirePermission(member, "invitation:create");
    const now = this.clock();
    const invitations = await this.repo.listPendingInvitations(organizationId, now);
    return invitations.map((invitation) => ({ ...invitation, status: invitationStatus(invitation, now) }));
  }

  async invite(actor: Actor, organizationId: string, email: string, role: OrganizationRole): Promise<InvitationView> {
    const { organization, actor: member } = await this.memberContext(organizationId, actor.userId);
    assertNotPersonal(organization.kind, "invite");
    requirePermission(member, "invitation:create");
    assertCanGrantRole(member, role);

    const now = this.clock();
    const token = randomBytes(32).toString("base64url");
    const outcome = await this.repo.createInvitation({
      organizationId,
      email: normalizeEmail(email),
      role,
      tokenHash: hashInvitationToken(token),
      invitedBy: actor.userId,
      expiresAt: new Date(now.getTime() + INVITATION_TTL_MS),
      now,
    });
    if (!outcome.ok) {
      throw outcome.reason === "already_member"
        ? conflict("Este usuario ya es miembro de la organización", "already_member")
        : conflict("Ya se envió una invitación pendiente a este correo", "already_invited");
    }
    await this.notifier.sendInvitation({ email: outcome.invitation.email, organizationName: organization.name, role, token });
    return { ...outcome.invitation, status: invitationStatus(outcome.invitation, now) };
  }

  async cancelInvitation(actor: Actor, organizationId: string, invitationId: string): Promise<void> {
    const { actor: member } = await this.memberContext(organizationId, actor.userId);
    requirePermission(member, "invitation:cancel");
    const invitation = await this.repo.findInvitation(organizationId, invitationId);
    if (!invitation) throw notFound("Invitación no encontrada");
    if (invitationStatus(invitation, this.clock()) !== "pending") throw conflict("La invitación ya no está pendiente", "not_pending");
    await this.repo.cancelInvitation(invitationId, this.clock());
  }

  async previewInvitation(actor: Actor, token: string) {
    const invitation = await this.repo.findInvitationByTokenHash(hashInvitationToken(token));
    if (!invitation) throw notFound("Invitación no encontrada");
    return {
      organizationName: invitation.organizationName,
      role: invitation.role,
      emailMatches: invitationMatchesEmail(invitation.email, actor.email),
      expiresAt: invitation.expiresAt,
      status: invitationStatus(invitation, this.clock()),
    };
  }

  /** Legacy ValidTeamInvitation + accept: pending, not expired, addressed to the caller's email. */
  async acceptInvitation(actor: Actor, token: string): Promise<{ organizationId: string }> {
    const invitation = await this.repo.findInvitationByTokenHash(hashInvitationToken(token));
    if (!invitation) throw notFound("Invitación no encontrada");
    const status = invitationStatus(invitation, this.clock());
    if (status === "accepted") throw conflict("Esta invitación ya fue aceptada", "already_accepted");
    if (status === "cancelled") throw conflict("Esta invitación fue cancelada", "cancelled");
    if (status === "expired") throw conflict("Esta invitación ha expirado", "expired");
    if (!invitationMatchesEmail(invitation.email, actor.email)) {
      throw forbidden("email_mismatch", "Esta invitación fue enviada a otra dirección de correo");
    }
    const outcome = await this.repo.acceptInvitation({
      invitationId: invitation.id,
      userId: actor.userId,
      now: this.clock(),
      inviterCanGrant: (inviterRole, invitedRole) =>
        inviterRole !== null && roleHasPermission(inviterRole, "invitation:create") && roleLevels[invitedRole] <= roleLevels[inviterRole],
    });
    if (!outcome.ok) {
      throw outcome.reason === "inviter_lost_rights"
        ? conflict("Esta invitación ya no es válida: quien la envió ya no puede otorgar ese rol", "inviter_lost_rights")
        : conflict("La invitación ya no está pendiente", "not_pending");
    }
    await this.repo.setContext(actor.userId, outcome.organizationId);
    return { organizationId: outcome.organizationId };
  }
}

