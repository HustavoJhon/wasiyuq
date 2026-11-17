import type { Context } from "hono";
import { IdentityError } from "@wasiyuq/module-identity";
import { OrganizationError } from "@wasiyuq/module-organizations";
import type { ApiErrorCode } from "@wasiyuq/validation";
import { log } from "../logger";

const statusByCode: Record<ApiErrorCode, number> = {
  VALIDATION_FAILED: 400,
  UNAUTHENTICATED: 401,
  EMAIL_NOT_VERIFIED: 403,
  ACCOUNT_SUSPENDED: 403,
  FORBIDDEN: 403,
  INVALID_ORIGIN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};

/** Error with a stable API code. Messages must be safe to show to end users. */
export class HttpError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    message: string,
    readonly issues?: { path: string; message: string }[],
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const httpError = {
  unauthenticated: () => new HttpError("UNAUTHENTICATED", "Debes iniciar sesión"),
  emailNotVerified: () => new HttpError("EMAIL_NOT_VERIFIED", "Debes verificar tu correo electrónico para continuar"),
  notFound: (message = "Recurso no encontrado") => new HttpError("NOT_FOUND", message),
};

export function errorResponse(c: Context, error: unknown) {
  let code: ApiErrorCode = "INTERNAL_ERROR";
  let message = "Ocurrió un error inesperado";
  let issues: { path: string; message: string }[] | undefined;

  if (error instanceof HttpError) {
    ({ code, message, issues } = error);
  } else if (error instanceof OrganizationError || error instanceof IdentityError) {
    code = error.code;
    message = error.message;
    if (code === "FORBIDDEN") log("warn", "authorization denied", { path: c.req.routePath, reason: error.reason, userId: c.get("auth")?.user.id });
  } else {
    // Unknown errors: never log raw messages (database errors embed SQL parameters such as emails). Log only the
    // error type and, for PostgreSQL errors, the SQLSTATE code and constraint name.
    log("error", "unhandled error", { method: c.req.method, path: c.req.routePath, requestId: c.get("requestId"), ...safeErrorMeta(error) });
  }
  return c.json({ error: { code, message, ...(issues ? { issues } : {}) } }, statusByCode[code] as 400);
}

/** Non-sensitive description of an unexpected error for logs. */
export function safeErrorMeta(error: unknown): { errorType: string; pgCode?: string; constraint?: string } {
  const type = error instanceof Error ? error.name || error.constructor.name : typeof error;
  const cause = (error as { cause?: unknown } | null)?.cause ?? error;
  const pg = (cause ?? {}) as { code?: unknown; constraint_name?: unknown };
  return {
    errorType: type,
    ...(typeof pg.code === "string" && /^[0-9A-Z]{5}$/.test(pg.code) ? { pgCode: pg.code } : {}),
    ...(typeof pg.constraint_name === "string" ? { constraint: pg.constraint_name } : {}),
  };
}
