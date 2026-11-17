/**
 * Grant or revoke the platform administrator role. Replaces the legacy hardcoded super-admin email.
 *
 *   bun run --filter @wasiyuq/api admin:grant -- user@example.com            # grant
 *   bun run --filter @wasiyuq/api admin:grant -- user@example.com --revoke   # revoke
 *
 * Uses DATABASE_URL (or TEST_DATABASE_URL when NODE_ENV=test). Every change is logged.
 */
import { createDatabase, loadDatabaseConfig, targetFromNodeEnv } from "@wasiyuq/db";
import { DrizzleUserRepository } from "@wasiyuq/module-identity";
import { log } from "../logger";

const [email, flag] = process.argv.slice(2);
if (!email || (flag && flag !== "--revoke")) {
  console.error("usage: admin:grant -- <email> [--revoke]");
  process.exit(2);
}

const database = createDatabase(loadDatabaseConfig(targetFromNodeEnv(process.env.NODE_ENV)));
try {
  const users = new DrizzleUserRepository(database.db);
  const user = await users.findByEmail(email);
  if (!user) {
    log("error", "user not found", { email });
    process.exitCode = 1;
  } else {
    const role = flag === "--revoke" ? "user" : "platform_admin";
    await users.setPlatformRole(user.id, role);
    log("info", "platform role changed", { userId: user.id, platformRole: role });
  }
} finally {
  await database.close();
}
