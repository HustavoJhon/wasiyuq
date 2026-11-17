import type { DatabaseHandle } from "./client";

export type DatabaseHealth =
  | { status: "up"; latencyMs: number; database: string }
  | { status: "down"; latencyMs: number; error: string; code?: string };

function describeError(error: unknown): { error: string; code?: string } {
  if (error instanceof Error) {
    const code = (error as { code?: unknown }).code;
    return { error: error.message, ...(typeof code === "string" ? { code } : {}) };
  }
  return { error: String(error) };
}

/**
 * Run a trivial query and report whether PostgreSQL is reachable. Never throws.
 * Also confirms the server reports the configured database name.
 */
export async function checkDatabaseHealth(handle: DatabaseHandle, timeoutMs = 3000): Promise<DatabaseHealth> {
  const started = performance.now();
  const elapsed = () => Math.round(performance.now() - started);
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    const query = handle.sql<{ database: string }[]>`select current_database() as database`;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        query.cancel();
        reject(Object.assign(new Error(`database health check timed out after ${timeoutMs}ms`), { code: "TIMEOUT" }));
      }, timeoutMs);
    });
    const rows = await Promise.race([query, timeout]);
    const database = rows[0]?.database ?? "";
    if (database !== handle.config.database) {
      return {
        status: "down",
        latencyMs: elapsed(),
        error: `connected to unexpected database "${database}"`,
        code: "UNEXPECTED_DATABASE",
      };
    }
    return { status: "up", latencyMs: elapsed(), database };
  } catch (error) {
    return { status: "down", latencyMs: elapsed(), ...describeError(error) };
  } finally {
    if (timer) clearTimeout(timer);
  }
}
