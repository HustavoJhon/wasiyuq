import type { EmailMessage, EmailSender } from "../../domain/ports";
import { toDeliveryError } from "./delivery-error";

export interface EmailDispatcherOptions {
  /** Total attempts per message, including the first one. */
  maxAttempts?: number;
  /** Delay before the second attempt; doubles on each retry (with ±20 % jitter). */
  baseDelayMs?: number;
  /** Safe structured logging: receives only the message kind, attempt counts and error codes. */
  log?: (level: "info" | "warn" | "error", message: string, meta: Record<string, unknown>) => void;
  /** Injectable for tests. */
  sleep?: (ms: number) => Promise<void>;
}

export type DeliveryOutcome =
  | { status: "sent"; attempts: number }
  | { status: "failed"; attempts: number; code: string; transient: boolean; responseCode?: number };

export interface EmailDeliveryHealth {
  pending: number;
  sent: number;
  failed: number;
  consecutiveFailures: number;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  lastErrorCode: string | null;
}

/**
 * Delivers transactional email in the background with bounded retries.
 *
 * Authentication endpoints call `dispatch()` and return immediately, so:
 * - response time and status are identical whether or not an email was sent (no account enumeration by
 *   timing or by provider errors surfacing as 500s);
 * - a slow or unavailable provider never holds a request open.
 *
 * Only transient failures (connection errors, SMTP 4xx) are retried. Logs never contain recipients, subjects,
 * bodies or links: those carry personal data and single-use tokens.
 */
export class EmailDispatcher {
  private readonly maxAttempts: number;
  private readonly baseDelayMs: number;
  private readonly log: NonNullable<EmailDispatcherOptions["log"]>;
  private readonly sleep: (ms: number) => Promise<void>;
  private readonly inFlight = new Set<Promise<DeliveryOutcome>>();
  private readonly counters = { sent: 0, failed: 0, consecutiveFailures: 0 };
  private lastSuccessAt: Date | null = null;
  private lastFailureAt: Date | null = null;
  private lastErrorCode: string | null = null;

  constructor(
    private readonly sender: EmailSender,
    options: EmailDispatcherOptions = {},
  ) {
    this.maxAttempts = Math.max(1, options.maxAttempts ?? 3);
    this.baseDelayMs = Math.max(0, options.baseDelayMs ?? 1000);
    this.log = options.log ?? (() => {});
    this.sleep = options.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  }

  /** Queue a message without waiting for it. Never throws and never rejects. */
  dispatch(message: EmailMessage): void {
    void this.deliver(message);
  }

  /** Deliver with retries and resolve with the outcome. Never rejects. */
  deliver(message: EmailMessage): Promise<DeliveryOutcome> {
    const task = this.attempt(message);
    this.inFlight.add(task);
    void task.finally(() => this.inFlight.delete(task));
    return task;
  }

  /** Wait for in-flight deliveries (graceful shutdown). Resolves with how many were still pending at the deadline. */
  async drain(timeoutMs: number): Promise<number> {
    if (this.inFlight.size === 0) return 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    await Promise.race([
      Promise.allSettled([...this.inFlight]),
      new Promise((resolve) => (timer = setTimeout(resolve, timeoutMs))),
    ]);
    clearTimeout(timer);
    return this.inFlight.size;
  }

  health(): EmailDeliveryHealth {
    return {
      pending: this.inFlight.size,
      sent: this.counters.sent,
      failed: this.counters.failed,
      consecutiveFailures: this.counters.consecutiveFailures,
      lastSuccessAt: this.lastSuccessAt?.toISOString() ?? null,
      lastFailureAt: this.lastFailureAt?.toISOString() ?? null,
      lastErrorCode: this.lastErrorCode,
    };
  }

  private async attempt(message: EmailMessage): Promise<DeliveryOutcome> {
    for (let attempt = 1; ; attempt++) {
      try {
        await this.sender.send(message);
        this.counters.sent++;
        this.counters.consecutiveFailures = 0;
        this.lastSuccessAt = new Date();
        this.log("info", "email sent", { kind: message.kind, attempts: attempt });
        return { status: "sent", attempts: attempt };
      } catch (raw) {
        const error = toDeliveryError(raw);
        const meta = { kind: message.kind, attempt, code: error.code, responseCode: error.responseCode, transient: error.transient };
        if (error.transient && attempt < this.maxAttempts) {
          this.log("warn", "email delivery failed; retrying", meta);
          const delay = this.baseDelayMs * 2 ** (attempt - 1);
          await this.sleep(Math.round(delay * (0.8 + Math.random() * 0.4)));
          continue;
        }
        this.counters.failed++;
        this.counters.consecutiveFailures++;
        this.lastFailureAt = new Date();
        this.lastErrorCode = error.code;
        this.log("error", "email delivery failed", { ...meta, attempts: attempt });
        return { status: "failed", attempts: attempt, code: error.code, transient: error.transient, responseCode: error.responseCode };
      }
    }
  }
}
