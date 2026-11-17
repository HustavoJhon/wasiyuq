# Infra (local development)

PostgreSQL 16 and Mailpit (local email sink) for WASIYUQ 2.0. All commands run from the repository root and read variables from the root `.env`
(`cp .env.example .env`).

```bash
COMPOSE="docker compose --env-file .env -f infra/docker/docker-compose.yml"
```

| Action | Command |
|---|---|
| Start | `$COMPOSE up -d` |
| Status / health | `$COMPOSE ps` (wait for `healthy`) |
| Logs | `$COMPOSE logs -f postgres` / `$COMPOSE logs -f mailpit` |
| psql shell | `$COMPOSE exec postgres psql -U wasiyuq -d wasiyuq_dev` |
| Stop (keeps data) | `$COMPOSE stop` |
| Stop and remove container (keeps data) | `$COMPOSE down` |

## Databases

| Database | Purpose | Variable |
|---|---|---|
| `wasiyuq_dev` | Local development | `DATABASE_URL` |
| `wasiyuq_test` | Isolated automated tests | `TEST_DATABASE_URL` |

`wasiyuq_test` is created by `postgres/initdb/01-create-test-database.sh` **only when the volume is first initialized**.
If your volume predates that script, create it manually (non-destructive):

```bash
$COMPOSE exec postgres createdb -U wasiyuq wasiyuq_test
```

## Ports

The host port defaults to **55432** (`POSTGRES_PORT`) and is bound to `127.0.0.1` only, so it does not clash with —
or get confused with — other PostgreSQL instances commonly listening on 5432.

## Mailpit (development email)

Mailpit accepts SMTP on `127.0.0.1:51025` (`MAILPIT_SMTP_PORT`) and shows every captured message at
<http://127.0.0.1:58025> (`MAILPIT_UI_PORT`). Nothing is delivered to real inboxes. Messages live in memory and are
lost when the container restarts. The API uses it when `MAIL_TRANSPORT=smtp` points at it (see `.env.example` and
`docs/technical/EMAIL_DELIVERY.md`). Mailpit is not part of any production setup.

## Isolation from the legacy stack

- Compose project name is `wasiyuq2`; container `wasiyuq2-postgres`; volume `wasiyuq2_postgres_data`.
- The legacy Laravel stack used project `wasiyuq` (containers `wasiyuq-sqlserver-1`, `wasiyuq-minio-1`, … and volumes
  `wasiyuq_sqlserver_data`, `wasiyuq_minio_data`, `wasiyuq_redis_data`). **Those hold original data and must never be
  stopped, removed or pruned from this setup.** Never run `docker compose -p wasiyuq ...`, `docker volume prune` or
  `docker system prune --volumes` on a machine that holds legacy data.

## Reset (manual, destructive — development data only)

No script performs a reset automatically. To wipe **only** the 2.0 development volume, verify the name first and run
each step by hand:

```bash
docker volume inspect wasiyuq2_postgres_data   # confirm it is the 2.0 volume
$COMPOSE down                                  # stop the 2.0 container
docker volume rm wasiyuq2_postgres_data        # removes 2.0 dev/test data only
$COMPOSE up -d                                 # re-initializes wasiyuq_dev + wasiyuq_test
```

Do **not** use `down -v` or `--remove-orphans` habitually; target volumes by explicit name.
