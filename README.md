# WASIYUQ 2.0

WASIYUQ 2.0 is the technical rebuild of the Wasiyuq platform as a Bun/TypeScript modular monolith.

> Business/domain documentation and legacy audit remain in [`docs/`](docs/README.md).  
> Legacy Laravel implementation has been retired from the active runtime; reusable references are preserved in `legacy-assets/` and selected `database/` folders.

## Monorepo structure

- `apps/api` — Hono API (Bun + TypeScript)
- `apps/web` — React + Vite + TanStack Router/Query + Tailwind scaffold
- `apps/mobile` — React Native + Expo workspace (prepared, not implemented)
- `modules/*` — bounded-context module boundaries (identity, organizations, pets, adoptions, follow-ups, content, community, integrations)
- `packages/*` — shared packages (`core`, `db`, `auth`, `validation`, `api-client`, `ui`, `config`)
- `infra/docker` — development infrastructure (PostgreSQL)
- `docs/` — business, technical, and modernization documentation

## Prerequisites

- [Bun](https://bun.sh/) (recommended 1.2+)
- Docker + Docker Compose (for PostgreSQL dev service)

## Setup

```bash
bun install
cp .env.example .env
docker compose --env-file .env -f infra/docker/docker-compose.yml up -d   # PostgreSQL on 127.0.0.1:55432
bun run --filter @wasiyuq/db db:migrate                                    # apply migrations to wasiyuq_dev
```

See [`infra/docker/README.md`](infra/docker/README.md) (start/stop/logs/reset) and
[`docs/technical/DATABASE_FOUNDATION.md`](docs/technical/DATABASE_FOUNDATION.md) (env vars, migration workflow, safeguards).

## Development

```bash
bun run dev        # turbo dev (apps/packages)
bun run build      # turbo build
bun run lint       # turbo lint
bun run typecheck  # turbo typecheck
bun run test       # turbo test
```

### API only
```bash
bun run --filter @wasiyuq/api dev
# liveness:  GET http://localhost:3001/health   (process up, no database)
# readiness: GET http://localhost:3001/ready    (200 when PostgreSQL is reachable, 503 otherwise)
```

### Database
```bash
bun run --filter @wasiyuq/db db:generate       # generate SQL migrations from packages/db/src/schema
bun run --filter @wasiyuq/db db:migrate        # apply to DATABASE_URL (development)
bun run --filter @wasiyuq/db db:migrate:test   # apply to TEST_DATABASE_URL (test)
```
Migrations only run against databases listed in `DB_MIGRATION_ALLOWED_DATABASES`, on local hosts, never in production.

### Web only
```bash
bun run --filter @wasiyuq/web dev
# http://localhost:5173
```

## Notes

- Database/stack migration is in progress; original databases are not modified by this repository setup.
- Database foundation (PostgreSQL + Drizzle, Phase 2) is in place without business tables.
- Better Auth and business modules are not implemented yet.
- See `docs/development/LEGACY_CLEANUP_LOG.md` for cleanup record and risks.
