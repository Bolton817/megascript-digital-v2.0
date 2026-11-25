import crypto from "crypto";

export const VISITOR_TOKEN_COOKIE = "megascript_visitor_token";
export const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

export interface VisitorCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge: number;
}

export const DEFAULT_VISITOR_COOKIE_OPTIONS: VisitorCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: VISITOR_COOKIE_MAX_AGE,
};

/**
 * Generates a cryptographically strong 32-byte hexadecimal visitor token.
 */
export function generateVisitorToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Computes the SHA-256 hash of a visitor token for database persistence.
 * Raw visitor tokens are NEVER stored in the database.
 */
export function hashVisitorToken(token: string): string {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid token provided for hashing");
  }
  return crypto.createHash("sha256").update(token.trim()).digest("hex");
}

/**
 * Timing-safe comparison to verify that a supplied visitor token matches
 * the stored visitorTokenHash.
 */
export function verifyVisitorOwnership(storedHash: string, visitorToken: string): boolean {
  if (!storedHash || !visitorToken) {
    return false;
  }

  try {
    const computedHash = hashVisitorToken(visitorToken);
    const storedBuf = Buffer.from(storedHash, "hex");
    const computedBuf = Buffer.from(computedHash, "hex");

    if (storedBuf.length !== computedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(storedBuf, computedBuf);
  } catch {
    return false;
  }
}
