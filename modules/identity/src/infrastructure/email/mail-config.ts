import { z } from "zod";
import type { Sender, SmtpSettings } from "./smtp-sender";

/**
 * Email transport configuration.
 *
 * - `smtp`: real delivery through any SMTP provider (Mailpit locally). Required in production.
 * - `console`: prints messages (with their links) to stdout. Development only.
 * - `memory`: keeps messages in memory. Tests only.
 */
export type MailTransport = "smtp" | "console" | "memory";

export interface MailConfig {
  transport: MailTransport;
  from: Sender;
  smtp: SmtpSettings | null;
  maxAttempts: number;
  retryBaseDelayMs: number;
}

/** Hosts that only make sense on a developer machine; refused in production. */
const LOCAL_SMTP_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "mailpit", "0.0.0.0"]);

export const mailEnvSchema = z.object({
  MAIL_TRANSPORT: z.enum(["smtp", "console", "memory"]).default("console"),
  MAIL_FROM_NAME: z.string().trim().min(1).max(80).default("WASIYUQ"),
  MAIL_FROM_ADDRESS: z.string().trim().optional(),
  SMTP_HOST: z.string().trim().optional(),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).optional(),
  SMTP_SECURITY: z.enum(["tls", "starttls", "none"]).optional(),
  SMTP_USER: z.string().trim().optional(),
  SMTP_PASSWORD: z.string().optional(),
  MAIL_MAX_ATTEMPTS: z.coerce.number().int().min(1).max(10).default(3),
  MAIL_RETRY_BASE_DELAY_MS: z.coerce.number().int().min(0).max(60_000).default(1000),
});

type MailEnv = z.infer<typeof mailEnvSchema>;
type Issue = { path: string; message: string };

const DEFAULT_PORT: Record<NonNullable<MailEnv["SMTP_SECURITY"]>, number> = { tls: 465, starttls: 587, none: 25 };

/** Validate cross-field rules. Returns issues; never includes credential values in messages. */
export function mailConfigIssues(env: MailEnv, production: boolean): Issue[] {
  const issues: Issue[] = [];
  if (production && env.MAIL_TRANSPORT !== "smtp") {
    issues.push({ path: "MAIL_TRANSPORT", message: `must be "smtp" in production (got "${env.MAIL_TRANSPORT}"); development transports never deliver email` });
  }
  if (env.MAIL_TRANSPORT !== "smtp") return issues;

  if (!env.MAIL_FROM_ADDRESS) issues.push({ path: "MAIL_FROM_ADDRESS", message: "is required when MAIL_TRANSPORT=smtp" });
  else if (!z.email().safeParse(env.MAIL_FROM_ADDRESS).success) issues.push({ path: "MAIL_FROM_ADDRESS", message: "must be an email address" });
  if (!env.SMTP_HOST) issues.push({ path: "SMTP_HOST", message: "is required when MAIL_TRANSPORT=smtp" });
  if (!env.SMTP_SECURITY) issues.push({ path: "SMTP_SECURITY", message: "is required when MAIL_TRANSPORT=smtp (tls, starttls or none)" });
  if (Boolean(env.SMTP_USER) !== Boolean(env.SMTP_PASSWORD)) {
    issues.push({ path: "SMTP_USER", message: "set both SMTP_USER and SMTP_PASSWORD or neither" });
  }

  if (production) {
    if (env.SMTP_SECURITY === "none") issues.push({ path: "SMTP_SECURITY", message: "must be tls or starttls in production" });
    if (env.SMTP_HOST && LOCAL_SMTP_HOSTS.has(env.SMTP_HOST.toLowerCase())) {
      issues.push({ path: "SMTP_HOST", message: "points at a local development mail sink; set the provider's SMTP host" });
    }
    if (!env.SMTP_USER || !env.SMTP_PASSWORD) issues.push({ path: "SMTP_USER", message: "provider credentials are required in production" });
    const domain = env.MAIL_FROM_ADDRESS?.split("@")[1]?.toLowerCase() ?? "";
    if (/(^|\.)(example\.(com|org|net)|localhost|test|invalid)$/.test(domain)) {
      issues.push({ path: "MAIL_FROM_ADDRESS", message: "must use the organization's verified sending domain in production" });
    }
  }
  return issues;
}

export function buildMailConfig(env: MailEnv): MailConfig {
  const smtp: SmtpSettings | null =
    env.MAIL_TRANSPORT === "smtp" && env.SMTP_HOST && env.SMTP_SECURITY
      ? {
          host: env.SMTP_HOST,
          port: env.SMTP_PORT ?? DEFAULT_PORT[env.SMTP_SECURITY],
          security: env.SMTP_SECURITY,
          user: env.SMTP_USER || undefined,
          password: env.SMTP_PASSWORD || undefined,
        }
      : null;
  return {
    transport: env.MAIL_TRANSPORT,
    from: { name: env.MAIL_FROM_NAME, address: env.MAIL_FROM_ADDRESS ?? "no-reply@localhost" },
    smtp,
    maxAttempts: env.MAIL_MAX_ATTEMPTS,
    retryBaseDelayMs: env.MAIL_RETRY_BASE_DELAY_MS,
  };
}

/** Credential-free description for startup logs. */
export function describeMailConfig(config: MailConfig) {
  return {
    transport: config.transport,
    host: config.smtp?.host ?? null,
    port: config.smtp?.port ?? null,
    security: config.smtp?.security ?? null,
    authenticated: Boolean(config.smtp?.user),
    fromDomain: config.from.address.split("@")[1] ?? null,
  };
}
