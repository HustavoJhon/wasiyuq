import { describe, expect, test } from "bun:test";
import { safeErrorMeta } from "../http/errors";
import { redactPath } from "../http/middleware";

describe("log redaction", () => {
  test("token-like path segments are redacted, UUIDs and words kept", () => {
    expect(redactPath("/api/v1/invitations/Zx9_abcdefghijklmnopqrstuvwxyz012345/accept")).toBe("/api/v1/invitations/:token/accept");
    expect(redactPath("/api/auth/reset-password/AbCdEfGhIjKlMnOpQrStUv")).toBe("/api/auth/reset-password/:token");
    const uuid = "185adc8e-9a35-463a-945b-b06f1de2457a";
    expect(redactPath(`/api/v1/organizations/${uuid}/members`)).toBe(`/api/v1/organizations/${uuid}/members`);
    expect(redactPath("/api/auth/request-password-reset")).toBe("/api/auth/request-password-reset");
  });

  test("error metadata never includes messages (which may embed SQL params)", () => {
    const dbError = Object.assign(new Error("Failed query: insert ... params: ana@example.com"), {
      cause: { code: "23505", constraint_name: "users_email_unique", detail: "Key (email)=(ana@example.com)" },
    });
    const meta = safeErrorMeta(dbError);
    expect(meta).toEqual({ errorType: "Error", pgCode: "23505", constraint: "users_email_unique" });
    expect(JSON.stringify(meta)).not.toContain("ana@example.com");
  });
});
