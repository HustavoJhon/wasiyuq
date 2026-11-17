/** Outgoing email (verification, password reset, invitations). Implementations live in infrastructure. */
export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** Message category, used for logs and test inspection (never the content). */
  kind: "email_verification" | "password_reset" | "organization_invitation" | "account_exists" | "password_changed";
}

export interface EmailSender {
  send(message: EmailMessage): Promise<void>;
}

/**
 * Fire-and-forget email queue used by authentication flows. `dispatch` returns immediately and never throws, so
 * responses do not depend on (or reveal) whether a message was sent.
 */
export interface EmailOutbox {
  dispatch(message: EmailMessage): void;
}
