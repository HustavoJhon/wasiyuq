import { Hono } from "hono";
import { updateProfileRequestSchema, type MeResponse } from "@wasiyuq/validation";
import type { ApiServices, AppEnv } from "../http/context";
import { toCurrentUser, toSession } from "../http/mappers";
import { currentAuth } from "../http/middleware";
import { parseBody, uuidParam } from "../http/validation";

export function meRoutes(services: ApiServices) {
  const app = new Hono<AppEnv>();

  app.get("/", async (c) => {
    const { user } = currentAuth(c);
    // Self-healing: guarantees the personal organization even if the post sign-up hook failed.
    await services.organizations.ensurePersonalOrganization({ id: user.id, name: user.name });
    const { memberships, activeOrganizationId } = await services.organizations.listMemberships(user.id);
    return c.json({ user: toCurrentUser(user), memberships, activeOrganizationId } satisfies MeResponse);
  });

  app.patch("/", async (c) => {
    const { user } = currentAuth(c);
    const changes = await parseBody(c, updateProfileRequestSchema);
    const updated = await services.identity.updateProfile(user.id, changes);
    return c.json({ user: toCurrentUser(updated) });
  });

  app.get("/sessions", async (c) => {
    const { user, sessionId } = currentAuth(c);
    const sessions = await services.identity.listSessions(user.id);
    return c.json({ sessions: sessions.map((s) => toSession(s, sessionId)) });
  });

  app.delete("/sessions/:sessionId", async (c) => {
    const { user } = currentAuth(c);
    await services.identity.revokeSession(user.id, uuidParam(c, "sessionId"));
    return c.body(null, 204);
  });

  app.post("/sessions/revoke-others", async (c) => {
    const { user, sessionId } = currentAuth(c);
    const revoked = await services.identity.revokeOtherSessions(user.id, sessionId);
    return c.json({ revoked });
  });

  return app;
}
