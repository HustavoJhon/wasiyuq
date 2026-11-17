import type { OrganizationKind, OrganizationPermission, OrganizationRole } from "@wasiyuq/validation";
import { forbidden, invalid } from "./errors";
import { assignableRoles, roleHasPermission, roleLevels } from "./roles";

/** The caller's membership in the organization that owns the resource. `null` = not a member. */
export interface ActorMembership {
  userId: string;
  role: OrganizationRole;
}

/**
 * Authorization checks for organization-scoped actions. All functions deny by default and throw
 * `OrganizationError(FORBIDDEN)`. They never consult platform roles: platform administrators do not
 * inherit organization permissions (ADR-011).
 */
export function requireMembership(actor: ActorMembership | null): ActorMembership {
  if (!actor) throw forbidden("not_a_member", "No perteneces a esta organización");
  return actor;
}

export function requirePermission(actor: ActorMembership | null, permission: OrganizationPermission): ActorMembership {
  const member = requireMembership(actor);
  if (!roleHasPermission(member.role, permission)) throw forbidden(`missing_permission:${permission}`);
  return member;
}

/** An actor may only grant roles that are assignable and not above their own level (no escalation). */
export function assertCanGrantRole(actor: ActorMembership, role: OrganizationRole): void {
  if (!assignableRoles.includes(role)) throw invalid("El rol de propietario no se puede asignar", "owner_not_assignable");
  if (roleLevels[role] > roleLevels[actor.role]) {
    throw forbidden("role_escalation", "No puedes asignar un rol superior al tuyo");
  }
}

/** Changing or removing another member: never the owner, never someone above the actor, never oneself. */
export function assertCanManageMember(actor: ActorMembership, target: ActorMembership): void {
  if (target.role === "owner") throw forbidden("target_is_owner", "El propietario no puede ser modificado ni eliminado");
  if (actor.userId === target.userId) throw forbidden("self_management", "No puedes modificar tu propia membresía");
  if (roleLevels[target.role] > roleLevels[actor.role]) {
    throw forbidden("target_above_actor", "No puedes gestionar a un miembro con un rol superior al tuyo");
  }
}

/** Personal organizations are a user's private context: no members, invitations, or deletion. */
export function assertNotPersonal(kind: OrganizationKind, action: string): void {
  if (kind === "personal") throw forbidden(`personal_organization:${action}`, "Esta acción no está disponible en tu espacio personal");
}
