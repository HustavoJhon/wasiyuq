# Envío de correo transaccional (Fase 3.1)

**Fecha:** 2026-11-17  
**Alcance:** verificación de cuenta, recuperación de contraseña, invitaciones a organizaciones y avisos de seguridad de la cuenta. No incluye correo de marketing ni notificaciones de adopciones (fases posteriores).

## 1. Decisión

| Aspecto | Decisión |
|---|---|
| Integración | **SMTP estándar** mediante un adaptador propio (`SmtpEmailSender`, librería `nodemailer` 10.3.1). El mismo código habla con Mailpit en desarrollo y con el proveedor en producción; cambiar de proveedor es solo configuración. |
| Proveedor recomendado para producción | **Resend** por SMTP (`smtp.resend.com`, TLS implícito en 465 o STARTTLS en 587; usuario `resend`, contraseña = API key). Motivos: alta sencilla (verificación de dominio por DNS: SPF + DKIM), plan gratuito suficiente para el volumen esperado de un sistema de adopciones (verificaciones, recuperaciones e invitaciones), SMTP soportado sin SDK propietario. |
| Alternativas válidas | Amazon SES (coste mínimo por volumen; requiere cuenta AWS y salir del sandbox), Postmark (excelente entregabilidad transaccional; de pago), Brevo (plan gratuito diario; servidores en la UE). Todas ofrecen SMTP y funcionan sin cambios de código. |
| Desarrollo | **Mailpit** (`infra/docker`, servicio `mailpit`): captura todo, no entrega nada. UI en <http://127.0.0.1:58025>. |
| Pendiente (negocio) | Titular de la cuenta del proveedor, dominio de envío verificado (p. ej. `no-reply@<dominio>`), registros SPF/DKIM/DMARC y confirmación de precios vigentes antes de contratar. **No se envió ningún correo real en esta fase.** |

Se descartó un SDK HTTP específico de proveedor (p. ej. la API REST de Resend) para no acoplar el código a un proveedor; si en el futuro hace falta (webhooks de rebote, etiquetas), se añade otro adaptador detrás del mismo puerto.

## 2. Arquitectura

```
Better Auth callbacks / OrganizationService
        │  dispatch(message)            (retorna inmediatamente, nunca lanza)
        ▼
EmailDispatcher (cola en proceso, reintentos, contadores de salud)
        │  send(message)
        ▼
EmailSender (puerto)  ──►  SmtpEmailSender (nodemailer)  ──►  Mailpit | proveedor SMTP
                       ├─►  ConsoleEmailSender (solo desarrollo)
                       └─►  MemoryEmailSender (solo tests)
```

| Pieza | Archivo |
|---|---|
| Puertos `EmailSender`, `EmailOutbox`, `EmailMessage` | `modules/identity/src/domain/ports.ts` |
| Plantillas (texto + HTML escapado, asunto en una sola línea) | `modules/identity/src/infrastructure/email/templates.ts` |
| Adaptador SMTP | `modules/identity/src/infrastructure/email/smtp-sender.ts` |
| Errores saneados y clasificación transitorio/permanente | `modules/identity/src/infrastructure/email/delivery-error.ts` |
| Cola con reintentos | `modules/identity/src/infrastructure/email/dispatcher.ts` |
| Configuración (Zod) | `modules/identity/src/infrastructure/email/mail-config.ts` (integrada en `loadAuthConfig`) |
| Composición, drenado al apagar, verificación SMTP al arrancar | `apps/api/src/services.ts`, `apps/api/src/server.ts` |

### Mensajes

| Tipo (`kind`) | Cuándo | Enlace |
|---|---|---|
| `email_verification` | Registro / reenvío | Verificación firmada, 24 h |
| `password_reset` | Solicitud de recuperación | Token de un solo uso, 1 h |
| `password_changed` | Tras restablecer la contraseña (todas las sesiones revocadas) | Inicio de sesión |
| `account_exists` | Alguien intenta registrarse con un correo que ya tiene cuenta | Inicio de sesión |
| `organization_invitation` | Invitación a una organización | Invitación, 3 días |

## 3. Comportamiento ante fallos

