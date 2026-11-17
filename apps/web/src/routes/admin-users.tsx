import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { api, errorMessage, meQuery, queryKeys } from "../lib/api";

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const { data, error } = useQuery({ queryKey: queryKeys.adminUsers, queryFn: () => api.adminUsers(100, 0), retry: false });
  const setStatus = useMutation({
    mutationFn: (v: { id: string; status: "active" | "suspended" }) => api.setAccountStatus(v.id, v.status),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers }),
  });

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Administración de la plataforma</h1>
      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>Suspender una cuenta cierra todas sus sesiones de inmediato.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {(error || setStatus.error) && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage(error ?? setStatus.error)}</AlertDescription>
            </Alert>
          )}
          <ul className="divide-y rounded-md border">
            {data?.users.map((user) => (
              <li key={user.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                <div>
                  <div className="font-medium">
                    {user.name} {user.platformRole === "platform_admin" && <Badge>admin</Badge>}
                  </div>
                  <div className="text-muted-foreground">{user.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.status === "active" ? "success" : "destructive"}>{user.status === "active" ? "activa" : "suspendida"}</Badge>
                  {user.id !== me?.user.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={setStatus.isPending}
                      onClick={() => setStatus.mutate({ id: user.id, status: user.status === "active" ? "suspended" : "active" })}
                    >
                      {user.status === "active" ? "Suspender" : "Reactivar"}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
