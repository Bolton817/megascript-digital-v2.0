/**
 * Standard First-Party Event Taxonomy & Strict PII Sanitization
 * Authoritative Reference: TDD Sheet 074, 086 & Task 86
 */

import { z } from "zod";

export const ANALYTICS_EVENT_NAMES = [
  "page_view",
  "search_query",
  "site_search",
  "search_click",
  "product_click",
  "product_outbound_click",
  "service_click",
  "cta_click",
  "contact_form_view",
  "contact_form_submit",
  "chat_opened",
  "chat_message_sent",
  "chat_lead_captured",
  "newsletter_subscribed",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_PATTERN = /(\+?[0-9\s\-()]{7,18})/g;

/**
 * Recursively inspects and sanitizes metadata objects to remove any accidental PII.
 */
export function sanitizeEventMetadata(data: any): any {
  if (!data || typeof data !== "object") {
    if (typeof data === "string") {
      let cleaned = data;
      if (cleaned.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
        cleaned = cleaned.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]");
      }
      if (cleaned.match(/(\+?[0-9\s\-()]{7,18})/) && cleaned.replace(/\D/g, "").length >= 7) {
        cleaned = cleaned.replace(/(\+?[0-9\s\-()]{7,18})/g, "[REDACTED_PHONE]");
      }
      return cleaned;
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeEventMetadata);
  }

  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    // Exclude sensitive keys entirely
    if (
      lowerKey.includes("email") ||
      lowerKey.includes("phone") ||
      lowerKey.includes("password") ||
      lowerKey.includes("token") ||
      lowerKey.includes("card") ||
      lowerKey.includes("name")
    ) {
      continue;
    }
    cleaned[key] = sanitizeEventMetadata(value);
  }

  return cleaned;
}

export const analyticsEventSchema = z.object({
  eventName: z.enum(ANALYTICS_EVENT_NAMES),
  route: z.string().min(1).max(500),
  component: z.string().max(100).optional(),
  sourceChannel: z.string().max(100).optional(),
  sessionId: z.string().max(100).optional(),
  consentGiven: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
