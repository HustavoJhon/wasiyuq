import { describe, expect, test } from "bun:test";
import { createDatabase, loadDatabaseConfig } from "@wasiyuq/db";
import { createApp } from "../app";

describe("GET /health (liveness)", () => {
  test("returns ok without a database", async () => {
    const res = await createApp({ database: null }).request("/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.service).toBe("api");
    expect(typeof body.timestamp).toBe("string");
  });

  test("stays ok when the database is unreachable", async () => {
    const database = createDatabase(
      loadDatabaseConfig("test", { TEST_DATABASE_URL: "postgres://wasiyuq:x@127.0.0.1:1/wasiyuq_test", DB_CONNECT_TIMEOUT_SECONDS: "1" }),
    );
    const res = await createApp({ database }).request("/health");
    await database.close();
    expect(res.status).toBe(200);
  });
});
