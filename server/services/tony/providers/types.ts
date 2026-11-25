/**
 * Unified Tony AI Assistant Provider Contracts & Types
 * Authoritative Reference: TDD Sheets 090, 091, 092, 093
 */

export interface TonyMessageTurn {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface TonyGenerationParams {
  systemPrompt: string;
  history: TonyMessageTurn[];
  userMessage: string;
  temperature?: number;
  maxOutputTokens?: number;
  timeoutMs?: number;
  apiKey: string;
  modelId: string;
}

export interface TonyGenerationResult {
  content: string;
  model: string;
  provider: "GEMINI" | "DEEPSEEK";
  latencyMs: number;
  tokensUsed: number;
  finishReason?: string;
  rawUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export type ProviderErrorCategory =
  | "AUTH_ERROR"
  | "QUOTA_EXHAUSTED"
  | "MODEL_NOT_FOUND"
  | "TIMEOUT"
  | "RATE_LIMIT"
  | "CONTENT_BLOCKED"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export interface ProviderHealthCheckResult {
  ok: boolean;
  latencyMs: number;
  provider: "GEMINI" | "DEEPSEEK";
  modelId: string;
  error?: string;
  category?: ProviderErrorCategory;
}

export interface ITonyAIProvider {
  readonly provider: "GEMINI" | "DEEPSEEK";
  generateReply(params: TonyGenerationParams): Promise<TonyGenerationResult>;
  healthCheck(apiKey: string, modelId: string): Promise<ProviderHealthCheckResult>;
  getSupportedModels(): string[];
  getDefaultModel(): string;
}

export interface ProviderTelemetryStats {
  requestsToday: number;
  dailyCeiling: number;
  averageLatencyMs: number;
  totalTokensToday: number;
  errorCountToday: number;
  errorRatePercent: number;
}
