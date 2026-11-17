/**
 * Slug rules (legacy `GeneratesUniqueTeamSlugs` + `TeamName`): derived from the name, unique across all
 * organizations including archived ones, numeric suffix on collision, reserved words rejected.
 */
export const reservedSlugs: ReadonlySet<string> = new Set([
  "admin",
  "api",
  "app",
  "auth",
  "dashboard",
  "invitations",
  "login",
  "logout",
  "mi-adopcion",
  "new",
  "organizations",
  "register",
  "settings",
  "signin",
  "signup",
  "teams",
]);

export function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export function isReservedSlug(slug: string): boolean {
  return reservedSlugs.has(slug);
}

/** Pick the next free slug given every existing slug that starts with the base. */
export function nextAvailableSlug(base: string, existing: Iterable<string>): string {
  const taken = new Set(existing);
  if (!taken.has(base)) return base;
  let max = 0;
  const pattern = new RegExp(`^${base.replace(/[-]/g, "\\-")}-(\\d+)$`);
  for (const slug of taken) {
    const match = pattern.exec(slug);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `${base}-${max + 1}`;
}
