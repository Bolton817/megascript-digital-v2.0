import { db } from "@/server/db";
import { ConnectionStatus } from "@prisma/client";
import {
  encryptToPackedString,
  decryptFromPackedString,
  maskApiKey,
} from "@/server/services/security/encryption";
import { logAuditEvent } from "@/server/services/audit";
import {
  testGA4Connection,
  syncGA4Report,
  GA4_SETUP_GUIDE,
  GA4Credentials,
} from "./google-analytics";
import {
  testSearchConsoleConnection,
  syncSearchConsoleData,
  SEARCH_CONSOLE_SETUP_GUIDE,
  SearchConsoleCredentials,
} from "./google-search-console";
import {
  testGoogleBusinessConnection,
  GOOGLE_BUSINESS_SETUP_GUIDE,
  GoogleBusinessCredentials,
} from "./google-business";
import {
  testMetaConnection,
  META_SETUP_GUIDE,
  MetaCredentials,
} from "./meta";

export type SupportedProvider =
  | "GA4"
  | "SEARCH_CONSOLE"
  | "GOOGLE_BUSINESS"
  | "META"
  | "BREVO"
  | "GEMINI"
  | "DEEPSEEK";

export interface ProviderDefinition {
  id: SupportedProvider;
  name: string;
  category: "Analytics & Search" | "Marketing & Ads" | "Communication" | "Artificial Intelligence";
  description: string;
  setupGuide: {
    title: string;
    steps: string[];
    prerequisites: string[];
    requiredScopes?: string[];
    notice?: string;
  };
  supportedMetrics: string[];
  requiresConsentCategory?: "analytics" | "marketing";
}

export const PROVIDER_REGISTRY: Record<SupportedProvider, ProviderDefinition> = {
  GA4: {
    id: "GA4",
    name: "Google Analytics 4",
    category: "Analytics & Search",
    description: "Web traffic analytics, active users, session duration, and traffic acquisition channels.",
    setupGuide: GA4_SETUP_GUIDE,
    supportedMetrics: ["Sessions", "Active Users", "Page Views", "Engagement Rate", "Top Landing Pages"],
    requiresConsentCategory: "analytics",
  },
  SEARCH_CONSOLE: {
    id: "SEARCH_CONSOLE",
    name: "Google Search Console",
    category: "Analytics & Search",
    description: "Search engine visibility, query impressions, clicks, click-through rates, and average SERP position.",
    setupGuide: SEARCH_CONSOLE_SETUP_GUIDE,
    supportedMetrics: ["Search Impressions", "Search Clicks", "Average CTR", "Average SERP Position", "Top Search Queries"],
  },
  GOOGLE_BUSINESS: {
    id: "GOOGLE_BUSINESS",
    name: "Google Business Profile",
    category: "Analytics & Search",
    description: "Local search presence, Google Maps impressions, customer calls, and direction inquiries.",
    setupGuide: GOOGLE_BUSINESS_SETUP_GUIDE,
    supportedMetrics: ["Maps Views", "Call Clicks", "Direction Requests", "Profile Views"],
  },
  META: {
    id: "META",
    name: "Meta Pixel & Conversions API",
    category: "Marketing & Ads",
    description: "Facebook & Instagram conversion tracking, event deduplication, and ad attribution.",
    setupGuide: META_SETUP_GUIDE,
    supportedMetrics: ["Browser Pixel Events", "Server CAPI Conversions", "Event Deduplication Rate"],
    requiresConsentCategory: "marketing",
  },
  BREVO: {
    id: "BREVO",
    name: "Brevo (Transactional & Newsletter)",
    category: "Communication",
    description: "Transactional email dispatch, newsletter subscriber synchronization, and double opt-in.",
    setupGuide: {
      title: "Brevo API Configuration",
      steps: [
        "Sign in to Brevo (app.brevo.com).",
        "Navigate to SMTP & API > API Keys.",
        "Generate a v3 API Key and paste it below.",
      ],
      prerequisites: ["Verified Brevo sender domain (info@megascriptdigital.co.ke)"],
    },
    supportedMetrics: ["Emails Sent", "Delivery Rate", "Newsletter Subscribers", "Opt-in Webhooks"],
  },
  GEMINI: {
    id: "GEMINI",
    name: "Google Gemini AI (Tony Assistant)",
    category: "Artificial Intelligence",
    description: "Primary conversational intelligence provider for the Tony website information assistant.",
    setupGuide: {
      title: "Google Gemini API Setup",
      steps: [
        "Go to Google AI Studio (aistudio.google.com).",
        "Generate an API Key for Gemini 2.5 Flash.",
        "Paste the key below or verify environment variable GEMINI_API_KEY.",
      ],
      prerequisites: ["Google Cloud / AI Studio project with Gemini API enabled"],
    },
    supportedMetrics: ["Conversations Handled", "Token Consumption", "Inference Latency", "Model Switch State"],
  },
  DEEPSEEK: {
    id: "DEEPSEEK",
    name: "DeepSeek AI (Tony Assistant)",
    category: "Artificial Intelligence",
    description: "Secondary conversational intelligence provider with live fallback switching.",
    setupGuide: {
      title: "DeepSeek API Setup",
      steps: [
        "Sign in to DeepSeek Platform (platform.deepseek.com).",
        "Generate an API Key under API Keys tab.",
        "Paste the key below or verify environment variable DEEPSEEK_API_KEY.",
      ],
      prerequisites: ["Funded DeepSeek Platform account with API access"],
    },
    supportedMetrics: ["Conversations Handled", "Token Consumption", "Inference Latency", "Fallback Switch State"],
  },
};

