# Stack tecnológico actual

**Fecha:** 2026-11-16  
**Fuente:** `composer.json`, `composer.lock` (versiones instaladas), `package.json`, `docker-compose.yml`, `docker/php/Dockerfile`, `.env.example`, `config/*`, `vite.config.ts`.

> Las versiones "requeridas" provienen de manifiestos; las "instaladas/resueltas" se contrastan con archivos lock cuando aplica. Se distingue dependencia instalada vs uso real cuando hay evidencia.

## 1. Backend

| Tecnología | Versión (req/instalada) | Uso real (evidencia) | Archivos/rutas clave | Importancia | Alternativas modernas (referencia) |
|---|---|---|---|---|---|
| PHP | `^8.4` req; Docker `php:8.4-fpm-bookworm`; README declara 8.3 (**discrepancia**) | Runtime backend | `composer.json`, `docker/php/Dockerfile`, `README.md` | Crítica | — (se reemplazará en reconstrucción) |
| Laravel Framework | `^13.7` req; `v13.7.0` en `composer.lock` | Núcleo HTTP, Eloquent, routing, middleware, eventos, colas | `bootstrap/app.php`, `routes/*`, `app/*`, `config/*` | Crítica | Hono/Elysia + TS (objetivo propuesto) |
| Inertia Laravel | `^3.0` req; `v3.0.1` lock | Bridge servidor↔SPA Vue | `composer.json`, `app/Http/Middleware/HandleInertiaRequests.php`, controladores Inertia | Crítica | API tipada + SPA/SSR según diseño objetivo |
| Laravel Fortify | `^1.37.2` req; `v1.37.2` lock | Autenticación, registro, password, 2FA (y passkeys vía deps) | `composer.json`, rutas/settings, modelos/config auth | Crítica | Better Auth u alternativa TS |
| Laravel Socialite | `^5.27` req; `v5.27.0` lock | Login social Google | `routes/web.php` (`/auth/google*`), `config/services.php` | Alta | OAuth/OIDC en stack objetivo |
| barryvdh/laravel-dompdf | `^3.1` req; `v3.1.2` lock | Generación PDF (posible actas/documentos; confirmar uso en controladores/servicios) | `composer.json` | Media (pendiente confirmar uso real) | Librerías PDF en Node/Bun |
| laravel/wayfinder | `^0.1.14` req; `v0.1.14` lock | Generación/utilidades de rutas tipadas frontend | `vite.config.ts` (`@laravel/vite-plugin-wayfinder`), `composer.json` | Media | Rutas tipadas (TanStack Router/contracts) |
| laravel/tinker | `^3.0` req | REPL desarrollo | `composer.json` | Baja | — |
| laravel/chisel | `^0.1.0` req | Herramienta dev (Laravel) | `composer.json` | Baja | — |

### Desarrollo/testing backend
Pest (`^4.7`), Pest plugins (drift, laravel), PHPUnit config presente, Pint, Laravel Sail/Pail/Pao, Faker, Mockery, Collision (`composer.json`, `phpunit.xml`).

## 2. Frontend

| Tecnología | Versión (req/instalada) | Uso real (evidencia) | Archivos clave | Importancia | Alternativas modernas |
|---|---|---|---|---|---|
| Vue | `^3.5.13` req; `3.5.32` lock | UI SPA | `resources/js/**`, `package.json` | Crítica | React 19 (objetivo propuesto) |
| @inertiajs/vue3 + @inertiajs/vite | `^3.0.0` | Cliente Inertia | `resources/js/app.ts` (típico), páginas Inertia | Crítica | Cliente API + router objetivo |
| TypeScript | `^5.2.2` | Tipado frontend | `tsconfig.json`, `resources/js/**/*.ts` | Alta | TypeScript (se mantiene en objetivo) |
| Vite | `^8.0.0` | Bundling/dev server | `vite.config.ts` | Alta | Vite (compatible con objetivo React) |
| Tailwind CSS | `^4.1.1` | Estilos utilitarios/tokens | `resources/css/app.css`, plugin `@tailwindcss/vite` | Alta | Tailwind CSS (reutilizable) |
| reka-ui, shadcn-vue patterns, CVA, tailwind-merge, clsx | varias | Componentes UI | `components.json`, deps, `resources/js/components/ui` | Alta | shadcn/ui (React) en objetivo |
| lucide-vue-next | `^0.468.0` | Iconografía | deps/UI | Media | lucide-react |
| @tanstack/vue-table | `^8.21.3` | Tablas/datos | deps | Media | TanStack Table React |
| @vueuse/core | `^12.8.2` | Composables/utilidades | deps | Media | hooks/utilidades React |
| vue-sonner | `^2.0.0` | Notificaciones toast | deps | Media | sonner |
| marked | `^18.0.5` | Renderizado Markdown (posible blog/contenido) | deps | Media (confirmar uso) | librería markdown en objetivo |
| vue-input-otp | `^0.3.2` | OTP/2FA UI | deps | Media | componente OTP equivalente |

## 3. Móvil y PWA

