import { and, desc, eq, gt, ne } from "drizzle-orm";
import { sessions, users, type Database } from "@wasiyuq/db";
import type { AccountStatus, PlatformRole } from "@wasiyuq/validation";
import type { SessionRecord, SessionRepository, UserRepository } from "../application/ports";
import { IdentityError } from "../domain/errors";
import type { IdentityUser, ProfileChanges } from "../domain/user";

type UserRow = typeof users.$inferSelect;

export function toIdentityUser(row: UserRow): IdentityUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    emailVerified: row.emailVerified,
    image: row.image,
    dni: row.dni,
    whatsapp: row.whatsapp,
    platformRole: row.platformRole as PlatformRole,
    status: row.status as AccountStatus,
    createdAt: row.createdAt,
  };
}

function isUniqueViolation(error: unknown, constraint: string): boolean {
  const cause = (error as { cause?: unknown }).cause ?? error;
  const pg = cause as { code?: string; constraint_name?: string; constraint?: string };
  return pg.code === "23505" && (pg.constraint_name ?? pg.constraint) === constraint;
}

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string) {
    const [row] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return row ? toIdentityUser(row) : null;
  }

  async findByEmail(email: string) {
    const [row] = await this.db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);
    return row ? toIdentityUser(row) : null;
  }

  async updateProfile(id: string, changes: ProfileChanges) {
    try {
      const [row] = await this.db.update(users).set(changes).where(eq(users.id, id)).returning();
      if (!row) throw new IdentityError("NOT_FOUND", "Usuario no encontrado");
      return toIdentityUser(row);
    } catch (error) {
      if (isUniqueViolation(error, "users_dni_unique")) {
        throw new IdentityError("CONFLICT", "El DNI ya está registrado en otra cuenta", "dni_taken");
      }
      throw error;
    }
  }

  async setStatus(id: string, status: AccountStatus) {
    const [row] = await this.db.update(users).set({ status }).where(eq(users.id, id)).returning();
    return row ? toIdentityUser(row) : null;
  }

  async setPlatformRole(id: string, platformRole: PlatformRole) {
    const [row] = await this.db.update(users).set({ platformRole }).where(eq(users.id, id)).returning();
    return row ? toIdentityUser(row) : null;
  }

  async list({ limit, offset }: { limit: number; offset: number }) {
    const rows = await this.db.select().from(users).orderBy(desc(users.createdAt)).limit(limit).offset(offset);
    return rows.map(toIdentityUser);
  }
}

export class DrizzleSessionRepository implements SessionRepository {
  constructor(private readonly db: Database) {}

  async listActive(userId: string, now = new Date()): Promise<SessionRecord[]> {
    return this.db
      .select({
        id: sessions.id,
        userId: sessions.userId,
        ipAddress: sessions.ipAddress,
        userAgent: sessions.userAgent,
        createdAt: sessions.createdAt,
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .where(and(eq(sessions.userId, userId), gt(sessions.expiresAt, now)))
      .orderBy(desc(sessions.createdAt));
  }

  async revoke(userId: string, sessionId: string) {
    const deleted = await this.db
      .delete(sessions)
      .where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)))
      .returning({ id: sessions.id });
    return deleted.length > 0;
  }

  async revokeAllExcept(userId: string, keepSessionId: string) {
    const deleted = await this.db
      .delete(sessions)
      .where(and(eq(sessions.userId, userId), ne(sessions.id, keepSessionId)))
      .returning({ id: sessions.id });
    return deleted.length;
  }

  async revokeAll(userId: string) {
    const deleted = await this.db.delete(sessions).where(eq(sessions.userId, userId)).returning({ id: sessions.id });
    return deleted.length;
  }
}
