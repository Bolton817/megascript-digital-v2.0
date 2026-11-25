/**
 * Google Gemini Provider Adapter for Tony AI Assistant
 * Authoritative Reference: TDD Sheet 091 & Task 79
 * - Modern Google GenAI API endpoint
 * - Multi-turn conversational history with system instruction separation
 * - Bounded retry for transient 429/503 errors
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

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export const SUPPORTED_GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-1.5-pro",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

export const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class GeminiProviderAdapter implements ITonyAIProvider {
  readonly provider = "GEMINI" as const;

  getSupportedModels(): string[] {
    return SUPPORTED_GEMINI_MODELS;
  }

  getDefaultModel(): string {
    return DEFAULT_GEMINI_MODEL;
  }

  /**
   * Generates a grounded response turn using the configured Gemini model.
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
      throw new GeminiProviderError("API key is required for Gemini adapter", "AUTH_ERROR", 401);
    }

    const cleanModel = modelId?.trim() || DEFAULT_GEMINI_MODEL;
    const url = `${GEMINI_BASE_URL}/models/${cleanModel}:generateContent?key=${encodeURIComponent(apiKey)}`;

    // Format conversational contents for Gemini API (user | model)
    const formattedContents = this.formatContents(history, userMessage);

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: formattedContents,
      generationConfig: {
        temperature: Math.min(Math.max(temperature, 0), 1),
        maxOutputTokens,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    };

    const maxRetries = 2;
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const startTime = Date.now();
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        clearTimeout(timer);
        const latencyMs = Date.now() - startTime;

        if (!response.ok) {
          const status = response.status;
          const errorJson = await response.json().catch(() => ({}));
          const errorMessage = errorJson?.error?.message || `Gemini API HTTP ${status}`;

          // Retry on transient 429 (rate limit) or 503 (service unavailable)
          if ((status === 429 || status === 503) && attempt < maxRetries) {
            await sleep(attempt === 0 ? 600 : 1800);
            continue;
          }

          const category = this.categorizeHttpError(status, errorMessage);
          throw new GeminiProviderError(errorMessage, category, status);
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];

        if (!candidate) {
          const blockReason = data.promptFeedback?.blockReason;
          if (blockReason) {
            throw new GeminiProviderError(
              `Gemini response blocked by safety filters: ${blockReason}`,
              "CONTENT_BLOCKED"
            );
          }
          throw new GeminiProviderError("Gemini returned empty candidate list", "UNKNOWN");
        }

        if (candidate.finishReason === "SAFETY" || candidate.finishReason === "RECITATION") {
          throw new GeminiProviderError(
            `Generation flagged by filter: ${candidate.finishReason}`,
            "CONTENT_BLOCKED"
          );
        }

        const rawText = candidate.content?.parts?.map((p: any) => p.text || "").join("") || "";
        const cleanContent = stripEmojis(rawText);

        const usage = data.usageMetadata;
        const tokensUsed = usage?.totalTokenCount || Math.ceil((rawText.length + userMessage.length) / 4);

        return {
          content: cleanContent,
          model: cleanModel,
          provider: "GEMINI",
          latencyMs,
          tokensUsed,
          finishReason: candidate.finishReason || "STOP",
          rawUsage: usage
            ? {
                promptTokens: usage.promptTokenCount || 0,
                completionTokens: usage.candidatesTokenCount || 0,
                totalTokens: usage.totalTokenCount || 0,
              }
            : undefined,
        };
      } catch (err: any) {
        lastError = err;
        if (err.name === "AbortError") {
          throw new GeminiProviderError(`Gemini request timed out after ${timeoutMs}ms`, "TIMEOUT");
        }
        if (err instanceof GeminiProviderError) {
          throw err;
        }
        // Network / fetch level error
        if (attempt < maxRetries) {
          await sleep(600);
          continue;
        }
      }
    }

    throw new GeminiProviderError(
      lastError?.message || "Failed to generate reply from Gemini",
      "NETWORK_ERROR"
    );
  }

  /**
   * Performs an isolated synthetic ping to verify API credentials and connectivity.
   */
  async healthCheck(apiKey: string, modelId: string): Promise<ProviderHealthCheckResult> {
    const startTime = Date.now();
    const cleanModel = modelId?.trim() || DEFAULT_GEMINI_MODEL;

    try {
      const url = `${GEMINI_BASE_URL}/models/${cleanModel}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Hello" }] }],
          generationConfig: { maxOutputTokens: 5 },
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
          provider: "GEMINI",
          modelId: cleanModel,
          error: msg,
          category,
        };
      }

      return {
        ok: true,
        latencyMs,
        provider: "GEMINI",
        modelId: cleanModel,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      const isTimeout = err.name === "AbortError";
      return {
        ok: false,
        latencyMs,
        provider: "GEMINI",
        modelId: cleanModel,
        error: isTimeout ? "Health check timed out" : err.message || "Connection failed",
        category: isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
      };
    }
  }

  private formatContents(history: TonyMessageTurn[], userMessage: string) {
    const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    // Include recent history (excluding system messages which are in systemInstruction)
    for (const msg of history) {
      if (msg.role === "system") continue;
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // Append current user message
    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    return contents;
  }

  private categorizeHttpError(status: number, message: string): ProviderErrorCategory {
    if (status === 401 || status === 403 || message.toLowerCase().includes("api key")) {
      return "AUTH_ERROR";
    }
    if (status === 404 || message.toLowerCase().includes("not found")) {
      return "MODEL_NOT_FOUND";
    }
    if (status === 429) {
      return message.toLowerCase().includes("quota") ? "QUOTA_EXHAUSTED" : "RATE_LIMIT";
    }
    if (status >= 500) {
      return "NETWORK_ERROR";
    }
    return "UNKNOWN";
  }
}

export class GeminiProviderError extends Error {
  constructor(
    message: string,
    public category: ProviderErrorCategory = "UNKNOWN",
    public statusCode?: number
  ) {
    super(message);
    this.name = "GeminiProviderError";
  }
}
