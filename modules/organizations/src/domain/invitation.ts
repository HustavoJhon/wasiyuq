/** Legacy `TeamInvitationController::store`: invitations expire after 3 days. */
export const INVITATION_TTL_MS = 3 * 24 * 60 * 60 * 1000;

export type InvitationStatus = "pending" | "accepted" | "expired" | "cancelled";

export interface InvitationState {
  acceptedAt: Date | null;
  cancelledAt: Date | null;
  expiresAt: Date;
}

export function invitationStatus(invitation: InvitationState, now = new Date()): InvitationStatus {
  if (invitation.acceptedAt) return "accepted";
  if (invitation.cancelledAt) return "cancelled";
  if (invitation.expiresAt.getTime() <= now.getTime()) return "expired";
  return "pending";
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Legacy `ValidTeamInvitation`: the invitation must be addressed to the accepting user's email. */
export function invitationMatchesEmail(invitationEmail: string, userEmail: string): boolean {
  return normalizeEmail(invitationEmail) === normalizeEmail(userEmail);
}
