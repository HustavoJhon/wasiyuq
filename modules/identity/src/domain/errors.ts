export type IdentityErrorCode = "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "VALIDATION_FAILED" | "ACCOUNT_SUSPENDED";

/** Business-rule violation raised by the identity module. Messages are safe to show to users. */
export class IdentityError extends Error {
  constructor(
    readonly code: IdentityErrorCode,
    message: string,
    readonly reason?: string,
  ) {
    super(message);
    this.name = "IdentityError";
  }
}
