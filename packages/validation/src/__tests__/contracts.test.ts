import { describe, expect, test } from "bun:test";
import {
  createInvitationRequestSchema,
  organizationPermissions,
  organizationRoleLabels,
  organizationRoles,
  updateOrganizationRequestSchema,
  updateProfileRequestSchema,
} from "../index";

describe("organization vocabulary", () => {
  test("keeps the 8 legacy roles and 31 legacy permissions without duplicates", () => {
    expect(organizationRoles).toHaveLength(8);
    expect(new Set(organizationPermissions).size).toBe(organizationPermissions.length);
    expect(organizationPermissions).toHaveLength(31);
    for (const role of organizationRoles) expect(organizationRoleLabels[role].label.length).toBeGreaterThan(0);
  });
});

describe("request contracts", () => {
  test("invitation email is normalized and role is validated", () => {
    expect(createInvitationRequestSchema.parse({ email: " Ana@Example.COM ", role: "viewer" })).toEqual({
      email: "ana@example.com",
      role: "viewer",
    });
    expect(createInvitationRequestSchema.safeParse({ email: "x", role: "viewer" }).success).toBe(false);
    expect(createInvitationRequestSchema.safeParse({ email: "a@b.co", role: "superuser" }).success).toBe(false);
  });

  test("unknown fields are rejected (no mass assignment)", () => {
    expect(updateProfileRequestSchema.safeParse({ name: "Ana", platformRole: "platform_admin" }).success).toBe(false);
    expect(updateOrganizationRequestSchema.safeParse({ kind: "personal" }).success).toBe(false);
  });

  test("profile fields follow legacy DNI and WhatsApp rules", () => {
    expect(updateProfileRequestSchema.safeParse({ dni: "12345678" }).success).toBe(true);
    expect(updateProfileRequestSchema.safeParse({ dni: "1234" }).success).toBe(false);
    expect(updateProfileRequestSchema.safeParse({ whatsapp: "+51987654321" }).success).toBe(true);
    expect(updateProfileRequestSchema.safeParse({ whatsapp: "abc" }).success).toBe(false);
    expect(updateProfileRequestSchema.safeParse({}).success).toBe(false);
  });

  test("organization website must be http(s) and empty text becomes null", () => {
    expect(updateOrganizationRequestSchema.safeParse({ website: "javascript:alert(1)" }).success).toBe(false);
    expect(updateOrganizationRequestSchema.parse({ bio: "  " })).toEqual({ bio: null });
  });
});
