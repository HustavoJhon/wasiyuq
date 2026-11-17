import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { LogOut, MailWarning } from "lucide-react";
import { useState } from "react";
import { api, errorMessage, meQuery, queryKeys } from "../lib/api";
import { authClient } from "../lib/auth-client";
import { navigationFor } from "../lib/navigation";
import { Brand } from "./auth-layout";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select } from "./ui/input";

function OrganizationSwitcher() {
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const switchOrg = useMutation({
    mutationFn: (id: string) => api.switchOrganization(id),
    onSuccess: () => queryClient.invalidateQueries(),
  });
  if (!me) return null;
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="org-switcher" className="sr-only">
        Organización activa
      </Label>
      <Select
        id="org-switcher"
        className="h-9 w-56"
        value={me.activeOrganizationId ?? ""}
        disabled={switchOrg.isPending}
        onChange={(event) => switchOrg.mutate(event.target.value)}
      >
        {me.memberships.map((m) => (
          <option key={m.organizationId} value={m.organizationId}>
            {m.kind === "personal" ? "Espacio personal" : m.name}
          </option>
        ))}
      </Select>
    </div>
  );
}

function VerificationBanner({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");
  const resend = async () => {
    const { error } = await authClient.sendVerificationEmail({ email, callbackURL: "/app?verified=1" });
    setState(error ? "error" : "sent");
  };
  return (
    <Alert variant="warning" className="rounded-none border-x-0 border-t-0">
      <MailWarning aria-hidden className="h-4 w-4" />
      <AlertDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>Verifica tu correo para crear organizaciones y aceptar invitaciones.</span>
        {state === "sent" ? (
          <span className="font-medium">Correo enviado a {email}.</span>
        ) : (
          <Button variant="link" size="sm" className="h-auto p-0" onClick={resend}>
            Reenviar correo de verificación
          </Button>
        )}
        {state === "error" && <span className="text-destructive">No se pudo enviar. Inténtalo en unos minutos.</span>}
      </AlertDescription>
    </Alert>
  );
}

export function AppShell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const active = me?.memberships.find((m) => m.isActive) ?? null;
  const { data: activeDetail } = useQuery({
    queryKey: queryKeys.organization(active?.organizationId ?? "none"),
    queryFn: () => api.organization(active!.organizationId),
    enabled: Boolean(active && me?.user.emailVerified),
  });
  const [signOutError, setSignOutError] = useState<string | null>(null);

  if (!me) return null;
  const items = navigationFor({
    platformRole: me.user.platformRole,
    activeOrganization: active ? { id: active.organizationId, kind: active.kind } : null,
    permissions: activeDetail?.permissions ?? [],
  });

  const signOut = async () => {
    const { error } = await authClient.signOut();
    if (error) return setSignOutError(errorMessage(error));
    queryClient.clear();
    await navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-card focus:p-2">
        Saltar al contenido
      </a>
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Brand />
          <div className="flex items-center gap-3">
            <OrganizationSwitcher />
            <span className="hidden text-sm text-muted-foreground md:inline">{me.user.name}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut aria-hidden /> Salir
            </Button>
          </div>
        </div>
        {!me.user.emailVerified && <VerificationBanner email={me.user.email} />}
      </header>
      <div className="container grid gap-6 py-6 md:grid-cols-[200px_1fr]">
        <nav aria-label="Navegación principal">
          <ul className="flex gap-1 overflow-x-auto md:flex-col">
            {items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  params={item.params}
                  activeOptions={{ exact: item.to === "/app" }}
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground [&.active]:bg-secondary [&.active]:font-medium [&.active]:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main id="main" className="min-w-0">
          {signOutError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{signOutError}</AlertDescription>
            </Alert>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
