import { Hono } from "hono";
import {
  createInvitationRequestSchema,
  createOrganizationRequestSchema,
  deleteOrganizationRequestSchema,
  updateMemberRoleRequestSchema,
  updateOrganizationRequestSchema,
} from "@wasiyuq/validation";
import type { ApiServices, AppEnv } from "../http/context";
import { toInvitation, toMember, toOrganization } from "../http/mappers";
import { actorOf, currentAuth } from "../http/middleware";
import { parseBody, uuidParam } from "../http/validation";

export function organizationRoutes(services: ApiServices) {
  const app = new Hono<AppEnv>();
  const orgs = services.organizations;

  app.get("/", async (c) => {
    const { user } = currentAuth(c);
    return c.json(await orgs.listMemberships(user.id));
  });

  app.post("/", async (c) => {
    const { name } = await parseBody(c, createOrganizationRequestSchema);
    const organization = await orgs.createOrganization(actorOf(c), name);
    return c.json({ organization: toOrganization(organization) }, 201);
  });

  app.get("/:orgId", async (c) => {
    const detail = await orgs.getOrganization(actorOf(c), uuidParam(c, "orgId"));
    return c.json({ organization: toOrganization(detail.organization), role: detail.role, permissions: detail.permissions });
  });

  app.patch("/:orgId", async (c) => {
    const changes = await parseBody(c, updateOrganizationRequestSchema);
    const organization = await orgs.updateOrganization(actorOf(c), uuidParam(c, "orgId"), changes);
    return c.json({ organization: toOrganization(organization) });
  });

  app.delete("/:orgId", async (c) => {
    const { confirmName } = await parseBody(c, deleteOrganizationRequestSchema);
    await orgs.archiveOrganization(actorOf(c), uuidParam(c, "orgId"), confirmName);
    return c.body(null, 204);
  });

  app.post("/:orgId/switch", async (c) => {
    const organizationId = uuidParam(c, "orgId");
    await orgs.switchOrganization(actorOf(c), organizationId);
    return c.json({ activeOrganizationId: organizationId });
  });

  app.get("/:orgId/members", async (c) => {
    const members = await orgs.listMembers(actorOf(c), uuidParam(c, "orgId"));
    return c.json({ members: members.map(toMember) });
  });

  app.patch("/:orgId/members/:userId", async (c) => {
    const { role } = await parseBody(c, updateMemberRoleRequestSchema);
    await orgs.changeMemberRole(actorOf(c), uuidParam(c, "orgId"), uuidParam(c, "userId"), role);
    return c.body(null, 204);
  });

  app.delete("/:orgId/members/:userId", async (c) => {
    await orgs.removeMember(actorOf(c), uuidParam(c, "orgId"), uuidParam(c, "userId"));
    return c.body(null, 204);
  });

  app.get("/:orgId/invitations", async (c) => {
    const invitations = await orgs.listInvitations(actorOf(c), uuidParam(c, "orgId"));
    return c.json({ invitations: invitations.map(toInvitation) });
  });

  app.post("/:orgId/invitations", async (c) => {
    const { email, role } = await parseBody(c, createInvitationRequestSchema);
    const invitation = await orgs.invite(actorOf(c), uuidParam(c, "orgId"), email, role);
    return c.json({ invitation: toInvitation(invitation) }, 201);
  });

  app.delete("/:orgId/invitations/:invitationId", async (c) => {
    await orgs.cancelInvitation(actorOf(c), uuidParam(c, "orgId"), uuidParam(c, "invitationId"));
    return c.body(null, 204);
  });

  return app;
}
