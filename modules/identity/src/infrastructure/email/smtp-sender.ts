import { createTransport } from "nodemailer";
import type { EmailMessage, EmailSender } from "../../domain/ports";
import { toDeliveryError } from "./delivery-error";

export type SmtpSecurity = "tls" | "starttls" | "none";

export interface SmtpSettings {
  host: string;
  port: number;
  /** `tls`: implicit TLS (port 465). `starttls`: upgrade required (port 587). `none`: plain text, local sinks only. */
  security: SmtpSecurity;
  user?: string;
  password?: string;
}

export interface Sender {
  name: string;
  address: string;
}

/**
 * Provider-agnostic SMTP adapter (nodemailer). The same code talks to Mailpit in development and to the
 * transactional provider in production; only configuration changes.
 *
 * Failures are rethrown as sanitized `EmailDeliveryError`s; nodemailer's own logger stays disabled because it
 * would print envelopes and message contents.
 */
export class SmtpEmailSender implements EmailSender {
  private readonly transport;

  constructor(
    settings: SmtpSettings,
    private readonly from: Sender,
  ) {
    this.transport = createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.security === "tls",
      requireTLS: settings.security === "starttls",
      ignoreTLS: settings.security === "none",
      auth: settings.user ? { user: settings.user, pass: settings.password ?? "" } : undefined,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
      logger: false,
      debug: false,
    });
  }

  async send(message: EmailMessage): Promise<void> {
    try {
      await this.transport.sendMail({
        from: { name: this.from.name, address: this.from.address },
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
        // Transactional mail: ask mailbox providers not to send auto-replies (vacation notices) back.
        headers: { "Auto-Submitted": "auto-generated" },
      });
    } catch (error) {
      throw toDeliveryError(error);
    }
  }

  /** Open a connection and authenticate without sending anything (startup diagnostics). */
  async verify(): Promise<void> {
    try {
      await this.transport.verify();
    } catch (error) {
      throw toDeliveryError(error);
    }
  }

  close(): void {
    this.transport.close();
  }
}
