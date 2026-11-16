# Informe final de auditoría — WASIYUQ

**Fecha:** 2026-11-16  
**Rama:** `dev`  
**Alcance:** auditoría estática e ingeniería inversa documental del repositorio (sin modificaciones de código de aplicación, dependencias, migraciones ni base de datos).

## 1. Qué es WASIYUQ

WASIYUQ es una plataforma web para **adopción responsable de mascotas en Cusco, Perú**. Conecta organizaciones (albergues/equipos) con ciudadanos para publicar mascotas, gestionar postulaciones de adopción, realizar seguimiento post-adopción y difundir actividades/contenido comunitario.  
**Evidencia:** `README.md`, `routes/public.php`, `routes/web.php`, modelos (`Pet`, `Adoption`, `FollowUp`, `Team`, `Announcement`, `BlogPost`, `LostPet`, `Veterinarian`), configuración locale/timezone.

## 2. Cómo funciona el negocio (resumen)

1. **Descubrimiento público:** visitantes exploran mascotas, eventos, blog, mascotas perdidas y contactan a la plataforma.
2. **Postulación:** usuarios autenticados aplican a adoptar mascotas completando información de screening.
3. **Gestión organizacional:** equipos gestionan mascotas, revisan adopciones (aprobar/rechazar), programan y controlan seguimientos.
4. **Seguimiento:** adoptantes reportan hitos con evidencia/datos; el sistema/organización controla estados y atrasos.
5. **Comunidad y soporte:** publicación de eventos/blog, directorio y calificación de veterinarias/albergues, reportes de mascotas perdidas, contacto y chatbot/DNI.
6. **Gobernanza:** super administración gestiona usuarios, organizaciones y contenido global.

## 3. Funcionalidades identificadas

- **Público:** home, catálogo/detalle de mascotas, mascotas perdidas (listar/detalle/reportar), eventos, blog, sobre nosotros, contacto, sitemap, health.
- **Adoptante (`/mi-adopcion`):** dashboard, postulaciones, publicar mascotas propias, gestionar mascotas perdidas, directorio/calificación de veterinarias y albergues, seguimientos y reporte de hitos.
- **Equipo (`/{team}`):** dashboard con métricas, CRUD mascotas/blog/eventos, gestión adopciones y seguimientos, perfil, miembros, veterinarias.
- **Admin (`/admin`):** usuarios/roles/membresías, organizaciones, mascotas, eventos, blog, adopciones, seguimientos, veterinarias (verificación), albergues.
- **Cuenta/auth:** registro/login Fortify, 2FA/passkeys (soporte en stack), Google OAuth, perfil/seguridad/apariencia, equipos e invitaciones.
- **APIs/utilidades:** chatbot por reglas, consulta DNI, PWA/Capacitor.

Detalle: `docs/development/FEATURE_INVENTORY.md`, `docs/technical/API_CATALOG.md`.

## 4. Tecnologías actuales

- **Backend:** PHP `^8.4` (composer) / Docker `php:8.4-fpm`, Laravel `^13.7`, Inertia Laravel 3, Fortify, Socialite, DomPDF, Wayfinder.
- **Frontend:** Vue 3, Inertia Vue 3, TypeScript, Vite 8, Tailwind CSS 4, reka-ui/shadcn-vue patterns, PWA plugin, Capacitor 8.
- **Datos/infra dev:** SQL Server 2019 (driver `sqlsrv/pdo_sqlsrv`), migraciones + stored procedures T-SQL, Redis/MinIO/Mailpit en Docker; `.env.example` usa `file/sync/local` por defecto.
- **Integraciones:** Google OAuth, API DNI (apisperu), GA4 configurado.

Detalle: `docs/technical/CURRENT_STACK.md`, `docs/technical/DATABASE_SCHEMA.md`, `docs/technical/CURRENT_ARCHITECTURE.md`.

## 5. Cómo está construido actualmente

- **Monolito Laravel + Inertia/Vue** con rutas web como interfaz principal y pocos endpoints JSON.
- **Multi-tenancy lógico por Team:** equipos personales vs organizacionales, panel por slug, membresías con roles/permisos (`TeamRole`, `TeamPermission`).
- **Dominios:** mascotas, adopciones, seguimientos, eventos, blog, mascotas perdidas, veterinarias, calificaciones, contacto, admin.
- **Patrones mixtos:** Services/Repositories en áreas clave, eventos/jobs/listeners/notificaciones para adopciones/seguimientos/documentos, lógica también en closures de rutas y UI.
- **Persistencia híbrida:** Eloquent/migraciones + procedimientos almacenados T-SQL (con indicios de desfase respecto a esquema evolucionado).

## 6. Problemas y riesgos detectados

