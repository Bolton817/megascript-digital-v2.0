/**
 * Stage 23 Pre-Flight Environment Validation Script
 * Verifies production environment variables against security and deployment standards
 * Reference: TDD Page 188, Task 114; Specification Sheet 129; Appendix 08
 *
 * Usage:
 *   npx tsx scripts/verify-production-env.ts
 */

import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

interface EnvRule {
  key: string;
  required: boolean;
  sensitive: boolean;
  validator?: (val: string) => { valid: boolean; reason?: string };
  description: string;
}

const envRules: EnvRule[] = [
  {
    key: "NODE_ENV",
    required: true,
    sensitive: false,
    description: "Application runtime environment",
    validator: (val) => ({
      valid: ["production", "development", "test"].includes(val),
      reason: "Must be production, development, or test",
    }),
  },
  {
    key: "DATABASE_URL",
    required: true,
    sensitive: true,
    description: "Supavisor pooled database connection (port 6543)",
    validator: (val) => ({
      valid: val.startsWith("postgresql://") || val.startsWith("postgres://"),
      reason: "Must be a valid postgresql:// URI string",
    }),
  },
  {
    key: "DIRECT_URL",
    required: true,
    sensitive: true,
    description: "Direct database connection for Prisma migrations (port 5432)",
    validator: (val) => ({
      valid: val.startsWith("postgresql://") || val.startsWith("postgres://"),
      reason: "Must be a valid postgresql:// URI string",
    }),
  },
  {
    key: "BETTER_AUTH_SECRET",
    required: true,
    sensitive: true,
    description: "Cryptographic secret for signing session tokens",
    validator: (val) => ({
      valid: val.length >= 32,
      reason: `Length is ${val.length}; must be at least 32 characters`,
    }),
  },
  {
    key: "ENCRYPTION_MASTER_KEY",
    required: true,
    sensitive: true,
    description: "256-bit AES-GCM master key for encrypting provider credentials",
    validator: (val) => ({
      valid: /^[0-9a-fA-F]{64}$/.test(val),
      reason: "Must be a 64-character hexadecimal string (32 bytes / 256 bits)",
    }),
  },
  {
    key: "SUPER_ADMIN_EMAIL",
    required: true,
    sensitive: false,
    description: "Canonical protected Super Administrator email address",
    validator: (val) => ({
      valid: val.toLowerCase().trim() === "megascriptdigital@gmail.com",
      reason: "Must be megascriptdigital@gmail.com per TDD specification",
    }),
  },
  {
    key: "ADMIN_ALLOWED_EMAILS",
    required: true,
    sensitive: false,
    description: "Comma-separated allowlist for admin OTP authentication",
    validator: (val) => {
      const emails = val.split(",").map((e) => e.trim().toLowerCase());
      const hasSuper = emails.includes("megascriptdigital@gmail.com");
      return {
        valid: hasSuper,
        reason: "Must include canonical super admin (megascriptdigital@gmail.com)",
      };
    },
  },
  {
    key: "BREVO_API_KEY",
    required: false,
    sensitive: true,
    description: "Brevo API key for transactional emails and newsletter dispatch",
  },
  {
    key: "BREVO_SENDER_EMAIL",
    required: false,
    sensitive: false,
    description: "Verified Brevo sender email address",
    validator: (val) => ({
      valid: val.includes("@"),
      reason: "Must be a valid email address format",
    }),
  },
  {
    key: "GEMINI_API_KEY",
    required: false,
    sensitive: true,
    description: "Google AI Gemini API key for Tony AI Assistant",
  },
  {
    key: "DEEPSEEK_API_KEY",
    required: false,
    sensitive: true,
    description: "DeepSeek API key for alternative Tony AI model adapter",
  },
];

function maskSecret(val: string): string {
  if (val.length <= 8) return "••••••••";
  return val.slice(0, 4) + "••••••••" + val.slice(-4);
}

function verifyEnv() {
  console.log("======================================================");
  console.log("  MegaScript Digital: Pre-Flight Environment Audit    ");
  console.log("  TDD Task 114 / Specification Sheet 129              ");
  console.log("======================================================\n");

  let criticalErrors = 0;
  let warnings = 0;

  for (const rule of envRules) {
    const val = process.env[rule.key];

    if (!val || val.trim() === "") {
      if (rule.required) {
        console.error(`  [CRITICAL MISSING] ${rule.key}: Required variable is unset!`);
        console.error(`                     Description: ${rule.description}`);
        criticalErrors++;
      } else {
        console.warn(`  [OPTIONAL UNSET]   ${rule.key}: Optional provider integration not connected.`);
        warnings++;
      }
      continue;
    }

    if (rule.validator) {
      const check = rule.validator(val);
      if (!check.valid) {
        console.error(`  [INVALID FORMAT]   ${rule.key}: ${check.reason}`);
        criticalErrors++;
        continue;
      }
    }

    const displayVal = rule.sensitive ? maskSecret(val) : val;
    console.log(`  [PASS] ${rule.key} = ${displayVal}`);
  }

  // Canonical Domain Check
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  console.log("\n--- Canonical Domain & URL Configuration ---");
  if (!siteUrl) {
    console.warn("  [WARN] NEXT_PUBLIC_SITE_URL is unset. Defaults to http://localhost:3000 locally.");
    warnings++;
  } else {
    console.log(`  [PASS] Canonical Site URL: ${siteUrl}`);
    if (process.env.NODE_ENV === "production" && !siteUrl.startsWith("https://")) {
      console.warn("  [WARN] Production SITE_URL should use https:// protocol.");
      warnings++;
    }
  }

  console.log("\n======================================================");
  console.log(`Audit Completed: ${criticalErrors} Critical Errors, ${warnings} Warnings.`);
  if (criticalErrors === 0) {
    console.log("STATUS: PRE-FLIGHT ENVIRONMENT PASSED! Ready for deployment.");
    console.log("======================================================\n");
    process.exit(0);
  } else {
    console.error("STATUS: PRE-FLIGHT ENVIRONMENT FAILED! Resolve critical variables.");
    console.log("======================================================\n");
    process.exit(1);
  }
}

verifyEnv();
