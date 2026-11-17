import { describe, expect, test } from "bun:test";
import { organizationPermissions, organizationRoles } from "@wasiyuq/validation";
import { OrganizationError } from "../domain/errors";
import { INVITATION_TTL_MS, invitationMatchesEmail, invitationStatus } from "../domain/invitation";
import { assertCanGrantRole, assertCanManageMember, assertNotPersonal, requirePermission } from "../domain/policy";
import { assignableRoles, permissionsFor, roleHasPermission } from "../domain/roles";
import { isReservedSlug, nextAvailableSlug, slugify } from "../domain/slug";

/** Legacy TeamRole::permissions() transcribed from git history (8b77756^:app/Enums/TeamRole.php). */
const legacy: Record<string, string[]> = {
  admin: [
    "team:update", "team:delete", "member:add", "member:update", "member:remove", "invitation:create", "invitation:cancel",
    "pets:view", "pets:create", "pets:update", "pets:delete", "adoptions:view", "adoptions:update-status", "adoptions:generate-docs",
    "follow-ups:view", "follow-ups:create", "follow-ups:update", "blog:view", "blog:create", "blog:update", "blog:delete",
    "events:view", "events:create", "events:update", "events:delete", "announcements:view", "announcements:create",
    "announcements:update", "announcements:delete", "reports:view", "data:export",
  ],
  organization_manager: [
    "team:update", "member:add", "member:update", "member:remove", "invitation:create", "invitation:cancel",
    "pets:view", "pets:create", "pets:update", "pets:delete", "adoptions:view", "adoptions:update-status", "adoptions:generate-docs",
    "follow-ups:view", "follow-ups:create", "follow-ups:update", "reports:view",
  ],
  pet_manager: ["pets:view", "pets:create", "pets:update", "pets:delete", "adoptions:view"],
  blog_editor: [
    "blog:view", "blog:create", "blog:update", "blog:delete", "events:view", "events:create", "events:update", "events:delete",
    "announcements:view", "announcements:create", "announcements:update", "announcements:delete",
  ],
  adoptions_coordinator: [
    "pets:view", "adoptions:view", "adoptions:update-status", "adoptions:generate-docs",
    "follow-ups:view", "follow-ups:create", "follow-ups:update", "reports:view",
  ],
  member: ["pets:view", "adoptions:view", "blog:view", "events:view"],
  viewer: ["pets:view", "adoptions:view", "blog:view", "events:view", "announcements:view", "follow-ups:view"],
};

const code = (fn: () => unknown) => {
  try {
    fn();
  } catch (error) {
    if (error instanceof OrganizationError) return `${error.code}:${error.reason}`;
    throw error;
  }
  return "allowed";
};

describe("role → permission map", () => {
  test("owner holds every permission", () => {
    expect([...permissionsFor("owner")].sort()).toEqual([...organizationPermissions].sort());
  });

  for (const [role, permissions] of Object.entries(legacy)) {
    test(`${role} matches the legacy definition exactly`, () => {
      expect([...permissionsFor(role as never)].sort() as string[]).toEqual([...permissions].sort());
    });
  }

  test("deny by default for missing roles and unknown values", () => {
    expect(roleHasPermission(null, "pets:view")).toBe(false);
    expect(roleHasPermission("superuser" as never, "pets:view")).toBe(false);
    expect(roleHasPermission("viewer", "pets:create")).toBe(false);
  });

  test("owner is never assignable", () => {
    expect(assignableRoles).not.toContain("owner");
    expect(assignableRoles).toHaveLength(organizationRoles.length - 1);
  });
});

describe("authorization policy", () => {
  const actor = (role: string, userId = "actor") => ({ userId, role: role as never });

  test("non-members and members without the permission are denied", () => {
    expect(code(() => requirePermission(null, "team:update"))).toBe("FORBIDDEN:not_a_member");
    expect(code(() => requirePermission(actor("viewer"), "team:update"))).toBe("FORBIDDEN:missing_permission:team:update");
    expect(code(() => requirePermission(actor("admin"), "team:update"))).toBe("allowed");
  });

  test("no privilege escalation when granting roles", () => {
    expect(code(() => assertCanGrantRole(actor("organization_manager"), "admin"))).toBe("FORBIDDEN:role_escalation");
    expect(code(() => assertCanGrantRole(actor("organization_manager"), "pet_manager"))).toBe("allowed");
    expect(code(() => assertCanGrantRole(actor("owner"), "owner"))).toBe("VALIDATION_FAILED:owner_not_assignable");
    expect(code(() => assertCanGrantRole(actor("admin"), "admin"))).toBe("allowed");
  });

  test("owner, higher roles and oneself cannot be managed", () => {
    expect(code(() => assertCanManageMember(actor("admin"), actor("owner", "o")))).toBe("FORBIDDEN:target_is_owner");
    expect(code(() => assertCanManageMember(actor("organization_manager"), actor("admin", "a")))).toBe("FORBIDDEN:target_above_actor");
    expect(code(() => assertCanManageMember(actor("admin", "same"), actor("member", "same")))).toBe("FORBIDDEN:self_management");
    expect(code(() => assertCanManageMember(actor("admin"), actor("admin", "other")))).toBe("allowed");
  });

  test("personal organizations reject organization-only actions", () => {
    expect(code(() => assertNotPersonal("personal", "invite"))).toBe("FORBIDDEN:personal_organization:invite");
    expect(code(() => assertNotPersonal("organization", "invite"))).toBe("allowed");
  });
});

describe("invitations", () => {
  const now = new Date("2026-11-17T12:00:00Z");
  const base = { acceptedAt: null, cancelledAt: null, expiresAt: new Date(now.getTime() + INVITATION_TTL_MS) };

  test("status precedence: accepted > cancelled > expired > pending", () => {
    expect(invitationStatus(base, now)).toBe("pending");
    expect(invitationStatus({ ...base, expiresAt: now }, now)).toBe("expired");
    expect(invitationStatus({ ...base, cancelledAt: now, expiresAt: now }, now)).toBe("cancelled");
    expect(invitationStatus({ ...base, acceptedAt: now, cancelledAt: now }, now)).toBe("accepted");
  });

  test("expires after 3 days and matches email case-insensitively", () => {
    expect(INVITATION_TTL_MS).toBe(259_200_000);
    expect(invitationMatchesEmail(" Ana@Example.com", "ana@example.COM")).toBe(true);
    expect(invitationMatchesEmail("ana@example.com", "otra@example.com")).toBe(false);
  });
});

describe("slugs", () => {
  test("slugify strips accents and symbols", () => {
    expect(slugify("Albergue Patitas Cusco ñandú!")).toBe("albergue-patitas-cusco-nandu");
  });

  test("collisions get the next numeric suffix like the legacy generator", () => {
    expect(nextAvailableSlug("patitas", [])).toBe("patitas");
    expect(nextAvailableSlug("patitas", ["patitas"])).toBe("patitas-1");
    expect(nextAvailableSlug("patitas", ["patitas", "patitas-1", "patitas-7", "patitas-x"])).toBe("patitas-8");
  });

  test("reserved route words are rejected", () => {
    expect(isReservedSlug("admin")).toBe(true);
    expect(isReservedSlug("patitas")).toBe(false);
  });
});
