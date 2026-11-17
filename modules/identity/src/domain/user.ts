import type { AccountStatus, PlatformRole } from "@wasiyuq/validation";
import { IdentityError } from "./errors";

/** A platform user, independent of how they authenticate. */
export interface IdentityUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  dni: string | null;
  whatsapp: string | null;
  platformRole: PlatformRole;
  status: AccountStatus;
  createdAt: Date;
}

export interface ProfileChanges {
  name?: string;
  dni?: string | null;
  whatsapp?: string | null;
}

export function isPlatformAdmin(user: Pick<IdentityUser, "platformRole" | "status">): boolean {
  return user.status === "active" && user.platformRole === "platform_admin";
}

/** Suspended accounts cannot authenticate nor use existing sessions. */
export function assertCanAuthenticate(user: Pick<IdentityUser, "status">): void {
  if (user.status !== "active") throw new IdentityError("ACCOUNT_SUSPENDED", "Tu cuenta está suspendida", "suspended");
}

/** Platform administration is explicit (platform_role), never derived from an email address. */
export function assertPlatformAdmin(user: Pick<IdentityUser, "platformRole" | "status">): void {
  if (!isPlatformAdmin(user)) throw new IdentityError("FORBIDDEN", "Requiere permisos de administración de la plataforma", "not_platform_admin");
}

/** An administrator cannot change their own account status (avoids self-lockout and self-unsuspension). */
export function assertCanChangeStatus(actor: Pick<IdentityUser, "id" | "platformRole" | "status">, targetId: string): void {
  assertPlatformAdmin(actor);
  if (actor.id === targetId) throw new IdentityError("FORBIDDEN", "No puedes cambiar el estado de tu propia cuenta", "self_status_change");
}
