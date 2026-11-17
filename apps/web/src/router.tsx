import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, createRoute, createRouter, Link, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "./components/app-shell";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import { errorMessage, isUnauthenticated, meQuery } from "./lib/api";
import { AdminUsersPage } from "./routes/admin-users";
import { ForgotPasswordPage, LoginPage, RegisterPage, ResetPasswordPage } from "./routes/auth";
import { HomePage } from "./routes/home";
import { InvitationPage } from "./routes/invitation";
import { OrganizationSettingsPage } from "./routes/organization-settings";
import { OrganizationsPage } from "./routes/organizations";
import { ProfilePage } from "./routes/profile";

interface RouterContext {
  queryClient: QueryClient;
}

const str = (value: unknown) => (typeof value === "string" && value.length > 0 ? value : undefined);

/** Client-side guard for UX only: the API authorizes every request independently. */
async function requireSession(context: RouterContext, href: string) {
  try {
    return await context.queryClient.ensureQueryData(meQuery);
  } catch (error) {
    if (isUnauthenticated(error)) throw redirect({ to: "/login", search: { redirect: href } });
    throw error;
  }
}

function NotFound() {
  return (
    <main className="container grid min-h-[60vh] place-items-center">
      <div className="grid gap-3 text-center">
        <h1 className="text-2xl font-semibold">Página no encontrada</h1>
        <Button asChild variant="outline">
          <Link to="/app">Volver al inicio</Link>
        </Button>
      </div>
    </main>
  );
}

function RouteError({ error }: { error: unknown }) {
  return (
    <main className="container py-10">
      <Alert variant="destructive">
        <AlertDescription>{errorMessage(error)}</AlertDescription>
      </Alert>
    </main>
  );
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
  notFoundComponent: NotFound,
  errorComponent: RouteError,
});

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", beforeLoad: () => { throw redirect({ to: "/app" }); } });

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  validateSearch: (s: Record<string, unknown>): { redirect?: string; reset?: string; error?: string } => ({ redirect: str(s.redirect), reset: str(s.reset), error: str(s.error) }),
  component: LoginPage,
});
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  validateSearch: (s: Record<string, unknown>): { redirect?: string } => ({ redirect: str(s.redirect) }),
  component: RegisterPage,
});
const forgotRoute = createRoute({ getParentRoute: () => rootRoute, path: "/forgot-password", component: ForgotPasswordPage });
const resetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  validateSearch: (s: Record<string, unknown>): { token?: string; error?: string } => ({ token: str(s.token), error: str(s.error) }),
  component: ResetPasswordPage,
});
const invitationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/invitations/$token",
  beforeLoad: ({ context, location }) => requireSession(context, location.href),
  component: InvitationPage,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  validateSearch: (s: Record<string, unknown>): { verified?: string } => ({ verified: str(s.verified) }),
  beforeLoad: ({ context, location }) => requireSession(context, location.href),
  component: AppShell,
});
const homeRoute = createRoute({ getParentRoute: () => appRoute, path: "/", component: HomePage });
const profileRoute = createRoute({ getParentRoute: () => appRoute, path: "/profile", component: ProfilePage });
const organizationsRoute = createRoute({ getParentRoute: () => appRoute, path: "/organizations", component: OrganizationsPage });
const organizationRoute = createRoute({ getParentRoute: () => appRoute, path: "/organizations/$orgId", component: OrganizationSettingsPage });
const adminUsersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin/users",
  beforeLoad: async ({ context, location }) => {
    const me = await requireSession(context, location.href);
    if (me.user.platformRole !== "platform_admin") throw redirect({ to: "/app" });
  },
  component: AdminUsersPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  forgotRoute,
  resetRoute,
  invitationRoute,
  appRoute.addChildren([homeRoute, profileRoute, organizationsRoute, organizationRoute, adminUsersRoute]),
]);

export function createAppRouter(queryClient: QueryClient) {
  return createRouter({ routeTree, context: { queryClient }, defaultPreload: "intent" });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
