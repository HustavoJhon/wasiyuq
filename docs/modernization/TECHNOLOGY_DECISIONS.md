# Decisiones tecnológicas (ADR preliminares)

**Fecha:** 2026-11-16  
**Estado:** propuestas basadas en auditoría; requieren validación/spikes y aprobación.

## ADR-001 — Reconstrucción completa fuera de Laravel
- **Contexto:** stack actual acoplado a Laravel/Inertia/Vue y con componentes específicos (Eloquent, SPs SQL Server, Fortify).
- **Decisión:** reconstruir aplicación con stack TypeScript moderno en lugar de migración incremental in-place del framework.
- **Motivación:** alineación al objetivo de modernización, simplificación de contratos API-first, preparación web/móvil, reducción de deuda estructural.
- **Consecuencias:** alto esfuerzo inicial, necesidad de paridad funcional estricta y migración de datos/archivos.

## ADR-002 — Monorepo Modular Monolith (no microservicios iniciales)
- **Contexto:** dominio integrado (adopciones depende de mascotas/organizaciones/usuarios) y equipo/tamaño de producto no justifica distribución temprana.
- **Decisión:** Turborepo + Bun workspaces con módulos/bounded contexts en un backend monolítico modular.
- **Consecuencias:** despliegue simple, límites lógicos claros; microservicios diferidos hasta evidencia.

## ADR-003 — Núcleo backend: TypeScript + Bun + Hono (preferido) + Drizzle + PostgreSQL
- **Contexto:** objetivo solicitado y necesidad de API tipada y migración desde SQL Server.
- **Decisión:** adoptar este núcleo; evaluar Elysia si aporta ventajas concretas en Bun sin sacrificar portabilidad.
- **Consecuencias:** reimplementación de ORM/reglas; migración de datos y reemplazo de SPs T-SQL.

## ADR-004 — Contratos compartidos con Zod
- **Contexto:** múltiples clientes (web, futura app móvil) y validaciones dispersas hoy.
- **Decisión:** esquemas Zod en paquete `contracts` como fuente de validación/tipos.
- **Consecuencias:** consistencia y reutilización; requiere disciplina para evitar duplicados.

## ADR-005 — Autenticación: selección condicionada a paridad
- **Contexto:** hoy existen Fortify, 2FA, passkeys, Google OAuth, equipos y super admin.
- **Decisión:** considerar Better Auth u alternativa TS solo tras spike que demuestre paridad (password, OAuth Google, 2FA, passkeys si aplica, sesiones, integración RBAC por equipos).
- **Consecuencias:** posible necesidad de combinar proveedor auth + capa de autorización propia.

## ADR-006 — Frontend web: React 19 + Vite + TanStack + shadcn/ui + Tailwind
- **Contexto:** objetivo de modernización y reuso de patrones UI.
- **Decisión:** reescribir UI (no portar Vue/Inertia).
- **Consecuencias:** costo de UI alto; oportunidad de mejorar UX, accesibilidad y consistencia.

## ADR-007 — Móvil: React Native + Expo (fase posterior, API compartida)
- **Contexto:** existe Capacitor hoy; se busca app móvil con lógica compartida.
- **Decisión:** priorizar web y API estable; introducir Expo/RN para flujos núcleo cuando haya paridad backend.
- **Consecuencias:** evita duplicar esfuerzos antes de estabilizar dominio.

## ADR-008 — Infra: Redis y S3-compatible solo por necesidad justificada
- **Contexto:** Redis/MinIO disponibles pero uso efectivo actual variable.
- **Decisión:** incluir S3-compatible si hay gestión de archivos en producción; Redis para cache/colas/rate-limit cuando métricas o requisitos lo justifiquen.
- **Consecuencias:** reduce complejidad inicial sin cerrar opciones.

## ADR-009 — Trazabilidad funcional obligatoria
- **Contexto:** riesgo de pérdida de funcionalidades/reglas implícitas.
- **Decisión:** mantener matriz de trazabilidad y criterios de aceptación por flujo antes de dar por completo cada módulo.
- **Consecuencias:** mayor esfuerzo documental inicial, menor riesgo de regresión funcional.

## ADR-010 — Autenticación: Better Auth (solo autenticación) + autorización propia (Fase 3, 2026-11-17)
- **Estado:** aceptada para Fase 3 (sustituye la condición de ADR-005 tras la evaluación siguiente).
- **Contexto (legacy verificado en historial git, commit `8b77756^`):** Fortify con registro, reset de contraseña, verificación de email, 2FA TOTP (con confirmación) y passkeys; Socialite Google con vinculación automática por email; rate limit de login 5/min por email+IP; equipos con `team_members.role` (8 roles) y 31 permisos (`TeamRole::permissions()`); super admin por flag **o email hardcodeado**.

### Evaluación

