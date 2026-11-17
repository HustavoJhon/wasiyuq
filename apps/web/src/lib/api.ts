import { ApiClientError, createApiClient } from "@wasiyuq/api-client";
import { queryOptions } from "@tanstack/react-query";

export const api = createApiClient();

export const queryKeys = {
  me: ["me"] as const,
  providers: ["auth-providers"] as const,
  roles: ["roles"] as const,
  sessions: ["sessions"] as const,
  organization: (id: string) => ["organization", id] as const,
  members: (id: string) => ["organization", id, "members"] as const,
  invitations: (id: string) => ["organization", id, "invitations"] as const,
  invitation: (token: string) => ["invitation", token] as const,
  adminUsers: ["admin", "users"] as const,
};

export const meQuery = queryOptions({ queryKey: queryKeys.me, queryFn: () => api.me(), staleTime: 30_000, retry: false });
export const providersQuery = queryOptions({ queryKey: queryKeys.providers, queryFn: () => api.authProviders(), staleTime: Infinity });
export const rolesQuery = queryOptions({ queryKey: queryKeys.roles, queryFn: () => api.roles(), staleTime: Infinity });

export const isUnauthenticated = (error: unknown) => error instanceof ApiClientError && error.status === 401;

/** Human-readable message for any error thrown by the API client or the auth client. */
export function errorMessage(error: unknown, fallback = "Ocurrió un error inesperado"): string {
  if (error instanceof ApiClientError) return error.message;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") return error.message;
  return fallback;
}

/** Field errors (path → message) from a VALIDATION_FAILED response. */
export function fieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiClientError)) return {};
  return Object.fromEntries(error.issues.map((issue) => [issue.path, issue.message]));
}
