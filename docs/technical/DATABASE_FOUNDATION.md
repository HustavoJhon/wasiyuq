# Fundación de base de datos — WASIYUQ 2.0 (Fase 2)

**Fecha:** 2026-11-17  
**Alcance:** infraestructura PostgreSQL + Drizzle ORM para WASIYUQ 2.0. **No incluye esquemas de negocio ni migración de datos históricos** (fases posteriores).

## 1. Componentes

| Componente | Ubicación | Rol |
|---|---|---|
| PostgreSQL 16 (Docker) | `infra/docker/docker-compose.yml` | Proyecto Compose `wasiyuq2`, contenedor `wasiyuq2-postgres`, volumen `wasiyuq2_postgres_data`, puerto host `127.0.0.1:55432` |
| BD de test | `infra/docker/postgres/initdb/01-create-test-database.sh` | Crea `wasiyuq_test` al inicializar el volumen por primera vez |
| Paquete de BD | `packages/db` | Configuración tipada (Zod), cliente Drizzle + postgres.js, health check, runner de migraciones con salvaguardas |
| Esquema Drizzle | `packages/db/src/schema/` | `identity.ts` (users, sessions, accounts, verifications, rate_limits) y `organizations.ts` (organizations, memberships, invitations, contexts) desde Fase 3; sin tablas de negocio de mascotas/adopciones |
| Migraciones | `packages/db/migrations/` | Único directorio de migraciones de 2.0 (generadas por Drizzle Kit) |
| API | `apps/api` | `GET /health` (liveness) y `GET /ready` (readiness con BD), apagado ordenado |
| CI | `.github/workflows/tests.yml` | Servicio PostgreSQL efímero `wasiyuq_test` + migraciones + tests |

### API pública de `@wasiyuq/db` (`src/index.ts`)
`loadDatabaseConfig`, `targetFromNodeEnv`, `describeDatabase`, `DatabaseConfigError`, `createDatabase` (`DatabaseHandle` con `db`, `sql`, `close()`), `checkDatabaseHealth`, `runMigrations`, `hasMigrations`, `assertMigrationTargetAllowed`, `migrationTargetViolations`, `UnsafeDatabaseTargetError`, `schema`.

## 2. Variables de entorno (`.env` en la raíz, ver `.env.example`)

| Variable | Uso | Valor por defecto en ejemplo |
|---|---|---|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` | Credenciales del contenedor | `wasiyuq` / `wasiyuq` |
| `POSTGRES_DB` | BD de desarrollo creada por el contenedor | `wasiyuq_dev` |
| `POSTGRES_TEST_DB` | BD de test creada por `initdb` | `wasiyuq_test` |
| `POSTGRES_PORT` | Puerto host (solo loopback) | `55432` |
| `DATABASE_URL` | Conexión destino `development` (API, `db:migrate`) | `postgresql://wasiyuq:wasiyuq@127.0.0.1:55432/wasiyuq_dev` |
| `TEST_DATABASE_URL` | Conexión destino `test` (tests, `db:migrate:test`) | `postgresql://wasiyuq:wasiyuq@127.0.0.1:55432/wasiyuq_test` |
| `DB_MIGRATION_ALLOWED_DATABASES` | Lista explícita de BD que las migraciones pueden tocar | `wasiyuq_dev,wasiyuq_test` |
| `DB_POOL_MAX` | Conexiones máximas del pool (1–100) | `10` |
| `DB_CONNECT_TIMEOUT_SECONDS` | Timeout de conexión (1–120) | `5` |
| `NODE_ENV` | `test` → destino `test`; cualquier otro → `development` | `development` |

Las URL se validan con Zod: deben ser `postgres://`/`postgresql://` y con nombre de BD. URL de SQL Server, MySQL o SQLite se rechazan. Las credenciales nunca se registran (`describeDatabase` expone solo destino/host/puerto/BD).

## 3. Comandos

```bash
cp .env.example .env
docker compose --env-file .env -f infra/docker/docker-compose.yml up -d   # PostgreSQL (ver infra/docker/README.md)

bun run --filter @wasiyuq/db db:generate        # genera SQL desde src/schema (no conecta a ninguna BD)
bun run --filter @wasiyuq/db db:check           # verifica consistencia de migraciones generadas
bun run --filter @wasiyuq/db db:migrate         # aplica migraciones a DATABASE_URL (development)
bun run --filter @wasiyuq/db db:migrate:test    # aplica migraciones a TEST_DATABASE_URL (test)

bun run --filter @wasiyuq/api dev               # API: GET /health, GET /ready
bun run test                                     # incluye integración si TEST_DATABASE_URL es alcanzable
```

Inicio/parada/logs/reset del contenedor: `infra/docker/README.md`.

## 4. Flujo de migraciones

1. Definir/modificar tablas en `packages/db/src/schema/` (fases futuras).
2. `db:generate` → Drizzle Kit escribe SQL + `meta/` en `packages/db/migrations/`. Revisar el SQL y versionarlo.
3. `db:migrate:test` y `bun run test` contra `wasiyuq_test`.
4. `db:migrate` contra `wasiyuq_dev`.
5. Drizzle registra lo aplicado en `drizzle.__drizzle_migrations`; volver a ejecutar es idempotente.

Sin migraciones generadas, `db:migrate` informa `skipped`; con el `_journal.json` vacío actual, informa `applied` con `appliedTotal: 0` y solo crea el esquema de control `drizzle`.

