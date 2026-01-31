import { createDecipheriv } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const AUTH_TAG_LENGTH = 16;

export interface DecryptInput {
  /** Encrypted data as hex string */
  data: string;
  /** Initialization vector as hex string */
  iv: string;
  /** Authentication tag as hex string */
  authTag: string;
}

/**
 * Decrypt data encrypted with AES-256-GCM.
 *
 * @param encrypted - The encrypted data with IV and auth tag
 * @param key - 32-byte encryption key (derived from password + salt)
 * @returns Decrypted plaintext
 * @throws Error if decryption fails (wrong key or tampered data)
 */
export function decrypt(encrypted: DecryptInput, key: Buffer): string {
  const iv = Buffer.from(encrypted.iv, "hex");
  const authTag = Buffer.from(encrypted.authTag, "hex");
  const encryptedData = Buffer.from(encrypted.data, "hex");

  const decipher = createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
}

/**
 * Decrypt and parse as JSON object.
 */
export function decryptObject<T>(encrypted: DecryptInput, key: Buffer): T {
  const plaintext = decrypt(encrypted, key);
  return JSON.parse(plaintext) as T;
}

