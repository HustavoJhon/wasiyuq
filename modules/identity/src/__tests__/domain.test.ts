import { describe, expect, test } from "bun:test";
import { IdentityError } from "../domain/errors";
import { assertCanAuthenticate, assertCanChangeStatus, assertPlatformAdmin, isPlatformAdmin } from "../domain/user";
import { AuthConfigError, CLIENT_IP_HEADER, loadAuthConfig } from "../infrastructure/auth-config";
import { emailTemplates } from "../infrastructure/email/templates";

const reason = (fn: () => unknown) => {
  try {
    fn();
    return "allowed";
  } catch (error) {
    return error instanceof IdentityError ? `${error.code}:${error.reason}` : "unexpected";
  }
};

describe("identity rules", () => {
  test("platform admin requires an active account with the explicit platform role", () => {
    expect(isPlatformAdmin({ platformRole: "platform_admin", status: "active" })).toBe(true);
    expect(isPlatformAdmin({ platformRole: "platform_admin", status: "suspended" })).toBe(false);
    expect(reason(() => assertPlatformAdmin({ platformRole: "user", status: "active" }))).toBe("FORBIDDEN:not_platform_admin");
  });

  test("suspended accounts cannot authenticate", () => {
    expect(reason(() => assertCanAuthenticate({ status: "suspended" }))).toBe("ACCOUNT_SUSPENDED:suspended");
    expect(reason(() => assertCanAuthenticate({ status: "active" }))).toBe("allowed");
  });

  test("admins cannot change their own status", () => {
    const admin = { id: "a", platformRole: "platform_admin" as const, status: "active" as const };
    expect(reason(() => assertCanChangeStatus(admin, "a"))).toBe("FORBIDDEN:self_status_change");
    expect(reason(() => assertCanChangeStatus(admin, "b"))).toBe("allowed");
  });
});

describe("auth configuration", () => {
  const base = { AUTH_SECRET: "x".repeat(32), AUTH_BASE_URL: "http://localhost:5173/", WEB_APP_URL: "http://localhost:5173" };

  test("valid development configuration with sensible defaults", () => {
    const config = loadAuthConfig(base);
    expect(config).toMatchObject({ baseUrl: "http://localhost:5173", rateLimit: true, google: null, mailTransport: "console" });
    expect(config.clientIpHeader).toBe(CLIENT_IP_HEADER);
    expect(config.trustedOrigins).toEqual(["http://localhost:5173"]);
  });

  test("rejects short secrets, half-configured Google and production with dev transports", () => {
    const issues = (env: Record<string, string>) => {
      try {
        loadAuthConfig(env);
        return "";
      } catch (error) {
        return (error as AuthConfigError).issues.join("|");
      }
    };
    expect(issues({ ...base, AUTH_SECRET: "short" })).toContain("AUTH_SECRET");
    expect(issues({ ...base, GOOGLE_CLIENT_ID: "id" })).toContain("GOOGLE_CLIENT_ID");
    const prod = issues({ ...base, NODE_ENV: "production", AUTH_RATE_LIMIT: "off" });
    expect(prod).toContain("MAIL_TRANSPORT");
    expect(prod).toContain("AUTH_RATE_LIMIT");
    expect(prod).toContain("https");
  });

  test("trusting a proxy switches the client IP header", () => {
    expect(loadAuthConfig({ ...base, AUTH_TRUST_PROXY: "true" }).clientIpHeader).toBe("x-forwarded-for");
  });
});

describe("email templates", () => {
  test("escape HTML in user-controlled values", () => {
    const message = emailTemplates.invitation("A@B.co", "<script>x</script>", "Miembro", "http://localhost/i?t=1");
    expect(message.to).toBe("a@b.co");
    expect(message.html).not.toContain("<script>");
    expect(message.html).toContain("&lt;script&gt;");
  });
});
