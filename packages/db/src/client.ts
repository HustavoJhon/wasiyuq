import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import type { DatabaseConfig } from "./config";
import * as schema from "./schema";

export type Schema = typeof schema;
export type Database = PostgresJsDatabase<Schema>;

export interface DatabaseHandle {
  readonly config: DatabaseConfig;
  /** Typed Drizzle ORM instance. */
  readonly db: Database;
  /** Underlying postgres.js client, for low-level queries and health checks. */
  readonly sql: Sql;
  /** Close every pooled connection. Safe to call more than once. */
  close(timeoutSeconds?: number): Promise<void>;
  readonly closed: boolean;
}

/**
 * Create a lazily-connected database handle. No connection is opened until the first query,
 * so creating a handle never fails because PostgreSQL is down; use `checkDatabaseHealth` for that.
 */
export function createDatabase(config: DatabaseConfig): DatabaseHandle {
  const sql = postgres(config.url, {
    max: config.poolMax,
    connect_timeout: config.connectTimeoutSeconds,
    idle_timeout: 30,
    onnotice: () => {},
    connection: { application_name: `wasiyuq-${config.target}` },
  });
  const db = drizzle(sql, { schema });

  let closed = false;
  return {
    config,
    db,
    sql,
    get closed() {
      return closed;
    },
    async close(timeoutSeconds = 5) {
      if (closed) return;
      closed = true;
      await sql.end({ timeout: timeoutSeconds });
    },
  };
}
