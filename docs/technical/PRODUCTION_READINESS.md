# Preparación para producción (Fase 3.1)

**Fecha:** 2026-11-17  
**Estado:** **no desplegado.** Este documento recoge lo que la aplicación exige para arrancar en producción, cómo se opera y qué bloquea todavía un despliegue. Ninguna fase hasta ahora desplegó ni publicó nada.

## 1. Guardas de arranque (`NODE_ENV=production`)

La API **termina con código 1** (`api failed to start`), registrando solo nombres de variables y reglas, si:

| Condición | Origen |
|---|---|
| `DATABASE_URL` inválida o no PostgreSQL | `loadDatabaseConfig` |
| `AUTH_SECRET` < 32 caracteres; `AUTH_BASE_URL`/`WEB_APP_URL` sin `https://` | `loadAuthConfig` |
| `AUTH_RATE_LIMIT=off` | `loadAuthConfig` |
| Correo incompleto: transporte distinto de `smtp`, `SMTP_SECURITY=none`, host local, sin credenciales, remitente de dominio de prueba | `mailConfigIssues` (ver `EMAIL_DELIVERY.md` §4) |
| Google a medias (solo id o solo secreto) | `loadAuthConfig` |

En desarrollo, una configuración inválida deja la API viva (para `/health`) con los endpoints de identidad desactivados y lo registra como error.

Las migraciones siguen bloqueadas con `NODE_ENV=production` (`packages/db/src/safety.ts`, sin cambios): aplicar el esquema en producción requerirá un procedimiento y un rol de migración propios.

## 2. Variables de producción

| Variable | Requisito |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | PostgreSQL gestionado con TLS; usuario de aplicación sin permisos DDL |
| `AUTH_SECRET` | ≥ 32 caracteres aleatorios (`openssl rand -base64 48`), desde un gestor de secretos; rotarlo invalida sesiones |
| `AUTH_BASE_URL`, `WEB_APP_URL` | `https://` del dominio público (web y `/api` en el mismo origen) |
| `AUTH_TRUST_PROXY` | `true` solo detrás de **un** proxy inverso que añade `X-Forwarded-For` |
| `AUTH_RATE_LIMIT` | `on` |
| `AUTH_PASSWORD_HASH_CONCURRENCY` | Opcional; por defecto la mitad de las CPU (32 MiB por hash) |
| `MAIL_*`, `SMTP_*` | Ver `EMAIL_DELIVERY.md` |
| `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` | Opcional; callback `${AUTH_BASE_URL}/api/auth/callback/google` |
| `LOG_LEVEL` | `info` (por defecto) |

## 3. Operación

| Aspecto | Comportamiento |
|---|---|
| Logs | JSON en una línea por evento (`stdout`; `warn`/`error` a `stderr`), con `requestId`, método, ruta redactada, estado y duración. Sin secretos, tokens, emails de Better Auth ni contenido de correos |
| Liveness | `GET /health`: no toca la BD |
| Readiness | `GET /ready`: 200 si PostgreSQL responde y la base es la esperada; 503 si no, o durante el apagado. No expone el estado del correo (ver `EMAIL_DELIVERY.md` §3) |
| Salud del correo | `GET /api/v1/admin/email-health` (administradores de plataforma) |
| Apagado (`SIGTERM`/`SIGINT`) | Readiness pasa a `SHUTTING_DOWN`, deja de aceptar conexiones, termina las peticiones en curso, espera hasta 10 s a los correos pendientes y cierra el pool de BD |
| Errores no controlados | Rechazos de promesas sin manejar: se registran (solo el tipo). Excepciones no capturadas: se registran y el proceso sale con 1 para que el orquestador lo reinicie |
| Arranque | Verifica la BD y, con SMTP, la conexión al proveedor; ambos fallos se registran y la API sigue viva, mientras que readiness refleja el estado de la BD |

No se añadió un stack de observabilidad (métricas, trazas): los logs estructurados y los endpoints de salud cubren las necesidades actuales. Cuando exista el entorno de producción, conectar los logs al agregador que se elija.

## 4. Bloqueos pendientes antes de desplegar

| # | Bloqueo | Tipo |
|---|---|---|
| 1 | Elegir el titular de la cuenta del proveedor de correo, verificar el dominio de envío (SPF, DKIM, DMARC) y cargar las credenciales en el gestor de secretos | Negocio + infraestructura |
| 2 | Definir la infraestructura: hosting de API y web en un único origen HTTPS, PostgreSQL gestionado, gestor de secretos, backups | Infraestructura |
| 3 | Procedimiento de migraciones en producción (rol separado; las salvaguardas actuales lo bloquean a propósito) | Técnica |
| 4 | Rate limit de `/api/v1` y cola de correo en memoria: válidos con **una** instancia; mover a almacenamiento compartido antes de escalar horizontalmente | Técnica |
| 5 | Decidir 2FA/passkeys (diferidos) y la política de verificación obligatoria antes del primer inicio de sesión | Negocio |
| 6 | Avisos de dependencias de herramientas (no de runtime de API/web): ver `SECURITY_DECISIONS.md` | Mantenimiento |
| 7 | Decisiones de negocio de Fase 3: transferir la propiedad, abandonar una organización, regenerar el slug al renombrar, alcance del administrador de plataforma | Negocio |
