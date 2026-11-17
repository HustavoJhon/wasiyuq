import type { Authentication, EmailDispatcher, IdentityService, IdentityUser } from "@wasiyuq/module-identity";
import type { OrganizationService } from "@wasiyuq/module-organizations";

/** Application services wired by the composition root (server.ts) and injected into routes. */
export interface ApiServices {
  auth: Authentication;
  identity: IdentityService;
  organizations: OrganizationService;
  /** Background email delivery (verification, reset, invitations, security notices). */
  email: EmailDispatcher;
  /** Origins allowed to make cookie-authenticated, state-changing requests. */
  trustedOrigins: string[];
  /** Sign-in methods enabled on this deployment (public, no secrets). */
  providers: { emailPassword: boolean; google: boolean };
}

export interface AuthState {
  user: IdentityUser;
  sessionId: string;
}

export type AppEnv = {
  Variables: {
    requestId: string;
    auth: AuthState | undefined;
  };
};
