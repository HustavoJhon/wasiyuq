/** Outgoing email (verification, password reset, invitations). Implementations live in infrastructure. */
export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** Message category, used for logs and test inspection (never the content). */
  kind: "email_verification" | "password_reset" | "organization_invitation";
}

export interface EmailSender {
  send(message: EmailMessage): Promise<void>;
}
