# Registro de limpieza del legado (Fase 1)

**Fecha:** 2026-11-16  
**Rama:** `dev`  
**Base:** Fase 0 completada (`161b3c7`), documentación íntegra en `docs/`.  
**Alcance:** retiro del stack operativo Laravel/PHP/Inertia/Vue y preparación del monorepo Bun/TypeScript (sin implementar módulos de negocio, sin deploy, sin modificar bases de datos originales).

## 1. Estado previo (verificado)
- Stack legacy presente: Laravel 13/PHP (app, bootstrap, config, routes, resources Blade/Vue-Inertia, tests Pest/PHPUnit, artisan, composer), frontend Vue 3 + Inertia v3 + Vite + Tailwind + shadcn-vue, Capacitor, Docker (Nginx/PHP/SQL Server/Redis/MinIO/Mailpit), Makefile.
- Artefactos runtime/build locales: `node_modules/`, `vendor/`, `public/build/`, `public/dist/`, caches/logs de `storage/`.
- Referencias de datos en repo (al inicio de Fase 1): `database/migrations/` (Laravel, **retirado posteriormente**), `database/factories/`, `database/seeders/`, `database/stored-procedures/`.
- Archivo sensible local detectado: `.env` (preservado localmente como `.env.legacy`, no versionado).

## 2. Conservado (protegido)
- **Documentación íntegra:** `docs/**` (business, domain, functional, technical, modernization, development, `TRACEABILITY_MATRIX.md`, `FINAL_AUDIT_REPORT.md`, etc.).
- **Referencias legacy de BD conservadas (no operativas en 2.0, decisión independiente):** `database/stored-procedures/**`, `database/factories/**`, `database/seeders/**`.
- **Respaldos/referencias legacy y recursos reutilizables:**
  - `legacy-assets/public/**` (favicons, íconos PWA, imágenes hero, OG, QR Yape, offline/robots/placeholder, verificación Google).
  - `legacy-assets/docs-ref/{README.legacy.md,docker-compose.legacy.yml,.env.legacy.example,Makefile.legacy}`.
- **Copia local no versionada:** `.env.legacy` (contenido legacy preservado; ignorado por git).
- **No modificadas/borradas:** bases de datos originales, respaldos externos/SQL Server, archivos históricos de usuarios/adopciones/fotos/documentos/certificados (no presentes como activos gestionados por esta limpieza más allá de lo ya existente en repo).

## 3. Eliminado / reemplazado (por commit)

