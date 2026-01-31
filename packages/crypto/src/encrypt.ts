import { createCipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

export interface EncryptedData {
  /** Encrypted data as hex string */
  data: string;
  /** Initialization vector as hex string */
  iv: string;
  /** Authentication tag as hex string */
  authTag: string;
}

/**
 * Encrypt plaintext using AES-256-GCM.
 *
 * @param plaintext - The text to encrypt
 * @param key - 32-byte encryption key (derived from password + salt)
 * @returns Encrypted data with IV and auth tag
 */
export function encrypt(plaintext: string, key: Buffer): EncryptedData {
  // Generate random IV for each encryption
  const iv = randomBytes(IV_LENGTH);

  // Create cipher
  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  // Encrypt
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Get auth tag for integrity verification
  const authTag = cipher.getAuthTag();

  return {
    data: encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

/**
 * Encrypt a JavaScript object as JSON.
 */
export function encryptObject<T>(obj: T, key: Buffer): EncryptedData {
  return encrypt(JSON.stringify(obj), key);
}

