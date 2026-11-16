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
docker compose -f infra/docker/docker-compose.yml up -d
```

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
# health check: GET http://localhost:3001/health
```

### Web only
```bash
bun run --filter @wasiyuq/web dev
# http://localhost:5173
```

## Notes

- Database/stack migration is in progress; original databases are not modified by this repository setup.
- Better Auth and business modules are not implemented yet (Phase 1 foundation only).
- See `docs/development/LEGACY_CLEANUP_LOG.md` for cleanup record and risks.
