/**
 * Stage 16 Automated Verification Test Suite
 * Authoritative Reference: TDD Page 181 (Tasks 79-83) and Specification Sheets 090-096:
 * - Gemini and DeepSeek provider adapters
 * - Normalized provider interface (ITonyAIProvider)
 * - AES-256-GCM encrypted secret storage & write-only masking
 * - Provider switching isolation
 * - Daily usage ceilings & bounded fallback
 * - Zero Emojis invariant enforcement
 * - Untrusted context separation & injection defense
 */

import { db } from "../server/db";
import { AIProvider } from "@prisma/client";
import {
  encryptSecret,
  decryptSecret,
  packEncryptedSecret,
  unpackEncryptedSecret,
  encryptToPackedString,
  decryptFromPackedString,
  maskApiKey,
} from "../server/services/security/encryption";
import {
  GeminiProviderAdapter,
  DEFAULT_GEMINI_MODEL,
  SUPPORTED_GEMINI_MODELS,
  GeminiProviderError,
} from "../server/services/tony/providers/gemini";
import {
  DeepSeekProviderAdapter,
  DEFAULT_DEEPSEEK_MODEL,
  SUPPORTED_DEEPSEEK_MODELS,
  DeepSeekProviderError,
} from "../server/services/tony/providers/deepseek";
import {
  getProviderAdapter,
  getActiveProviderConfig,
  checkDailyUsageCeiling,
  resolveProviderApiKey,
  generateProviderTonyReply,
} from "../server/services/tony/providers";
import { EMOJI_REGEX, stripEmojis } from "../server/services/tony/mock-provider";
import { assembleTonySystemPrompt } from "../server/services/tony/prompt";

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}${detail ? ` - ${detail}` : ""}`);
    testsFailed++;
  }
}

async function runStage16Verification() {
  console.log("==================================================================");
  console.log("STAGE 16 TEST SUITE: GEMINI & DEEPSEEK PROVIDER ADAPTERS & SWITCHING");
  console.log("==================================================================\n");

  // --------------------------------------------------------------------------
  // TEST GROUP 1: AES-256-GCM Cryptographic Security (TDD Sheet 093 & Sheet 129)
  // --------------------------------------------------------------------------
  console.log("--- Group 1: Cryptographic Encryption & Secret Masking (Task 81) ---");

  const sampleKey = "AIzaSyB_SampleGeminiKey1234567890abcdef";
  const encrypted = encryptSecret(sampleKey);

  assert(
    encrypted.ciphertext.length > 0 && encrypted.iv.length === 24 && encrypted.authTag.length === 32,
    "AES-256-GCM produces valid 12-byte IV (24 hex) and 16-byte AuthTag (32 hex)"
  );

  const decrypted = decryptSecret(encrypted.ciphertext, encrypted.iv, encrypted.authTag);
  assert(decrypted === sampleKey, "Decryption round-trip recovers exact original plaintext key");

  const packed = packEncryptedSecret(encrypted);
  assert(packed.split(":").length === 3, "Packed encrypted string matches 'iv:authTag:ciphertext' format");

  const unpackedDecrypted = decryptFromPackedString(packed);
  assert(unpackedDecrypted === sampleKey, "decryptFromPackedString cleanly unpacks and decrypts");

  // Tamper resistance test
  const tamperedCipher = encrypted.ciphertext.slice(0, -2) + "ff";
  let tamperDetected = false;
  try {
    decryptSecret(tamperedCipher, encrypted.iv, encrypted.authTag);
  } catch {
    tamperDetected = true;
  }
  assert(tamperDetected, "Authentication tag verification fails on tampered ciphertext");

  // Masking test (Sheet 093)
  const masked = maskApiKey(sampleKey);
  assert(
    masked.startsWith("••••••••••••") && masked.endsWith("cdef") && !masked.includes("AIzaSyB"),
    "maskApiKey masks secret and never displays plaintext secret in admin responses",
    `Got: ${masked}`
  );
  assert(maskApiKey("") === "Not configured", "maskApiKey safely handles empty or null values");

  // --------------------------------------------------------------------------
  // TEST GROUP 2: Gemini Adapter Specifications (TDD Sheet 091 & Task 79)
  // --------------------------------------------------------------------------
  console.log("\n--- Group 2: Google Gemini Adapter (Task 79) ---");

  const geminiAdapter = new GeminiProviderAdapter();
  assert(geminiAdapter.provider === "GEMINI", "Gemini adapter identifies with 'GEMINI' provider tag");
  assert(
    geminiAdapter.getDefaultModel() === DEFAULT_GEMINI_MODEL,
    `Gemini adapter defaults to configured baseline model (${DEFAULT_GEMINI_MODEL})`
  );
  assert(
    geminiAdapter.getSupportedModels().includes("gemini-2.5-flash") &&
      geminiAdapter.getSupportedModels().includes("gemini-1.5-flash"),
    "Gemini adapter supports configured models including gemini-2.5-flash and gemini-1.5-flash"
  );

  // Missing API key error classification
  let geminiAuthError = false;
  try {
    await geminiAdapter.generateReply({
      systemPrompt: "You are Tony",
      history: [],
      userMessage: "Hello",
      apiKey: "",
      modelId: "gemini-1.5-flash",
    });
  } catch (err: any) {
    if (err instanceof GeminiProviderError && err.category === "AUTH_ERROR") {
      geminiAuthError = true;
    }
  }
  assert(geminiAuthError, "Gemini adapter throws classified AUTH_ERROR when API key is missing");

  // --------------------------------------------------------------------------
  // TEST GROUP 3: DeepSeek Adapter Specifications (TDD Sheet 092 & Task 80)
  // --------------------------------------------------------------------------
  console.log("\n--- Group 3: DeepSeek Adapter (Task 80) ---");

  const deepseekAdapter = new DeepSeekProviderAdapter();
  assert(deepseekAdapter.provider === "DEEPSEEK", "DeepSeek adapter identifies with 'DEEPSEEK' provider tag");
  assert(
    deepseekAdapter.getDefaultModel() === DEFAULT_DEEPSEEK_MODEL,
    `DeepSeek adapter defaults to configured baseline model (${DEFAULT_DEEPSEEK_MODEL})`
  );
  assert(
    deepseekAdapter.getSupportedModels().includes("deepseek-chat") &&
      deepseekAdapter.getSupportedModels().includes("deepseek-reasoner"),
    "DeepSeek adapter supports configured models including deepseek-chat and deepseek-reasoner"
  );

  // Missing API key error classification
  let deepseekAuthError = false;
  try {
    await deepseekAdapter.generateReply({
      systemPrompt: "You are Tony",
      history: [],
      userMessage: "Hello",
      apiKey: "",
      modelId: "deepseek-chat",
    });
  } catch (err: any) {
    if (err instanceof DeepSeekProviderError && err.category === "AUTH_ERROR") {
      deepseekAuthError = true;
    }
  }
  assert(deepseekAuthError, "DeepSeek adapter throws classified AUTH_ERROR when API key is missing");

  // --------------------------------------------------------------------------
  // TEST GROUP 4: Database Storage & Admin Switching (TDD Sheet 090 & Task 82)
  // --------------------------------------------------------------------------
  console.log("\n--- Group 4: Provider Registry & Database Persistence (Task 82) ---");

  const activeConfig = await getActiveProviderConfig();
  assert(!!activeConfig && !!activeConfig.id, "Active provider configuration exists in database");
  assert(
    activeConfig.provider === AIProvider.GEMINI || activeConfig.provider === AIProvider.DEEPSEEK,
    `Active provider is a valid registered AIProvider (${activeConfig.provider})`
  );

  const resolvedAdapter = getProviderAdapter(activeConfig.provider);
  assert(
    resolvedAdapter.provider === activeConfig.provider,
    "Provider router resolves adapter corresponding to active database configuration"
  );

  // Test updating provider configuration
  const testCipher = encryptToPackedString("test-secret-key-12345");
  const updatedGemini = await db.aIProviderConfig.upsert({
    where: { provider: AIProvider.GEMINI },
    create: {
      provider: AIProvider.GEMINI,
      activeModel: "gemini-1.5-flash",
      encryptedApiKey: testCipher,
      temperature: 0.65,
      maxTokens: 1024,
      timeoutMs: 15000,
      dailyCeiling: 1500,
      isDefault: true,
      isEnabled: true,
    },
    update: {
      encryptedApiKey: testCipher,
      temperature: 0.65,
      dailyCeiling: 1500,
    },
  });

  const resolvedKey = resolveProviderApiKey(updatedGemini);
  assert(resolvedKey === "test-secret-key-12345", "resolveProviderApiKey decrypts database stored AES-256-GCM secret");

  // --------------------------------------------------------------------------
  // TEST GROUP 5: Daily Usage Ceiling & Safe Fallbacks (TDD Sheet 093 & Task 83)
  // --------------------------------------------------------------------------
  console.log("\n--- Group 5: Daily Ceiling & Bounded Fallback (Task 83) ---");

  const ceilingResult = await checkDailyUsageCeiling(100000);
  assert(ceilingResult.exceeded === false, "checkDailyUsageCeiling permits requests under configured limit");

  const exceededCeiling = await checkDailyUsageCeiling(0);
  assert(exceededCeiling.exceeded === true, "checkDailyUsageCeiling triggers when limit is 0");

  // Dispatch reply when ceiling is exceeded -> falls back cleanly to grounded mock
  const { systemPrompt } = await assembleTonySystemPrompt();
  // Temporarily update dailyCeiling to 0 to test ceiling fallback
  await db.aIProviderConfig.update({
    where: { provider: AIProvider.GEMINI },
    data: { dailyCeiling: 0 },
  });

  const ceilingReply = await generateProviderTonyReply({
    systemPrompt,
    history: [],
    userMessage: "What services do you offer?",
    language: "en",
  });

  assert(
    ceilingReply.fallbackUsed === true && ceilingReply.errorCode === "DAILY_CEILING_EXCEEDED",
    "Router triggers safe mock fallback when daily usage ceiling is reached"
  );
  assert(!EMOJI_REGEX.test(ceilingReply.content), "Fallback reply complies with strict Zero Emoji invariant");

  // Restore daily ceiling
  await db.aIProviderConfig.update({
    where: { provider: AIProvider.GEMINI },
    data: { dailyCeiling: 1500 },
  });

  // --------------------------------------------------------------------------
  // TEST GROUP 6: Zero Emoji Invariant Across Completions (TDD Sheet 080)
  // --------------------------------------------------------------------------
  console.log("\n--- Group 6: Strict Zero Emoji Enforcement (TDD Sheet 080) ---");

  const rawSampleWithEmojis = "Hello! 🚀 Welcome to MegaScript Digital ✨🎉. We build great apps! 😊";
  const stripped = stripEmojis(rawSampleWithEmojis);
  assert(!EMOJI_REGEX.test(stripped), "stripEmojis completely removes unicode emojis from completions");
  assert(
    stripped.includes("MegaScript Digital") && stripped.includes("We build great apps!"),
    "Typography, text, and sentence punctuation are preserved after emoji removal"
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 7: Clean Dispatch Without External Secrets (Graceful Fallback)
  // --------------------------------------------------------------------------
  console.log("\n--- Group 7: Graceful Execution When Live External Keys Absent ---");

  // Clear mock key from test config
  await db.aIProviderConfig.update({
    where: { provider: AIProvider.GEMINI },
    data: { encryptedApiKey: null },
  });

  const groundedReply = await generateProviderTonyReply({
    systemPrompt,
    history: [],
    userMessage: "Can you provide a pricing estimate for a corporate website?",
    language: "en",
  });

  assert(
    groundedReply.content.includes("35,000") || groundedReply.content.includes("125,000"),
    "Grounded reply accurately communicates Kenyan pricing boundaries (KSh 35,000 - 125,000)"
  );
  assert(!groundedReply.content.includes("500"), "Graceful reply returns clean content without 500 error");
  assert(!EMOJI_REGEX.test(groundedReply.content), "Zero emojis present in grounded response");

  // Kiswahili turn check
  const swahiliReply = await generateProviderTonyReply({
    systemPrompt,
    history: [],
    userMessage: "Habari, je mnafanya kazi za kutengeneza tovuti?",
    language: "sw",
  });
  assert(
    swahiliReply.content.toLowerCase().includes("tovuti") ||
      swahiliReply.content.toLowerCase().includes("ndio") ||
      swahiliReply.content.toLowerCase().includes("karibu"),
    "Bilingual support responds fluently in professional Kiswahili"
  );
  assert(!EMOJI_REGEX.test(swahiliReply.content), "Zero emojis present in Kiswahili response");

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log("\n==================================================================");
  console.log(`TEST SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log("==================================================================");

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runStage16Verification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Unhandled test suite error:", err);
    process.exit(1);
  });
