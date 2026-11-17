import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { organizationRoleLabels, type Member, type OrganizationPermission, type OrganizationRole } from "@wasiyuq/validation";
import { useState, type FormEvent } from "react";
import { FormField } from "../components/form-field";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, Textarea } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { api, errorMessage, fieldErrors, meQuery, queryKeys, rolesQuery } from "../lib/api";

const date = new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" });

function useRoleLevels() {
  const { data } = useQuery(rolesQuery);
  const levels = Object.fromEntries((data?.roles ?? []).map((r) => [r.role, r.level])) as Record<OrganizationRole, number>;
  const assignable = (data?.roles ?? []).filter((r) => r.assignable);
  return { levels, assignable };
}

function ProfileSection({ orgId, can }: { orgId: string; can: (p: OrganizationPermission) => boolean }) {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: queryKeys.organization(orgId), queryFn: () => api.organization(orgId) });
  const [saved, setSaved] = useState(false);
  const update = useMutation({
    mutationFn: (changes: Parameters<typeof api.updateOrganization>[1]) => api.updateOrganization(orgId, changes),
    onSuccess: () => {
      setSaved(true);
      return queryClient.invalidateQueries();
    },
  });
  if (!data) return null;
  const org = data.organization;
  const editable = can("team:update");
  const errors = fieldErrors(update.error);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(false);
    const form = new FormData(event.currentTarget);
    const v = (k: string) => String(form.get(k) ?? "").trim();
    update.mutate({ name: v("name"), bio: v("bio"), website: v("website") || null, phone: v("phone"), address: v("address"), city: v("city"), region: v("region") });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de la organización</CardTitle>
        <CardDescription>
          Identificador público: <code>{org.slug}</code>
          {!editable && " · Solo lectura para tu rol"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid max-w-2xl gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          {saved && (
            <Alert variant="success" className="md:col-span-2">
              <AlertDescription>Cambios guardados.</AlertDescription>
            </Alert>
          )}
          {update.error && !Object.keys(errors).length && (
            <Alert variant="destructive" className="md:col-span-2">
              <AlertDescription>{errorMessage(update.error)}</AlertDescription>
            </Alert>
          )}
          <fieldset disabled={!editable || update.isPending} className="contents">
            <div className="md:col-span-2">
              <FormField label="Nombre" name="name" defaultValue={org.name} required error={errors.name} />
            </div>
            <div className="grid gap-1.5 md:col-span-2">
              <Label htmlFor="bio">Descripción</Label>
              <Textarea id="bio" name="bio" defaultValue={org.bio ?? ""} maxLength={2000} />
            </div>
            <FormField label="Sitio web" name="website" type="url" defaultValue={org.website ?? ""} error={errors.website} />
            <FormField label="Teléfono" name="phone" defaultValue={org.phone ?? ""} error={errors.phone} />
            <FormField label="Dirección" name="address" defaultValue={org.address ?? ""} />
            <FormField label="Ciudad" name="city" defaultValue={org.city ?? ""} />
            <FormField label="Región" name="region" defaultValue={org.region ?? ""} />
            {editable && (
              <div className="md:col-span-2">
                <Button type="submit">{update.isPending ? "Guardando…" : "Guardar cambios"}</Button>
              </div>
            )}
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}

