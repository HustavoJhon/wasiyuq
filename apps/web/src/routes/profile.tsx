import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { FormField } from "../components/form-field";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { api, errorMessage, fieldErrors, meQuery, queryKeys } from "../lib/api";

const dateTime = new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" });

function ProfileForm() {
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const [saved, setSaved] = useState(false);
  const update = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: () => {
      setSaved(true);
      return queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
  if (!me) return null;
  const errors = fieldErrors(update.error);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(false);
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    update.mutate({ name: text("name"), dni: text("dni") || null, whatsapp: text("whatsapp") || null });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos personales</CardTitle>
        <CardDescription>
          {me.user.email}{" "}
          {me.user.emailVerified ? <Badge variant="success">verificado</Badge> : <Badge variant="warning">sin verificar</Badge>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid max-w-lg gap-4" onSubmit={onSubmit}>
          {saved && (
            <Alert variant="success">
              <AlertDescription>Perfil actualizado.</AlertDescription>
            </Alert>
          )}
          {update.error && !Object.keys(errors).length && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage(update.error)}</AlertDescription>
            </Alert>
          )}
          <FormField label="Nombre" name="name" defaultValue={me.user.name} required autoComplete="name" error={errors.name} />
          <FormField label="DNI" name="dni" defaultValue={me.user.dni ?? ""} inputMode="numeric" maxLength={8} hint="8 dígitos (opcional)" error={errors.dni} />
          <FormField label="WhatsApp" name="whatsapp" defaultValue={me.user.whatsapp ?? ""} inputMode="tel" autoComplete="tel" hint="Ej. +51987654321 (opcional)" error={errors.whatsapp} />
          <div>
            <Button type="submit" disabled={update.isPending}>
              {update.isPending ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Sessions() {
  const queryClient = useQueryClient();
  const { data, error } = useQuery({ queryKey: queryKeys.sessions, queryFn: () => api.sessions() });
  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
  const revoke = useMutation({ mutationFn: api.revokeSession, onSuccess: refresh });
  const revokeOthers = useMutation({ mutationFn: api.revokeOtherSessions, onSuccess: refresh });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sesiones activas</CardTitle>
        <CardDescription>Cierra las sesiones que no reconozcas.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage(error)}</AlertDescription>
          </Alert>
        )}
        <ul className="divide-y rounded-md border">
          {data?.sessions.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{s.userAgent ?? "Dispositivo desconocido"}</p>
                <p className="text-muted-foreground">
                  Inicio: {dateTime.format(new Date(s.createdAt))} · IP: {s.ipAddress ?? "—"}
                </p>
              </div>
              {s.current ? (
                <Badge variant="secondary">Esta sesión</Badge>
              ) : (
                <Button variant="outline" size="sm" disabled={revoke.isPending} onClick={() => revoke.mutate(s.id)}>
                  Cerrar
                </Button>
              )}
            </li>
          ))}
        </ul>
        <div>
          <Button variant="outline" disabled={revokeOthers.isPending || (data?.sessions.length ?? 0) < 2} onClick={() => revokeOthers.mutate()}>
            Cerrar las demás sesiones
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfilePage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Mi perfil</h1>
      <ProfileForm />
      <Sessions />
    </div>
  );
}