| Severidad | Hallazgo |
|---|---|
| Alta | Superadmin hardcodeado por email en middlewares (`IsSuperAdmin`, `EnsureTeamMembership`) |
| Alta | Riesgo operativo por `.env` presente en árbol y posibles exposiciones de configuración |
| Media | Enforcement fino de permisos no verificado exhaustivamente frente al catálogo definido |
| Media | Endpoints públicos (chatbot/DNI) sin controles de abuso explícitos en rutas revisadas |
| Media/Alta | Desfase potencial entre SPs T-SQL, migraciones recientes y factories |
| Media | Discrepancias README vs implementación/versiones reales; defaults `sync/file` vs servicios disponibles |
| Media | Deuda de consistencia arquitectónica (closures, convenciones mixtas, UI legacy) |

Detalle: `docs/technical/SECURITY_AUDIT.md`, `docs/technical/TECHNICAL_DEBT.md`.

## 7. Arquitectura y tecnologías propuestas

- **Objetivo:** Modular Monolith en **TypeScript** (monorepo Turborepo+Bun workspaces), **API-first**, contratos compartidos con **Zod**.
- **Backend:** Bun + Hono (preferido) o Elysia, Drizzle ORM, PostgreSQL.
- **Frontend:** React 19 + Vite + TanStack Router/Query (+ Form cuando aporte), shadcn/ui + Tailwind.
- **Móvil:** React Native + Expo (fase posterior) reutilizando contratos/cliente API.
- **Auth:** Better Auth u alternativa condicionada a paridad (OAuth Google, 2FA, passkeys, equipos/RBAC).
- **Infra:** Docker, S3-compatible para archivos, Redis solo si se justifica, CI/CD, logging/monitoreo/backups.

Detalle: `docs/modernization/TARGET_STACK.md`, `docs/modernization/TARGET_ARCHITECTURE.md`, `docs/modernization/TECHNOLOGY_DECISIONS.md`.

## 8. Roadmap de reconstrucción

Fases propuestas: (1) fundación/monorepo, (2) infraestructura y BD, (3) identidad/permisos, (4) dominio núcleo, (5) módulos complementarios, (6) integraciones, (7) frontend web, (8) móvil, (9) pruebas/validación, (10) despliegue/cutover.  
Prioridad máxima inicial: identidad/RBAC, mascotas, adopciones y seguimientos.

Detalle: `docs/modernization/RECONSTRUCTION_ROADMAP.md`, `docs/modernization/MIGRATION_STRATEGY.md`.

## 9. Qué falta investigar / validar

- Reglas y validaciones exactas en `Form Requests`, `Policies`, controladores y UI por cada acción.
- Efectos reales de `Events/Listeners/Jobs/Notifications/Mail` y su ejecución (colas/scheduler).
- Uso efectivo de stored procedures, Redis, storage S3/local y generación de PDFs/actas en flujos reales.
- Cobertura y resultados de pruebas (`tests/`) y casos borde de negocio.
- Conciliación de roles del README con implementación real y expectativas de negocio.
- Estrategia de migración de credenciales (hashes, 2FA, passkeys) y compatibilidad.

Cobertura y pendientes: `docs/development/DOCUMENTATION_COVERAGE.md`.

## 10. Decisiones que requieren aprobación

1. Framework HTTP definitivo (Hono vs Elysia) y proveedor de autenticación (paridad comprobada).
2. Estrategia SEO/SSR para sitio público.
3. Alcance y momento de app móvil (Expo/RN).
4. Modelo final de roles/permisos y eliminación de excepciones hardcodeadas.
5. Plan de migración de datos/archivos (incl. SQL Server→PostgreSQL, SPs, documentos).
6. Priorización de negocio para MVP de paridad.

## 11. Siguiente paso recomendado

1. **Cerrar auditoría profunda pendiente:** Requests/Policies/Jobs/Events/Listeners/Tests y trazado de uso real de SPs/storage/colas.
2. **Completar artefactos críticos:** `WORKFLOWS.md`, `STATE_MACHINES.md`, `MIGRATION_STRATEGY` detallada por tabla/flujo, `INTEGRATIONS.md`, `TESTING_AUDIT.md`, `TECHNICAL_DEBT` priorizada.
3. **Construir matriz de trazabilidad completa** (funcionalidad → regla → entidad → módulo nuevo → prioridad → estado).
4. **Ejecutar spikes de validación:** (a) Hono+Drizzle+PostgreSQL con identidad/equipos, (b) migración de datos de muestra, (c) paridad auth (OAuth/2FA/passkeys).
5. **Aprobar ADRs clave** y solo entonces iniciar implementación de la Fase 1 de reconstrucción.

> **Conclusión:** se cuenta con un expediente inicial verificable y estructurado en `docs/` para guiar la reconstrucción sin depender de Laravel, aunque se requiere completar la verificación fina de reglas/efectos secundarios antes de declarar paridad funcional total. 
