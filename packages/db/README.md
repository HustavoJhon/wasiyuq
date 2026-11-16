# @wasiyuq/db

Database package for WASIYUQ 2.0 (PostgreSQL + Drizzle ORM).

- `src/schema/` — Drizzle schema definitions (to be implemented).
- `migrations/` — Drizzle-generated SQL migrations for PostgreSQL (exclusive migration path for 2.0).
- `drizzle.config.ts` — Drizzle Kit configuration.

> Legacy Laravel SQL Server migrations have been removed from `database/migrations/`.  
> `database/stored-procedures/`, `database/factories/`, and `database/seeders/` remain only as legacy references pending separate decisions.
