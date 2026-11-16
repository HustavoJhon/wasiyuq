import { Hono } from "hono";
import { healthResponseSchema } from "@wasiyuq/validation";

export const app = new Hono();

function log(level: "info" | "error", message: string, meta?: Record<string, unknown>) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };
  console.log(JSON.stringify(entry));
}

app.get("/health", (c) => {
  const payload = healthResponseSchema.parse({
    status: "ok",
    service: "api",
    timestamp: new Date().toISOString(),
  });
  return c.json(payload);
});

const port = Number(process.env.PORT ?? 3001);

if (import.meta.main) {
  log("info", "api starting", { port });
  Bun.serve({ fetch: app.fetch, port });
  log("info", "api started", { port });
}

export default {
  port,
  fetch: app.fetch,
};
