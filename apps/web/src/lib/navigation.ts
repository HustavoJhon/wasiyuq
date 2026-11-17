import type { OrganizationKind, OrganizationPermission, PlatformRole } from "@wasiyuq/validation";

export interface NavItem {
  label: string;
  to: string;
  params?: Record<string, string>;
}

export interface NavigationInput {
  platformRole: PlatformRole;
  activeOrganization: { id: string; kind: OrganizationKind } | null;
  permissions: readonly OrganizationPermission[];
}

const manages = (permissions: readonly OrganizationPermission[]) =>
  permissions.some((p) => p === "team:update" || p.startsWith("member:") || p.startsWith("invitation:"));

/**
 * Navigation derived from the caller's real permissions. Visibility only: every action is authorized again by
 * the API, so hiding an item is never the security boundary.
 */
export function navigationFor({ platformRole, activeOrganization, permissions }: NavigationInput): NavItem[] {
  const items: NavItem[] = [
    { label: "Inicio", to: "/app" },
    { label: "Organizaciones", to: "/app/organizations" },
  ];
  if (activeOrganization && activeOrganization.kind === "organization") {
    items.push({
      label: manages(permissions) ? "Gestionar organización" : "Mi organización",
      to: "/app/organizations/$orgId",
      params: { orgId: activeOrganization.id },
    });
  }
  items.push({ label: "Mi perfil", to: "/app/profile" });
  if (platformRole === "platform_admin") items.push({ label: "Administración", to: "/app/admin/users" });
  return items;
}

/** Organization modules (future phases) and whether the current role can see them. */
export const moduleCatalog = [
  { key: "pets", label: "Mascotas", permission: "pets:view" },
  { key: "adoptions", label: "Adopciones", permission: "adoptions:view" },
  { key: "follow-ups", label: "Seguimientos", permission: "follow-ups:view" },
  { key: "blog", label: "Blog", permission: "blog:view" },
  { key: "events", label: "Eventos", permission: "events:view" },
  { key: "announcements", label: "Anuncios", permission: "announcements:view" },
  { key: "reports", label: "Reportes", permission: "reports:view" },
] as const satisfies readonly { key: string; label: string; permission: OrganizationPermission }[];

export function visibleModules(permissions: readonly OrganizationPermission[]) {
  return moduleCatalog.filter((module) => permissions.includes(module.permission));
}
