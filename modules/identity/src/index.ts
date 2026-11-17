// Public API of the identity module. Internal files must not be imported directly.
export { IdentityError, type IdentityErrorCode } from "./domain/errors";
export type { EmailMessage, EmailOutbox, EmailSender } from "./domain/ports";
export { assertCanAuthenticate, assertPlatformAdmin, isPlatformAdmin, type IdentityUser, type ProfileChanges } from "./domain/user";
export type { SessionRecord } from "./application/ports";
export { IdentityService } from "./application/identity-service";
export { AuthConfigError, CLIENT_IP_HEADER, loadAuthConfig, resolveClientIp, type AuthConfig } from "./infrastructure/auth-config";
export {
  AUTH_BASE_PATH,
  createAuthentication,
  SESSION_TTL_SECONDS,
  type AuthenticatedSession,
  type Authentication,
  type AuthenticationHooks,
  redactEmails,
} from "./infrastructure/authentication";
export { DrizzleSessionRepository, DrizzleUserRepository } from "./infrastructure/drizzle-repositories";
export { emailTemplates } from "./infrastructure/email/templates";
export { ConsoleEmailSender, MemoryEmailSender } from "./infrastructure/email/senders";
export { SmtpEmailSender, type SmtpSettings } from "./infrastructure/email/smtp-sender";
export { EmailDeliveryError } from "./infrastructure/email/delivery-error";
export { EmailDispatcher, type DeliveryOutcome, type EmailDeliveryHealth } from "./infrastructure/email/dispatcher";
export { createEmailSender } from "./infrastructure/email/factory";
export { describeMailConfig, type MailConfig, type MailTransport } from "./infrastructure/email/mail-config";
export { createPasswordHasher, SCRYPT_PARAMS, type PasswordHasher } from "./infrastructure/password-hasher";
