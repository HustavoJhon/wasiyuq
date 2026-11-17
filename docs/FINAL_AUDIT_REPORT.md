# Informe final de auditoría y transición — WASIYUQ

**Fecha:** 2026-11-17 (Fase 0 documental + Fase 1 fundación/limpieza + Fase 2 fundación de BD + Fase 3 identidad y organizaciones)  
**Rama:** `dev` (documentación Fase 0: `2665584`, `86eac2d`, `1110843`, `161b3c7`; Fase 1: múltiples commits hasta la verificación/fundación 2.0)  
**Alcance:**  
- **Fase 0:** auditoría estática e ingeniería inversa documental (sin modificar código de aplicación, dependencias, migraciones ni BD).  
- **Fase 1:** retiro del runtime legacy Laravel/PHP/Composer/Inertia/Vue del proyecto activo y preparación del monorepo Bun/TypeScript. **`docs/**` conservado**, referencias legacy de BD conservadas (`database/factories|seeders|stored-procedures`; `database/migrations/**` Laravel retirado en limpieza adicional), respaldos/referencias en `legacy-assets/**`. **No se modificaron ni destruyeron bases de datos originales. No se implementaron módulos de negocio ni se realizó deploy.**  
- **Migraciones 2.0:** `packages/db/migrations/` (Drizzle ORM + PostgreSQL; infraestructura operativa con salvaguardas desde Fase 2; sin esquema de negocio).  
- **Fase 2:** fundación de base de datos (PostgreSQL + Drizzle + readiness API). Ver sección 15 y `docs/technical/DATABASE_FOUNDATION.md`.  
**Registro operativo:** `docs/development/LEGACY_CLEANUP_LOG.md`.

## 1. Qué es WASIYUQ
Plataforma web para **adopción responsable de mascotas en Cusco, Perú**. Conecta organizaciones (equipos/albergues) con ciudadanos para publicar mascotas, gestionar postulaciones, realizar seguimiento post-adopción y difundir contenido comunitario.  
**Evidencia:** `README.md`, rutas públicas/web/admin, modelos (`Pet`, `Adoption`, `FollowUp`, `Team`, `Announcement`, `BlogPost`, `LostPet`, `Veterinarian`, `ContactRequest`), locale `es` / timezone `America/Lima`. **Estado: Verificado.**

## 2. Cómo funciona el negocio (resumen)
1. **Descubrimiento público:** mascotas, eventos, blog, mascotas perdidas, contacto, chatbot.  
2. **Postulación:** usuario autenticado envía screening; se crea adopción `pending`, mascota pasa a `in_process` y se notifica a admins del equipo.  
3. **Revisión:** equipo aprueba (mascota `adopted`, notificación y acta PDF) o rechaza (mascota `available`).  
4. **Cierre y seguimiento:** `complete` (lógica existe) dispara plan de 5 hitos; adoptante reporta evidencia; equipo gestiona/programa; job diario marca vencidos como `missed`.  
5. **Comunidad/admin:** contenido, directorios/calificaciones, mascotas perdidas, panel admin global.

Detalle: `docs/business/WORKFLOWS.md`, `docs/domain/STATE_MACHINES.md`.

## 3. Funcionalidades identificadas (actualizado)
- **Público:** home, catálogo/detalle mascotas, mascotas perdidas (listar/detalle/reportar), eventos, blog, sobre nosotros, contacto, sitemap, health.
- **Adoptante:** dashboard, postulaciones (anti-duplicado), publicar mascotas propias, mascotas perdidas propias, directorios/calificaciones, seguimientos y reporte de hitos con fotos.
- **Equipo:** dashboard con métricas, CRUD mascotas/blog/eventos, gestión adopciones (aprobar/rechazar) y seguimientos (completar/missed/programar), perfil/logo/galería, miembros, veterinarias.
- **Admin:** gestión global de usuarios/roles/membresías, organizaciones, mascotas, eventos, blog, adopciones, seguimientos, veterinarias (verificación), albergues.
- **APIs/utilidades:** chatbot por reglas, consulta DNI, OAuth Google, PWA/Capacitor.
- **Automatismos:** eventos/listeners/notificaciones en cola, generación PDF (acta; certificado definido), scheduler diario de vencimientos.

