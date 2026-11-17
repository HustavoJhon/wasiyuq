import { describe, expect, test } from "bun:test";

// auth-client.ts reads window.location at import; provide a minimal stub for unit tests.
(globalThis as { window?: unknown }).window ??= { location: { origin: "http://localhost:5173" } };
const { authErrorMessage, safeRedirect } = await import("../auth-client");

describe("auth helpers", () => {
  test("safeRedirect only allows same-site relative paths", () => {
    expect(safeRedirect("/app/profile")).toBe("/app/profile");
    expect(safeRedirect("//evil.example")).toBe("/app");
    expect(safeRedirect("https://evil.example")).toBe("/app");
    expect(safeRedirect("/\\evil.example")).toBe("/app");
    expect(safeRedirect(undefined)).toBe("/app");
  });

  test("auth errors map to Spanish messages without leaking details", () => {
    expect(authErrorMessage({ code: "INVALID_EMAIL_OR_PASSWORD", status: 401 })).toBe("Correo o contraseña incorrectos");
    expect(authErrorMessage({ status: 429 })).toContain("Demasiados intentos");
    expect(authErrorMessage({ code: "SOMETHING_INTERNAL", status: 500, message: "stack trace" })).not.toContain("stack");
  });
});
