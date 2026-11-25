import crypto from "crypto";

const SECRET =
  process.env.BETTER_AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "megascript-digital-token-signing-secret-2026";

export interface TokenPayload {
  email: string;
  purpose: "confirm" | "unsubscribe";
  expiresAt: number;
}

/**
 * Generates a URL-safe signed HMAC token containing email, purpose, and expiration timestamp.
 */
export function generateSignedToken(
  email: string,
  purpose: "confirm" | "unsubscribe",
  expiresInHours: number = 72
): string {
  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = Date.now() + expiresInHours * 60 * 60 * 1000;
  const payloadStr = `${normalizedEmail}|${purpose}|${expiresAt}`;

  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(payloadStr);
  const signature = hmac.digest("base64url");

  const fullData = Buffer.from(payloadStr).toString("base64url");
  return `${fullData}.${signature}`;
}

/**
 * Validates a signed HMAC token against tamper and expiration.
 */
export function verifySignedToken(
  token: string,
  expectedPurpose?: "confirm" | "unsubscribe"
): { valid: boolean; email?: string; purpose?: string; error?: string } {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Missing token" };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "Malformed token" };
  }

  const [encodedPayload, signature] = parts;

  try {
    const payloadStr = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const [email, purpose, expiresAtStr] = payloadStr.split("|");

    if (!email || !purpose || !expiresAtStr) {
      return { valid: false, error: "Corrupted token payload" };
    }

    // Verify signature with timing-safe comparison
    const hmac = crypto.createHmac("sha256", SECRET);
    hmac.update(payloadStr);
    const expectedSignature = hmac.digest("base64url");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      return { valid: false, error: "Invalid token signature" };
    }

    // Check expiration
    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) {
      return { valid: false, error: "Token has expired" };
    }

    if (expectedPurpose && purpose !== expectedPurpose) {
      return { valid: false, error: `Invalid token purpose (expected ${expectedPurpose})` };
    }

    return {
      valid: true,
      email,
      purpose,
    };
  } catch (err: any) {
    return { valid: false, error: "Token verification exception" };
  }
}
