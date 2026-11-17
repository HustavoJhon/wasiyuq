import { z } from "zod";

/** Database targets supported by WASIYUQ 2.0. Each one maps to its own connection URL. */
export const databaseTargets = ["development", "test"] as const;
export type DatabaseTarget = (typeof databaseTargets)[number];

/** Environment variable that holds the connection URL for each target. */
export const databaseUrlVariables: Record<DatabaseTarget, "DATABASE_URL" | "TEST_DATABASE_URL"> = {
  development: "DATABASE_URL",
  test: "TEST_DATABASE_URL",
};

export interface DatabaseConfig {
  target: DatabaseTarget;
  /** Full connection URL. Contains credentials: never log it, use `describeDatabase` instead. */
  url: string;
  host: string;
  port: number;
  database: string;
  user: string;
  poolMax: number;
  connectTimeoutSeconds: number;
}

export class DatabaseConfigError extends Error {
  constructor(
    message: string,
    readonly issues: string[] = [],
  ) {
    super(issues.length > 0 ? `${message}: ${issues.join("; ")}` : message);
    this.name = "DatabaseConfigError";
  }
}

const postgresUrlSchema = z
  .string({ error: "is required" })
  .trim()
  .min(1, "is required")
  .superRefine((value, ctx) => {
    let parsed: URL;
    try {
      parsed = new URL(value);
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "must be a valid URL" });
      return;
    }
    if (!/^postgres(ql)?:$/.test(parsed.protocol)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "must use the postgres:// or postgresql:// scheme (PostgreSQL only)",
      });
    }
    if (parsed.pathname.replace(/^\//, "").length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "must include a database name" });
    }
  });

const envSchema = z.object({
  DB_POOL_MAX: z.coerce.number().int().min(1).max(100).default(10),
  DB_CONNECT_TIMEOUT_SECONDS: z.coerce.number().int().min(1).max(120).default(5),
});

type Env = Record<string, string | undefined>;

function formatIssues(error: z.ZodError, prefix?: string): string[] {
  return error.issues.map((issue) => {
    const path = prefix ?? issue.path.join(".");
    return `${path} ${issue.message}`;
  });
}

/**
 * Resolve and validate the database configuration for a target from environment variables.
 * Throws `DatabaseConfigError` with every validation issue when the configuration is invalid.
 */
export function loadDatabaseConfig(target: DatabaseTarget, env: Env = process.env): DatabaseConfig {
  const variable = databaseUrlVariables[target];
  const issues: string[] = [];

  const urlResult = postgresUrlSchema.safeParse(env[variable]);
  if (!urlResult.success) issues.push(...formatIssues(urlResult.error, variable));

  const envResult = envSchema.safeParse(env);
  if (!envResult.success) issues.push(...formatIssues(envResult.error));

  if (!urlResult.success || !envResult.success) {
    throw new DatabaseConfigError(`Invalid ${target} database configuration`, issues);
  }

  const parsed = new URL(urlResult.data);
  return {
    target,
    url: urlResult.data,
    host: parsed.hostname.replace(/^\[|\]$/g, ""),
    port: parsed.port ? Number(parsed.port) : 5432,
    database: decodeURIComponent(parsed.pathname.replace(/^\//, "")),
    user: decodeURIComponent(parsed.username),
    poolMax: envResult.data.DB_POOL_MAX,
    connectTimeoutSeconds: envResult.data.DB_CONNECT_TIMEOUT_SECONDS,
  };
}

/** Pick the target from NODE_ENV: `test` → test database, anything else → development database. */
export function targetFromNodeEnv(nodeEnv: string | undefined): DatabaseTarget {
  return nodeEnv === "test" ? "test" : "development";
}

/** Credential-free description of a configuration, safe for logs. */
export function describeDatabase(config: Pick<DatabaseConfig, "target" | "host" | "port" | "database">) {
  return { target: config.target, host: config.host, port: config.port, database: config.database };
}
