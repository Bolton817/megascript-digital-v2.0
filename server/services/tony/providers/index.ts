/**
 * Central AI Provider Router, Registry, and Bounded Fallback Engine
 * Authoritative Reference: TDD Sheets 090, 091, 092, 093 & Tasks 79-83
 */

import { db } from "@/server/db";
import { AIProvider, AIProviderConfig } from "@prisma/client";
import { decryptFromPackedString } from "@/server/services/security/encryption";
import { GeminiProviderAdapter, DEFAULT_GEMINI_MODEL } from "./gemini";
import { DeepSeekProviderAdapter, DEFAULT_DEEPSEEK_MODEL } from "./deepseek";
import {
  ITonyAIProvider,
  TonyGenerationParams,
  TonyGenerationResult,
  TonyMessageTurn,
  ProviderHealthCheckResult,
} from "./types";
import {
  generateGroundedTonyReply,
  MockResponseOptions,
  stripEmojis,
} from "../mock-provider";
import { TonyIntentState } from "../intent";

// Singleton Adapter Registry
const adapterRegistry: Record<AIProvider, ITonyAIProvider> = {
  [AIProvider.GEMINI]: new GeminiProviderAdapter(),
  [AIProvider.DEEPSEEK]: new DeepSeekProviderAdapter(),
};

export function getProviderAdapter(provider: AIProvider): ITonyAIProvider {
  const adapter = adapterRegistry[provider];
  if (!adapter) {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }
  return adapter;
}

/**
 * Resolves the operational API key for a provider configuration.
 * Priority: Decrypted DB key -> Server Environment Variable -> null
 */
export function resolveProviderApiKey(config: AIProviderConfig): string | null {
  if (config.encryptedApiKey) {
    const decrypted = decryptFromPackedString(config.encryptedApiKey);
    if (decrypted && decrypted.trim()) {
      return decrypted.trim();
    }
  }

  // Fallback to server environment variables
  if (config.provider === AIProvider.GEMINI) {
    return process.env.GEMINI_API_KEY?.trim() || null;
  }
  if (config.provider === AIProvider.DEEPSEEK) {
    return process.env.DEEPSEEK_API_KEY?.trim() || null;
  }

  return null;
}

/**
 * Retrieves the currently active AI provider configuration from the database.
 * Seeds baseline records if absent.
 */
export async function getActiveProviderConfig(): Promise<AIProviderConfig> {
  let active = await db.aIProviderConfig.findFirst({
    where: { isDefault: true, isEnabled: true },
  });

  if (!active) {
    // Fall back to any enabled provider
    active = await db.aIProviderConfig.findFirst({
      where: { isEnabled: true },
    });
  }

  if (!active) {
    // Seed default Gemini configuration if table is empty
    active = await db.aIProviderConfig.upsert({
      where: { provider: AIProvider.GEMINI },
      create: {
        provider: AIProvider.GEMINI,
        activeModel: DEFAULT_GEMINI_MODEL,
        temperature: 0.7,
        maxTokens: 1024,
        timeoutMs: 15000,
        dailyCeiling: 1000,
        isDefault: true,
        isEnabled: true,
      },
      update: {
        isDefault: true,
      },
    });

    // Also ensure DeepSeek config row exists
    await db.aIProviderConfig.upsert({
      where: { provider: AIProvider.DEEPSEEK },
      create: {
        provider: AIProvider.DEEPSEEK,
        activeModel: DEFAULT_DEEPSEEK_MODEL,
        temperature: 0.7,
        maxTokens: 1024,
        timeoutMs: 15000,
        dailyCeiling: 1000,
        isDefault: false,
        isEnabled: true,
      },
      update: {},
    });
  }

  return active;
}

/**
 * Checks if the total requests dispatched today have reached the configured daily ceiling.
 */
export async function checkDailyUsageCeiling(dailyCeiling: number): Promise<{
  exceeded: boolean;
  countToday: number;
  ceiling: number;
}> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const countToday = await db.chatMessage.count({
    where: {
      role: "assistant",
      createdAt: { gte: startOfDay },
    },
  });

  return {
    exceeded: countToday >= dailyCeiling,
    countToday,
    ceiling: dailyCeiling,
  };
}

export interface RouterDispatchOptions {
  systemPrompt: string;
  history: TonyMessageTurn[];
  userMessage: string;
  language?: string;
  route?: string;
  contextSnippets?: string[];
  intent?: TonyIntentState;
  promptVersion?: string;
  leadReferenceCode?: string;
  isDeclineOrSkip?: boolean;
}

export interface RouterDispatchResult {
  content: string;
  model: string;
  provider: "GEMINI" | "DEEPSEEK" | "MOCK";
  latencyMs: number;
  tokensUsed: number;
  isHandoffRequested: boolean;
  intent: TonyIntentState;
  leadCaptured: boolean;
  fallbackUsed?: boolean;
  errorCode?: string;
}

/**
 * Dispatches conversational message to the active AI provider with bounded fallback (TDD Sheet 090 & Task 83).
 */
