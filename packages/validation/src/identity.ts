import { z } from "zod";
import { membershipSummarySchema } from "./organizations";

export const platformRoles = ["user", "platform_admin"] as const;
export type PlatformRole = (typeof platformRoles)[number];

export const accountStatuses = ["active", "suspended"] as const;
export type AccountStatus = (typeof accountStatuses)[number];

/** Peruvian DNI: exactly 8 digits (legacy `dniRules`). */
export const dniSchema = z.string().trim().regex(/^[0-9]{8}$/, "El DNI debe tener 8 dígitos");
/** Legacy `whatsappRules`: optional leading +, 7–15 digits. */
export const whatsappSchema = z.string().trim().regex(/^\+?[0-9]{7,15}$/, "Número de WhatsApp inválido");

/** Password policy (Better Auth enforces the same bounds server-side). */
export const passwordSchema = z.string().min(8, "Mínimo 8 caracteres").max(128, "Máximo 128 caracteres");

export const currentUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  dni: z.string().nullable(),
  whatsapp: z.string().nullable(),
  platformRole: z.enum(platformRoles),
  status: z.enum(accountStatuses),
  createdAt: z.string(),
});
export type CurrentUser = z.infer<typeof currentUserSchema>;

export const meResponseSchema = z.object({
  user: currentUserSchema,
  memberships: z.array(membershipSummarySchema),
  activeOrganizationId: z.string().uuid().nullable(),
});
export type MeResponse = z.infer<typeof meResponseSchema>;

export const updateProfileRequestSchema = z
  .object({
    name: z.string().trim().min(2, "Debe tener al menos 2 caracteres").max(255).optional(),
    dni: dniSchema.nullable().optional(),
    whatsapp: whatsappSchema.nullable().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "Debe enviar al menos un campo");
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;

export const sessionSummarySchema = z.object({
  id: z.string(),
  current: z.boolean(),
  userAgent: z.string().nullable(),
  ipAddress: z.string().nullable(),
  createdAt: z.string(),
  expiresAt: z.string(),
});
export type SessionSummary = z.infer<typeof sessionSummarySchema>;

export const adminUserSchema = currentUserSchema.pick({
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  platformRole: true,
  status: true,
  createdAt: true,
});
export type AdminUser = z.infer<typeof adminUserSchema>;

export const updateAccountStatusRequestSchema = z.object({ status: z.enum(accountStatuses) }).strict();