Detalle: `docs/development/FEATURE_INVENTORY.md`, `docs/functional/FUNCTIONAL_REQUIREMENTS.md`, `docs/functional/USE_CASES.md`, `docs/technical/API_CATALOG.md`.

## 4. Tecnologías actuales
- **Backend:** PHP `^8.4`, Laravel `^13.7`, Inertia Laravel 3, Fortify, Socialite, DomPDF, Wayfinder.
- **Frontend:** Vue 3, Inertia Vue 3, TypeScript, Vite 8, Tailwind CSS 4, reka-ui/shadcn-vue, PWA, Capacitor 8.
- **Datos/infra dev:** SQL Server 2019 (`sqlsrv/pdo_sqlsrv`), migraciones + 9 SPs T-SQL (`database/stored-procedures/**`), Redis/MinIO/Mailpit en Docker (uso real por confirmar).
- **Integraciones:** Google OAuth, apisperu DNI, correo/notificaciones, GA4 (config), storage local/S3-compatible.

Detalle: `docs/technical/CURRENT_STACK.md`, `docs/technical/INTEGRATIONS.md`, `docs/technical/DATABASE_SCHEMA.md`.

## 5. Cómo está construido actualmente
- Monolito Laravel + Inertia/Vue; rutas web principales y endpoints JSON puntuales.
- Multi-tenancy lógico por `Team` (slug), equipos personales vs organizacionales, RBAC por `TeamRole/TeamPermission`.
- Dominios: identidad/equipos, mascotas, adopciones, seguimientos, contenido, comunidad, directorios, soporte.
- Patrones mixtos: Services/Repositories, eventos/jobs/listeners/notificaciones y lógica en closures/controladores.
- **Persistencia:** Eloquent como vía observada; **SPs definidos sin invocaciones halladas** en `app/`. PDFs y uploads en disco `public`.

Detalle: `docs/technical/CURRENT_ARCHITECTURE.md`, `docs/domain/DOMAIN_MODEL.md`, `docs/domain/ER_DIAGRAM.md`.

## 6. Clasificación de estado (Fase 0)

| Clasificación | Elementos principales |
|---|---|
| **Verificado** | Flujos adopción/seguimiento y side-effects en código; requests/middleware/policies clave; eventos/listeners/jobs/notificaciones/PDFs; SPs definidos (sin uso app); integraciones configuradas en código; inventario de tests y `phpunit.xml`; estructura repo/configs; gaps de seguridad y pruebas |
| **Inferido** | Detalle fino de algunas pantallas/acciones admin, uso real en entorno de Redis/MinIO/S3/colas no-sync, partes de OAuth/2FA, campos exactos de tablas auxiliares/calificaciones |
| **Incompleto (gap conocido)** | Campos extendidos de seguimiento no persistidos; semántica/descarga de acta vs certificado; modelo de ratings parcialmente trazado; cobertura de pruebas de dominio nula |
| **Pendiente de confirmación** | Disparo UI/ruta de `complete`/`cancel` adopción; ejecución real de scheduler/colas; uso operativo de SPs; resultados de tests y paridad de negocio con stakeholders; estrategia de migración de credenciales/factores |

## 7. Hallazgos nuevos relevantes (cierre documental)
1. **SPs sin uso en runtime:** 9 procedimientos T-SQL presentes y cargables, pero sin llamadas desde la aplicación (Eloquent domina).  
2. **Brecha de persistencia en seguimientos:** `Store/UpdateFollowUpRequest` acepta `weight_kg`, `vaccines`, `behavior`, `health_status`, `drive_link`, `photos` URL, pero `FollowUpService` no persiste estos metadatos.  
3. **Documentos PDF duplicados/ambiguos:** `GenerateAdoptionActaJob` (disparado al aprobar) y `GenerateAdoptionCertificateJob` (sin disparador hallado) escriben ambos en `acta_path` con rutas distintas.  
4. **Ciclo de adopción parcialmente trazado en operación:** `complete()` crea plan vía evento/listener; `cancel()` existe; invocación desde UI/rutas no confirmada.  
5. **Seguridad:** bypass de superadmin por email hardcodeado en `IsSuperAdmin` y `EnsureTeamMembership`.  
6. **Pruebas:** 17 archivos concentrados en auth/teams/settings/dashboard (scaffolding) y **cero** pruebas de dominio (adopciones, seguimientos, contenido, integraciones, jobs).  
7. **Integraciones:** DNI (apisperu) con manejo de token/errores y timeout 10s sin rate-limit visible; chatbot por reglas en memoria; cola default `database` pero pruebas y dev suelen `sync`.

