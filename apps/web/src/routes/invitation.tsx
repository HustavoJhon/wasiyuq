import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { organizationRoleLabels } from "@wasiyuq/validation";
import { AuthLayout } from "../components/auth-layout";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { api, errorMessage, queryKeys } from "../lib/api";

const statusMessage = {
  accepted: "Esta invitación ya fue aceptada.",
  cancelled: "Esta invitación fue cancelada.",
  expired: "Esta invitación ha expirado. Pide una nueva a la organización.",
} as const;

export function InvitationPage() {
  const { token } = useParams({ strict: false }) as { token: string };
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const preview = useQuery({ queryKey: queryKeys.invitation(token), queryFn: () => api.previewInvitation(token), retry: false });
  const accept = useMutation({
    mutationFn: () => api.acceptInvitation(token),
    onSuccess: async ({ organizationId }) => {
      await queryClient.invalidateQueries();
      await navigate({ to: "/app/organizations/$orgId", params: { orgId: organizationId } });
    },
  });

  const data = preview.data;
  return (
    <AuthLayout title="Invitación a una organización">
      <div className="grid gap-4">
        {preview.isPending && <p className="text-sm text-muted-foreground">Cargando invitación…</p>}
        {preview.error && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage(preview.error)}</AlertDescription>
          </Alert>
        )}
        {data && (
          <>
            <p>
              Te invitaron a <strong>{data.organizationName}</strong> con el rol <strong>{organizationRoleLabels[data.role].label}</strong>.
            </p>
            {data.status !== "pending" ? (
              <Alert variant="warning">
                <AlertDescription>{statusMessage[data.status]}</AlertDescription>
              </Alert>
            ) : !data.emailMatches ? (
              <Alert variant="destructive">
                <AlertDescription>Esta invitación fue enviada a otra dirección de correo. Inicia sesión con esa cuenta para aceptarla.</AlertDescription>
              </Alert>
            ) : (
              <>
                {accept.error && (
                  <Alert variant="destructive">
                    <AlertDescription>{errorMessage(accept.error)}</AlertDescription>
                  </Alert>
                )}
                <Button onClick={() => accept.mutate()} disabled={accept.isPending}>
                  {accept.isPending ? "Aceptando…" : "Aceptar invitación"}
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </AuthLayout>
  );
}
