export type OrganizationErrorCode = "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "VALIDATION_FAILED";

/** Business-rule violation raised by the organizations module. Messages are safe to show to users. */
export class OrganizationError extends Error {
  constructor(
    readonly code: OrganizationErrorCode,
    message: string,
    readonly reason?: string,
  ) {
    super(message);
    this.name = "OrganizationError";
  }
}

export const forbidden = (reason: string, message = "No tienes permiso para realizar esta acción") =>
  new OrganizationError("FORBIDDEN", message, reason);
export const notFound = (message = "Recurso no encontrado") => new OrganizationError("NOT_FOUND", message);
export const conflict = (message: string, reason?: string) => new OrganizationError("CONFLICT", message, reason);
export const invalid = (message: string, reason?: string) => new OrganizationError("VALIDATION_FAILED", message, reason);
