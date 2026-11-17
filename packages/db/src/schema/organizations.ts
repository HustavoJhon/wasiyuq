import { sql } from "drizzle-orm";
import { check, index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./identity";

/**
 * Organization tables (owned by modules/organizations).
 *
 * Retention: organizations are never hard-deleted by the application. "Deleting" an organization archives it
 * (`archived_at`), removes its memberships and cancels pending invitations, mirroring the legacy soft delete.
 * Memberships, invitations and contexts belong to the organization aggregate and cascade if a row is ever removed
 * (e.g. a user's personal organization when the user is deleted). Future business tables (pets, adoptions...) must
 * reference organizations with RESTRICT so business history can never be deleted implicitly.
 */

const roleList = sql.raw(
  `'owner','admin','organization_manager','adoptions_coordinator','pet_manager','blog_editor','member','viewer'`,
);

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    /** Unique across active and archived organizations (legacy slugs were unique including soft-deleted rows). */
    slug: text("slug").notNull(),
    /** `personal`: private per-user context created at sign-up (legacy `is_personal`). */
    kind: text("kind").notNull().default("organization"),
    /** Set only for personal organizations: exactly one per user. */
    personalOwnerId: uuid("personal_owner_id").references(() => users.id, { onDelete: "cascade" }),
    bio: text("bio"),
    website: text("website"),
    phone: text("phone"),
    address: text("address"),
    city: text("city"),
    region: text("region"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("organizations_slug_unique").on(table.slug),
    uniqueIndex("organizations_personal_owner_unique").on(table.personalOwnerId),
    check("organizations_kind_valid", sql`${table.kind} in ('personal', 'organization')`),
    check(
      "organizations_personal_owner_consistent",
      sql`(${table.kind} = 'personal') = (${table.personalOwnerId} is not null)`,
    ),
    check("organizations_slug_format", sql`${table.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`),
  ],
);

export const organizationMemberships = pgTable(
  "organization_memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("organization_memberships_org_user_unique").on(table.organizationId, table.userId),
    /** Exactly one owner per organization (legacy `Team::owner()`). */
    uniqueIndex("organization_memberships_single_owner").on(table.organizationId).where(sql`${table.role} = 'owner'`),
    index("organization_memberships_user_id_idx").on(table.userId),
    check("organization_memberships_role_valid", sql`${table.role} in (${roleList})`),
  ],
);

export const organizationInvitations = pgTable(
  "organization_invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role").notNull(),
    /** SHA-256 of the invitation token. The raw token is only ever sent to the invitee. */
    tokenHash: text("token_hash").notNull(),
    invitedBy: uuid("invited_by").references(() => users.id, { onDelete: "set null" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    acceptedBy: uuid("accepted_by").references(() => users.id, { onDelete: "set null" }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("organization_invitations_token_hash_unique").on(table.tokenHash),
    index("organization_invitations_org_email_idx").on(table.organizationId, table.email),
    check("organization_invitations_email_lowercase", sql`${table.email} = lower(${table.email})`),
    check("organization_invitations_role_valid", sql`${table.role} in (${roleList}) and ${table.role} <> 'owner'`),
    check(
      "organization_invitations_single_outcome",
      sql`not (${table.acceptedAt} is not null and ${table.cancelledAt} is not null)`,
    ),
  ],
);

/** The organization a user is currently working in (legacy `users.current_team_id`). One row per user. */
export const organizationContexts = pgTable("organization_contexts", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
