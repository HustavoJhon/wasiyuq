import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AuthLayout } from "../components/auth-layout";
import { FormField } from "../components/form-field";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { providersQuery, queryKeys } from "../lib/api";
import { authClient, authErrorMessage, safeRedirect } from "../lib/auth-client";

const formValue = (form: HTMLFormElement, name: string) => String(new FormData(form).get(name) ?? "");

function GoogleButton({ redirect }: { redirect: string }) {
  const { data } = useQuery(providersQuery);
  if (!data?.google) return null;
  return (
    <>
      <div className="relative my-2 text-center text-xs text-muted-foreground">
        <span className="bg-card px-2">o</span>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => authClient.signIn.social({ provider: "google", callbackURL: redirect, errorCallbackURL: "/login?error=oauth" })}
      >
        Continuar con Google
      </Button>
    </>
  );
}

export function LoginPage() {
  const search = useSearch({ strict: false }) as { redirect?: string; reset?: string; error?: string };
  const redirect = safeRedirect(search.redirect);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(search.error === "oauth" ? "No se pudo iniciar sesión con Google" : null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = event.currentTarget;
    const { error } = await authClient.signIn.email({ email: formValue(form, "email"), password: formValue(form, "password") });
    setPending(false);
    if (error) return setError(authErrorMessage(error));
    await queryClient.invalidateQueries({ queryKey: queryKeys.me });
    await navigate({ to: redirect });
  };

  return (
    <AuthLayout
      title="Iniciar sesión"
      description="Accede a tu cuenta de WASIYUQ"
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link to="/register" search={{ redirect }} className="font-medium text-primary hover:underline">
            Regístrate
          </Link>
        </>
      }
    >
      <form className="grid gap-4" onSubmit={onSubmit} noValidate={false}>
        {search.reset === "1" && (
          <Alert variant="success">
            <AlertDescription>Contraseña actualizada. Inicia sesión con tu nueva contraseña.</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField label="Correo electrónico" name="email" type="email" autoComplete="email" required />
        <FormField label="Contraseña" name="password" type="password" autoComplete="current-password" required />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Ingresando…" : "Ingresar"}
        </Button>
        <GoogleButton redirect={redirect} />
      </form>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const search = useSearch({ strict: false }) as { redirect?: string };
  const redirect = safeRedirect(search.redirect);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = formValue(form, "name").trim();
    const email = formValue(form, "email").trim();
    const password = formValue(form, "password");
    const next: Record<string, string> = {};
    if (name.length < 2) next.name = "Ingresa tu nombre";
    if (password.length < 8) next.password = "Mínimo 8 caracteres";
    if (password !== formValue(form, "confirm")) next.confirm = "Las contraseñas no coinciden";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true);
    setError(null);
    const { error } = await authClient.signUp.email({ name, email, password, callbackURL: "/app?verified=1" });
    setPending(false);
    if (error) return setError(authErrorMessage(error));
    // Sign-up never opens a session and answers the same way for new and existing emails (no enumeration),
    // so the next step is always: check the inbox, then sign in.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AuthLayout title="Revisa tu correo" description="Tu registro fue recibido">
        <div className="grid gap-4">
          <Alert variant="success">
            <CheckCircle2 aria-hidden className="h-4 w-4" />
            <AlertDescription>
              Te enviamos un correo con los siguientes pasos. Verifica tu dirección con el enlace del mensaje (válido 24 horas) y luego
              inicia sesión.
            </AlertDescription>
          </Alert>
          <Button asChild>
            <Link to="/login" search={{ redirect }}>
              Ir a iniciar sesión
            </Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Crear cuenta"
      description="Te enviaremos un correo para verificar tu dirección"
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" search={{ redirect }} className="font-medium text-primary hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form className="grid gap-4" onSubmit={onSubmit}>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField label="Nombre completo" name="name" autoComplete="name" required error={errors.name} />
        <FormField label="Correo electrónico" name="email" type="email" autoComplete="email" required />
        <FormField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={128}
          hint="Mínimo 8 caracteres"
          error={errors.password}
        />
        <FormField label="Confirmar contraseña" name="confirm" type="password" autoComplete="new-password" required error={errors.confirm} />
        <Button type="submit" disabled={pending}>
          {pending ? "Creando cuenta…" : "Crear cuenta"}
        </Button>
        <GoogleButton redirect={redirect} />
      </form>
    </AuthLayout>
  );
}

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    const { error } = await authClient.requestPasswordReset({
      email: formValue(event.currentTarget, "email"),
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setPending(false);
    if (error) return setError(authErrorMessage(error));
    setSent(true);
  };

  return (
    <AuthLayout title="Recuperar contraseña" description="Te enviaremos un enlace para crear una nueva contraseña" footer={<Link to="/login" className="text-primary hover:underline">Volver a iniciar sesión</Link>}>
      {sent ? (
        <Alert variant="success">
          <CheckCircle2 aria-hidden className="h-4 w-4" />
          <AlertDescription>Si existe una cuenta con ese correo, recibirás un enlace válido durante 1 hora.</AlertDescription>
        </Alert>
      ) : (
        <form className="grid gap-4" onSubmit={onSubmit}>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <FormField label="Correo electrónico" name="email" type="email" autoComplete="email" required />
          <Button type="submit" disabled={pending}>
            {pending ? "Enviando…" : "Enviar enlace"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  const search = useSearch({ strict: false }) as { token?: string; error?: string };
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(search.error ? "El enlace no es válido o ha caducado" : null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const password = formValue(form, "password");
    const next: Record<string, string> = {};
    if (password.length < 8) next.password = "Mínimo 8 caracteres";
    if (password !== formValue(form, "confirm")) next.confirm = "Las contraseñas no coinciden";
    setErrors(next);
    if (Object.keys(next).length || !search.token) return;
    setPending(true);
    const { error } = await authClient.resetPassword({ newPassword: password, token: search.token });
    setPending(false);
    if (error) return setError(authErrorMessage(error));
    await navigate({ to: "/login", search: { reset: "1" } });
  };

  return (
    <AuthLayout title="Nueva contraseña" description="Al cambiarla se cerrarán tus sesiones abiertas">
      {!search.token && !error ? (
        <Alert variant="destructive">
          <AlertDescription>Falta el enlace de recuperación. Solicita uno nuevo.</AlertDescription>
        </Alert>
      ) : (
        <form className="grid gap-4" onSubmit={onSubmit}>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error}{" "}
                <Link to="/forgot-password" className="font-medium underline">
                  Solicitar otro enlace
                </Link>
              </AlertDescription>
            </Alert>
          )}
          <FormField label="Nueva contraseña" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} error={errors.password} />
          <FormField label="Confirmar contraseña" name="confirm" type="password" autoComplete="new-password" required error={errors.confirm} />
          <Button type="submit" disabled={pending || !search.token}>
            {pending ? "Guardando…" : "Guardar contraseña"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
