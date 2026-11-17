import { defineConfig } from "drizzle-kit";

// Drizzle Kit is used ONLY to generate SQL migrations from src/schema (`bun run db:generate`).
// Generation does not connect to any database. Migrations are applied exclusively through
// `bun run db:migrate` / `db:migrate:test`, which enforce the safeguards in src/safety.ts.
// Do not use `drizzle-kit push`, `drizzle-kit migrate` or `drizzle-kit drop`: they bypass those safeguards.
export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  strict: true,
  verbose: true,
});
