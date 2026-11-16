import { describe, expect, test } from "bun:test";
import { app } from "../index";

describe("health", () => {
  test("GET /health returns ok", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.service).toBe("api");
    expect(typeof body.timestamp).toBe("string");
  });
});