- **Envío en segundo plano:** los endpoints de autenticación no esperan al proveedor. El estado HTTP y el tiempo de respuesta son los mismos haya o no correo, así que un fallo del proveedor nunca se convierte en un 500 que revele si una cuenta existe.
- **Reintentos:** solo errores transitorios (conexión, timeouts, respuestas SMTP 4xx). Hasta `MAIL_MAX_ATTEMPTS` intentos (3 por defecto) con backoff exponencial desde `MAIL_RETRY_BASE_DELAY_MS` (1 s → 2 s, ±20 % de jitter). Los errores permanentes (5xx, autenticación) no se reintentan.
- **Logs:** `email sent`, `email delivery failed; retrying`, `email delivery failed` con `kind`, intentos, código (`ECONNECTION`, `EENVELOPE`…) y código SMTP. **Nunca** destinatario, asunto, cuerpo ni enlaces. El error del proveedor se descarta (puede contener la dirección o el enlace) y el logger interno de nodemailer está desactivado.
- **Salud:** `/ready` expone solo `checks.email.status` (`ok` / `degraded` tras 3 fallos consecutivos), informativo: un fallo de correo no saca la API de servicio. Los contadores (pendientes, enviados, fallidos, último error) están en `GET /api/v1/admin/email-health` (solo administradores de plataforma), porque en un endpoint público permitirían saber si una solicitud generó un correo.
- **Al arrancar** con `MAIL_TRANSPORT=smtp` se verifica la conexión y autenticación SMTP sin enviar nada; un fallo se registra (sin credenciales) y la API sigue funcionando.
- **Al apagar** (`SIGTERM`) se esperan hasta 10 s a que terminen los envíos en curso; lo que quede se registra como `shutdown with undelivered emails`.
- **Limitación aceptada:** la cola vive en memoria. Un correo pendiente se pierde si el proceso muere de forma abrupta; el usuario puede reenviar la verificación o pedir otra recuperación. Una cola persistente (tabla `email_outbox` o servicio de colas) queda para cuando haya varias instancias o mayor volumen.

## 4. Configuración (`.env.example`)

| Variable | Desarrollo (Mailpit) | Producción |
|---|---|---|
| `MAIL_TRANSPORT` | `smtp` | `smtp` (obligatorio; `console`/`memory` rechazados) |
| `MAIL_FROM_NAME` | `WASIYUQ` | Nombre visible |
| `MAIL_FROM_ADDRESS` | `no-reply@wasiyuq.test` | Dirección del dominio verificado (se rechazan `example.*`, `.test`, `localhost`) |
| `SMTP_HOST` | `127.0.0.1` | Host del proveedor (se rechazan `localhost`, `127.0.0.1`, `mailpit`…) |
| `SMTP_PORT` | `51025` | 465 (`tls`) o 587 (`starttls`); por defecto según `SMTP_SECURITY` |
| `SMTP_SECURITY` | `none` | `tls` o `starttls` (obligatorio; `none` rechazado) |
| `SMTP_USER` / `SMTP_PASSWORD` | vacíos | Credenciales del proveedor (obligatorias). **Nunca** en el repositorio: gestor de secretos del entorno. |
| `MAIL_MAX_ATTEMPTS` / `MAIL_RETRY_BASE_DELAY_MS` | 3 / 1000 | Igual o ajustado |

Con `NODE_ENV=production` y cualquiera de estas reglas incumplida, `loadAuthConfig` falla y **la API se niega a arrancar** (`api failed to start`, código de salida 1), listando las variables afectadas sin sus valores.

## 5. Desarrollo local

```bash
docker compose --env-file .env -f infra/docker/docker-compose.yml up -d   # postgres + mailpit
bun run --filter @wasiyuq/api dev                                          # API con MAIL_TRANSPORT=smtp → Mailpit
open http://127.0.0.1:58025                                                # bandeja de Mailpit
```

## 6. Pruebas

| Suite | Cubre |
|---|---|
| `modules/identity/src/__tests__/email-delivery.test.ts` | Clasificación de errores; reintentos con backoff; sin reintento en permanentes; agotamiento de intentos; `dispatch` nunca lanza; logs sin datos personales ni tokens; drenado; SMTP contra un servidor de prueba (éxito, 451, 550, servidor caído); ida y vuelta real con Mailpit (HTML escapado, enlace intacto) |
| `modules/identity/src/__tests__/mail-config.test.ts` | Configuración Zod de desarrollo y producción, credenciales nunca en errores, asuntos sin saltos de línea (inyección de cabeceras), HTML escapado |
| `modules/identity/src/__tests__/authentication.test.ts` | Fallo del proveedor sin cambiar respuestas ni filtrar tokens a logs; avisos `account_exists` y `password_changed` |
| `apps/web/e2e/*.spec.ts` | Verificación, recuperación e invitaciones con enlaces leídos de Mailpit |
