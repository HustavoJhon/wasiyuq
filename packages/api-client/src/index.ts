import { z } from "zod";
import {
  adminUserSchema,
  apiErrorSchema,
  currentUserSchema,
  invitationPreviewSchema,
  invitationSchema,
  meResponseSchema,
  memberSchema,
  membershipSummarySchema,
  organizationDetailSchema,
  organizationPermissionSchema,
  organizationRoleSchema,
  organizationSchema,
  sessionSummarySchema,
  type AccountStatus,
  type ApiErrorCode,
  type CreateInvitationRequest,
  type OrganizationRole,
  type UpdateOrganizationRequest,
  type UpdateProfileRequest,
} from "@wasiyuq/validation";

/** Error returned by /api/v1 (or a transport failure, code INTERNAL_ERROR). */
export class ApiClientError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly issues: { path: string; message: string }[] = [],
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export interface ApiClientOptions {
  /** Origin serving /api (empty string = same origin). */
  baseUrl?: string;
  fetch?: (input: string, init?: RequestInit) => Promise<Response>;
}

const roleCatalogSchema = z.object({
  roles: z.array(
    z.object({
      role: organizationRoleSchema,
      label: z.string(),
      description: z.string(),
      assignable: z.boolean(),
      level: z.number().int(),
      permissions: z.array(organizationPermissionSchema),
    }),
  ),
});
export type RoleCatalog = z.infer<typeof roleCatalogSchema>["roles"];

const authProvidersSchema = z.object({ emailPassword: z.boolean(), google: z.boolean() });
export type AuthProviders = z.infer<typeof authProvidersSchema>;

/** Typed client for the WASIYUQ API. Cookies are sent automatically (same-origin credentials). */
export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = options.baseUrl ?? "";
  const doFetch = options.fetch ?? ((input, init) => fetch(input, init));

  async function call<S extends z.ZodTypeAny>(method: string, path: string, schema: S | null, body?: unknown): Promise<z.output<S>> {
    let res: Response;
    try {
      res = await doFetch(`${baseUrl}${path}`, {
        method,
        credentials: "same-origin",
        headers: body !== undefined ? { "content-type": "application/json" } : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new ApiClientError(0, "INTERNAL_ERROR", "No se pudo conectar con el servidor");
    }
    if (!res.ok) {
      const parsed = apiErrorSchema.safeParse(await res.json().catch(() => null));
      if (parsed.success) {
        const { code, message, issues } = parsed.data.error;
        throw new ApiClientError(res.status, code, message, issues);
      }
      throw new ApiClientError(res.status, res.status === 401 ? "UNAUTHENTICATED" : "INTERNAL_ERROR", "Ocurrió un error inesperado");
    }
    if (!schema || res.status === 204) return undefined as z.output<S>;
    return schema.parse(await res.json());
  }

  const v1 = "/api/v1";
  return {
    authProviders: () => call("GET", "/api/public/auth-providers", authProvidersSchema),
    me: () => call("GET", `${v1}/me`, meResponseSchema),
    updateProfile: (changes: UpdateProfileRequest) => call("PATCH", `${v1}/me`, z.object({ user: currentUserSchema }), changes),
    sessions: () => call("GET", `${v1}/me/sessions`, z.object({ sessions: z.array(sessionSummarySchema) })),
    revokeSession: (id: string) => call("DELETE", `${v1}/me/sessions/${id}`, null),
    revokeOtherSessions: () => call("POST", `${v1}/me/sessions/revoke-others`, z.object({ revoked: z.number() }), {}),
    roles: () => call("GET", `${v1}/roles`, roleCatalogSchema),

    organizations: () =>
      call("GET", `${v1}/organizations`, z.object({ memberships: z.array(membershipSummarySchema), activeOrganizationId: z.string().nullable() })),
    createOrganization: (name: string) => call("POST", `${v1}/organizations`, z.object({ organization: organizationSchema }), { name }),
    organization: (id: string) => call("GET", `${v1}/organizations/${id}`, organizationDetailSchema),
    updateOrganization: (id: string, changes: UpdateOrganizationRequest) =>
      call("PATCH", `${v1}/organizations/${id}`, z.object({ organization: organizationSchema }), changes),
    archiveOrganization: (id: string, confirmName: string) => call("DELETE", `${v1}/organizations/${id}`, null, { confirmName }),
    switchOrganization: (id: string) => call("POST", `${v1}/organizations/${id}/switch`, z.object({ activeOrganizationId: z.string() }), {}),

    members: (id: string) => call("GET", `${v1}/organizations/${id}/members`, z.object({ members: z.array(memberSchema) })),
    changeMemberRole: (id: string, userId: string, role: OrganizationRole) =>
      call("PATCH", `${v1}/organizations/${id}/members/${userId}`, null, { role }),
    removeMember: (id: string, userId: string) => call("DELETE", `${v1}/organizations/${id}/members/${userId}`, null),

    invitations: (id: string) => call("GET", `${v1}/organizations/${id}/invitations`, z.object({ invitations: z.array(invitationSchema) })),
    invite: (id: string, input: CreateInvitationRequest) =>
      call("POST", `${v1}/organizations/${id}/invitations`, z.object({ invitation: invitationSchema }), input),
    cancelInvitation: (id: string, invitationId: string) => call("DELETE", `${v1}/organizations/${id}/invitations/${invitationId}`, null),
    previewInvitation: (token: string) => call("GET", `${v1}/invitations/${encodeURIComponent(token)}`, invitationPreviewSchema),
    acceptInvitation: (token: string) =>
      call("POST", `${v1}/invitations/${encodeURIComponent(token)}/accept`, z.object({ organizationId: z.string() }), {}),

    adminUsers: (limit = 50, offset = 0) =>
      call("GET", `${v1}/admin/users?limit=${limit}&offset=${offset}`, z.object({ users: z.array(adminUserSchema), limit: z.number(), offset: z.number() })),
    setAccountStatus: (userId: string, status: AccountStatus) =>
      call("PATCH", `${v1}/admin/users/${userId}/status`, z.object({ user: adminUserSchema }), { status }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