| Criterio | Better Auth 1.7 | Auth.js (`@auth/core` + `@hono/auth-js`) | Lucia v3 / Oslo + Arctic (propio) | SaaS (Clerk/Auth0/Supabase Auth) |
|---|---|---|---|---|
| Email/contraseña | Nativo (hash scrypt, políticas de longitud) | "Credentials" desaconsejado, sin sesiones BD con credentials | A implementar (hash, flujos) | Sí |
| Verificación de email | Nativo (token firmado, callbacks de envío) | Solo vía "magic link" | A implementar | Sí |
| Recuperación de contraseña | Nativo (token en tabla `verifications`, revoca sesiones opcional) | No para credentials | A implementar | Sí |
| Google OAuth + vinculación | Nativo, `accountLinking.trustedProviders` | Sí (fuerte) | Arctic (solo protocolo) | Sí |
| 2FA TOTP | Plugin `twoFactor` (TOTP, OTP, backup codes) | No | `@oslojs/otp` + implementación propia | Sí |
| Passkeys | Paquete `@better-auth/passkey` (SimpleWebAuthn) | Experimental | Implementación propia | Sí |
| Sesiones y revocación | Sesiones en BD, listar/revocar una/todas, expiración + `updateAge` | JWT o BD según adaptador | Patrón documentado | Sí (externo) |
| Multi-organización / RBAC | Plugin `organization` + `access` (roles owner/admin/member por defecto) | No | No | Parcial, con lock-in |
| Rate limiting | Integrado (memoria o BD), reglas por ruta | No | A implementar | Sí |
| Bun / Hono / Drizzle / PostgreSQL | Handler Fetch estándar; adaptador Drizzle oficial; PostgreSQL | Hono vía paquete de terceros; adaptador Drizzle | Total control | API HTTP externa |
| Datos y residencia | Tablas propias en nuestra BD | Tablas propias | Tablas propias | Datos de identidad en proveedor externo |
| Mantenimiento/seguridad | Proyecto muy activo (releases frecuentes); superficie grande | Activo; foco OAuth | Lucia v3 **deprecado** como librería (ahora guía); todo el riesgo es nuestro | Proveedor gestiona; coste y lock-in |
| Móvil (Expo) | Plugin `@better-auth/expo` (cookies seguras/SecureStore) y plugin `bearer` | Limitado | Propio | SDKs |

### Decisión
1. **Better Auth `1.7.15`** (versión fijada, publicada hace >2 semanas) se usa **solo para autenticación**: usuarios, cuentas (credenciales/OAuth), sesiones, verificaciones, rate limiting. Montado en Hono en `/api/auth/*`, adaptador Drizzle sobre PostgreSQL, telemetría desactivada.
2. **No se usa el plugin `organization` de Better Auth.** La organización, membresía, invitaciones y RBAC viven en `modules/organizations` con tablas propias, porque: (a) el modelo legacy tiene 8 roles y 31 permisos con semántica propia (equipo personal, único propietario, invitaciones ligadas a email, expiración 3 días); (b) el dominio no debe depender del proveedor de autenticación; (c) facilita la migración de datos legacy y el cambio futuro de proveedor.
3. El dominio (`modules/identity/src/domain`) no conoce Better Auth; la integración vive en `modules/identity/src/infrastructure`.
4. Autorización de plataforma (`platform_role`) separada de la autorización por organización. **Sin bypass por email.**

### Alcance Fase 3 vs paridad
| Capacidad legacy | Fase 3 | Nota |
|---|---|---|
| Registro + login email/contraseña | Implementado | |
| Verificación de email | Implementado | Requerida para operar organizaciones (equivale a middleware `verified`) |
| Recuperación de contraseña | Implementado | Revoca sesiones abiertas al restablecer |
| Google OAuth + vinculación por email | Implementado, **activado solo si hay credenciales** (`GOOGLE_CLIENT_ID/SECRET`) | No probado contra Google real (sin credenciales en este entorno) |
| Sesiones: listar/revocar | Implementado | Nuevo respecto a legacy |
| 2FA TOTP | **Diferido** | Soportado por la librería; se implementará completo (servidor + UI + recuperación) en una fase dedicada para no entregar una versión parcial |
| Passkeys | **Diferido** | Igual que 2FA; requiere decisión de RP ID/dominios |
| Rate limiting login | Implementado (configurable) | Almacenamiento en memoria por proceso: insuficiente con varias réplicas |

- **Consecuencias:** dependencia de una librería con ritmo de releases alto (fijar versiones y revisar changelog al actualizar); 2FA/passkeys quedan como brecha de paridad documentada.
- **Ajustes descubiertos al implementar (2026-11-17):** Better Auth devuelve el token de sesión en JSON (se elimina de todas las respuestas); desactiva las comprobaciones de origen/CSRF cuando detecta entorno de test (se fuerzan explícitamente); `/list-sessions` expone tokens (desactivado); requiere `drizzle-orm ≥ 0.45.2` (actualizado a 0.45.4 / drizzle-kit 0.31.11). Registro completo en `docs/technical/SECURITY_DECISIONS.md`.

## ADR-011 — RBAC por organización con catálogo centralizado (Fase 3)
- **Decisión:** se preservan los 8 roles y 31 permisos legacy (`TeamRole`/`TeamPermission`) con los mismos identificadores (`team:update`, `pets:view`, …) en un catálogo central; autorización **deny-by-default** evaluada en servidor por membresía activa en la organización del recurso.
- **Endurecimientos respecto al legacy (documentados como decisiones):** sin bypass por email; un actor no puede asignar ni invitar con un rol de nivel superior al suyo; el rol `owner` no es asignable ni invitable (el legacy permitía invitar como `owner` por `Rule::enum`); el propietario no puede ser eliminado ni degradado; los administradores de plataforma **no** heredan permisos dentro de organizaciones (el legacy los dejaba pasar) — actúan solo por endpoints de plataforma.
- **Consecuencias:** cambios de comportamiento visibles para super admins acostumbrados al bypass; requiere validación con negocio (ver decisiones pendientes).

## Decisiones pendientes de aprobación

1. Framework HTTP final: Hono vs Elysia.
2. ~~Proveedor de autenticación~~ → resuelto en ADR-010; pendiente: calendario de 2FA/passkeys.
3. Estrategia SEO/SSR para web pública (SPA, SSR, prerender).
4. Alcance MVP móvil y prioridades de flujos.
5. Política de retención/migración de archivos y documentos (actas/fotos).
6. Tratamiento de stored procedures: reemplazo total vs vistas/consultas equivalentes documentadas.
7. Modelo definitivo de roles de negocio (conciliación README vs implementación). 
