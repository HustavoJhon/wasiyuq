import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { organizationRoleLabels } from "@wasiyuq/validation";
import type { FormEvent } from "react";
import { FormField } from "../components/form-field";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { api, errorMessage, fieldErrors, meQuery } from "../lib/api";

export function OrganizationsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: me } = useQuery(meQuery);
  const create = useMutation({
    mutationFn: api.createOrganization,
    onSuccess: async ({ organization }) => {
      await queryClient.invalidateQueries();
      await navigate({ to: "/app/organizations/$orgId", params: { orgId: organization.id } });
    },
  });
  const switchOrg = useMutation({ mutationFn: api.switchOrganization, onSuccess: () => queryClient.invalidateQueries() });
  if (!me) return null;

  const onCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    create.mutate(String(new FormData(event.currentTarget).get("name") ?? ""));
  };
  const errors = fieldErrors(create.error);

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Organizaciones</h1>
      <Card>
        <CardHeader>
          <CardTitle>Mis membresías</CardTitle>
          <CardDescription>Puedes pertenecer a varias organizaciones con roles distintos.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y rounded-md border">
            {me.memberships.map((m) => (
              <li key={m.organizationId} className="flex flex-wrap items-center justify-between gap-3 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{m.kind === "personal" ? "Espacio personal" : m.name}</span>
                  <Badge variant="secondary">{organizationRoleLabels[m.role].label}</Badge>
                  {m.isActive && <Badge variant="success">activa</Badge>}
                </div>
                <div className="flex gap-2">
                  {!m.isActive && (
                    <Button size="sm" variant="outline" disabled={switchOrg.isPending} onClick={() => switchOrg.mutate(m.organizationId)}>
                      Activar
                    </Button>
                  )}
                  {m.kind === "organization" && (
                    <Button size="sm" variant="ghost" asChild>
                      <Link to="/app/organizations/$orgId" params={{ orgId: m.organizationId }}>
                        Abrir
                      </Link>
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Nueva organización</CardTitle>
          <CardDescription>Serás su propietario. Podrás invitar miembros y asignarles roles.</CardDescription>
        </CardHeader>
        <CardContent>
          {me.user.emailVerified ? (
            <form className="grid max-w-lg gap-4" onSubmit={onCreate}>
              {create.error && !errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage(create.error)}</AlertDescription>
                </Alert>
              )}
              <FormField label="Nombre de la organización" name="name" required minLength={2} maxLength={120} error={errors.name} />
              <div>
                <Button type="submit" disabled={create.isPending}>
                  {create.isPending ? "Creando…" : "Crear organización"}
                </Button>
              </div>
            </form>
          ) : (
            <Alert variant="warning">
              <AlertDescription>Verifica tu correo electrónico para crear organizaciones.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