| Commit | Cambio |
|---|---|
| `9cc42e5` | Creación de registro de limpieza y respaldo de activos/referencias legacy en `legacy-assets/**`. |
| `8b77756` | Eliminación de código de aplicación Laravel: `app/`, `bootstrap/`, `config/`, `routes/`, `resources/`, `tests/`, `capacitor/`. |
| `50c3612` | Retiro del backup local `.env.legacy` del índice (quedó local e ignorado). |
| `90fcf88` | Eliminación de artefactos PHP/Composer: `artisan`, `composer.json`, `composer.lock`, `phpunit.xml`, `pint.json`. |
| `b83558b` | Eliminación de tooling/config legacy y artefactos: `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `.npmrc`, `components.json`, `pnpm-workspace.yaml`, `Makefile`, `docker/`, `docker-compose.yml`, `public/index.php`, `public/.htaccess`, `public/dist/**`, `task/`, caches/logs runtime de `storage/`. |
| `28f31e0` | Eliminación del `.env` trackeado del índice (evita versionar secretos/locales; `.env*` ignorados con excepciones de ejemplo). |
| `a7b833c`–`78e1923` (y fixes intermedios) | Reemplazo por fundación monorepo 2.0: workspaces Bun, Turbo, tsconfig base, paquetes, módulos, apps, infra Docker PostgreSQL, `.env.example`, README 2.0, lockfile y ajustes de verificación. |
| `f02d015` | Eliminación de migraciones legacy Laravel: `database/migrations/**` (26 migraciones PHP + `stored_procedures/.gitkeep`). |
| `0fd4f4e` | Preparación de estructura de migraciones 2.0 en `packages/db` (Drizzle ORM + PostgreSQL): `migrations/`, `drizzle.config.ts`, `src/schema/`, README (sin esquema funcional). |
| (este lote) | Actualización de documentación/configuración para reflejar que migraciones 2.0 viven en `packages/db/migrations/` y que `database/migrations/**` ya no forma parte del proyecto operativo; workflows CI actualizados a Bun/Turbo. |

**Dependencias operativas retiradas del nuevo proyecto:** Laravel, PHP, Composer, Inertia, Vue (y tooling específico asociado).  
**Migraciones:** las migraciones de WASIYUQ 2.0 pertenecen exclusivamente a `packages/db/migrations/` (Drizzle). `database/migrations/**` legacy eliminado; `database/factories/**`, `database/seeders/**`, `database/stored-procedures/**` se conservan como referencias legacy pendientes de decisión independiente.  
**No retirado del disco por permisos (root-owned, no trackeado en git):** `vendor/**`; parte de `public/build/**` (symlink `public/storage` también root-owned). `vendor/` permanece ignorado por `.gitignore`.

## 4. Reemplazos introducidos (nuevo stack)

### Estructura creada
- `apps/api` — Hono + TypeScript (Bun), endpoint `GET /health`, logging JSON estructurado, prueba básica (`bun:test`).
- `apps/web` — React 19 + Vite 6 + TanStack Router/Query + Tailwind CSS (scaffold funcional).
- `apps/mobile` — workspace preparado React Native + Expo (sin implementación funcional).
- `modules/{identity,organizations,pets,adoptions,follow-ups,content,community,integrations}` — límites de módulos con `package.json`, `tsconfig`, `src/index.ts` y exportación encapsulada mínima.
- `packages/{core,db,auth,validation,api-client,ui,config}` — paquetes compartidos mínimos (`validation` con Zod `healthResponseSchema`; `db/auth` preparados como base).
- `infra/docker/docker-compose.yml` — PostgreSQL 16 para desarrollo.
- Raíz: `package.json` (Bun workspaces), `turbo.json`, `tsconfig.base.json`, `.gitignore`, `.env.example`, `README.md`, `bun.lock`.

### Tecnologías instaladas/configuradas (versiones efectivas en lock/resolución)
- **Runtime/tooling:** Bun 1.3.14 (entorno), Turbo 2.11.11, TypeScript 5.9.3.
- **Backend:** Hono 4.7.x, Zod 3.24.x (validation), Drizzle ORM 0.44.x + postgres 3.4.x + drizzle-kit 0.30.x (paquete `db` preparado).
- **Frontend:** React 19.3.x, Vite 6.4.x, TanStack Router 1.114.x, TanStack Query 5.66.x, Tailwind CSS 3.4.17, PostCSS/Autoprefixer.
- **Móvil (preparado):** Expo ~52, React Native 0.76 (workspace placeholder).
- **Infra:** PostgreSQL 16 Alpine (imagen Docker Compose).

## 5. Pendientes de migración posterior
- Migración de datos desde SQL Server legado a PostgreSQL; estrategia para stored procedures/T-SQL; preservación de archivos/media/documentos y respaldos.
- Paridad funcional de módulos de negocio (identity, organizations, pets, adoptions, follow-ups, content, community, integrations) según `docs/development/TRACEABILITY_MATRIX.md`.
- Evaluación e integración real de autenticación (Better Auth u alternativa) con paridad de Fortify/Socialite/equipos/roles.
- Decisiones aprobadas pendientes registradas en docs: uso de SPs vs ORM/SQL, acta/certificado, campos de seguimiento, flujo complete/cancel, proveedor auth definitivo, Hono/Elysia definitivo, SEO/SSR, alcance móvil.
- Limpieza física en entorno con permisos de `vendor/**` y `public/build/**` residuales (root-owned).

## 6. Riesgos remanentes
- **Permisos en disco:** `vendor/` y parte de `public/build/` no pudieron eliminarse por ser root-owned (no trackeados; ignorados). Requiere limpieza con permisos adecuados en el entorno.
- **Historial git:** commit `b83558b` renombró `.env` trackeado en el historial (el contenido previo puede permanecer en la historia del repo); el archivo fue retirado del índice en `28f31e0` y `.env*` está ignorado. Rotar secretos si el historial es compartido/sensible.
- **Puertos Docker en entorno de verificación:** `docker compose up` no pudo publicar puertos `5432/5433/55432` por estar asignados en el host durante la prueba; `docker compose config` fue válido y la imagen PostgreSQL se obtuvo. Se requiere un puerto/host libre para levantar el servicio.
- Backups reales de BD/archivos/secretos no verificables desde este repo.
- Versiones del stack sujetas a evolución; shadcn/ui queda preparado a nivel de stack frontend (scaffold Tailwind) sin componentes generados aún.

## 7. Verificaciones (ejecutadas 2026-11-16)

| Verificación | Resultado |
|---|---|
| `bun --version` | `1.3.14` |
| `bun install` | OK (lockfile `bun.lock` generado/actualizado) |
| `bun run typecheck` (`turbo typecheck`) | OK — 18/18 tareas exitosas |
| `bun run lint` (`turbo lint`) | OK — 18/18 tareas exitosas |
| `bun run test` (`turbo test`) | OK — 19/19 tareas exitosas; incluye `apps/api` health test (`GET /health` 200, 1 pass). Paquetes sin tests usan `--pass-with-no-tests`. |
| `bun run build` (`turbo build`) | OK — 18/18 tareas exitosas (Vite web build generado en `dist/`; aviso no bloqueante por outputs de `@wasiyuq/mobile`). |
| `docker compose -f infra/docker/docker-compose.yml config` | OK (configuración válida). `up -d` intentado: imagen PostgreSQL obtenida, pero bind de puertos falló por puertos ya asignados en el host (`5432/5433/55432`). |
| API Hono responde | OK — `bun run --filter @wasiyuq/api dev` (PORT 3101), `GET /health` → `{"status":"ok","service":"api",...}` con logs JSON estructurados. |
| Frontend React inicia | OK — `bun run --filter @wasiyuq/web dev` (Vite en `127.0.0.1:5174`), respuesta HTTP 200 y HTML de la app servido. |

**Conclusión de fase:** fundación técnica 2.0 operativa en monorepo (install/build/lint/typecheck/test/API/web verificados). Quedan pendientes de entorno/permisos y trabajo funcional de módulos de negocio y migración de datos.