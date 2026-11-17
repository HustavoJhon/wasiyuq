import type { IdentityUser, SessionRecord } from "@wasiyuq/module-identity";
import type { InvitationView, MemberRecord, OrganizationRecord } from "@wasiyuq/module-organizations";
import type { AdminUser, CurrentUser, Invitation, Member, Organization, SessionSummary } from "@wasiyuq/validation";

export const toCurrentUser = (user: IdentityUser): CurrentUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified,
  image: user.image,
  dni: user.dni,
  whatsapp: user.whatsapp,
  platformRole: user.platformRole,
  status: user.status,
  createdAt: user.createdAt.toISOString(),
});

export const toAdminUser = (user: IdentityUser): AdminUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified,
  platformRole: user.platformRole,
  status: user.status,
  createdAt: user.createdAt.toISOString(),
});

export const toSession = (session: SessionRecord, currentId: string): SessionSummary => ({
  id: session.id,
  current: session.id === currentId,
  userAgent: session.userAgent,
  ipAddress: session.ipAddress,
  createdAt: session.createdAt.toISOString(),
  expiresAt: session.expiresAt.toISOString(),
});

export const toOrganization = (org: OrganizationRecord): Organization => ({
  id: org.id,
  name: org.name,
  slug: org.slug,
  kind: org.kind,
  bio: org.bio,
  website: org.website,
  phone: org.phone,
  address: org.address,
  city: org.city,
  region: org.region,
  createdAt: org.createdAt.toISOString(),
});

export const toMember = (member: MemberRecord): Member => ({
  userId: member.userId,
  name: member.name,
  email: member.email,
  role: member.role,
  joinedAt: member.joinedAt.toISOString(),
});

export const toInvitation = (invitation: InvitationView): Invitation => ({
  id: invitation.id,
  email: invitation.email,
  role: invitation.role,
  status: invitation.status,
  invitedBy: invitation.invitedBy,
  expiresAt: invitation.expiresAt.toISOString(),
  createdAt: invitation.createdAt.toISOString(),
});
