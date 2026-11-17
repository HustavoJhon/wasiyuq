import type { Context } from "hono";
import type { ZodTypeAny, z } from "zod";
import { HttpError } from "./errors";

/** Parse a JSON body with a Zod schema; invalid input → 400 VALIDATION_FAILED with field issues. */
export async function parseBody<S extends ZodTypeAny>(c: Context, schema: S): Promise<z.output<S>> {
  let raw: unknown;
  try {
    raw = await c.req.json();
  } catch {
    throw new HttpError("VALIDATION_FAILED", "El cuerpo de la solicitud debe ser JSON válido");
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new HttpError(
      "VALIDATION_FAILED",
      "Datos inválidos",
      result.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    );
  }
  return result.data;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Route ids must be UUIDs; anything else is a 404 (never reaches the database). */
export function uuidParam(c: Context, name: string): string {
  const value = c.req.param(name);
  if (!value || !UUID.test(value)) throw new HttpError("NOT_FOUND", "Recurso no encontrado");
  return value.toLowerCase();
}

/** Opaque tokens (invitation links): base64url, bounded length. */
export function tokenParam(c: Context, name: string): string {
  const value = c.req.param(name) ?? "";
  if (!/^[A-Za-z0-9_-]{20,128}$/.test(value)) throw new HttpError("NOT_FOUND", "Recurso no encontrado");
  return value;
}
