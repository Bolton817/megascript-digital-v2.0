import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH_BYTES = 12; // 96 bits standard for GCM
const AUTH_TAG_LENGTH_BYTES = 16; // 128 bits standard for GCM

/**
 * Returns a 32-byte master encryption key derived via SHA-256 from application secrets.
 * Priority: ENCRYPTION_MASTER_KEY -> AI_ENCRYPTION_SECRET -> BETTER_AUTH_SECRET -> fallback salt
 */
function getDerivedMasterKey(): Buffer {
  const secretSource =
    process.env.ENCRYPTION_MASTER_KEY ||
    process.env.AI_ENCRYPTION_SECRET ||
    process.env.BETTER_AUTH_SECRET ||
    "megascript-digital-tony-ai-default-master-key-salt-2026";

  return crypto.createHash("sha256").update(secretSource).digest();
}

export interface EncryptedPayload {
  ciphertext: string; // hex
  iv: string; // hex
  authTag: string; // hex
}

/**
 * Encrypts a plaintext string (e.g. API key) using AES-256-GCM authenticated encryption.
 */
export function encryptSecret(plaintext: string): EncryptedPayload {
  if (!plaintext) {
    throw new Error("Cannot encrypt empty or null secret");
  }

  const masterKey = getDerivedMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH_BYTES);

  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);
  let ciphertext = cipher.update(plaintext, "utf8", "hex");
  ciphertext += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return {
    ciphertext,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

/**
 * Decrypts an AES-256-GCM encrypted payload. Throws if authentication tag verification fails (tampering detected).
 */
export function decryptSecret(ciphertext: string, ivHex: string, authTagHex: string): string {
  if (!ciphertext || !ivHex || !authTagHex) {
    throw new Error("Invalid parameters for secret decryption");
  }

  const masterKey = getDerivedMasterKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Packs encrypted payload into a single portable string: "iv:authTag:ciphertext"
 */
export function packEncryptedSecret(payload: EncryptedPayload): string {
  return `${payload.iv}:${payload.authTag}:${payload.ciphertext}`;
}

/**
 * Unpacks a portable string "iv:authTag:ciphertext" into its cryptographic components.
 */
export function unpackEncryptedSecret(packed: string): EncryptedPayload | null {
  if (!packed || typeof packed !== "string") return null;

  const parts = packed.split(":");
  if (parts.length !== 3) return null;

  const [iv, authTag, ciphertext] = parts;
  if (!iv || !authTag || !ciphertext) return null;

  return { iv, authTag, ciphertext };
}

/**
 * Encrypts a plaintext secret and returns the packed composite string.
 */
export function encryptToPackedString(plaintext: string): string {
  const encrypted = encryptSecret(plaintext);
  return packEncryptedSecret(encrypted);
}

/**
 * Decrypts a packed composite string ("iv:authTag:ciphertext"). Returns null if invalid or tampered.
 */
export function decryptFromPackedString(packed: string): string | null {
  try {
    const unpacked = unpackEncryptedSecret(packed);
    if (!unpacked) return null;
    return decryptSecret(unpacked.ciphertext, unpacked.iv, unpacked.authTag);
  } catch (err) {
    console.error("Failed to decrypt secret payload (tampered or invalid key):", err);
    return null;
  }
}

/**
 * Returns a masked representation of an API key for safe display in administrative UIs.
 * Never exposes the full plaintext. Example: "••••••••••••1a2b" or "••••••••••••"
 */
export function maskApiKey(apiKey?: string | null): string {
  if (!apiKey || typeof apiKey !== "string") {
    return "Not configured";
  }

  const trimmed = apiKey.trim();
  if (trimmed.length <= 6) {
    return "••••••••";
  }

  const visibleSuffix = trimmed.slice(-4);
  return `••••••••••••${visibleSuffix}`;
}
