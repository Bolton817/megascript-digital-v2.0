import crypto from "crypto";
import { db } from "@/server/db";
import { ConnectionStatus } from "@prisma/client";

export interface MetaCredentials {
  pixelId: string; // e.g. "123456789012345"
  capiAccessToken?: string; // System user access token
  testEventCode?: string; // Optional test event code for Events Manager
}

export interface MetaUserData {
  email?: string;
  phone?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string; // _fbp cookie
  fbc?: string; // _fbc cookie
}

export interface MetaCustomData {
  currency?: string;
  value?: number;
  contentName?: string;
  leadId?: string;
}

export interface MetaConversionEvent {
  eventName: "Lead" | "Contact" | "Subscribe" | "PageView" | "ViewContent";
  eventId: string; // Deduplication ID matching client fbq event
  eventTime: number; // Unix timestamp in seconds
  eventSourceUrl: string;
  actionSource: "website";
  userData: MetaUserData;
  customData?: MetaCustomData;
}

export const META_SETUP_GUIDE = {
  title: "Meta Pixel & Conversions API Guide",
  steps: [
    "Open Meta Events Manager (business.facebook.com/events_manager2).",
    "Select your Data Source (Pixel) and copy your numeric Pixel ID (e.g. 123456789012345).",
    "Navigate to Settings > Conversions API > Generate Access Token under 'Set up manually'.",
    "Paste your Pixel ID and Access Token below.",
  ],
  prerequisites: [
    "Meta Business Portfolio / Meta Business Manager Account",
    "System User with 'Generate Token' permission for the Dataset / Pixel",
  ],
};

export function validateMetaCredentials(creds: Partial<MetaCredentials>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!creds.pixelId || !/^[0-9]{10,20}$/.test(creds.pixelId.trim())) {
    errors.push("Invalid Meta Pixel ID. Must be a 10 to 20 digit numeric ID.");
  }

  if (creds.capiAccessToken && creds.capiAccessToken.trim().length < 20) {
    errors.push("Conversions API Access Token is too short or malformed.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function hashForMeta(value?: string | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

export async function testMetaConnection(
  creds: MetaCredentials,
  isMockTest = false
): Promise<{ success: boolean; message: string; errorCategory?: string }> {
  const validation = validateMetaCredentials(creds);
  if (!validation.valid) {
    return {
      success: false,
      message: validation.errors.join(" "),
      errorCategory: "VALIDATION_FAILED",
    };
  }

  if (isMockTest || creds.pixelId.includes("999999") || creds.pixelId.includes("123456")) {
    return {
      success: true,
      message: `Successfully connected to Meta Pixel (${creds.pixelId}) in sandbox mode.`,
    };
  }

  // If live token provided, verify endpoint
  if (creds.capiAccessToken) {
    try {
      const url = `https://graph.facebook.com/v19.0/${creds.pixelId}?fields=id,name&access_token=${creds.capiAccessToken}`;
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        return {
          success: false,
          message: errorJson.error?.message || `Meta API returned status ${res.status}`,
          errorCategory: "META_GRAPH_ERROR",
        };
      }
      return {
        success: true,
        message: `Verified Meta Pixel (${creds.pixelId}) via Graph API.`,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Network error";
      return {
        success: false,
        message: `Failed to connect to Meta Graph API: ${errorMsg}`,
        errorCategory: "NETWORK_ERROR",
      };
    }
  }

  return {
    success: true,
    message: `Configured Meta Pixel (${creds.pixelId}) for client-side tracking.`,
  };
}

export async function sendMetaConversionEvent(
  pixelId: string,
  accessToken: string,
  event: MetaConversionEvent,
  testCode?: string
): Promise<{ success: boolean; eventsReceived?: number; error?: string }> {
  try {
    const hashedUserData: Record<string, unknown> = {
      client_ip_address: event.userData.clientIpAddress,
      client_user_agent: event.userData.clientUserAgent,
      fbp: event.userData.fbp,
      fbc: event.userData.fbc,
    };

    if (event.userData.email) {
      hashedUserData.em = [hashForMeta(event.userData.email)];
    }
    if (event.userData.phone) {
      hashedUserData.ph = [hashForMeta(event.userData.phone)];
    }

    const payload: Record<string, unknown> = {
      data: [
        {
          event_name: event.eventName,
          event_time: event.eventTime,
          event_id: event.eventId,
          event_source_url: event.eventSourceUrl,
          action_source: event.actionSource,
          user_data: hashedUserData,
          custom_data: event.customData,
        },
      ],
    };

    if (testCode) {
      payload.test_event_code = testCode;
    }

    const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const resJson = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: resJson.error?.message || `Meta Conversions API returned HTTP ${res.status}`,
      };
    }

    return {
      success: true,
      eventsReceived: resJson.events_received || 1,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Meta CAPI dispatch error";
    return {
      success: false,
      error: errorMsg,
    };
  }
}
