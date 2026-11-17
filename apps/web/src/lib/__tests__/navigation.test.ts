import { describe, expect, test } from "bun:test";
import { navigationFor, visibleModules } from "../navigation";

const labels = (items: { label: string }[]) => items.map((i) => i.label);

describe("permission-aware navigation", () => {
  test("personal context shows no organization management", () => {
    const items = navigationFor({ platformRole: "user", activeOrganization: { id: "p", kind: "personal" }, permissions: ["team:update"] });
    expect(labels(items)).toEqual(["Inicio", "Organizaciones", "Mi perfil"]);
  });

  test("managers see the management entry, viewers a read-only one", () => {
    const org = { id: "o", kind: "organization" as const };
    expect(labels(navigationFor({ platformRole: "user", activeOrganization: org, permissions: ["member:add"] }))).toContain("Gestionar organización");
    expect(labels(navigationFor({ platformRole: "user", activeOrganization: org, permissions: ["pets:view"] }))).toContain("Mi organización");
  });

  test("administration only for platform admins", () => {
    expect(labels(navigationFor({ platformRole: "platform_admin", activeOrganization: null, permissions: [] }))).toContain("Administración");
    expect(labels(navigationFor({ platformRole: "user", activeOrganization: null, permissions: [] }))).not.toContain("Administración");
  });

  test("modules follow view permissions", () => {
    expect(visibleModules(["pets:view", "blog:view"]).map((m) => m.key)).toEqual(["pets", "blog"]);
    expect(visibleModules([])).toEqual([]);
  });
});
