export { createApp, type AppOptions } from "./app";
export { startServer, type RunningServer, type StartServerOptions } from "./server";

if (import.meta.main) {
  const { startServer } = await import("./server");
  const { log } = await import("./logger");
  const errorType = (error: unknown) => (error instanceof Error ? error.name : typeof error);

  // Last-resort handlers. Messages are not logged: driver/provider errors can carry emails, SQL parameters or links.
  process.on("unhandledRejection", (reason) => log("error", "unhandled promise rejection", { errorType: errorType(reason) }));
  process.on("uncaughtException", (error) => {
    log("error", "uncaught exception; exiting", { errorType: errorType(error) });
    process.exit(1);
  });

  try {
    await startServer();
  } catch (error) {
    // Configuration errors list only variable names and rules, never values.
    const issues = (error as { issues?: unknown }).issues;
    log("error", "api failed to start", { errorType: errorType(error), issues: Array.isArray(issues) ? issues : undefined });
    process.exit(1);
  }
}
