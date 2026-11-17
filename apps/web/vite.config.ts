import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// The web app talks to the API through a same-origin `/api` proxy so the httpOnly session cookie is
// first-party (SameSite=Lax) and no CORS configuration is needed. Production must serve both under one origin.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../..", "VITE_");
  return {
    envDir: "../..",
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": { target: env.VITE_API_PROXY_TARGET || "http://localhost:3001", changeOrigin: false, xfwd: false },
      },
    },
  };
});
