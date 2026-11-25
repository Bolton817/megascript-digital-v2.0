/**
 * DeepSeek Provider Adapter for Tony AI Assistant
 * Authoritative Reference: TDD Sheet 092 & Task 80
 * - OpenAI-compatible chat completion endpoint
 * - Multi-turn conversational history with system message
 * - Bounded retry for transient 429/5xx errors
 * - Sanitized completion output enforcing Zero Emojis (TDD Sheet 080)
 * - Safe error mapping protecting credentials and server internals
 */

import { stripEmojis } from "../mock-provider";
import {
  ITonyAIProvider,
  TonyGenerationParams,
  TonyGenerationResult,
  ProviderHealthCheckResult,
  ProviderErrorCategory,
  TonyMessageTurn,
} from "./types";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export const SUPPORTED_DEEPSEEK_MODELS = [
  "deepseek-chat",
  "deepseek-reasoner",
];

export const DEFAULT_DEEPSEEK_MODEL = "deepseek-chat";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class DeepSeekProviderAdapter implements ITonyAIProvider {
  readonly provider = "DEEPSEEK" as const;

  getSupportedModels(): string[] {
    return SUPPORTED_DEEPSEEK_MODELS;
  }

  getDefaultModel(): string {
    return DEFAULT_DEEPSEEK_MODEL;
  }

  /**
   * Generates a grounded response turn using the configured DeepSeek model.
   */
  async generateReply(params: TonyGenerationParams): Promise<TonyGenerationResult> {
    const {
      systemPrompt,
      history,
      userMessage,
      temperature = 0.7,
      maxOutputTokens = 1024,
      timeoutMs = 15000,
      apiKey,
      modelId,
    } = params;

    if (!apiKey) {
      throw new DeepSeekProviderError("API key is required for DeepSeek adapter", "AUTH_ERROR", 401);
    }

    const cleanModel = modelId?.trim() || DEFAULT_DEEPSEEK_MODEL;

    // DeepSeek messages array: system -> prior turns -> new user turn
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
    ];

    for (const msg of history) {
      if (msg.role === "system") continue;
      messages.push({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      });
    }

    messages.push({ role: "user", content: userMessage });

    const requestBody: Record<string, any> = {
      model: cleanModel,
      messages,
      max_tokens: maxOutputTokens,
    };

    // deepseek-reasoner doesn't support custom temperature; deepseek-chat does
    if (cleanModel !== "deepseek-reasoner") {
      requestBody.temperature = Math.min(Math.max(temperature, 0), 2);
    }

    const maxRetries = 2;
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const startTime = Date.now();
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(DEEPSEEK_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        clearTimeout(timer);
        const latencyMs = Date.now() - startTime;

        if (!response.ok) {
          const status = response.status;
          const errorJson = await response.json().catch(() => ({}));
          const errorMessage = errorJson?.error?.message || `DeepSeek API HTTP ${status}`;

          // Retry on transient 429 or 5xx
          if ((status === 429 || status >= 500) && attempt < maxRetries) {
            await sleep(attempt === 0 ? 600 : 1800);
            continue;
          }

          const category = this.categorizeHttpError(status, errorMessage);
          throw new DeepSeekProviderError(errorMessage, category, status);
        }

        const data = await response.json();
        const choice = data.choices?.[0];

        if (!choice || !choice.message) {
          throw new DeepSeekProviderError("DeepSeek returned empty completion choice", "UNKNOWN");
        }

        const rawText = choice.message.content || "";
        const cleanContent = stripEmojis(rawText);

        const usage = data.usage;
        const tokensUsed = usage?.total_tokens || Math.ceil((rawText.length + userMessage.length) / 4);

        return {
          content: cleanContent,
          model: cleanModel,
          provider: "DEEPSEEK",
          latencyMs,
          tokensUsed,
          finishReason: choice.finish_reason || "stop",
          rawUsage: usage
            ? {
                promptTokens: usage.prompt_tokens || 0,
                completionTokens: usage.completion_tokens || 0,
                totalTokens: usage.total_tokens || 0,
              }
            : undefined,
        };
      } catch (err: any) {
        lastError = err;
        if (err.name === "AbortError") {
          throw new DeepSeekProviderError(`DeepSeek request timed out after ${timeoutMs}ms`, "TIMEOUT");
        }
        if (err instanceof DeepSeekProviderError) {
          throw err;
        }
        // Transient network error
        if (attempt < maxRetries) {
          await sleep(600);
          continue;
        }
      }
    }

    throw new DeepSeekProviderError(
      lastError?.message || "Failed to generate reply from DeepSeek",
      "NETWORK_ERROR"
    );
  }

  /**
   * Performs an isolated synthetic ping to verify API credentials and connectivity.
   */
  async healthCheck(apiKey: string, modelId: string): Promise<ProviderHealthCheckResult> {
    const startTime = Date.now();
    const cleanModel = modelId?.trim() || DEFAULT_DEEPSEEK_MODEL;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: cleanModel,
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 5,
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);
      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const msg = errJson?.error?.message || `HTTP ${res.status}`;
        const category = this.categorizeHttpError(res.status, msg);
        return {
          ok: false,
          latencyMs,
          provider: "DEEPSEEK",
          modelId: cleanModel,
          error: msg,
          category,
        };
      }

      return {
        ok: true,
        latencyMs,
        provider: "DEEPSEEK",
        modelId: cleanModel,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      const isTimeout = err.name === "AbortError";
      return {
        ok: false,
        latencyMs,
        provider: "DEEPSEEK",
        modelId: cleanModel,
        error: isTimeout ? "Health check timed out" : err.message || "Connection failed",
        category: isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
      };
    }
  }

  private categorizeHttpError(status: number, message: string): ProviderErrorCategory {
    if (status === 401 || status === 403 || message.toLowerCase().includes("authentication")) {
      return "AUTH_ERROR";
    }
    if (status === 402 || message.toLowerCase().includes("insufficient balance") || message.toLowerCase().includes("quota")) {
      return "QUOTA_EXHAUSTED";
    }
    if (status === 404 || message.toLowerCase().includes("model")) {
      return "MODEL_NOT_FOUND";
    }
    if (status === 429) {
      return "RATE_LIMIT";
    }
    if (status >= 500) {
      return "NETWORK_ERROR";
    }
    return "UNKNOWN";
  }
}

export class DeepSeekProviderError extends Error {
  constructor(
    message: string,
    public category: ProviderErrorCategory = "UNKNOWN",
    public statusCode?: number
  ) {
    super(message);
    this.name = "DeepSeekProviderError";
  }
}
