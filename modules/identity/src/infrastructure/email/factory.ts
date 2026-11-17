import type { EmailSender } from "../../domain/ports";
import type { MailConfig } from "./mail-config";
import { ConsoleEmailSender, MemoryEmailSender } from "./senders";
import { SmtpEmailSender } from "./smtp-sender";

/** Build the configured transport. Configuration validation guarantees `smtp` settings exist for the smtp transport. */
export function createEmailSender(config: MailConfig): EmailSender {
  switch (config.transport) {
    case "smtp":
      if (!config.smtp) throw new Error("MAIL_TRANSPORT=smtp requires SMTP settings");
      return new SmtpEmailSender(config.smtp, config.from);
    case "memory":
      return new MemoryEmailSender();
    case "console":
      return new ConsoleEmailSender();
  }
}
