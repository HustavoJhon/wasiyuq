/**
 * Password hashing benchmark: throughput and event-loop blocking.
 *
 *   bun run --filter @wasiyuq/module-identity bench:hash
 *
 * Compares the production hasher (async scrypt on the thread pool, bounded concurrency) with Better Auth's
 * default and with a synchronous scrypt baseline, which shows what "blocking the event loop" would look like.
 * Uses throwaway passwords; prints numbers only.
 */
import { scryptSync, randomBytes } from "node:crypto";
import { availableParallelism } from "node:os";
import { hashPassword as betterAuthHash } from "better-auth/crypto";
import { createPasswordHasher, defaultHashConcurrency, SCRYPT_PARAMS } from "../src/infrastructure/password-hasher";

async function measure(label: string, n: number, work: (i: number) => Promise<unknown>) {
  let maxLag = 0;
  let last = performance.now();
  const timer = setInterval(() => {
    const now = performance.now();
    maxLag = Math.max(maxLag, now - last - 5);
    last = now;
  }, 5);
  const started = performance.now();
  await Promise.all(Array.from({ length: n }, (_, i) => work(i)));
  const total = performance.now() - started;
  // Count the final gap too: a fully blocking run never lets the timer fire at all.
  maxLag = Math.max(maxLag, performance.now() - last - 5);
  clearInterval(timer);
  console.log(
    `${label.padEnd(34)} n=${String(n).padStart(2)}  total=${total.toFixed(0).padStart(5)} ms  per-hash=${(total / n).toFixed(1).padStart(6)} ms  max event-loop lag=${maxLag.toFixed(0).padStart(4)} ms`,
  );
}

const syncHash = async (i: number) => {
  // Same parameters, synchronous API: runs on the event loop.
  scryptSync(`password-${i}`, randomBytes(16).toString("hex"), SCRYPT_PARAMS.dkLen, { ...SCRYPT_PARAMS, maxmem: 128 * SCRYPT_PARAMS.N * SCRYPT_PARAMS.r * 2 });
};

const hasher = createPasswordHasher();
console.log(`runtime: Bun ${Bun.version}; logical CPUs: ${availableParallelism()}; hasher concurrency: ${defaultHashConcurrency()}`);
console.log(`scrypt N=${SCRYPT_PARAMS.N} r=${SCRYPT_PARAMS.r} p=${SCRYPT_PARAMS.p} dkLen=${SCRYPT_PARAMS.dkLen} (32 MiB per derivation)\n`);
await hasher.hash("warm-up");
await betterAuthHash("warm-up");

for (const n of [1, 8, 32]) {
  await measure("wasiyuq hasher (async, bounded)", n, (i) => hasher.hash(`password-${i}`));
  await measure("better-auth default (async)", n, (i) => betterAuthHash(`password-${i}`));
  await measure("baseline: scryptSync (blocking)", n, syncHash);
  console.log();
}
