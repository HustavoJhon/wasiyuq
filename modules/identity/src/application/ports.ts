import type { AccountStatus, PlatformRole } from "@wasiyuq/validation";
import type { IdentityUser, ProfileChanges } from "../domain/user";

export interface SessionRecord {
  id: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  expiresAt: Date;
}

export interface UserRepository {
  findById(id: string): Promise<IdentityUser | null>;
  findByEmail(email: string): Promise<IdentityUser | null>;
  /** Throws IdentityError(CONFLICT) when the DNI is already used by another user. */
  updateProfile(id: string, changes: ProfileChanges): Promise<IdentityUser>;
  setStatus(id: string, status: AccountStatus): Promise<IdentityUser | null>;
  setPlatformRole(id: string, role: PlatformRole): Promise<IdentityUser | null>;
  list(options: { limit: number; offset: number }): Promise<IdentityUser[]>;
}

export interface SessionRepository {
  listActive(userId: string, now?: Date): Promise<SessionRecord[]>;
  /** Revoke one of the user's sessions. Returns false when it does not belong to the user. */
  revoke(userId: string, sessionId: string): Promise<boolean>;
  revokeAllExcept(userId: string, keepSessionId: string): Promise<number>;
  revokeAll(userId: string): Promise<number>;
}
