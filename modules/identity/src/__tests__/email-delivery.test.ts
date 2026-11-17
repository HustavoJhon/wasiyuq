import { afterAll, describe, expect, test } from "bun:test";
import type { EmailMessage, EmailSender } from "../domain/ports";
import { EmailDeliveryError, toDeliveryError } from "../infrastructure/email/delivery-error";
import { EmailDispatcher } from "../infrastructure/email/dispatcher";
import { SmtpEmailSender } from "../infrastructure/email/smtp-sender";
import { emailTemplates } from "../infrastructure/email/templates";
import { startFakeSmtp } from "./fake-smtp";

const TOKEN_URL = "http://localhost:5173/reset-password/SECRET-TOKEN-123";
const message = (to = "persona@example.test"): EmailMessage => emailTemplates.passwordReset(to, "Persona", TOKEN_URL);
const from = { name: "WASIYUQ", address: "no-reply@wasiyuq.test" };
const noSleep = async () => {};

type LogEntry = { level: string; message: string; meta: Record<string, unknown> };
function recorder() {
  const entries: LogEntry[] = [];
  return { entries, log: (level: LogEntry["level"], message: string, meta: Record<string, unknown>) => entries.push({ level, message, meta }) };
}

/** Sender that fails with the given errors in order, then succeeds. */
class ScriptedSender implements EmailSender {
  calls = 0;
  constructor(private readonly failures: unknown[]) {}
  async send(): Promise<void> {
    const failure = this.failures[this.calls++];
    if (failure) throw failure;
  }
}

describe("delivery error classification", () => {
  test("SMTP 4xx and connection errors are transient; 5xx and auth errors are permanent", () => {
    expect(toDeliveryError({ code: "EENVELOPE", responseCode: 451 }).transient).toBe(true);
    expect(toDeliveryError({ code: "EENVELOPE", responseCode: 550 }).transient).toBe(false);
    expect(toDeliveryError({ code: "ECONNECTION" }).transient).toBe(true);
    expect(toDeliveryError({ code: "ETIMEDOUT" }).transient).toBe(true);
    expect(toDeliveryError({ code: "EAUTH", responseCode: 535 }).transient).toBe(false);
    expect(toDeliveryError(new Error("boom")).code).toBe("EUNKNOWN");
  });

  test("never keeps provider text (which may echo recipients or links)", () => {
    const error = toDeliveryError(Object.assign(new Error(`550 rejected ${TOKEN_URL} for persona@example.test`), { code: "EENVELOPE", responseCode: 550 }));
    expect(error.message).not.toContain("SECRET-TOKEN");
    expect(error.message).not.toContain("persona@");
    expect(error.cause).toBeUndefined();
    expect(toDeliveryError({ code: "weird code; DROP" }).code).toBe("EUNKNOWN");
  });
});

describe("email dispatcher", () => {
  test("retries transient failures with exponential backoff, then succeeds", async () => {
    const sender = new ScriptedSender([new EmailDeliveryError("ECONNECTION", true), new EmailDeliveryError("EENVELOPE", true, 451)]);
    const delays: number[] = [];
    const logs = recorder();
    const dispatcher = new EmailDispatcher(sender, { maxAttempts: 3, baseDelayMs: 100, sleep: async (ms) => void delays.push(ms), log: logs.log });
    expect(await dispatcher.deliver(message())).toEqual({ status: "sent", attempts: 3 });
    expect(sender.calls).toBe(3);
    expect(delays).toHaveLength(2);
    expect(delays[0]).toBeGreaterThanOrEqual(80);
    expect(delays[0]).toBeLessThanOrEqual(120);
    expect(delays[1]).toBeGreaterThanOrEqual(160);
    expect(delays[1]).toBeLessThanOrEqual(240);
    expect(dispatcher.health()).toMatchObject({ sent: 1, failed: 0, consecutiveFailures: 0, pending: 0 });
  });

  test("does not retry permanent failures", async () => {
    const sender = new ScriptedSender([new EmailDeliveryError("EENVELOPE", false, 550)]);
    const dispatcher = new EmailDispatcher(sender, { maxAttempts: 5, sleep: noSleep });
    expect(await dispatcher.deliver(message())).toEqual({ status: "failed", attempts: 1, code: "EENVELOPE", transient: false, responseCode: 550 });
    expect(sender.calls).toBe(1);
  });

  test("gives up after maxAttempts and records the failure", async () => {
    const transient = new EmailDeliveryError("ETIMEDOUT", true);
    const sender = new ScriptedSender([transient, transient, transient, transient]);
    const dispatcher = new EmailDispatcher(sender, { maxAttempts: 3, sleep: noSleep });
    const outcome = await dispatcher.deliver(message());
    expect(outcome).toMatchObject({ status: "failed", attempts: 3, code: "ETIMEDOUT" });
    expect(dispatcher.health()).toMatchObject({ failed: 1, consecutiveFailures: 1, lastErrorCode: "ETIMEDOUT" });
  });

  test("dispatch() never throws, even when the sender throws arbitrary values", async () => {
    const dispatcher = new EmailDispatcher({ send: async () => Promise.reject("raw string") }, { maxAttempts: 1, sleep: noSleep });
    expect(() => dispatcher.dispatch(message())).not.toThrow();
    expect(await dispatcher.drain(1000)).toBe(0);
    expect(dispatcher.health().failed).toBe(1);
  });

  test("logs contain no recipient, subject, body or token", async () => {
    const logs = recorder();
    const sender = new ScriptedSender([Object.assign(new Error(`rejected ${TOKEN_URL} persona@example.test`), { code: "EENVELOPE", responseCode: 451 })]);
    const dispatcher = new EmailDispatcher(sender, { maxAttempts: 2, sleep: noSleep, log: logs.log });
    await dispatcher.deliver(message());
    const serialized = JSON.stringify(logs.entries);
    expect(logs.entries.map((e) => e.message)).toEqual(["email delivery failed; retrying", "email sent"]);
    for (const secret of ["persona@", "SECRET-TOKEN", "Restablece", "reset-password"]) expect(serialized).not.toContain(secret);
    expect(logs.entries[0]!.meta).toMatchObject({ kind: "password_reset", code: "EENVELOPE", responseCode: 451 });
  });

  test("drain waits for in-flight deliveries and reports leftovers at the deadline", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    const dispatcher = new EmailDispatcher({ send: () => gate }, { sleep: noSleep });
    dispatcher.dispatch(message());
    expect(dispatcher.health().pending).toBe(1);
    expect(await dispatcher.drain(20)).toBe(1);
    release();
    expect(await dispatcher.drain(1000)).toBe(0);
  });
});