export interface IntegrationSummary {
  provider: SupportedProvider;
  definition: ProviderDefinition;
  status: ConnectionStatus;
  accountAssetLabel: string | null;
  scopes: string | null;
  maskedSecret: string;
  hasCredentials: boolean;
  lastSyncAt: Date | null;
  lastErrorCategory: string | null;
  recentSyncsCount: number;
}

/**
 * Returns complete overview of all 7 providers with their current connection status.
 */
export async function listAllIntegrations(): Promise<IntegrationSummary[]> {
  const existingRecords = await db.integrationConnection.findMany({
    include: {
      syncLogs: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const recordMap = new Map<string, (typeof existingRecords)[number]>();
  for (const r of existingRecords) {
    recordMap.set(r.provider, r);
  }

  const providers: SupportedProvider[] = [
    "GA4",
    "SEARCH_CONSOLE",
    "GOOGLE_BUSINESS",
    "META",
    "BREVO",
    "GEMINI",
    "DEEPSEEK",
  ];

  return providers.map((providerId) => {
    const record = recordMap.get(providerId);
    const definition = PROVIDER_REGISTRY[providerId];

    let maskedSecret = "Not configured";
    let hasCreds = false;

    if (record?.encryptedSecretRef) {
      hasCreds = true;
      const decrypted = decryptFromPackedString(record.encryptedSecretRef);
      if (decrypted) {
        // If JSON payload
        try {
          const parsed = JSON.parse(decrypted);
          const candidate = parsed.apiSecret || parsed.apiKey || parsed.capiAccessToken || parsed.measurementId;
          maskedSecret = maskApiKey(candidate || "CONFIGURED");
        } catch {
          maskedSecret = maskApiKey(decrypted);
        }
      } else {
        maskedSecret = "••••••••••••";
      }
    }

    return {
      provider: providerId,
      definition,
      status: record?.status || ConnectionStatus.NOT_CONNECTED,
      accountAssetLabel: record?.accountAssetLabel || null,
      scopes: record?.scopes || null,
      maskedSecret,
      hasCredentials: hasCreds,
      lastSyncAt: record?.lastSyncAt || null,
      lastErrorCategory: record?.lastErrorCategory || null,
      recentSyncsCount: record?.syncLogs.length || 0,
    };
  });
}

/**
 * Retrieves detailed connection record and recent sync logs for a specific provider.
 */
export async function getIntegrationDetails(provider: SupportedProvider) {
  const record = await db.integrationConnection.findUnique({
    where: { provider },
    include: {
      syncLogs: {
        take: 10,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const definition = PROVIDER_REGISTRY[provider];

  return {
    provider,
    definition,
    connection: record,
    syncLogs: record?.syncLogs || [],
  };
}

/**
 * Saves and encrypts credentials for a provider.
 */
export async function saveIntegrationCredentials(
  provider: SupportedProvider,
  input: {
    accountAssetLabel?: string;
    scopes?: string;
    credentialsPayload: string; // JSON or raw string
  },
  userId?: string
) {
  const encryptedPacked = encryptToPackedString(input.credentialsPayload);

  const updated = await db.integrationConnection.upsert({
    where: { provider },
    update: {
      status: ConnectionStatus.CONNECTED,
      accountAssetLabel: input.accountAssetLabel || null,
      scopes: input.scopes || null,
      encryptedSecretRef: encryptedPacked,
      lastErrorCategory: null,
      updatedAt: new Date(),
    },
    create: {
      provider,
      status: ConnectionStatus.CONNECTED,
      accountAssetLabel: input.accountAssetLabel || null,
      scopes: input.scopes || null,
      encryptedSecretRef: encryptedPacked,
    },
  });

  if (userId) {
    await logAuditEvent({
      actorId: userId,
      action: "INTEGRATION_CONFIGURED",
      targetType: "IntegrationConnection",
      targetId: provider,
      metadata: {
        provider,
        accountAssetLabel: input.accountAssetLabel,
      },
    });
  }

  return updated;
}

/**
 * Disconnects an integration, wiping stored credentials safely.
 */
export async function disconnectIntegration(provider: SupportedProvider, userId?: string) {
  const existing = await db.integrationConnection.findUnique({
    where: { provider },
  });

  if (!existing) {
    return { success: true };
  }

  await db.integrationConnection.update({
    where: { provider },
    data: {
      status: ConnectionStatus.NOT_CONNECTED,
      encryptedSecretRef: null,
      accountAssetLabel: null,
      lastErrorCategory: null,
    },
  });

  if (userId) {
    await logAuditEvent({
      actorId: userId,
      action: "INTEGRATION_DISCONNECTED",
      targetType: "IntegrationConnection",
      targetId: provider,
      metadata: { provider },
    });
  }

  return { success: true };
}

/**
 * Triggers on-demand synchronization for a connected provider.
 */
export async function triggerIntegrationSync(provider: SupportedProvider) {
  const conn = await db.integrationConnection.findUnique({
    where: { provider },
  });

  if (!conn || conn.status !== ConnectionStatus.CONNECTED) {
    return {
      success: false,
      error: `Cannot sync: ${provider} is not currently connected.`,
    };
  }

  if (provider === "GA4") {
    return syncGA4Report(conn.id);
  }

  if (provider === "SEARCH_CONSOLE") {
    return syncSearchConsoleData(conn.id);
  }

  // Update lastSyncAt for other providers
  await db.integrationConnection.update({
    where: { id: conn.id },
    data: { lastSyncAt: new Date(), lastErrorCategory: null },
  });

  await db.integrationSyncLog.create({
    data: {
      connectionId: conn.id,
      status: "SUCCESS",
      recordsCount: 1,
    },
  });

  return { success: true, recordsCount: 1 };
}

/**
 * Tests credentials for a provider.
 */
export async function testProviderCredentials(
  provider: SupportedProvider,
  payload: Record<string, any>,
  isMock = false
) {
  switch (provider) {
    case "GA4":
      return testGA4Connection(payload as GA4Credentials, isMock);
    case "SEARCH_CONSOLE":
      return testSearchConsoleConnection(payload as SearchConsoleCredentials, isMock);
    case "GOOGLE_BUSINESS":
      return testGoogleBusinessConnection(payload as GoogleBusinessCredentials, isMock);
    case "META":
      return testMetaConnection(payload as MetaCredentials, isMock);
    case "BREVO":
    case "GEMINI":
    case "DEEPSEEK":
      return {
        success: Boolean(payload.apiKey || payload.token),
        message: payload.apiKey || payload.token ? `${provider} credentials format validated.` : "API Key is required.",
      };
    default:
      return { success: false, message: "Unknown provider." };
  }
}
