import { describe, expect, test } from "bun:test";
import { ApiClientError, createApiClient } from "../index";

const respond = (status: number, body: unknown) => async () =>
  new Response(body === null ? null : JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("api client", () => {
  test("maps the error envelope to ApiClientError with code and issues", async () => {
    const client = createApiClient({
      fetch: respond(400, { error: { code: "VALIDATION_FAILED", message: "Datos inválidos", issues: [{ path: "name", message: "corto" }] } }),
    });
    const error = await client.createOrganization("x").catch((e) => e);
    expect(error).toBeInstanceOf(ApiClientError);
    expect(error).toMatchObject({ status: 400, code: "VALIDATION_FAILED", issues: [{ path: "name", message: "corto" }] });
  });

  test("rejects responses that do not match the contract", async () => {
    const client = createApiClient({ fetch: respond(200, { user: { id: "not-a-uuid" } }) });
    await expect(client.me()).rejects.toThrow();
  });

  test("204 responses resolve to undefined and network failures become ApiClientError", async () => {
    expect(await createApiClient({ fetch: respond(204, null) }).removeMember("o", "u")).toBeUndefined();
    const offline = createApiClient({ fetch: async () => { throw new TypeError("offline"); } });
    await expect(offline.me()).rejects.toMatchObject({ code: "INTERNAL_ERROR", status: 0 });
  });
});
