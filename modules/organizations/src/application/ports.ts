import type { MembershipSummary, OrganizationKind, OrganizationRole } from "@wasiyuq/validation";
import type { InvitationState } from "../domain/invitation";

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  kind: OrganizationKind;
  bio: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  createdAt: Date;
}

export interface MemberRecord {
  userId: string;
  name: string;
  email: string;
  role: OrganizationRole;
  joinedAt: Date;
}

export interface InvitationRecord extends InvitationState {
  id: string;
  organizationId: string;
  email: string;
  role: OrganizationRole;
  invitedBy: string | null;
  createdAt: Date;
}

export interface OrganizationProfileChanges {
  name?: string;
  slug?: string;
  bio?: string | null;
  website?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
}

export type CreateInvitationOutcome = { ok: true; invitation: InvitationRecord } | { ok: false; reason: "already_member" | "already_invited" };

export type AcceptInvitationOutcome =
  | { ok: true; organizationId: string }
  | { ok: false; reason: "not_found" | "not_pending" | "inviter_lost_rights" };

/** Persistence port for the organizations module. Every method is atomic. Archived organizations are invisible. */
export interface OrganizationRepository {
  findOrganization(id: string): Promise<OrganizationRecord | null>;
  findPersonalOrganization(userId: string): Promise<OrganizationRecord | null>;
  findMembershipRole(organizationId: string, userId: string): Promise<OrganizationRole | null>;
  listMembershipsForUser(userId: string): Promise<Omit<MembershipSummary, "isActive">[]>;
  slugsStartingWith(base: string): Promise<string[]>;
  /** Creates the organization and its owner membership. Throws `SlugTakenError` on a concurrent slug clash. */
  createWithOwner(input: { name: string; slug: string; kind: OrganizationKind; ownerUserId: string }): Promise<OrganizationRecord>;
  update(id: string, changes: OrganizationProfileChanges): Promise<OrganizationRecord>;
  /** Archive, drop memberships, cancel pending invitations, clear contexts. Returns affected user ids. */
  archive(id: string): Promise<string[]>;

  getContext(userId: string): Promise<string | null>;
  setContext(userId: string, organizationId: string): Promise<void>;
  clearContext(userId: string): Promise<void>;

  listMembers(organizationId: string): Promise<MemberRecord[]>;
  findMember(organizationId: string, userId: string): Promise<MemberRecord | null>;
  updateMemberRole(organizationId: string, userId: string, role: OrganizationRole): Promise<void>;
  removeMember(organizationId: string, userId: string): Promise<void>;

  listPendingInvitations(organizationId: string, now: Date): Promise<InvitationRecord[]>;
  findInvitation(organizationId: string, invitationId: string): Promise<InvitationRecord | null>;
  findInvitationByTokenHash(tokenHash: string): Promise<(InvitationRecord & { organizationName: string }) | null>;
  /** Checks membership and pending duplicates inside the same transaction as the insert. */
  createInvitation(input: {
    organizationId: string;
    email: string;
    role: OrganizationRole;
    tokenHash: string;
    invitedBy: string;
    expiresAt: Date;
    now: Date;
  }): Promise<CreateInvitationOutcome>;
  cancelInvitation(invitationId: string, now: Date): Promise<boolean>;
  /**
   * Locks the invitation, re-checks it is pending, re-validates that the inviter can still grant the role
   * (`inviterCanGrant` receives the inviter's current role, or null if no longer a member; when false the
   * invitation is cancelled), adds the membership (keeps an existing one) and marks it accepted.
   */
  acceptInvitation(input: {
    invitationId: string;
    userId: string;
    now: Date;
    inviterCanGrant: (inviterRole: OrganizationRole | null, invitedRole: OrganizationRole) => boolean;
  }): Promise<AcceptInvitationOutcome>;
}

export class SlugTakenError extends Error {
  constructor() {
    super("slug taken");
    this.name = "SlugTakenError";
  }
}

/** Delivers invitation links. The raw token only travels through this port. */
export interface InvitationNotifier {
  sendInvitation(input: { email: string; organizationName: string; role: OrganizationRole; token: string }): Promise<void>;
}
