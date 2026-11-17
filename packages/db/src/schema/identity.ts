import { sql } from "drizzle-orm";
import { bigint, boolean, check, index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

/**
 * Identity tables (owned by modules/identity).
 * `users`, `sessions`, `accounts`, `verifications` and `rate_limits` follow the field names Better Auth expects
 * (TypeScript keys) while using snake_case columns. Never add business data here: organizations live elsewhere.
 */

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    /** Always stored lower-case (Better Auth normalizes; the check enforces it). */
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    /** Peruvian DNI (8 digits), optional, unique when present (legacy users.dni). */
    dni: text("dni"),
    whatsapp: text("whatsapp"),
    /** Platform-level authorization, independent from organization roles. No email-based bypass exists. */
    platformRole: text("platform_role").notNull().default("user"),
    /** `suspended` users cannot sign in nor use existing sessions. */
    status: text("status").notNull().default("active"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    uniqueIndex("users_dni_unique").on(table.dni),
    check("users_email_lowercase", sql`${table.email} = lower(${table.email})`),
    check("users_dni_format", sql`${table.dni} is null or ${table.dni} ~ '^[0-9]{8}$'`),
    check("users_platform_role_valid", sql`${table.platformRole} in ('user', 'platform_admin')`),
    check("users_status_valid", sql`${table.status} in ('active', 'suspended')`),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Opaque session token (sent only in an httpOnly signed cookie). */
    token: text("token").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    ...timestamps,
  },
  (table) => [uniqueIndex("sessions_token_unique").on(table.token), index("sessions_user_id_idx").on(table.userId)],
);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Provider-side account id (for `credential`, the user id). */
    accountId: text("account_id").notNull(),
    /** `credential` (email/password) or an OAuth provider such as `google`. */
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    /** Password hash (scrypt) for the `credential` provider. Never returned by the API. */
    password: text("password"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("accounts_provider_account_unique").on(table.providerId, table.accountId),
    index("accounts_user_id_idx").on(table.userId),
  ],
);

/** Email verification and password reset tokens (stored hashed). */
export const verifications = pgTable(
  "verifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

/** Authentication rate-limit counters, shared across API instances. */
export const rateLimits = pgTable(
  "rate_limits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(),
    count: integer("count").notNull(),
    lastRequest: bigint("last_request", { mode: "number" }).notNull(),
  },
  (table) => [uniqueIndex("rate_limits_key_unique").on(table.key)],
);
