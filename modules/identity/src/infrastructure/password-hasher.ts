import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { availableParallelism } from "node:os";

/**
 * Password hashing for email/password accounts.
 *
 * Algorithm: scrypt (RFC 7914) through `node:crypto`, whose asynchronous form runs on the runtime's worker
 * thread pool in Bun and Node, so hashing never blocks the event loop.
 *
 * Parameters and storage format are identical to Better Auth 1.7's default (`@better-auth/utils/password`):
 * `N=16384, r=16, p=1, dkLen=64`, password normalized to NFKC, stored as `<saltHex>:<keyHex>` where the salt
 * passed to scrypt is the 32-character hex string itself. Every hash created before this module existed
 * verifies unchanged, and hashes created here verify with Better Auth's implementation.
 *
 * What it adds on top of the default:
 * - a concurrency limit: each scrypt call holds 128·N·r = 32 MiB, so an unbounded burst of sign-ups or
 *   sign-in attempts could exhaust memory and starve the thread pool shared with file/DNS work;
 * - constant-time comparison of derived keys;
 * - malformed stored hashes verify as `false` instead of throwing (no 500 that reveals a broken account).
 *
 * Nothing here logs: passwords, salts and derived keys never leave this module except as the stored hash.
 */

export const SCRYPT_PARAMS = { N: 16384, r: 16, p: 1, dkLen: 64 } as const;
const SCRYPT_MAXMEM = 128 * SCRYPT_PARAMS.N * SCRYPT_PARAMS.r * 2;
const SALT_BYTES = 16;
const HASH_PATTERN = /^[0-9a-f]{32}:[0-9a-f]{128}$/;

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  verify(input: { hash: string; password: string }): Promise<boolean>;
  /** Current number of running and queued derivations (for tests and diagnostics). */
  stats(): { running: number; queued: number; concurrency: number };
}

export interface PasswordHasherOptions {
  /** Maximum simultaneous scrypt derivations. Extra calls wait in a FIFO queue. */
  concurrency?: number;
}

/** Default concurrency: half the logical CPUs (at least 2), leaving room for the rest of the thread pool. */
export function defaultHashConcurrency(cpus: number = availableParallelism()): number {
  return Math.max(2, Math.floor(cpus / 2));
}

class Semaphore {
  private running = 0;
  private readonly waiters: Array<() => void> = [];

  constructor(readonly limit: number) {}

  async run<T>(task: () => Promise<T>): Promise<T> {
    if (this.running >= this.limit) await new Promise<void>((resolve) => this.waiters.push(resolve));
    else this.running++;
    try {
      return await task();
    } finally {
      const next = this.waiters.shift();
      // Hand the slot directly to the next waiter so `running` never exceeds the limit.
      if (next) next();
      else this.running--;
    }
  }

  stats() {
    return { running: this.running, queued: this.waiters.length, concurrency: this.limit };
  }
}

function deriveKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      SCRYPT_PARAMS.dkLen,
      { N: SCRYPT_PARAMS.N, r: SCRYPT_PARAMS.r, p: SCRYPT_PARAMS.p, maxmem: SCRYPT_MAXMEM },
      (error, key) => (error ? reject(error) : resolve(key)),
    );
  });
}

export function createPasswordHasher(options: PasswordHasherOptions = {}): PasswordHasher {
  const concurrency = options.concurrency ?? defaultHashConcurrency();
  if (!Number.isInteger(concurrency) || concurrency < 1) throw new RangeError("concurrency must be a positive integer");
  const limiter = new Semaphore(concurrency);

  return {
    async hash(password) {
      const salt = randomBytes(SALT_BYTES).toString("hex");
      const key = await limiter.run(() => deriveKey(password, salt));
      return `${salt}:${key.toString("hex")}`;
    },
    async verify({ hash, password }) {
      if (!HASH_PATTERN.test(hash)) return false;
      const [salt, expectedHex] = hash.split(":") as [string, string];
      const actual = await limiter.run(() => deriveKey(password, salt));
      return timingSafeEqual(actual, Buffer.from(expectedHex, "hex"));
    },
    stats: () => limiter.stats(),
  };
}
