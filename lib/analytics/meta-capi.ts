import crypto from "crypto";

export function generateConversionEventId(prefix = "ev"): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(6).toString("hex");
  return `${prefix}_${timestamp}_${random}`;
}
