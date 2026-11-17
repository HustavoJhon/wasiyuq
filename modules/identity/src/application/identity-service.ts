import type { AccountStatus } from "@wasiyuq/validation";
import { IdentityError } from "../domain/errors";
import { assertCanChangeStatus, assertPlatformAdmin, type IdentityUser, type ProfileChanges } from "../domain/user";
import type { SessionRecord, SessionRepository, UserRepository } from "./ports";

/** Use cases for the identity module. Authentication itself (sign-in, verification, reset) is handled by the auth adapter. */
export class IdentityService {
  constructor(
    private readonly users: UserRepository,
    private readonly sessions: SessionRepository,
  ) {}

  async getUser(id: string): Promise<IdentityUser> {
    const user = await this.users.findById(id);
    if (!user) throw new IdentityError("NOT_FOUND", "Usuario no encontrado");
    return user;
  }

  updateProfile(userId: string, changes: ProfileChanges): Promise<IdentityUser> {
    return this.users.updateProfile(userId, changes);
  }

  listSessions(userId: string): Promise<SessionRecord[]> {
    return this.sessions.listActive(userId);
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    const revoked = await this.sessions.revoke(userId, sessionId);
    // Same response for "not yours" and "does not exist": never reveal other users' session ids.
    if (!revoked) throw new IdentityError("NOT_FOUND", "Sesión no encontrada");
  }

  revokeOtherSessions(userId: string, currentSessionId: string): Promise<number> {
    return this.sessions.revokeAllExcept(userId, currentSessionId);
  }

  async listUsers(actor: IdentityUser, options: { limit: number; offset: number }): Promise<IdentityUser[]> {
    assertPlatformAdmin(actor);
    return this.users.list(options);
  }

  /** Suspending an account also revokes every session it has, so the change takes effect immediately. */
  async changeAccountStatus(actor: IdentityUser, targetId: string, status: AccountStatus): Promise<IdentityUser> {
    assertCanChangeStatus(actor, targetId);
    const updated = await this.users.setStatus(targetId, status);
    if (!updated) throw new IdentityError("NOT_FOUND", "Usuario no encontrado");
    if (status === "suspended") await this.sessions.revokeAll(targetId);
    return updated;
  }
}