| Tecnología | Versión | Uso real | Evidencia | Importancia |
|---|---|---|---|---|
| vite-plugin-pwa (Workbox) | `^1.3.0` | PWA, manifest, service worker, cache runtime | `vite.config.ts` | Alta |
| Capacitor core/cli/android y plugins (app, camera, local-notifications, splash-screen, status-bar) | `^8.x` | Empaquetado app nativa Android (y base iOS) | `package.json`, `capacitor/capacitor.config.ts` | Media-Alta (alcance real de uso nativo a confirmar) |

## 4. Base de datos, caché, colas y almacenamiento

| Tecnología | Configuración observada | Uso real | Evidencia | Notas |
|---|---|---|---|---|
| SQL Server 2019 (Developer) | `mcr.microsoft.com/mssql/server:2019-latest`, conexión `sqlsrv` | BD principal prevista | `docker-compose.yml`, `.env.example`, `config/database.php` | Drivers `sqlsrv/pdo_sqlsrv` en Dockerfile |
| Redis 7 | Servicio `redis:7-alpine` | Disponible en compose; `.env.example` usa `CACHE_STORE=file`, `QUEUE_CONNECTION=sync`, `SESSION_DRIVER=file` | `docker-compose.yml`, `.env.example` | Uso efectivo en runtime depende de entorno; **diferenciar instalado/disponible vs activo** |
| MinIO (S3 compatible) | Servicio `minio/minio`, puertos API/console; vars AWS_* apuntan a MinIO | Almacenamiento de objetos compatible S3 | `docker-compose.yml`, `.env.example`, `config/filesystems.php` (a verificar) | `FILESYSTEM_DISK=local` por defecto en ejemplo |
| Filesystem local | `FILESYSTEM_DISK=local` en `.env.example` | Almacenamiento local por defecto | `.env.example` | |
| Mailpit | SMTP dev `1025`, UI `8025` | Correo en desarrollo | `docker-compose.yml`, `.env.example` | |

## 5. Infraestructura y despliegue (dev/contenedores)

| Componente | Detalle | Evidencia |
|---|---|---|
| Docker Compose | Servicios `app`, `nginx`, `sqlserver`, `redis`, `minio`, `mailpit`; volúmenes persistentes | `docker-compose.yml` |
| Nginx | Imagen `nginx:alpine`, puerto `8080:80`, config montada | `docker-compose.yml`, `docker/nginx/default.conf` |
| PHP-FPM image | Instala extensiones `sqlsrv`, `pdo_sqlsrv`, `gd`, `zip`, `intl`, `opcache`, `pcntl`, `redis`; Node 20; Composer | `docker/php/Dockerfile` |
| Makefile | Comandos setup/migrate/sp/build/dev/test/pint/queue | `Makefile` |

## 6. Integraciones y servicios externos

| Integración | Propósito | Evidencia | Config/secretos |
|---|---|---|---|
| Google OAuth (Socialite) | Login social | `routes/web.php`, `config/services.php` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` |
| Google Analytics (GA4) | Analítica (ID configurado) | `.env.example`, `config/services.php` (`analytics_id`) | `GA_MEASUREMENT_ID` (uso en frontend/layout a confirmar) |
| API DNI (apisperu.com) | Consulta/validación de DNI | `app/Services/DniLookupService.php`, `routes/web.php` (`/api/dni/lookup`), `config/services.php` | `DNI_API_TOKEN`, `DNI_API_URL` |

## 7. Herramientas de calidad y desarrollo

- **Lint/format:** ESLint 9, Prettier, Pint.
- **Tipos:** `vue-tsc`.
- **Testing:** Pest/PHPUnit, scripts `composer test`, `ci:check`.
- **Build:** Vite build/SSR scripts.

## 8. Hallazgos y observaciones

1. **Discrepancias de versión/documentación:** README indica PHP 8.3/Laravel 13; dependencias/config reales apuntan a PHP 8.4 y Laravel 13.7. Vite 8 y Capacitor 8 son versiones recientes (confirmar compatibilidad operativa en entorno real).
2. **Redis/colas en ejemplo:** configurados como `file/sync` en `.env.example` pese a existir servicio Redis; el stack "efectivo" puede variar por entorno.
3. **Stored procedures:** existen artefactos SQL y comando de carga; su uso real debe mapearse contra Repositories/Services/Controllers (ver `DATABASE_SCHEMA.md` / auditoría de datos).
4. **DomPDF instalado:** uso funcional (actas/reportes PDF) pendiente de confirmar en implementación.

## 9. Dependencias instaladas vs uso real (resumen)

- **Instaladas y con uso evidente:** Laravel core, Fortify, Socialite, Inertia, Vue, Vite, Tailwind, PWA plugin, Capacitor deps, SQL Server drivers en infra.
- **Instaladas, uso a confirmar en detalle:** DomPDF, Redis como backend activo, marked, algunas capacidades de passkeys/2FA en UI completa.
- **Dev tooling:** múltiples paquetes presentes por tooling; no forman parte del runtime de producción.