**No usar** `drizzle-kit push`, `drizzle-kit migrate` ni `drizzle-kit drop`: omiten las salvaguardas. `drizzle.config.ts` no declara credenciales a propósito.

## 5. Salvaguardas (`packages/db/src/safety.ts`)

`runMigrations` las evalúa **antes de abrir cualquier conexión** y se niega si falla alguna:

- `NODE_ENV=production`.
- `DB_MIGRATION_ALLOWED_DATABASES` vacío o que no incluye la BD destino (sin valor implícito).
- Destino `test` cuya BD no termina en `_test`, o destino `development` que apunta a una BD `_test`.
- Host no local (`localhost`, `127.0.0.1`, `::1`, `postgres`).
- Indicadores del stack legacy: puertos 1433/1434 (SQL Server) o nombres de BD/usuario con `legacy|laravel|sqlserver|mssql|sqlite|forge|homestead`.

Tras conectar, además verifica que `current_database()` coincide con la BD configurada. El health check aplica la misma verificación (`UNEXPECTED_DATABASE`).

Garantías adicionales:
- Ningún script ejecuta `DROP DATABASE`, `migrate:fresh` ni resets. El único `DROP SCHEMA` existente está en los tests de integración y elimina únicamente los esquemas efímeros `probe_<id>` que esa ejecución creó en `wasiyuq_test`.
- El proyecto Compose (`wasiyuq2`) está separado del stack legacy (`wasiyuq`: contenedores `wasiyuq-sqlserver-1`, `wasiyuq-minio-1`… y volúmenes `wasiyuq_sqlserver_data`, `wasiyuq_minio_data`, `wasiyuq_redis_data`), que **no deben tocarse**.
- El puerto 55432 evita confusiones con otras instancias PostgreSQL locales en 5432/5433.

## 6. API: liveness vs readiness

| Endpoint | Depende de BD | Respuesta |
|---|---|---|
| `GET /health` | No | `200 {status:"ok"}` mientras el proceso vive |
| `GET /ready` | Sí | `200 {status:"ready", checks.database.status:"up"}`; `503 not_ready` con `down` + `code` (p. ej. `ECONNREFUSED`, `TIMEOUT`, `SHUTTING_DOWN`) o `not_configured` |

- Al arrancar se verifica la conexión y se registra `database connected` o `database connection failed` (JSON estructurado, sin credenciales). La API sigue viva si la BD no está disponible; `/ready` refleja el estado y se recupera solo.
- `SIGINT`/`SIGTERM`: readiness pasa a `SHUTTING_DOWN`, se deja de aceptar conexiones, se completan peticiones en curso y se cierra el pool.

## 7. Tests

| Suite | Cubre | Requiere BD |
|---|---|---|
| `packages/db/src/__tests__/config.test.ts` | Validación Zod, URLs no PostgreSQL, pool, ausencia de credenciales en logs | No |
| `packages/db/src/__tests__/safety.test.ts` | Todas las salvaguardas; rechazo sin conectar | No |
| `packages/db/src/__tests__/integration.test.ts` | Fallo de conexión; conexión real; BD inesperada; `drizzle-kit generate` + `runMigrations` idempotente en esquema efímero | Sí (`wasiyuq_test`) |
| `apps/api/src/__tests__/health.test.ts` | Liveness independiente de la BD | No |
| `apps/api/src/__tests__/readiness.test.ts` | `/ready` (not_configured, down sin filtrar secretos, shutting down, up); arranque y apagado ordenado del servidor | Parcial |

Las suites que requieren BD se omiten (no fallan) si `TEST_DATABASE_URL` no está definida o no es alcanzable; antes de ejecutarse validan el destino con las salvaguardas. En CI siempre se ejecutan contra un servicio PostgreSQL efímero. La tarea `test` de Turbo no usa caché porque depende del estado de la BD.

## 8. Limitaciones conocidas

- Migración aplicada: `0000_identity_organizations` (Fase 3). Sin tablas de pets, adoptions, follow-ups (fases posteriores).
- No hay configuración de producción: el destino `development` lee `DATABASE_URL`; las migraciones están bloqueadas con `NODE_ENV=production`. El despliegue requiere una decisión propia (gestión de secretos, TLS, rol de migración separado).
- `wasiyuq_test` solo se crea automáticamente en volúmenes nuevos; volúmenes previos requieren `createdb` manual.
- No hay migración de datos desde SQL Server/SQLite legacy ni traducción de stored procedures T-SQL.
- `lint` sigue siendo un placeholder (`echo`) en los paquetes.

## 9. Actualización Fase 3 (2026-11-17)

- Drizzle ORM 0.45.4 / drizzle-kit 0.31.11 (requisito de Better Auth). Zod 4.6.7.
- Migración `packages/db/migrations/0000_identity_organizations.sql`: solo `CREATE TABLE/INDEX` y claves foráneas (aditiva). Aplicada a `wasiyuq_dev` y `wasiyuq_test` con `db:migrate` / `db:migrate:test`; re-ejecución idempotente; `drizzle-kit check` sin conflictos; `db:generate` sin cambios pendientes.
- Restricciones y cascadas cubiertas por `packages/db/src/__tests__/schema.test.ts`.
- Variables nuevas de autenticación: ver `docs/technical/AUTHENTICATION.md` y `.env.example`.
- Salvaguardas de migración sin cambios (no se debilitaron).
