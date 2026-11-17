import { describe, expect, test } from "bun:test";
import { hashPassword as betterAuthHash, verifyPassword as betterAuthVerify } from "better-auth/crypto";
import { createPasswordHasher, defaultHashConcurrency, SCRYPT_PARAMS } from "../infrastructure/password-hasher";

/** Largest gap between 5 ms timer ticks while `work` runs: a direct measure of event-loop blocking. */
async function maxEventLoopLag<T>(work: () => Promise<T>): Promise<{ lagMs: number; result: T }> {
  let lagMs = 0;
  let last = performance.now();
  const timer = setInterval(() => {
    const now = performance.now();
    lagMs = Math.max(lagMs, now - last - 5);
    last = now;
  }, 5);
  try {
    const result = await work();
    return { lagMs, result };
  } finally {
    clearInterval(timer);
  }
}

describe("password hasher", () => {
  const hasher = createPasswordHasher({ concurrency: 4 });

  test("keeps Better Auth's scrypt parameters and storage format", async () => {
    expect(SCRYPT_PARAMS).toEqual({ N: 16384, r: 16, p: 1, dkLen: 64 });
    const hash = await hasher.hash("correct horse battery");
    expect(hash).toMatch(/^[0-9a-f]{32}:[0-9a-f]{128}$/);
    expect(hash).not.toContain("correct horse battery");
  });

  test("verifies hashes created by Better Auth (existing passwords keep working)", async () => {
    const legacy = await betterAuthHash("contraseña-existente");
    expect(await hasher.verify({ hash: legacy, password: "contraseña-existente" })).toBe(true);
    expect(await hasher.verify({ hash: legacy, password: "otra-contraseña" })).toBe(false);
  });

  test("hashes it creates verify with Better Auth (reversible rollout)", async () => {
    const hash = await hasher.hash("rollback-safe-password");
    expect(await betterAuthVerify({ hash, password: "rollback-safe-password" })).toBe(true);
  });

  test("normalizes Unicode the same way (NFKC)", async () => {
    const hash = await hasher.hash("ﬁesta-ñandú"); // "ﬁ" ligature normalizes to "fi"
    expect(await hasher.verify({ hash, password: "fiesta-ñandú" })).toBe(true);
  });

  test("uses a fresh salt per hash", async () => {
    const [a, b] = await Promise.all([hasher.hash("same-password"), hasher.hash("same-password")]);
    expect(a).not.toBe(b);
  });

  test("malformed stored hashes verify as false instead of throwing", async () => {
    for (const hash of ["", "nocolon", "abc:def", `${"0".repeat(32)}:${"z".repeat(128)}`, `${"0".repeat(32)}:${"0".repeat(64)}`]) {
      expect(await hasher.verify({ hash, password: "whatever-password" })).toBe(false);
    }
  });

  test("rejects invalid concurrency settings", () => {
    expect(() => createPasswordHasher({ concurrency: 0 })).toThrow(RangeError);
    expect(defaultHashConcurrency(1)).toBe(2);
    expect(defaultHashConcurrency(12)).toBe(6);
  });

  test("never runs more derivations than the concurrency limit", async () => {
    const limited = createPasswordHasher({ concurrency: 2 });
    let peak = 0;
    const sampler = setInterval(() => (peak = Math.max(peak, limited.stats().running)), 1);
    await Promise.all(Array.from({ length: 8 }, (_, i) => limited.hash(`password-${i}`)));
    clearInterval(sampler);
    expect(peak).toBeLessThanOrEqual(2);
    expect(limited.stats()).toEqual({ running: 0, queued: 0, concurrency: 2 });
  });

  test("concurrent hashing does not block the event loop", async () => {
    await hasher.hash("warm-up-password");
    const { lagMs, result } = await maxEventLoopLag(() =>
      Promise.all(Array.from({ length: 16 }, (_, i) => hasher.hash(`concurrent-password-${i}`))),
    );
    expect(result).toHaveLength(16);
    // A single synchronous scrypt derivation takes ~50-80 ms; 16 of them on the loop would stall it for >1 s.
    expect(lagMs).toBeLessThan(150);
  });
});
