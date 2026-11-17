import {
  organizationPermissions,
  organizationRoles,
  type OrganizationPermission,
  type OrganizationRole,
} from "@wasiyuq/validation";

/**
 * Central role → permission policy. Mirrors legacy `App\Enums\TeamRole::permissions()` exactly
 * (verified in git history, commit 8b77756^). Any change here is a business decision: document it.
 */
const P = (...permissions: OrganizationPermission[]) => Object.freeze(permissions);

const memberAdmin = P("member:add", "member:update", "member:remove", "invitation:create", "invitation:cancel");
const petsCrud = P("pets:view", "pets:create", "pets:update", "pets:delete");
const adoptionsManage = P("adoptions:view", "adoptions:update-status", "adoptions:generate-docs");
const followUpsManage = P("follow-ups:view", "follow-ups:create", "follow-ups:update");
const contentCrud = P(
  "blog:view",
  "blog:create",
  "blog:update",
  "blog:delete",
  "events:view",
  "events:create",
  "events:update",
  "events:delete",
  "announcements:view",
  "announcements:create",
  "announcements:update",
  "announcements:delete",
);

export const rolePermissions: Readonly<Record<OrganizationRole, readonly OrganizationPermission[]>> = Object.freeze({
  owner: Object.freeze([...organizationPermissions]),
  admin: P(
    "team:update",
    "team:delete",
    ...memberAdmin,
    ...petsCrud,
    ...adoptionsManage,
    ...followUpsManage,
    ...contentCrud,
    "reports:view",
    "data:export",
  ),
  organization_manager: P("team:update", ...memberAdmin, ...petsCrud, ...adoptionsManage, ...followUpsManage, "reports:view"),
  pet_manager: P(...petsCrud, "adoptions:view"),
  blog_editor: P(...contentCrud),
  adoptions_coordinator: P("pets:view", ...adoptionsManage, ...followUpsManage, "reports:view"),
  member: P("pets:view", "adoptions:view", "blog:view", "events:view"),
  viewer: P("pets:view", "adoptions:view", "blog:view", "events:view", "announcements:view", "follow-ups:view"),
});

/** Legacy `TeamRole::level()`. Used to prevent privilege escalation when assigning roles. */
export const roleLevels: Readonly<Record<OrganizationRole, number>> = Object.freeze({
  owner: 10,
  admin: 9,
  organization_manager: 8,
  adoptions_coordinator: 6,
  pet_manager: 5,
  blog_editor: 4,
  member: 2,
  viewer: 1,
});

export function isOrganizationRole(value: unknown): value is OrganizationRole {
  return typeof value === "string" && (organizationRoles as readonly string[]).includes(value);
}

export function permissionsFor(role: OrganizationRole): readonly OrganizationPermission[] {
  return rolePermissions[role] ?? [];
}

/** Deny by default: unknown roles or permissions are never granted. */
export function roleHasPermission(role: OrganizationRole | null | undefined, permission: OrganizationPermission): boolean {
  if (!role || !isOrganizationRole(role)) return false;
  return rolePermissions[role].includes(permission);
}

/** Roles that can be granted through invitations or role changes. `owner` is never assignable (legacy `assignable()`). */
export const assignableRoles: readonly OrganizationRole[] = Object.freeze(organizationRoles.filter((role) => role !== "owner"));
