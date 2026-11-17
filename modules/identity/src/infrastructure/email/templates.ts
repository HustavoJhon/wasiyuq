import type { EmailMessage } from "../../domain/ports";

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function render(kind: EmailMessage["kind"], to: string, subject: string, intro: string, action: string, url: string, outro: string): EmailMessage {
  return {
    kind,
    to: to.toLowerCase(),
    subject,
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
