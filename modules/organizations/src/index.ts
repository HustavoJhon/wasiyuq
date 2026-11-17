// Public API of the organizations module. Internal files must not be imported directly.
export { OrganizationError, type OrganizationErrorCode } from "./domain/errors";
export { INVITATION_TTL_MS, invitationStatus, type InvitationStatus } from "./domain/invitation";
export {
  assertCanGrantRole,
  assertCanManageMember,
  requireMembership,
  requirePermission,
  type ActorMembership,
} from "./domain/policy";
export { assignableRoles, permissionsFor, roleHasPermission, roleLevels } from "./domain/roles";
