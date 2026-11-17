export { createApp, type AppOptions } from "./app";
export { startServer, type RunningServer, type StartServerOptions } from "./server";

if (import.meta.main) {
  const { startServer } = await import("./server");
  await startServer();
}
