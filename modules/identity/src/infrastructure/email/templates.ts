import type { EmailMessage } from "../../domain/ports";

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Header values must be single-line: user-controlled text (names) must never inject extra headers. */
const singleLine = (value: string) => value.replace(/[\r\n\t]+/g, " ").trim();

function render(kind: EmailMessage["kind"], to: string, subject: string, intro: string, action: string, url: string, outro: string): EmailMessage {
  return {
    kind,
    to: to.toLowerCase(),
    subject: singleLine(subject),
    text: `${intro}\n\n${action}: ${url}\n\n${outro}\n\n— WASIYUQ`,
    html: `<p>${escape(intro)}</p><p><a href="${escape(url)}">${escape(action)}</a></p><p>${escape(outro)}</p><p>— WASIYUQ</p>`,
  };
}

export const emailTemplates = {
  verification: (to: string, name: string, url: string) =>
    render(
      "email_verification",
      to,
      "Verifica tu correo en WASIYUQ",
      `Hola ${name}, confirma tu dirección de correo para activar todas las funciones de tu cuenta.`,
      "Verificar correo",
      url,
      "Si no creaste esta cuenta, ignora este mensaje.",
    ),
  passwordReset: (to: string, name: string, url: string) =>
    render(
      "password_reset",
      to,
      "Restablece tu contraseña de WASIYUQ",
      `Hola ${name}, recibimos una solicitud para restablecer tu contraseña. El enlace caduca en 1 hora.`,
      "Restablecer contraseña",
      url,
      "Si no lo solicitaste, ignora este mensaje: tu contraseña no cambiará.",
    ),
  /** Sent instead of an error when someone signs up with an address that already has an account. */
  accountExists: (to: string, name: string, url: string) =>
    render(
      "account_exists",
      to,
      "Intento de registro con tu correo en WASIYUQ",
      `Hola ${name}, alguien intentó crear una cuenta nueva con este correo, pero ya tienes una. Si fuiste tú, inicia sesión; si olvidaste tu contraseña, puedes restablecerla.`,
      "Iniciar sesión",
      url,
      "Si no fuiste tú, no necesitas hacer nada: tu cuenta no cambió.",
    ),
  /** Security notification after a successful password reset (all sessions were revoked). */
  passwordChanged: (to: string, name: string, url: string) =>
    render(
      "password_changed",
      to,
      "Tu contraseña de WASIYUQ cambió",
      `Hola ${name}, la contraseña de tu cuenta se cambió y cerramos todas las sesiones abiertas.`,
      "Iniciar sesión",
      url,
      "Si no fuiste tú, restablece tu contraseña de inmediato desde la página de inicio de sesión y avísanos.",
    ),
  invitation: (to: string, organizationName: string, roleLabel: string, url: string) =>
    render(
      "organization_invitation",
      to,
      `Invitación a ${organizationName} en WASIYUQ`,
      `Te invitaron a unirte a ${organizationName} con el rol ${roleLabel}. La invitación caduca en 3 días.`,
      "Ver invitación",
      url,
      "Debes iniciar sesión con este mismo correo para aceptarla.",
    ),
};
