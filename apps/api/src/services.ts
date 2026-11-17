import type { DatabaseHandle } from "@wasiyuq/db";
import {
  createAuthentication,
  createEmailSender,
  DrizzleSessionRepository,
  DrizzleUserRepository,
  EmailDispatcher,
  emailTemplates,
  IdentityService,
  type AuthConfig,
  type EmailSender,
} from "@wasiyuq/module-identity";
import { DrizzleOrganizationRepository, OrganizationService } from "@wasiyuq/module-organizations";
import { organizationRoleLabels } from "@wasiyuq/validation";
import type { ApiServices } from "./http/context";
import { log } from "./logger";

export interface ServiceOverrides {
  /** Replace the configured transport (tests use MemoryEmailSender or a failing sender). */
  sender?: EmailSender;
  /** Delay before the first email retry (tests use 0). */
  retryBaseDelayMs?: number;
}

/** Composition root: wires modules together. Modules never import each other's internals. */
export function createServices(database: DatabaseHandle, config: AuthConfig, overrides: ServiceOverrides = {}): ApiServices {
  const email = new EmailDispatcher(overrides.sender ?? createEmailSender(config.mail), {
    maxAttempts: config.mail.maxAttempts,
    baseDelayMs: overrides.retryBaseDelayMs ?? config.mail.retryBaseDelayMs,
    log: (level, message, meta) => log(level, message, meta),
  });

  const organizations = new OrganizationService(new DrizzleOrganizationRepository(database.db), {
    async sendInvitation({ email: to, organizationName, role, token }) {
      const url = `${config.webAppUrl}/invitations/${encodeURIComponent(token)}`;
      // Background delivery: the invitation exists either way; failures are logged (without the link) and the
      // inviter can cancel and re-invite.
      email.dispatch(emailTemplates.invitation(to, organizationName, organizationRoleLabels[role].label, url));
    },
  });

  const auth = createAuthentication(database.db, config, email, {
    onUserCreated: async (user) => {
      await organizations.ensurePersonalOrganization(user);
    },
    log: (level, message, meta) => log(level, message, meta),
  });

  return {
    auth,
    organizations,
    identity: new IdentityService(new DrizzleUserRepository(database.db), new DrizzleSessionRepository(database.db)),
    email,
    trustedOrigins: config.trustedOrigins,
    providers: { emailPassword: true, google: Boolean(config.google) },
  };
}