describe("SMTP sender (scripted server)", () => {
  const server = startFakeSmtp({ rcptReplies: [250, 451, 550] });
  afterAll(() => server.stop());
  const sender = new SmtpEmailSender({ host: "127.0.0.1", port: server.port, security: "none" }, from);

  test("delivers a message with sender, recipient and both bodies", async () => {
    await sender.send(message("destino@example.test"));
    const raw = server.messages.at(-1)!;
    expect(raw).toContain("To: destino@example.test");
    expect(raw).toMatch(/From: WASIYUQ <no-reply@wasiyuq\.test>/);
    expect(raw).toContain("Auto-Submitted: auto-generated");
    expect(raw).toContain("text/html");
  });

  test("maps a 451 reply to a transient error and a 550 reply to a permanent one", async () => {
    const transient = await sender.send(message()).catch((e) => e);
    expect(transient).toBeInstanceOf(EmailDeliveryError);
    expect(transient).toMatchObject({ transient: true, responseCode: 451 });
    const permanent = await sender.send(message()).catch((e) => e);
    expect(permanent).toMatchObject({ transient: false, responseCode: 550 });
    expect(String(permanent.message)).not.toContain("persona@");
  });

  test("an unreachable server is a transient connection error", async () => {
    const closed = startFakeSmtp();
    const port = closed.port;
    closed.stop();
    const down = new SmtpEmailSender({ host: "127.0.0.1", port, security: "none" }, from);
    const error = await down.send(message()).catch((e) => e);
    expect(error).toBeInstanceOf(EmailDeliveryError);
    expect(error.transient).toBe(true);
  });
});

/** Optional: real SMTP round-trip through Mailpit when it is running (docker compose service `mailpit`). */
const MAILPIT_API = process.env.MAILPIT_API_URL;
const MAILPIT_SMTP_PORT = Number(process.env.MAILPIT_SMTP_PORT ?? 51025);
const mailpitUp = MAILPIT_API
  ? await fetch(`${MAILPIT_API}/api/v1/info`, { signal: AbortSignal.timeout(1000) }).then((r) => r.ok, () => false)
  : false;

describe.skipIf(!mailpitUp)("SMTP sender (Mailpit)", () => {
  test("message arrives with escaped HTML and the link intact", async () => {
    const to = `mailpit-${crypto.randomUUID()}@example.test`;
    const sender = new SmtpEmailSender({ host: "127.0.0.1", port: MAILPIT_SMTP_PORT, security: "none" }, from);
    const dispatcher = new EmailDispatcher(sender, { maxAttempts: 2, baseDelayMs: 50 });
    const outcome = await dispatcher.deliver(emailTemplates.verification(to, "<b>Ana</b>", "http://localhost:5173/verify?token=abc"));
    expect(outcome.status).toBe("sent");
    const search = (await (await fetch(`${MAILPIT_API}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}`)).json()) as {
      messages: { ID: string; Subject: string; From: { Address: string; Name: string } }[];
    };
    expect(search.messages).toHaveLength(1);
    const found = search.messages[0]!;
    expect(found.From).toEqual({ Name: "WASIYUQ", Address: "no-reply@wasiyuq.test" });
    const full = (await (await fetch(`${MAILPIT_API}/api/v1/message/${found.ID}`)).json()) as { HTML: string; Text: string };
    expect(full.HTML).toContain("&lt;b&gt;Ana&lt;/b&gt;");
    expect(full.Text).toContain("http://localhost:5173/verify?token=abc");
    sender.close();
  });
});
