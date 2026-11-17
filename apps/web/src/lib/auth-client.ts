import { createAuthClient } from "better-auth/react";

/** Better Auth browser client. Same-origin `/api/auth` (proxied to the API in development). */
export const authClient = createAuthClient({ baseURL: window.location.origin, basePath: "/api/auth" });

const messages: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Correo o contraseña incorrectos",
  USER_ALREADY_EXISTS: "Ya existe una cuenta con este correo",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Ya existe una cuenta con este correo",
  PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 8 caracteres",
  PASSWORD_TOO_LONG: "La contraseña es demasiado larga",
  INVALID_TOKEN: "El enlace no es válido o ha caducado",
  ACCOUNT_SUSPENDED: "Tu cuenta está suspendida",
  INVALID_EMAIL: "Correo electrónico inválido",
};

/** Translate a Better Auth client error into a user-facing Spanish message. */
export function authErrorMessage(error: { code?: string; status?: number; message?: string } | null | undefined): string {
  if (!error) return "Ocurrió un error inesperado";
  if (error.status === 429) return "Demasiados intentos. Espera un minuto e inténtalo de nuevo.";
  if (error.code && messages[error.code]) return messages[error.code]!;
  if (error.status === 403) return "No tienes acceso con esta cuenta";
  return "No se pudo completar la operación. Inténtalo de nuevo.";
}

/** Only same-site relative paths are accepted as post-login redirects (prevents open redirects). */
export function safeRedirect(value: unknown, fallback = "/app"): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : fallback;
}
