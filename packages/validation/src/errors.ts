import { z } from "zod";

/** Stable machine-readable error codes returned by the API. */
export const apiErrorCodes = [
  "VALIDATION_FAILED",
  "UNAUTHENTICATED",
  "EMAIL_NOT_VERIFIED",
  "ACCOUNT_SUSPENDED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "RATE_LIMITED",
  "INVALID_ORIGIN",
  "INTERNAL_ERROR",
] as const;

export type ApiErrorCode = (typeof apiErrorCodes)[number];

/** Every non-2xx response from /api/v1 uses this envelope. */
export const apiErrorSchema = z.object({
  error: z.object({
    code: z.enum(apiErrorCodes),
    message: z.string(),
    /** Field-level validation issues (VALIDATION_FAILED only). */
    issues: z.array(z.object({ path: z.string(), message: z.string() })).optional(),
  }),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