## 8. Problemas y riesgos detectados
| Severidad | Hallazgo | Estado |
|---|---|---|
| Alta | Superadmin hardcodeado por email en middlewares | V |
| Alta | Ciclo crítico dependiente de scheduler/colas (vencimientos, notificaciones, PDFs, plan) sin garantía de operación verificada | V/C |
| Alta | Migración de datos/credenciales (SQL Server→PostgreSQL, hashes, 2FA, passkeys, archivos) sin estrategia ejecutada | C |
| Media-Alta | Gaps de dominio: `complete/cancel` no confirmados, campos seguimiento no persistidos, acta/certificado ambiguo | V/C |
| Media | SPs definidos no usados / posible drift con esquema y factories | V |
| Media | Endpoints públicos (chatbot/DNI) sin controles de abuso explícitos evidenciados | V |
| Media | Discrepancias README vs implementación; defaults de infra (sync/file) vs servicios disponibles | V/P |
| Media | Deuda de consistencia (closures, authz fina parcial, UI legacy) | V/P |

Detalle: `docs/technical/SECURITY_AUDIT.md`, `docs/technical/TECHNICAL_DEBT.md`, `docs/technical/TESTING_AUDIT.md`.

## 9. Arquitectura y tecnologías propuestas
- **Objetivo:** Modular Monolith en **TypeScript** (monorepo Turborepo+Bun), API-first, contratos con **Zod**.
- **Backend:** Bun + Hono (preferido) o Elysia, Drizzle ORM, PostgreSQL.
- **Frontend:** React 19 + Vite + TanStack Router/Query, shadcn/ui + Tailwind.
- **Móvil:** React Native + Expo (fase posterior).
- **Auth/infra:** solución con paridad (OAuth Google, 2FA, passkeys, equipos/RBAC), storage S3-compatible, colas/workers, observabilidad y CI/CD.

Detalle: `docs/modernization/TARGET_STACK.md`, `docs/modernization/TARGET_ARCHITECTURE.md`, `docs/modernization/MODULE_BOUNDARIES.md`, `docs/modernization/TECHNOLOGY_DECISIONS.md`.

## 10. Preparación para retiro de Laravel
- **Inventario y plan sin eliminaciones:** `docs/modernization/LEGACY_CLEANUP_PLAN.md` (código/deps/config Docker a reemplazar, assets/docs a conservar, respaldos de BD/archivos/secretos, integraciones a reconstruir, secuencia segura y criterios de listo).
- **Trazabilidad completa:** `docs/development/TRACEABILITY_MATRIX.md`.

## 11. Documentación producida en Fase 0 (nuevos/clave)
- Negocio/dominio: `docs/business/WORKFLOWS.md`, `BUSINESS_MODEL.md`, `GLOSSARY.md`, `docs/domain/DOMAIN_MODEL.md`, `ER_DIAGRAM.md`, `STATE_MACHINES.md`.
- Funcional: `docs/functional/FUNCTIONAL_REQUIREMENTS.md`, `USE_CASES.md`, `USER_STORIES.md`, `REPORTS_AND_EXPORTS.md`.
- Técnico/modernización: `docs/technical/INTEGRATIONS.md`, `TESTING_AUDIT.md`, `docs/modernization/MODULE_BOUNDARIES.md`, `LEGACY_CLEANUP_PLAN.md`.
- Trazabilidad y control: `docs/development/TRACEABILITY_MATRIX.md`, actualizaciones en `DOCUMENTATION_COVERAGE.md`, `FEATURE_INVENTORY.md`, `FINAL_AUDIT_REPORT.md`.

