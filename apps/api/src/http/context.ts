import type { Authentication, IdentityService, IdentityUser } from "@wasiyuq/module-identity";
import type { OrganizationService } from "@wasiyuq/module-organizations";

/** Application services wired by the composition root (server.ts) and injected into routes. */
export interface ApiServices {
  auth: Authentication;
  identity: IdentityService;
  organizations: OrganizationService;
  /** Origins allowed to make cookie-authenticated, state-changing requests. */
  trustedOrigins: string[];
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
