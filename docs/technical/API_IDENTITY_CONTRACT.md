# Contrato API: identidad y organizaciones — WASIYUQ 2.0 (Fase 3)

**Fecha:** 2026-11-17  
**Contratos tipados:** `packages/validation` (Zod; compartidos por API, web y móvil). **Cliente:** `packages/api-client` (valida cada respuesta).

## 1. Convenciones

- Autenticación por cookie `wasiyuq.session_token` (httpOnly). Mismo origen.
- Mutaciones en `/api/v1/*` exigen `Origin` confiable (CSRF).
- IDs de ruta: UUID; cualquier otro valor → 404 sin tocar la BD.
- Cuerpos JSON validados con Zod en modo estricto (campos desconocidos → 400).
- Errores de `/api/v1` y rutas públicas:

```json
{ "error": { "code": "VALIDATION_FAILED", "message": "Datos inválidos", "issues": [{ "path": "name", "message": "…" }] } }
```

| Código | HTTP | Cuándo |
|---|---|---|
| `VALIDATION_FAILED` | 400 | Cuerpo inválido o regla de validación de dominio (`name_mismatch`, `owner_not_assignable`) |
| `UNAUTHENTICATED` | 401 | Sin sesión, sesión expirada/revocada o cuenta suspendida |
| `EMAIL_NOT_VERIFIED` | 403 | Funciones de organización sin email verificado |
| `FORBIDDEN` | 403 | Falta permiso, escalada de rol, objetivo protegido, email de invitación distinto, acción de plataforma sin rol |
| `INVALID_ORIGIN` | 403 | CSRF |
| `NOT_FOUND` | 404 | Recurso inexistente **o** organización de la que no eres miembro |
| `CONFLICT` | 409 | DNI duplicado, ya miembro, invitación pendiente/aceptada/expirada/cancelada |
| `RATE_LIMITED` | 429 | Límite de `/api/v1` (cabecera `Retry-After`) |
| `INTERNAL_ERROR` | 500 | Error inesperado (mensaje genérico; el detalle solo en logs, sin SQL ni parámetros) |

`/api/auth/*` usa el formato de Better Auth (`{ "code", "message" }`), sin tokens de sesión en el cuerpo.

## 2. Autenticación (`/api/auth`, Better Auth)

| Método y ruta | Uso |
|---|---|
| `POST /api/auth/sign-up/email` | `{name, email, password, callbackURL?}` → 200 `{ user }` **sin cookie de sesión**. Email nuevo: crea la cuenta y envía la verificación. Email existente: misma respuesta, no cambia nada y avisa al titular por correo (Fase 3.1, sin enumeración) |
| `POST /api/auth/sign-in/email` | `{email, password}` → 200 / 401 genérico / 403 suspendida / 429 |
| `POST /api/auth/sign-out` | Revoca la sesión actual |
| `GET /api/auth/get-session` | Sesión actual (sin token) |
| `GET /api/auth/verify-email?token&callbackURL` | Verifica y redirige |
| `POST /api/auth/send-verification-email` | Reenvía verificación |
| `POST /api/auth/request-password-reset` | `{email, redirectTo}` → siempre 200 con el mismo cuerpo (sin enumeración); el correo sale en segundo plano |
| `GET /api/auth/reset-password/:token?callbackURL` | Redirige a la web con `?token=` |
| `POST /api/auth/reset-password` | `{token, newPassword}` → revoca todas las sesiones y envía el aviso "tu contraseña cambió"; token caducado o reutilizado → 400 |
| `POST /api/auth/sign-in/social` · `GET /api/auth/callback/google` | Google OAuth (solo si está configurado) |

## 3. Público

| Método y ruta | Respuesta |
|---|---|
| `GET /health` | Liveness |
| `GET /ready` | Readiness: 200/503 según la BD; `checks.email.status` (`ok`/`degraded`) es informativo y nunca incluye contadores |
| `GET /api/public/auth-providers` | `{ emailPassword: true, google: boolean }` |

## 4. `/api/v1` (requiere sesión)

| Método y ruta | Requisito | Respuesta |
|---|---|---|
| `GET /me` | sesión | `{ user, memberships[], activeOrganizationId }` |
| `PATCH /me` | sesión | `{name?, dni?, whatsapp?}` → `{ user }` |
| `GET /me/sessions` | sesión | `{ sessions[] }` (id, current, userAgent, ipAddress, fechas) |
| `DELETE /me/sessions/:sessionId` | sesión propia | 204 / 404 |
| `POST /me/sessions/revoke-others` | sesión | `{ revoked }` |
| `GET /roles` | sesión | Catálogo: rol, etiqueta, nivel, asignable, permisos |
| `GET /organizations` | email verificado | Membresías + contexto activo |
| `POST /organizations` | verificado | `{name}` → 201 `{ organization }` |
| `GET /organizations/:orgId` | miembro | `{ organization, role, permissions[] }` |
| `PATCH /organizations/:orgId` | `team:update` | Perfil (nombre, bio, web, teléfono, dirección, ciudad, región) |
| `DELETE /organizations/:orgId` | `team:delete`, no personal | `{confirmName}` → 204 (archiva) |
| `POST /organizations/:orgId/switch` | miembro | `{ activeOrganizationId }` |
| `GET /organizations/:orgId/members` | miembro | `{ members[] }` |
| `PATCH /organizations/:orgId/members/:userId` | `member:update` + reglas | `{role}` → 204 |
| `DELETE /organizations/:orgId/members/:userId` | `member:remove` + reglas | 204 |
| `GET /organizations/:orgId/invitations` | `invitation:create` o `invitation:cancel` | Pendientes |
| `POST /organizations/:orgId/invitations` | `invitation:create`, rol ≤ propio | `{email, role}` → 201 `{ invitation }` (sin token) |
| `DELETE /organizations/:orgId/invitations/:invitationId` | `invitation:cancel` | 204 |
| `GET /invitations/:token` | verificado | `{ organizationName, role, emailMatches, expiresAt, status }` |
| `POST /invitations/:token/accept` | verificado, email coincide | `{ organizationId }` |
| `GET /admin/users?limit&offset` | `platform_admin` | `{ users[], limit, offset }` |
| `PATCH /admin/users/:userId/status` | `platform_admin`, no a sí mismo | `{status}` → `{ user }` (suspender revoca sesiones) |
| `GET /admin/email-health` | `platform_admin` | `{ email: { pending, sent, failed, consecutiveFailures, lastSuccessAt, lastFailureAt, lastErrorCode } }` (sin destinatarios ni contenido) |

## 5. Garantías verificadas por tests

`apps/api/src/__tests__/identity-api.test.ts` (PostgreSQL de test): 401 sin sesión; respuestas sin contraseñas/hashes/tokens; verificación obligatoria; validación y campos desconocidos; aislamiento entre organizaciones (todas las rutas → 404); permisos por rol; escaladas; aceptación ligada al email; tokens ausentes de respuestas y logs; CSRF; sesiones; logout; administración sin bypass; suspensión; recuperación de contraseña; archivado; email-health solo para admins; `/ready` sin contadores.

Fase 3.1: `auth-concurrency.test.ts` (12 registros e inicios de sesión concurrentes correctos con `/health` < 150 ms p95) y `security-regressions.test.ts` (IP de rate limit no falseable a través del servidor real, sin CORS, guardas de arranque en producción).
