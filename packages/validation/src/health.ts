import { z } from "zod";

/** GET /health — liveness: the process is up. Independent of the database. */
export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.string(),
  timestamp: z.string(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const dependencyCheckSchema = z.object({
  status: z.enum(["up", "down", "not_configured"]),
  latencyMs: z.number().int().nonnegative().optional(),
  /** Machine-readable failure code. Error details are logged, never returned. */
  code: z.string().optional(),
});

export type DependencyCheck = z.infer<typeof dependencyCheckSchema>;

/** GET /ready — readiness: the service can handle traffic (database reachable, not shutting down). */
export const readinessResponseSchema = z.object({
  status: z.enum(["ready", "not_ready"]),
  service: z.string(),
  timestamp: z.string(),
  checks: z.object({
    database: dependencyCheckSchema,
  }),
});

export type ReadinessResponse = z.infer<typeof readinessResponseSchema>;
