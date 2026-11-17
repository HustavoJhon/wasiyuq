# @wasiyuq/db

Database package for WASIYUQ 2.0: PostgreSQL + Drizzle ORM, typed and validated configuration, connection lifecycle,
health checks and a guarded migration runner. Full guide (Spanish): [`docs/technical/DATABASE_FOUNDATION.md`](../../docs/technical/DATABASE_FOUNDATION.md).

## Layout

- `src/config.ts` — Zod-validated config per target (`development` → `DATABASE_URL`, `test` → `TEST_DATABASE_URL`).
- `src/client.ts` — `createDatabase(config)` → `{ db, sql, close() }` (lazy connection, idempotent close).
- `src/health.ts` — `checkDatabaseHealth(handle)` (never throws; verifies `current_database()`).
- `src/safety.ts` — migration safeguards (allow-list, local host only, dev/test separation, no production, no legacy).
- `src/migrate.ts`, `src/cli/migrate.ts` — guarded `runMigrations` and its CLI.
- `src/schema/` — Drizzle schema (intentionally empty: no business tables yet).
- `migrations/` — Drizzle Kit generated SQL (the only migration path for 2.0).

## Commands

```bash
bun run db:generate       # generate SQL from src/schema (no database connection)
bun run db:check          # check generated migrations
bun run db:migrate        # apply to DATABASE_URL (development)
bun run db:migrate:test   # apply to TEST_DATABASE_URL (test)
bun run test              # unit + integration (integration skipped if the test DB is unreachable)
```

Scripts load the repository root `.env`. Migrations refuse any database not listed in
`DB_MIGRATION_ALLOWED_DATABASES`. Do not use `drizzle-kit push|migrate|drop`: they bypass the safeguards.

> Legacy Laravel SQL Server migrations were removed from `database/migrations/`.
> `database/stored-procedures/`, `database/factories/` and `database/seeders/` remain only as legacy references pending separate decisions.
