# Auditoría del repositorio

**Fecha de auditoría:** 2026-11-16  
**Rama activa:** `dev` (coincide con remoto `origin/dev`)  
**Estado de trabajo Git:** limpio al inicio de la auditoría (sin cambios rastreados/no rastreados reportados por `git status --short`).

## 1. Resumen ejecutivo

WASIYUQ es un monolito web basado en **Laravel** con frontend **Vue 3 + Inertia.js + TypeScript + Tailwind CSS 4**, orientado a la **adopción responsable de mascotas en Cusco, Perú** (evidencia: `README.md`, rutas públicas, modelos de dominio, seeders).

El repositorio incluye además configuración para **PWA** (Vite PWA), **app nativa con Capacitor** (`capacitor/`, dependencias `@capacitor/*`), contenedores Docker (nginx, app PHP-FPM, SQL Server 2019, Redis, MinIO, Mailpit), y componentes de dominio para mascotas, adopciones, seguimientos, eventos/anuncios, blog, mascotas perdidas, veterinarias, albergues/equipos y contacto/chatbot/DNI.

## 2. Estructura de alto nivel (evidencia)

| Ruta | Descripción |
|---|---|
| `app/` | Código backend Laravel: Actions, Concerns, Console, Enums, Events, Http (Controllers/Middleware/Requests), Jobs, Listeners, Mail, Models, Notifications, Policies, Providers, Repositories, Rules, Services, Support |
| `bootstrap/` | Bootstrap de aplicación (`bootstrap/app.php` configura routing/middleware) |
| `config/` | Configuración Laravel (auth, database, services, fortify, filesystems, etc.) |
| `database/` | Seeders, factories y stored procedures legacy conservados como referencia (`database/stored-procedures/`). Las migraciones Laravel (`database/migrations/`) fueron retiradas en Fase 1; migraciones 2.0 en `packages/db/migrations/` (Drizzle). |
| `docker/` | Dockerfiles/config: `php/Dockerfile`, `php/entrypoint.sh`, `nginx/default.conf`, `minio/init.sh` |
| `resources/` | Frontend: `js/` (pages, components, layouts, composables, stores, types), `css/app.css`, `views/` (Blade, emails) |
| `routes/` | `web.php`, `public.php`, `admin.php`, `settings.php`, `console.php` |
| `public/` | Assets públicos y punto de entrada web |
| `tests/` | Pruebas (Pest indicado en dependencias) |
| `capacitor/` | Configuración Capacitor (`capacitor.config.ts`, appId `pe.wasiyuq.app`) |
| `task/` | Carpeta auxiliar `task/wasiyuq` (contenido a revisar en detalle) |
| `vendor/`, `node_modules/` | Dependencias instaladas en árbol de trabajo (no forman parte del código fuente propio) |

**Archivos raíz relevantes:** `README.md`, `composer.json`, `composer.lock`, `package.json`, `package-lock.json`, `Makefile`, `docker-compose.yml`, `.env.example`, `vite.config.ts`, `tsconfig.json`, `phpunit.xml`, `eslint.config.js`, `pint.json`.

## 3. Estado de documentación existente (previo a esta auditoría)

- `README.md` en raíz: descripción general, stack declarado, setup, comandos Make, estructura resumida, páginas públicas, roles de usuario.
- No existía carpeta `docs/` propia del proyecto (solo documentación dentro de `vendor/`).
- **Hallazgo:** README declara "Laravel 13 (PHP 8.3)" y "SQL Server 2019+", pero `composer.json` requiere `php: ^8.4` y `laravel/framework: ^13.7`; `docker/php/Dockerfile` usa `php:8.4-fpm-bookworm`. Existe discrepancia documental vs implementación/configuración de dependencias (hecho comprobado por comparación de archivos).

## 4. Indicadores tecnológicos principales

- **Backend:** Laravel 13 (`laravel/framework ^13.7`), PHP `^8.4` (composer), Inertia Laravel v3, Fortify, Socialite (Google), DomPDF, Wayfinder.
- **Frontend:** Vue 3, Inertia Vue 3, TypeScript 5, Vite 8, Tailwind CSS 4, shadcn-vue/reka-ui, Lucide, TanStack Table, vue-sonner, marked.
- **Móvil/PWA:** `vite-plugin-pwa`, Capacitor 8 (`@capacitor/*`), `capacitor/capacitor.config.ts`.
- **Base de datos objetivo en entorno:** SQL Server (`DB_CONNECTION=sqlsrv`, imagen `mcr.microsoft.com/mssql/server:2019-latest` en `docker-compose.yml`, driver `sqlsrv` habilitado en Dockerfile y `config/database.php`).
- **Infra dev:** Redis, MinIO, Mailpit; queue/sesión/caché por defecto en `.env.example` apuntan a `file/sync` (configurable).

## 5. Rutas y superficies funcionales (alto nivel)

