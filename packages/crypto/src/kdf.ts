import { pbkdf2Sync, randomBytes } from "node:crypto";

const ITERATIONS = 100000;
const KEY_LENGTH = 32; // 256 bits for AES-256
const DIGEST = "sha256";

/**
 * Generate a random salt for user encryption key derivation.
 * This salt is stored in the database per-user.
 */
export function generateSalt(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Derive an encryption key from user password and salt.
 * The derived key is NEVER stored - only the salt is stored.
 *
 * @param password - User's password
 * @param salt - User's unique salt (stored in DB)
 * @returns 32-byte key as Buffer
 */
export function deriveKey(password: string, salt: string): Buffer {
  return pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
}

/**
 * Derive key and return as hex string.
 */
export function deriveKeyHex(password: string, salt: string): string {
  return deriveKey(password, salt).toString("hex");
}

