import { Hono } from "hono";
import type { InvitationPreview } from "@wasiyuq/validation";
import type { ApiServices, AppEnv } from "../http/context";
import { actorOf } from "../http/middleware";
import { tokenParam } from "../http/validation";

/** Invitee-side endpoints. The token travels only in the path of these requests (redacted from logs). */
export function invitationRoutes(services: ApiServices) {
  const app = new Hono<AppEnv>();

  app.get("/:token", async (c) => {
    const preview = await services.organizations.previewInvitation(actorOf(c), tokenParam(c, "token"));
    return c.json({ ...preview, expiresAt: preview.expiresAt.toISOString() } satisfies InvitationPreview);
  });

  app.post("/:token/accept", async (c) => {
    const result = await services.organizations.acceptInvitation(actorOf(c), tokenParam(c, "token"));
    return c.json(result);
  });

  return app;
}
