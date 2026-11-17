import { Hono } from "hono";
import { assignableRoles, permissionsFor, roleLevels } from "@wasiyuq/module-organizations";
import { organizationRoleLabels, organizationRoles } from "@wasiyuq/validation";
import type { AppEnv } from "../http/context";

/** Role catalog (labels, permissions, assignability) so clients never hardcode the policy. */
export function roleRoutes() {
  const app = new Hono<AppEnv>();
  app.get("/", (c) =>
    c.json({
      roles: organizationRoles.map((role) => ({
        role,
        ...organizationRoleLabels[role],
        assignable: assignableRoles.includes(role),
        level: roleLevels[role],
        permissions: [...permissionsFor(role)],
      })),
    }),
  );
  return app;
}
