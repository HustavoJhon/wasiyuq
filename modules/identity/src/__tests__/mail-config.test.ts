import { describe, expect, test } from "bun:test";
import { AuthConfigError, loadAuthConfig } from "../infrastructure/auth-config";
import { redactEmails } from "../infrastructure/authentication";
import { describeMailConfig } from "../infrastructure/email/mail-config";
import { emailTemplates } from "../infrastructure/email/templates";

const dev = { AUTH_SECRET: "x".repeat(32), AUTH_BASE_URL: "http://localhost:5173", WEB_APP_URL: "http://localhost:5173" };
const prod = {
  ...dev,
  NODE_ENV: "production",
  AUTH_BASE_URL: "https://app.wasiyuq.org",
  WEB_APP_URL: "https://app.wasiyuq.org",
  MAIL_TRANSPORT: "smtp",
  MAIL_FROM_ADDRESS: "no-reply@wasiyuq.org",
  SMTP_HOST: "smtp.provider.example",
  SMTP_SECURITY: "tls",
  SMTP_USER: "apikey",
  SMTP_PASSWORD: "super-secret-provider-key",
};

function issues(env: Record<string, string>): string {
  try {
    loadAuthConfig(env);
    return "";
  } catch (error) {
    if (!(error instanceof AuthConfigError)) throw error;
    return error.issues.join("|");
  }
}

describe("mail configuration", () => {
  test("development SMTP (Mailpit) is accepted with defaults", () => {
    const config = loadAuthConfig({ ...dev, MAIL_TRANSPORT: "smtp", MAIL_FROM_ADDRESS: "no-reply@wasiyuq.test", SMTP_HOST: "127.0.0.1", SMTP_PORT: "51025", SMTP_SECURITY: "none" });
    expect(config.mail).toMatchObject({
      transport: "smtp",
      from: { name: "WASIYUQ", address: "no-reply@wasiyuq.test" },
      smtp: { host: "127.0.0.1", port: 51025, security: "none" },
    });
  });

  test("smtp transport requires sender, host and security; credentials come in pairs", () => {
    const result = issues({ ...dev, MAIL_TRANSPORT: "smtp", SMTP_USER: "only-user" });
    for (const key of ["MAIL_FROM_ADDRESS", "SMTP_HOST", "SMTP_SECURITY", "SMTP_USER"]) expect(result).toContain(key);
    expect(issues({ ...dev, MAIL_TRANSPORT: "smtp", MAIL_FROM_ADDRESS: "not-an-email", SMTP_HOST: "h", SMTP_SECURITY: "tls" })).toContain("MAIL_FROM_ADDRESS");
  });

  test("a complete production configuration is accepted and defaults the port from the security mode", () => {
    const config = loadAuthConfig(prod);
    expect(config.mail.smtp).toMatchObject({ host: "smtp.provider.example", port: 465, security: "tls", user: "apikey" });
    expect(loadAuthConfig({ ...prod, SMTP_SECURITY: "starttls" }).mail.smtp?.port).toBe(587);
  });

  test("production refuses development transports, plain SMTP, local sinks, missing credentials and test domains", () => {
    expect(issues({ ...prod, MAIL_TRANSPORT: "console" })).toContain("MAIL_TRANSPORT");
    expect(issues({ ...prod, MAIL_TRANSPORT: "memory" })).toContain("MAIL_TRANSPORT");
    expect(issues({ ...prod, SMTP_SECURITY: "none" })).toContain("SMTP_SECURITY");
    expect(issues({ ...prod, SMTP_HOST: "mailpit" })).toContain("SMTP_HOST");
    expect(issues({ ...prod, SMTP_HOST: "localhost" })).toContain("SMTP_HOST");
    const noCreds: Record<string, string> = { ...prod };
    delete noCreds.SMTP_USER;
    delete noCreds.SMTP_PASSWORD;
    expect(issues(noCreds)).toContain("SMTP_USER");
    expect(issues({ ...prod, MAIL_FROM_ADDRESS: "no-reply@example.com" })).toContain("MAIL_FROM_ADDRESS");
  });

  test("configuration errors and descriptions never include the provider password", () => {
    expect(issues({ ...prod, SMTP_SECURITY: "none", SMTP_HOST: "mailpit" })).not.toContain("super-secret-provider-key");
    const described = JSON.stringify(describeMailConfig(loadAuthConfig(prod).mail));
    expect(described).not.toContain("super-secret-provider-key");
    expect(described).not.toContain("apikey");
    expect(JSON.parse(described)).toMatchObject({ transport: "smtp", authenticated: true, fromDomain: "wasiyuq.org" });
  });

  test("password hash concurrency is configurable and bounded", () => {
    expect(loadAuthConfig({ ...dev, AUTH_PASSWORD_HASH_CONCURRENCY: "3" }).passwordHashConcurrency).toBe(3);
    expect(issues({ ...dev, AUTH_PASSWORD_HASH_CONCURRENCY: "0" })).toContain("AUTH_PASSWORD_HASH_CONCURRENCY");
    expect(issues({ ...dev, AUTH_PASSWORD_HASH_CONCURRENCY: "500" })).toContain("AUTH_PASSWORD_HASH_CONCURRENCY");
  });
});

describe("email content safety", () => {
  test("subjects are single-line even with hostile organization names (no header injection)", () => {
    const message = emailTemplates.invitation("a@example.test", "Org\r\nBcc: victim@example.test", "Miembro", "http://x/i/1");
    expect(message.subject).not.toMatch(/[\r\n]/);
  });

  test("names are HTML-escaped in the HTML body", () => {
    const message = emailTemplates.accountExists("a@example.test", '<img src=x onerror="alert(1)">', "http://x/login");
    expect(message.html).not.toContain("<img");
    expect(message.html).toContain("&lt;img");
  });

  test("Better Auth log lines are stripped of email addresses", () => {
    expect(redactEmails("Sign-up attempt for existing email: ana.perez+1@correo.pe")).toBe("Sign-up attempt for existing email: [email]");
  });
});