## 12. Decisiones que requieren aprobación
1. Confirmar operación real de `complete/cancel` adopción y política de cierre/seguimiento.  
2. Definir documento oficial (acta vs certificado), almacenamiento, descarga y permisos.  
3. Decidir persistencia de metadatos clínicos de seguimiento y ajustes de esquema.  
4. Destino de SPs (portar/descartar/equivalentes) y estrategia de paridad de consultas.  
5. Framework HTTP (Hono vs Elysia) y proveedor de auth con paridad (OAuth/2FA/passkeys).  
6. Estrategia SEO/SSR, alcance móvil (Expo/RN) y priorización de MVP.  
7. Plan de migración SQL Server→PostgreSQL, archivos, credenciales/factores y cutover/rollback.  
8. Eliminación de excepciones hardcodeadas (superadmin) y modelo final de roles/permisos.

## 13. Resultado Fase 1 (fundación 2.0)
- **Estructura:** monorepo Bun workspaces + Turborepo con `apps/{api,web,mobile}`, `modules/{identity,organizations,pets,adoptions,follow-ups,content,community,integrations}`, `packages/{core,db,auth,validation,api-client,ui,config}`, `infra/docker`.
- **Stack activo (scaffold):** Bun 1.3.14, TypeScript 5.9.3, Turbo 2.11.11, Hono 4.7.x, Zod 3.24.x, Drizzle ORM 0.44.x/postgres 3.4.x (base), React 19.3.x, Vite 6.4.x, TanStack Router 1.114.x, TanStack Query 5.66.x, Tailwind 3.4.17, Expo ~52/RN 0.76 preparado, PostgreSQL 16 compose.
- **Verificaciones:** `bun install`, `bun run build|lint|typecheck|test` OK (18/18 build/lint/typecheck, 19/19 test; API health test pasa). `docker compose config` OK (bind de puertos bloqueado en entorno de prueba por puertos ocupados). Hono `GET /health` responde; frontend React/Vite inicia.
- **Limpieza:** dependencias operativas Laravel/PHP/Composer/Inertia/Vue retiradas; activos/referencias conservados en `legacy-assets/` y `database/`; detalles en `docs/development/LEGACY_CLEANUP_LOG.md`.
- **Pendientes/riesgos:** `vendor/**` y parte de `public/build/**` root-owned en disco (no trackeados); historial git contiene rename de `.env` en `b83558b` (retirado del índice en `28f31e0`); implementación de módulos de negocio, migración SQL Server→PostgreSQL, paridad auth/documentos/seguimientos/SPs y decisiones abiertas (secciones 8, 12).

## 14. Siguiente paso recomendado
> Actualización 2026-11-17: el punto 3 (integración PostgreSQL/Drizzle) quedó resuelto a nivel de infraestructura en Fase 2 (sección 15).
1. **Validar con negocio:** gaps C/P críticos (cierre adopción, documentos, campos seguimiento, SPs) y congelar decisiones de paridad.  
2. **Respaldos y descubrimiento de datos reales:** inventario de BD/archivos/secretos en entornos (sin exponer secretos en repo).  
3. **Implementación Fase 2:** módulos de negocio por prioridad (identidad/organizaciones/mascotas/adopciones/seguimientos), integración PostgreSQL/Drizzle, auth evaluada, y migración de datos/archivos con pruebas de paridad.  
4. **Operación:** resolver limpieza de residuos root-owned, rotar secretos si aplica por historial, y asegurar entorno Docker con puertos disponibles para CI/dev.

> **Conclusión:** Fase 0 documentada y Fase 1 completada a nivel de fundación técnica y retiro del runtime legacy. Persisten decisiones de negocio/migración y la implementación funcional de módulos antes de paridad y cutover.

