import { z } from "zod";

/**
 * Organization roles. Identifiers preserved from the legacy `TeamRole` enum.
 * The role → permission mapping (policy) lives in modules/organizations.
 */
export const organizationRoles = [
  "owner",
  "admin",
  "organization_manager",
  "adoptions_coordinator",
  "pet_manager",
  "blog_editor",
  "member",
  "viewer",
] as const;

export type OrganizationRole = (typeof organizationRoles)[number];
export const organizationRoleSchema = z.enum(organizationRoles);

export const organizationRoleLabels: Record<OrganizationRole, { label: string; description: string }> = {
  owner: { label: "Propietario", description: "Control total sobre la organización" },
  admin: { label: "Administrador", description: "Administración completa de la organización" },
  organization_manager: { label: "Gestor de Organización", description: "Gestiona organización, mascotas y adopciones" },
  adoptions_coordinator: { label: "Coordinador de Adopciones", description: "Coordina procesos de adopción y seguimientos" },
  pet_manager: { label: "Gestor de Mascotas", description: "Gestiona el registro y datos de mascotas" },
  blog_editor: { label: "Editor de Blog", description: "Crea y edita contenido del blog" },
  member: { label: "Miembro", description: "Acceso básico con permisos limitados" },
  viewer: { label: "Visualizador", description: "Solo lectura de información" },
};

/** Organization-scoped permissions. Identifiers preserved from the legacy `TeamPermission` enum. */
export const organizationPermissions = [
  "team:update",
  "team:delete",
  "member:add",
  "member:update",
  "member:remove",
  "invitation:create",
  "invitation:cancel",
  "pets:view",
  "pets:create",
  "pets:update",
  "pets:delete",
  "adoptions:view",
  "adoptions:update-status",
  "adoptions:generate-docs",
  "follow-ups:view",
  "follow-ups:create",
  "follow-ups:update",
  "blog:view",
  "blog:create",
  "blog:update",
  "blog:delete",
  "events:view",
  "events:create",
  "events:update",
  "events:delete",
  "announcements:view",
  "announcements:create",
  "announcements:update",
  "announcements:delete",
  "reports:view",
  "data:export",
] as const;

export type OrganizationPermission = (typeof organizationPermissions)[number];
export const organizationPermissionSchema = z.enum(organizationPermissions);

/** `personal`: the per-user context created at sign-up (legacy `is_personal`). `organization`: shelters/teams. */
export const organizationKinds = ["personal", "organization"] as const;
export type OrganizationKind = (typeof organizationKinds)[number];

const trimmed = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) =>
  trimmed(max)
    .transform((value) => (value.length === 0 ? null : value))
    .nullable()
    .optional();

export const organizationNameSchema = trimmed(120).min(2, "Debe tener al menos 2 caracteres");

export const createOrganizationRequestSchema = z.object({ name: organizationNameSchema }).strict();
export type CreateOrganizationRequest = z.infer<typeof createOrganizationRequestSchema>;

export const updateOrganizationRequestSchema = z
  .object({
    name: organizationNameSchema.optional(),
    bio: optionalText(2000),
    website: z
      .string()
      .trim()
      .url("URL inválida")
      .max(255)
      .refine((value) => /^https?:\/\//.test(value), "Debe usar http o https")
      .nullable()
      .optional(),
    phone: optionalText(30),
    address: optionalText(255),
    city: optionalText(120),
    region: optionalText(120),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "Debe enviar al menos un campo");
export type UpdateOrganizationRequest = z.infer<typeof updateOrganizationRequestSchema>;

export const deleteOrganizationRequestSchema = z.object({ confirmName: z.string() }).strict();

export const membershipSummarySchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  kind: z.enum(organizationKinds),
  role: organizationRoleSchema,
  isActive: z.boolean(),
});
export type MembershipSummary = z.infer<typeof membershipSummarySchema>;

export const organizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  kind: z.enum(organizationKinds),
  bio: z.string().nullable(),
  website: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  region: z.string().nullable(),
  createdAt: z.string(),
});
export type Organization = z.infer<typeof organizationSchema>;

export const organizationDetailSchema = z.object({
  organization: organizationSchema,
  role: organizationRoleSchema,
  permissions: z.array(organizationPermissionSchema),
});
export type OrganizationDetail = z.infer<typeof organizationDetailSchema>;

export const memberSchema = z.object({
  userId: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  role: organizationRoleSchema,
  joinedAt: z.string(),
});
export type Member = z.infer<typeof memberSchema>;

export const updateMemberRoleRequestSchema = z.object({ role: organizationRoleSchema }).strict();

export const invitationSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
  role: organizationRoleSchema,
  status: z.enum(["pending", "accepted", "expired", "cancelled"]),
  invitedBy: z.string().uuid().nullable(),
  expiresAt: z.string(),
  createdAt: z.string(),
});
export type Invitation = z.infer<typeof invitationSchema>;

export const createInvitationRequestSchema = z
  .object({ email: z.string().trim().toLowerCase().email("Email inválido").max(255), role: organizationRoleSchema })
  .strict();
export type CreateInvitationRequest = z.infer<typeof createInvitationRequestSchema>;

/** Returned once, at creation: the raw token is never stored nor shown again. */
export const createdInvitationSchema = z.object({ invitation: invitationSchema, acceptUrl: z.string() });

export const invitationPreviewSchema = z.object({
  organizationName: z.string(),
  role: organizationRoleSchema,
  email: z.string(),
  expiresAt: z.string(),
  status: z.enum(["pending", "accepted", "expired", "cancelled"]),
});
export type InvitationPreview = z.infer<typeof invitationPreviewSchema>;

export const switchOrganizationResponseSchema = z.object({ activeOrganizationId: z.string().uuid() });
