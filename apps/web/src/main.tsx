import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import "./index.css";

const queryClient = new QueryClient();

function Home() {
  return (
    <main className="min-h-screen p-8 font-sans">
      <h1 className="text-2xl font-semibold">WASIYUQ 2.0</h1>
      <p className="mt-2 text-gray-700">Frontend scaffold ready (React + Vite + TanStack + Tailwind).</p>
    </main>
  );
}

const rootRoute = createRootRoute({ component: Home });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/" });
const routeTree = rootRoute.addChildren([indexRoute]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