## 15. Resultado Fase 2 (fundación de base de datos, 2026-11-17)
- **Auditoría previa:** sin dependencias operativas de Laravel/Artisan/Eloquent/SQL Server (`LEGACY_CLEANUP_LOG.md` §8).
- **`packages/db`:** configuración Zod por destino (dev/test), cliente Drizzle + postgres.js con ciclo de vida, health check, runner de migraciones con salvaguardas y CLI (`db:generate`, `db:check`, `db:migrate`, `db:migrate:test`).
- **Infra:** PostgreSQL 16 en Compose `wasiyuq2` (aislado del stack legacy `wasiyuq`), `127.0.0.1:55432`, `pg_isready`, volumen persistente, BD de test automática.
- **API:** `/health` (liveness) independiente de `/ready` (readiness con BD); logs estructurados de fallos; apagado ordenado.
- **CI:** servicio PostgreSQL efímero + migraciones + tests de integración.
- **Verificado:** compose healthy; generate/migrate en dev y test; rechazo de destinos no autorizados; 29 tests db+api en verde con BD real; lint/typecheck/build OK; ciclo real de caída/recuperación de BD en `/ready`.
- **Sin cambios en:** bases de datos originales, volúmenes/contenedores legacy, respaldos, archivos de usuarios, stored procedures/factories/seeders. Sin tablas de negocio, sin migración de datos, sin merge a `main`, sin deploy.
- **Decisiones pendientes:** configuración y secretos de producción; destino del volumen residual `docker_wasiyuq_postgres_data`; destino de factories/seeders/SPs legacy; respaldo externo de `database/database.sqlite` y volúmenes legacy; esquema de dominio (inicio de módulos).

## 16. Resultado Fase 3 (identidad y organizaciones, 2026-11-17)
- **Decisión:** Better Auth 1.7.15 solo para autenticación; organizaciones/membresías/RBAC propios (ADR-010, ADR-011).
- **Implementado:** registro, login/logout, verificación de email, recuperación de contraseña (revoca sesiones), sesiones listables/revocables, Google OAuth configurable, estado de cuenta (suspensión), rol de plataforma explícito (sin email hardcodeado), organizaciones multi-membresía con espacio personal, 8 roles y 31 permisos legacy, invitaciones con token hasheado, contexto activo, archivado, panel mínimo de administración.
- **Base de datos:** migración aditiva `0000_identity_organizations` (9 tablas) con claves, únicos, índices parciales y `CHECK`.
- **API:** `/api/auth/*` (Better Auth) y `/api/v1/*` (Hono, Zod estricto, errores uniformes, CSRF, rate limit, límite de cuerpo, logs sin secretos). Contrato: `docs/technical/API_IDENTITY_CONTRACT.md`.
- **Web:** login, registro, recuperación, verificación, shell autenticado, perfil y sesiones, organizaciones, miembros, invitaciones, administración; navegación según permisos.
- **Verificación:** 129 tests automatizados (validation 5, api-client 3, db 27, web 6, organizations 36, identity 24, api 28) contra PostgreSQL de test; E2E en Chromium con 28 comprobaciones; `lint`/`typecheck`/`build` OK; migraciones idempotentes y `drizzle-kit check` sin conflictos; `bun audit` sin avisos en dependencias de runtime.
- **Seguridad:** 22 decisiones registradas en `docs/technical/SECURITY_DECISIONS.md`, varias derivadas de revisiones durante la implementación (fuga de token de sesión en JSON, checks de origen desactivados en test, suplantación de IP para rate limit, TOCTOU en invitaciones, SQL en logs, rol por defecto en UI).
- **Brechas de paridad:** 2FA y passkeys diferidos; Google OAuth sin prueba real; sin transporte de correo de producción (arranque en producción bloqueado); cambio de email y borrado de cuenta no implementados; consulta DNI no migrada.
- **Observación de rendimiento:** el hash scrypt de Better Auth se ejecuta en JavaScript y bloquea el event loop (~0,1–1 s por operación); bajo carga de CPU del host se observaron registros de varios segundos. Evaluar workers o un hash nativo antes de producción.
  > **Corrección (Fase 3.1):** esta observación era errónea. En Bun, Better Auth usa `crypto.scrypt` asíncrono (pool de hilos) y el event loop no se bloquea; los registros lentos se debieron a contención de CPU de procesos ajenos. Ver §17.
