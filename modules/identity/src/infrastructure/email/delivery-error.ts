/**
 * A sanitized email delivery failure.
 *
 * Provider errors can echo recipients, message headers or, in the worst case, the body (which contains
 * verification/reset links). This type keeps only what is safe to log: a stable code, whether a retry may
 * help, and the SMTP status code. The original error is intentionally not kept as `cause`.
 */
export class EmailDeliveryError extends Error {
  constructor(
    readonly code: string,
    readonly transient: boolean,
    readonly responseCode?: number,
  ) {
    super(`email delivery failed (${code}${responseCode ? ` ${responseCode}` : ""})`);
    this.name = "EmailDeliveryError";
  }
}

/** Socket/connection level failures that usually succeed on retry. */
const TRANSIENT_ERROR_CODES = new Set([
  "ECONNECTION",
  "ETIMEDOUT",
  "ESOCKET",
  "EDNS",
  "ECONNREFUSED",
  "ECONNRESET",
  "EPIPE",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "EAI_AGAIN",
  "EPROXY",
]);

/**
 * Classify any thrown value into an `EmailDeliveryError`.
 * SMTP 4xx replies are temporary by definition (RFC 5321 §4.2.1); 5xx and authentication/envelope errors are not.
 */
export function toDeliveryError(error: unknown): EmailDeliveryError {
  if (error instanceof EmailDeliveryError) return error;
  const record = (error && typeof error === "object" ? error : {}) as { code?: unknown; responseCode?: unknown };
  const code = typeof record.code === "string" && /^[A-Z0-9_]{2,32}$/.test(record.code) ? record.code : "EUNKNOWN";
  const responseCode = typeof record.responseCode === "number" ? record.responseCode : undefined;
  if (responseCode !== undefined) return new EmailDeliveryError(code, responseCode >= 400 && responseCode < 500, responseCode);
  return new EmailDeliveryError(code, TRANSIENT_ERROR_CODES.has(code));
}