function MembersSection({ orgId, myRole, can }: { orgId: string; myRole: OrganizationRole; can: (p: OrganizationPermission) => boolean }) {
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const { levels, assignable } = useRoleLevels();
  const { data, error } = useQuery({ queryKey: queryKeys.members(orgId), queryFn: () => api.members(orgId) });
  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.members(orgId) });
  const changeRole = useMutation({ mutationFn: (v: { userId: string; role: OrganizationRole }) => api.changeMemberRole(orgId, v.userId, v.role), onSettled: refresh });
  const remove = useMutation({ mutationFn: (userId: string) => api.removeMember(orgId, userId), onSettled: refresh });

  // Mirrors the server policy for display only; the API re-checks every change.
  const manageable = (member: Member) =>
    member.role !== "owner" && member.userId !== me?.user.id && (levels[member.role] ?? 99) <= (levels[myRole] ?? 0);
  const grantable = assignable.filter((r) => r.level <= (levels[myRole] ?? 0));
  const actionError = changeRole.error ?? remove.error;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Miembros</CardTitle>
        <CardDescription>Roles y acceso de las personas en esta organización.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {(error || actionError) && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage(error ?? actionError)}</AlertDescription>
          </Alert>
        )}
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <caption className="sr-only">Miembros de la organización</caption>
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                <th scope="col" className="p-3 font-medium">Nombre</th>
                <th scope="col" className="p-3 font-medium">Rol</th>
                <th scope="col" className="p-3 font-medium">Desde</th>
                <th scope="col" className="p-3"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.members.map((member) => (
                <tr key={member.userId}>
                  <td className="p-3">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-muted-foreground">{member.email}</div>
                  </td>
                  <td className="p-3">
                    {can("member:update") && manageable(member) ? (
                      <Select
                        aria-label={`Rol de ${member.name}`}
                        className="h-9 w-52"
                        value={member.role}
                        disabled={changeRole.isPending}
                        onChange={(e) => changeRole.mutate({ userId: member.userId, role: e.target.value as OrganizationRole })}
                      >
                        {grantable.map((r) => (
                          <option key={r.role} value={r.role}>{r.label}</option>
                        ))}
                      </Select>
                    ) : (
                      <Badge variant={member.role === "owner" ? "default" : "secondary"}>{organizationRoleLabels[member.role].label}</Badge>
                    )}
                  </td>
                  <td className="p-3 text-muted-foreground">{date.format(new Date(member.joinedAt))}</td>
                  <td className="p-3 text-right">
                    {can("member:remove") && manageable(member) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={remove.isPending}
                        onClick={() => window.confirm(`¿Quitar a ${member.name} de la organización?`) && remove.mutate(member.userId)}
                      >
                        Quitar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function InvitationsSection({ orgId, myRole, can }: { orgId: string; myRole: OrganizationRole; can: (p: OrganizationPermission) => boolean }) {
  const queryClient = useQueryClient();
  const { levels, assignable } = useRoleLevels();
  const { data } = useQuery({ queryKey: queryKeys.invitations(orgId), queryFn: () => api.invitations(orgId) });
  const [sentTo, setSentTo] = useState<string | null>(null);
  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.invitations(orgId) });
  const invite = useMutation({
    mutationFn: (input: { email: string; role: OrganizationRole }) => api.invite(orgId, input),
    onSuccess: ({ invitation }) => {
      setSentTo(invitation.email);
      return refresh();
    },
  });
  const cancel = useMutation({ mutationFn: (id: string) => api.cancelInvitation(orgId, id), onSettled: refresh });
  const grantable = assignable.filter((r) => r.level <= (levels[myRole] ?? 0));
  const errors = fieldErrors(invite.error);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSentTo(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    invite.mutate(
      { email: String(data.get("email") ?? ""), role: String(data.get("role")) as OrganizationRole },
      { onSuccess: () => form.reset() },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitaciones</CardTitle>
        <CardDescription>Las invitaciones caducan a los 3 días y solo puede aceptarlas el correo invitado.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {can("invitation:create") && (
          <form className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end" onSubmit={onSubmit}>
            <FormField label="Correo electrónico" name="email" type="email" required error={errors.email} />
            <div className="grid gap-1.5">
              <Label htmlFor="invite-role">Rol</Label>
              <Select id="invite-role" name="role" defaultValue="member">
                {grantable.map((r) => (
                  <option key={r.role} value={r.role}>{r.label}</option>
                ))}
              </Select>
            </div>
            <Button type="submit" disabled={invite.isPending}>
              {invite.isPending ? "Enviando…" : "Invitar"}
            </Button>
          </form>
        )}
        {sentTo && (
          <Alert variant="success">
            <AlertDescription>Invitación enviada a {sentTo}.</AlertDescription>
          </Alert>
        )}
        {(invite.error && !Object.keys(errors).length) || cancel.error ? (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage(invite.error ?? cancel.error)}</AlertDescription>
          </Alert>
        ) : null}
        {data && data.invitations.length === 0 && <p className="text-sm text-muted-foreground">No hay invitaciones pendientes.</p>}
        {data && data.invitations.length > 0 && (
          <ul className="divide-y rounded-md border">
            {data.invitations.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                <div>
                  <span className="font-medium">{inv.email}</span> · {organizationRoleLabels[inv.role].label}
                  <div className="text-muted-foreground">Caduca el {date.format(new Date(inv.expiresAt))}</div>
                </div>
                {can("invitation:cancel") && (
                  <Button variant="ghost" size="sm" disabled={cancel.isPending} onClick={() => cancel.mutate(inv.id)}>
                    Cancelar
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function DangerZone({ orgId, name }: { orgId: string; name: string }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState("");
  const archive = useMutation({
    mutationFn: () => api.archiveOrganization(orgId, confirm),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      await navigate({ to: "/app/organizations" });
    },
  });
  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle>Eliminar organización</CardTitle>
        <CardDescription>
          Se archivará: sus miembros perderán el acceso y las invitaciones pendientes se cancelarán. Escribe <strong>{name}</strong> para confirmar.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid max-w-lg gap-3">
        {archive.error && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage(archive.error)}</AlertDescription>
          </Alert>
        )}
        <FormField label="Nombre de la organización" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" />
        <div>
          <Button variant="destructive" disabled={confirm !== name || archive.isPending} onClick={() => archive.mutate()}>
            Eliminar organización
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function OrganizationSettingsPage() {
  const { orgId } = useParams({ strict: false }) as { orgId: string };
  const { data, error, isPending } = useQuery({ queryKey: queryKeys.organization(orgId), queryFn: () => api.organization(orgId), retry: false });
  if (isPending) return <p className="text-sm text-muted-foreground">Cargando…</p>;
  if (error || !data)
    return (
      <Alert variant="destructive">
        <AlertDescription>{errorMessage(error, "Organización no encontrada")}</AlertDescription>
      </Alert>
    );
  const can = (permission: OrganizationPermission) => data.permissions.includes(permission);
  const showInvitations = can("invitation:create") || can("invitation:cancel");

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{data.organization.name}</h1>
        <Badge variant="secondary">{organizationRoleLabels[data.role].label}</Badge>
      </div>
      <ProfileSection orgId={orgId} can={can} />
      {data.organization.kind === "organization" && <MembersSection orgId={orgId} myRole={data.role} can={can} />}
      {data.organization.kind === "organization" && showInvitations && <InvitationsSection orgId={orgId} myRole={data.role} can={can} />}
      {data.organization.kind === "organization" && can("team:delete") && <DangerZone orgId={orgId} name={data.organization.name} />}
    </div>
  );
}