- **Sin cambios en:** bases de datos originales (SQL Server/SQLite), volúmenes legacy, respaldos, fotos, documentos. No se implementaron pets/adoptions/follow-ups ni se desplegó a producción.
- **Decisiones pendientes:** ver `AUTHENTICATION.md` §7, `AUTHORIZATION_RBAC.md` §5, `ORGANIZATION_MEMBERSHIP.md` §7.

## 17. Resultado Fase 3.1 (endurecimiento y preparación para producción, 2026-11-17)
- **Hash de contraseñas:** investigación con mediciones: el scrypt de Better Auth en Bun es asíncrono y no bloquea el event loop (lag ≤ 22 ms con 32 hashes, frente a 2 s con `scryptSync`). Se añadió un hasher con los mismos parámetros y formato (sin migración, compatible en ambos sentidos), con concurrencia acotada (memoria máxima de 192 MiB en vez de ~1 GiB con 32 hashes), comparación en tiempo constante y hashes malformados que fallan sin 500. ADR-012, `AUTHENTICATION_SECURITY.md`.
- **Correo real:** adaptador SMTP (nodemailer 10.3.1) con cola en segundo plano, reintentos solo ante errores transitorios, errores saneados y logs sin datos personales; Mailpit en Compose y CI; proveedor recomendado Resend (configuración, sin cambio de código). Producción exige SMTP completo con TLS o no arranca. No se envió correo real. ADR-013, `EMAIL_DELIVERY.md`.
- **Enumeración:** el registro con un email existente ahora es indistinguible (sin sesión automática; aviso `account_exists` al titular); correo fuera del camino de la respuesta; `/ready` sin contadores (hallazgo de revisión automática corregido; contadores en `GET /api/v1/admin/email-health`).
- **Seguridad adicional:** logger de Better Auth redirigido con emails redactados; asuntos sin saltos de línea; `requireLocalEmailVerified` explícito; manejadores de errores no controlados; la API sale con código 1 en producción si la configuración de BD, auth o correo es inválida. S-23…S-33 en `SECURITY_DECISIONS.md`.
- **Dependencias:** Expo SDK 52 → 58 (RN 0.88.1, React 19.3.0) en el workspace móvil sin código; `bun audit` pasó de 38 avisos (1 crítico) a 4 (0 críticos: `picomatch` sin parche publicado, `esbuild` antiguo dentro de drizzle-kit, `glob`/`minimatch` de la CLI de Expo), todos en herramientas. Antigüedad mínima de 14 días en `bunfig.toml`; CI con `--frozen-lockfile`, Bun fijado y fallo ante avisos críticos. ADR-014.
- **Pruebas permanentes:** 170 tests automatizados (validation 5, api-client 3, db 27, web 6, organizations 36, identity 58, api 35) contra PostgreSQL de test y Mailpit; 8 tests E2E de Playwright en `apps/web/e2e` (registro y verificación por correo real, cookies, logout, error genérico, recuperación con revocación y enlace de un solo uso, recuperación de email inexistente, organización + invitación + roles + 404 a no miembros, móvil) con servidores propios y base `wasiyuq_test`; job E2E en CI.
- **Operación:** `PRODUCTION_READINESS.md` (guardas de arranque, variables, readiness, apagado con drenado de correo, bloqueos pendientes).
- **Sin cambios en:** bases de datos originales, volúmenes legacy, respaldos, fotos, documentos; modelo de 8 roles y 31 permisos; salvaguardas de migración. No se implementaron pets/adoptions/follow-ups, DNI, 2FA ni passkeys. Sin despliegue.
- **Bloqueos de producción restantes:** cuenta y dominio verificado del proveedor de correo; infraestructura (hosting en un único origen HTTPS, PostgreSQL gestionado, secretos, backups); procedimiento de migraciones en producción; rate limit de `/api/v1` y cola de correo en memoria (una sola instancia); decisiones de negocio pendientes (2FA/passkeys, verificación obligatoria, propiedad de organizaciones).
