import type { EmailMessage, EmailSender } from "../../domain/ports";

/**
 * Development transport: prints the message (including its links) to stdout so a developer can follow
 * verification/reset links locally. Refused in production by the auth configuration.
 */
export class ConsoleEmailSender implements EmailSender {
  async send(message: EmailMessage): Promise<void> {
    console.log(
      ["", "──────── email (dev transport) ────────", `To: ${message.to}`, `Subject: ${message.subject}`, "", message.text, "───────────────────────────────────────", ""].join("\n"),
    );
  }
}

/** Test transport: keeps messages in memory for assertions. */
export class MemoryEmailSender implements EmailSender {
  readonly messages: EmailMessage[] = [];

  async send(message: EmailMessage): Promise<void> {
    this.messages.push(message);
  }

  /** Latest message for a recipient and kind, if any. */
  last(to: string, kind?: EmailMessage["kind"]): EmailMessage | undefined {
    return [...this.messages].reverse().find((m) => m.to === to.toLowerCase() && (!kind || m.kind === kind));
  }
}