export async function generateProviderTonyReply(
  options: RouterDispatchOptions
): Promise<RouterDispatchResult> {
  const {
    systemPrompt,
    history,
    userMessage,
    language = "en",
    route = "/",
    contextSnippets = [],
    intent = "INFORMATIONAL",
    promptVersion = "1.0.0",
    leadReferenceCode,
    isDeclineOrSkip = false,
  } = options;

  // 1. Fetch active provider configuration
  const config = await getActiveProviderConfig();

  // 2. Check Daily Usage Ceiling (TDD Sheet 093)
  const ceilingCheck = await checkDailyUsageCeiling(config.dailyCeiling);
  if (ceilingCheck.exceeded) {
    console.warn(`[Tony AI] Daily usage ceiling reached (${ceilingCheck.countToday}/${ceilingCheck.ceiling}). Falling back to grounded mock engine.`);
    const mockReply = generateGroundedTonyReply(userMessage, {
      language,
      route,
      contextSnippets,
      intent,
      promptVersion,
      leadReferenceCode,
      isDeclineOrSkip,
    });
    return {
      content: mockReply.content,
      model: `${mockReply.model}-ceiling-fallback`,
      provider: "MOCK",
      latencyMs: mockReply.latencyMs,
      tokensUsed: mockReply.tokensUsed,
      isHandoffRequested: mockReply.isHandoffRequested,
      intent: mockReply.intent,
      leadCaptured: mockReply.leadCaptured,
      fallbackUsed: true,
      errorCode: "DAILY_CEILING_EXCEEDED",
    };
  }

  // 3. Resolve API Key for active provider
  const apiKey = resolveProviderApiKey(config);

  if (!apiKey) {
    // No credentials supplied; safely fallback to grounded mock provider
    const mockReply = generateGroundedTonyReply(userMessage, {
      language,
      route,
      contextSnippets,
      intent,
      promptVersion,
      leadReferenceCode,
      isDeclineOrSkip,
    });
    return {
      content: mockReply.content,
      model: mockReply.model,
      provider: "MOCK",
      latencyMs: mockReply.latencyMs,
      tokensUsed: mockReply.tokensUsed,
      isHandoffRequested: mockReply.isHandoffRequested,
      intent: mockReply.intent,
      leadCaptured: mockReply.leadCaptured,
      fallbackUsed: false,
    };
  }

  // 4. Attempt Primary Provider Execution
  const primaryAdapter = getProviderAdapter(config.provider);
  const genParams: TonyGenerationParams = {
    systemPrompt,
    history,
    userMessage,
    temperature: config.temperature,
    maxOutputTokens: config.maxTokens,
    timeoutMs: config.timeoutMs,
    apiKey,
    modelId: config.activeModel,
  };

  try {
    const result = await primaryAdapter.generateReply(genParams);
    const isHandoff = intent === "HANDOFF_REQUESTED" || result.content.toLowerCase().includes("human team member");

    return {
      content: result.content,
      model: result.model,
      provider: result.provider,
      latencyMs: result.latencyMs,
      tokensUsed: result.tokensUsed,
      isHandoffRequested: isHandoff,
      intent,
      leadCaptured: !!leadReferenceCode,
      fallbackUsed: false,
    };
  } catch (primaryError: any) {
    console.error(`[Tony AI] Primary provider ${config.provider} failed:`, primaryError.message);

    // 5. Bounded Safe Fallback (TDD Sheet 090 & Task 83)
    if (config.isFallbackEnabled && config.fallbackProvider && config.fallbackProvider !== config.provider) {
      try {
        const fallbackConfig = await db.aIProviderConfig.findUnique({
          where: { provider: config.fallbackProvider },
        });

        if (fallbackConfig && fallbackConfig.isEnabled) {
          const fallbackKey = resolveProviderApiKey(fallbackConfig);
          if (fallbackKey) {
            const fallbackAdapter = getProviderAdapter(fallbackConfig.provider);
            const fallbackParams: TonyGenerationParams = {
              systemPrompt,
              history,
              userMessage,
              temperature: fallbackConfig.temperature,
              maxOutputTokens: fallbackConfig.maxTokens,
              timeoutMs: Math.min(fallbackConfig.timeoutMs, 10000), // bounded fallback timeout
              apiKey: fallbackKey,
              modelId: fallbackConfig.activeModel,
            };

            const fallbackResult = await fallbackAdapter.generateReply(fallbackParams);
            const isHandoff = intent === "HANDOFF_REQUESTED" || fallbackResult.content.toLowerCase().includes("human team member");

            return {
              content: fallbackResult.content,
              model: `${fallbackResult.model}-fallback`,
              provider: fallbackResult.provider,
              latencyMs: fallbackResult.latencyMs,
              tokensUsed: fallbackResult.tokensUsed,
              isHandoffRequested: isHandoff,
              intent,
              leadCaptured: !!leadReferenceCode,
              fallbackUsed: true,
              errorCode: primaryError.category || "PRIMARY_PROVIDER_FAILED",
            };
          }
        }
      } catch (fallbackError: any) {
        console.error(`[Tony AI] Fallback provider ${config.fallbackProvider} also failed:`, fallbackError.message);
      }
    }

    // 6. Final Grounded Safe Fallback (zero user crash, grounded response)
    const mockFallback = generateGroundedTonyReply(userMessage, {
      language,
      route,
      contextSnippets,
      intent,
      promptVersion,
      leadReferenceCode,
      isDeclineOrSkip,
    });

    return {
      content: mockFallback.content,
      model: `${mockFallback.model}-error-fallback`,
      provider: "MOCK",
      latencyMs: mockFallback.latencyMs,
      tokensUsed: mockFallback.tokensUsed,
      isHandoffRequested: mockFallback.isHandoffRequested,
      intent: mockFallback.intent,
      leadCaptured: mockFallback.leadCaptured,
      fallbackUsed: true,
      errorCode: primaryError.category || "EXECUTION_ERROR",
    };
  }
}