- **Públicas (`routes/public.php`):** home, mascotas, detalle mascota, mascotas perdidas (listado/detalle/reporte), eventos, blog, sobre nosotros, contacto, sitemap, health.
- **Web autenticada/mixta (`routes/web.php`):** login social Google, área adoptante `/mi-adopcion/*` (dashboard, postulaciones, publicar mascotas, mascotas perdidas, veterinarias, albergues, seguimientos), redirección `/dashboard` según rol/equipo, panel por equipo `/{current_team}/...` (mascotas, adopciones, seguimientos, blog, eventos, perfil, miembros, veterinarias), postulación a mascota, chatbot API, lookup DNI, aceptación de invitaciones.
- **Administración (`routes/admin.php`, middleware `auth,verified,admin`):** dashboard, perfil, roles, usuarios (CRUD/membresías/roles), mascotas, organizaciones/equipos, eventos, blog, adopciones, seguimiento, veterinarias (verificación/eliminación), albergues.
- **Configuración (`routes/settings.php`):** perfil, seguridad/contraseña/2FA (Fortify), apariencia, gestión de equipos e invitaciones.

## 6. Modelo organizativo y autorización (evidencia inicial)

- **Usuarios:** `is_super_admin`, `current_team_id`, campos sociales/DNI/whatsapp (`app/Models/User.php`, migraciones).
- **Equipos (Teams):** organizaciones/albergues y equipos personales (`is_personal`), slug como route key, soft deletes, perfiles enriquecidos (bio, ubicación, redes, galería, etc. en `Team`).
- **Membresías y roles de equipo:** `Membership` (tabla `team_members`) con `TeamRole` enum; permisos granulares en `TeamPermission` enum (`app/Enums/TeamRole.php`, `app/Enums/TeamPermission.php`).
- **Middleware clave:** `IsSuperAdmin` (permite super admin o email hardcodeado `hustavojhon@gmail.com` — **hallazgo de seguridad/mantenibilidad**), `EnsureTeamMembership` (valida pertenencia, redirige equipos personales a `/mi-adopcion`, aplica rol mínimo opcional).

## 7. Dominios funcionales detectados (inicial)

- Mascotas en adopción (catálogo público y gestión por equipo/admin), estados/tallas/especies por enums.
- Adopciones/postulaciones con revisión, estados y seguimiento (follow-ups) con reportes/fotos/campos de salud.
- Eventos/anuncios (`Announcement`) y blog (`BlogPost`) por equipo/autor.
- Mascotas perdidas (`LostPet`) con reporte público y gestión por adoptante.
- Veterinarias (directorio, calificaciones, verificación admin) y calificación de albergues/equipos.
- Contacto, chatbot basado en reglas (`app/Services/ChatbotService.php`), consulta DNI vía API externa (`DniLookupService`, config `services.dni`).
- Autenticación: Fortify (password/2FA/passkeys según dependencias), login social Google.

## 8. Base de datos y artefactos

- (Histórico Fase 0) 25+ migraciones Laravel en `database/migrations/`; **retiradas del repo en limpieza Fase 1**. Estructura de migraciones 2.0: `packages/db/migrations/` (Drizzle ORM + PostgreSQL).
- Directorio `database/stored-procedures/{pets,adoptions,announcements,blog,reports}/` y comando `app:load-stored-procedures` (según scripts/comandos Make). **Uso real de SPs vs Eloquent pendiente de verificación detallada** en servicios/repositorios/controladores.
- Seeder principal extenso (`DatabaseSeeder`) con datos demo (usuarios, organizaciones, mascotas, eventos, posts, adopciones/seguimientos — lectura parcial durante muestreo).

## 9. Hallazgos iniciales relevantes

1. **Discrepancia de versiones/documentación:** README vs `composer.json`/Dockerfile (PHP/Laravel).
2. **Acceso privilegiado hardcodeado:** `IsSuperAdmin` y `EnsureTeamMembership` contemplan email específico además de `is_super_admin`.
3. **Stack híbrido de persistencia:** uso previsto de SQL Server y stored procedures junto a Eloquent/Repositories; requiere mapa de uso real.
4. **Capacitor server en config:** `capacitor.config.ts` apunta a `http://10.0.2.2:8081` con `cleartext` y debug habilitado (posible configuración de desarrollo embebida; confirmar intención).
5. **`.env` presente en árbol de trabajo:** no se inspecciona ni documenta contenido sensible; `.env.example` sirve como referencia de variables.

## 10. Próximos pasos de la auditoría documental

- Inventariar exhaustivamente controladores, requests, policies, eventos/jobs/notificaciones y vistas Inertia.
- Documentar esquema completo desde migraciones y mapear uso de SPs/repositorios.
- Completar reglas de negocio, flujos, permisos y matriz de trazabilidad.
- Elaborar propuesta de modernización (Bun/Hono o Elysia/Drizzle/PostgreSQL/React 19 stack) y roadmap por fases.

> **Nota:** Este documento es una base viva de la etapa de descubrimiento; se ampliará con evidencia adicional conforme avance la inspección sistemática del repositorio.
