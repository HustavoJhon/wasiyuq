import { Hono } from "hono";
import { z } from "zod";
import { assertPlatformAdmin } from "@wasiyuq/module-identity";
import { updateAccountStatusRequestSchema } from "@wasiyuq/validation";
import type { ApiServices, AppEnv } from "../http/context";
import { toAdminUser } from "../http/mappers";
import { currentAuth } from "../http/middleware";
import { parseBody, uuidParam } from "../http/validation";
import { log } from "../logger";

const pagination = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

/** Platform administration. Requires platform_role = platform_admin (no email bypass). */
export function adminRoutes(services: ApiServices) {
  const app = new Hono<AppEnv>();

  app.use("*", async (c, next) => {
    assertPlatformAdmin(currentAuth(c).user);
    await next();
  });

  app.get("/users", async (c) => {
    const { limit, offset } = pagination.parse({ limit: c.req.query("limit"), offset: c.req.query("offset") });
    const users = await services.identity.listUsers(currentAuth(c).user, { limit, offset });
    return c.json({ users: users.map(toAdminUser), limit, offset });
  });

  app.patch("/users/:userId/status", async (c) => {
    const { status } = await parseBody(c, updateAccountStatusRequestSchema);
    const actor = currentAuth(c).user;
    const targetId = uuidParam(c, "userId");
    const user = await services.identity.changeAccountStatus(actor, targetId, status);
    log("info", "account status changed", { actorId: actor.id, targetId, status });
    return c.json({ user: toAdminUser(user) });
  });

  // Email delivery counters (no recipients or content). Admin-only: see the note on /ready.
  app.get("/email-health", (c) => c.json({ email: services.email.health() }));

  return app;
}
