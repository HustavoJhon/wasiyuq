import { useQuery } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import { organizationRoleLabels } from "@wasiyuq/validation";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { api, meQuery, queryKeys } from "../lib/api";
import { visibleModules } from "../lib/navigation";

export function HomePage() {
  const search = useSearch({ strict: false }) as { verified?: string };
  const { data: me } = useQuery(meQuery);
  const active = me?.memberships.find((m) => m.isActive);
  const { data: detail } = useQuery({
    queryKey: queryKeys.organization(active?.organizationId ?? "none"),
    queryFn: () => api.organization(active!.organizationId),
    enabled: Boolean(active && me?.user.emailVerified),
  });
  if (!me) return null;
  const modules = visibleModules(detail?.permissions ?? []);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hola, {me.user.name}</h1>
        <p className="text-muted-foreground">Este es tu panel de WASIYUQ.</p>
      </div>
      {search.verified === "1" && me.user.emailVerified && (
        <Alert variant="success">
          <AlertDescription>Tu correo fue verificado correctamente.</AlertDescription>
        </Alert>
      )}
      {active && (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{active.kind === "personal" ? "Espacio personal" : active.name}</CardTitle>
              <Badge variant="secondary">{organizationRoleLabels[active.role].label}</Badge>
            </div>
            <CardDescription>
              {active.kind === "personal"
                ? "Tu espacio como adoptante. Para gestionar un albergue, crea una organización o acepta una invitación."
                : "Organización activa. Los módulos operativos se habilitarán en próximas fases."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {active.kind === "organization" && (
              <div>
                <h3 className="mb-2 text-sm font-medium">Módulos disponibles para tu rol</h3>
                {modules.length ? (
                  <ul className="flex flex-wrap gap-2">
                    {modules.map((m) => (
                      <li key={m.key}>
                        <Badge variant="outline">{m.label} · próximamente</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Tu rol no tiene acceso a módulos operativos.</p>
                )}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {active.kind === "organization" ? (
                <Button asChild variant="outline">
                  <Link to="/app/organizations/$orgId" params={{ orgId: active.organizationId }}>
                    Ver organización
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/app/organizations">Crear o elegir organización</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
