import type { DatabaseHandle } from "@wasiyuq/db";
import {
  ConsoleEmailSender,
  createAuthentication,
  DrizzleSessionRepository,
  DrizzleUserRepository,
  emailTemplates,
  IdentityService,
  type AuthConfig,
  type EmailSender,
} from "@wasiyuq/module-identity";
import { DrizzleOrganizationRepository, OrganizationService } from "@wasiyuq/module-organizations";
import { organizationRoleLabels } from "@wasiyuq/validation";
import type { ApiServices } from "./http/context";
import { log } from "./logger";

/** Composition root: wires modules together. Modules never import each other's internals. */
export function createServices(database: DatabaseHandle, config: AuthConfig, mailer: EmailSender = new ConsoleEmailSender()): ApiServices {
  const organizations = new OrganizationService(new DrizzleOrganizationRepository(database.db), {
    async sendInvitation({ email, organizationName, role, token }) {
      const url = `${config.webAppUrl}/invitations/${encodeURIComponent(token)}`;
      await mailer.send(emailTemplates.invitation(email, organizationName, organizationRoleLabels[role].label, url));
    },
  });

  const auth = createAuthentication(database.db, config, mailer, {
    onUserCreated: async (user) => {
      await organizations.ensurePersonalOrganization(user);
    },
    logError: (message, meta) => log("error", message, meta),
  });

  return {
    auth,
    organizations,
    identity: new IdentityService(new DrizzleUserRepository(database.db), new DrizzleSessionRepository(database.db)),
    trustedOrigins: config.trustedOrigins,
  };
}
