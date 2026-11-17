export type LogLevel = "debug" | "info" | "warn" | "error";

const order: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function threshold(): number {
  const level = process.env.LOG_LEVEL as LogLevel | undefined;
  return order[level ?? "info"] ?? order.info;
}

/** Structured JSON logger (one line per event). Never pass connection URLs or secrets in `meta`. */
export function log(level: LogLevel, message: string, meta: Record<string, unknown> = {}): void {
  if (order[level] < threshold()) return;
  const line = JSON.stringify({ level, message, timestamp: new Date().toISOString(), service: "api", ...meta });
  if (level === "error" || level === "warn") console.error(line);
  else console.log(line);
}
