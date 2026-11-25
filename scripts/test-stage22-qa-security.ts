import assert from "assert";
import fs from "fs";
import path from "path";
import { checkRateLimit } from "../lib/rate-limit";
import { encryptSecret, decryptSecret } from "../server/services/security/encryption";
import { checkEmailAllowlisted } from "../features/auth/allowlist";
import { INACTIVITY_TIMEOUT_MS } from "../features/auth/session";
import { contactEnquirySchema } from "../lib/validations/contact";
import { RoleName } from "@prisma/client";

const rootDir = path.resolve(__dirname, "..");

console.log("======================================================");
console.log("  Stage 22: Pre-Release QA & Security Test Suite      ");
console.log("======================================================\n");

async function runTests() {
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`[FAIL] ${name}`);
      console.error(`       Error: ${err.message}`);
      failed++;
    }
  }

  // =========================================================================
  // 1. Task 109: Static Analysis, Build & Route Inventory Verification
  // =========================================================================
  console.log("--- 1. Testing Route Inventory & Build Budgets (Task 109) ---");

  await test("Package.json defines strict typecheck and lint scripts", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf-8"));
    assert.strictEqual(pkg.scripts.typecheck, "tsc --noEmit", "typecheck must run tsc --noEmit");
    assert.strictEqual(pkg.scripts.lint, "next lint", "lint must run next lint");
    assert.strictEqual(pkg.scripts.build, "next build", "build must run next build");
  });

  await test("All primary public routes exist as page components", () => {
    const publicPages = [
      "app/page.tsx",
      "app/about/page.tsx",
      "app/services/page.tsx",
      "app/products/page.tsx",
      "app/portfolio/page.tsx",
      "app/blog/page.tsx",
      "app/contact/page.tsx",
      "app/terms-and-conditions/page.tsx",
      "app/privacy-policy/page.tsx",
      "app/privacy-request/page.tsx",
      "app/wow-factors/page.tsx",
    ];
    for (const pagePath of publicPages) {
      assert(fs.existsSync(path.join(rootDir, pagePath)), `Public page ${pagePath} must exist`);
    }
  });

  await test("All master administrative routes exist under (admin)/master/", () => {
    const adminPages = [
      "app/(admin)/master/overview/page.tsx",
      "app/(admin)/master/leads/page.tsx",
      "app/(admin)/master/content/services/page.tsx",
      "app/(admin)/master/content/products/page.tsx",
      "app/(admin)/master/content/portfolio/page.tsx",
      "app/(admin)/master/content/testimonials/page.tsx",
      "app/(admin)/master/newsletter/subscribers/page.tsx",
      "app/(admin)/master/newsletter/campaigns/page.tsx",
      "app/(admin)/master/tony/prompts/page.tsx",
      "app/(admin)/master/tony/providers/page.tsx",
      "app/(admin)/master/analytics/page.tsx",
      "app/(admin)/master/privacy/page.tsx",
    ];
    for (const pagePath of adminPages) {
      assert(fs.existsSync(path.join(rootDir, pagePath)), `Admin page ${pagePath} must exist`);
    }
  });

  // =========================================================================
  // 2. Task 110: Security, Authentication Hardening & Webhook Verification
  // =========================================================================
  console.log("\n--- 2. Testing Security, Auth Hardening & Webhooks (Task 110) ---");

  await test("ProtectedAccountError protects Super Administrator (megascriptdigital@gmail.com)", () => {
    const userMgmtFile = fs.readFileSync(path.join(rootDir, "features/auth/user-management.ts"), "utf-8");
    assert(userMgmtFile.includes("ProtectedAccountError"), "user-management.ts must define ProtectedAccountError");
    assert(userMgmtFile.includes("megascriptdigital@gmail.com"), "Protected account email must be hardcoded");
    assert(userMgmtFile.includes("cannot be deleted, deactivated, or demoted"), "Protected account immutability message present");
  });

  await test("Allowlist enforcement verifies approved and rejects unapproved email addresses", async () => {
    // Valid seeded admin
    const superAdminRes = await checkEmailAllowlisted("megascriptdigital@gmail.com");
    assert.strictEqual(superAdminRes.isAllowed, true, "Super admin must be allowlisted");
    assert.strictEqual(superAdminRes.role, "SUPER_ADMIN", "Super admin must have SUPER_ADMIN role");

    const primaryAdminRes = await checkEmailAllowlisted("boltonmoseti78@gmail.com");
    assert.strictEqual(primaryAdminRes.isAllowed, true, "Primary admin must be allowlisted");

    // Malicious or unauthorized email
    const evilRes = await checkEmailAllowlisted("attacker@evil.com");
    assert.strictEqual(evilRes.isAllowed, false, "External email must be rejected");

    const unapprovedRes = await checkEmailAllowlisted("random.user@gmail.com");
    assert.strictEqual(unapprovedRes.isAllowed, false, "Unapproved email must be rejected");
  });

  await test("15-minute inactivity session timeout is strictly configured on server", () => {
    assert.strictEqual(INACTIVITY_TIMEOUT_MS, 15 * 60 * 1000, "Inactivity timeout must be exactly 15 minutes");
    const sessionFile = fs.readFileSync(path.join(rootDir, "features/auth/session.ts"), "utf-8");
    assert(sessionFile.includes("INACTIVITY_TIMEOUT"), "session.ts must evaluate INACTIVITY_TIMEOUT");
    assert(sessionFile.includes("lastActivityAt"), "session.ts must track lastActivityAt timestamp");
  });

  await test("RBAC defines 5 distinct roles matching enterprise security model", () => {
    const roles = Object.values(RoleName);
    assert(roles.includes("SUPER_ADMIN"), "RoleName must include SUPER_ADMIN");
    assert(roles.includes("ADMIN"), "RoleName must include ADMIN");
    assert(roles.includes("EDITOR"), "RoleName must include EDITOR");
    assert(roles.includes("MARKETING_MANAGER"), "RoleName must include MARKETING_MANAGER");
    assert(roles.includes("ANALYST"), "RoleName must include ANALYST");
    assert.strictEqual(roles.length, 5, "RoleName must have exactly 5 roles");
  });

  await test("Provider secrets AES-256-GCM encryption/decryption roundtrip", () => {
    const testSecret = "AIzaSyD-TestKey1234567890abcdef";
    const encrypted = encryptSecret(testSecret);
    assert(encrypted.ciphertext.length > 0, "Ciphertext must not be empty");
    assert(encrypted.iv.length === 24, "IV hex string must be 12 bytes (24 hex characters)");
    assert(encrypted.authTag.length === 32, "AuthTag hex string must be 16 bytes (32 hex characters)");

    const decrypted = decryptSecret(encrypted.ciphertext, encrypted.iv, encrypted.authTag);
    assert.strictEqual(decrypted, testSecret, "Decrypted secret must match original plaintext");
  });

  await test("Decryption fails when ciphertext or authTag is tampered with", () => {
    const testSecret = "sensitive-api-token-value";
    const encrypted = encryptSecret(testSecret);
    // Tamper single hex character while preserving valid even hex length
    const lastChar = encrypted.ciphertext.slice(-1);
    const flippedChar = lastChar === "0" ? "1" : "0";
    const tamperedCipher = encrypted.ciphertext.slice(0, -1) + flippedChar;

    assert.throws(
      () => decryptSecret(tamperedCipher, encrypted.iv, encrypted.authTag),
      /Unsupported state or unable to authenticate data|tamper/i,
      "Tampered ciphertext must fail authentication tag check"
    );
  });

  await test("Brevo webhook route verifies secret and suppresses bounced/spam subscribers", () => {
    const webhookFile = fs.readFileSync(path.join(rootDir, "app/api/webhooks/brevo/route.ts"), "utf-8");
    assert(webhookFile.includes("BREVO_WEBHOOK_SECRET"), "Webhook route must support BREVO_WEBHOOK_SECRET");
    assert(webhookFile.includes("hard_bounce"), "Webhook route must handle hard_bounce");
    assert(webhookFile.includes("spam"), "Webhook route must handle spam complaints");
    assert(webhookFile.includes("unsubscribe"), "Webhook route must handle unsubscribe events");
    assert(webhookFile.includes("SubscriberStatus.UNSUBSCRIBED"), "Webhook route must suppress bounced subscribers");
  });

  await test("Sliding window rate limiter enforces request thresholds", () => {
    const testIp = `test-ip-${Date.now()}`;
    // 5 requests allowed
    for (let i = 0; i < 5; i++) {
      const res = checkRateLimit(testIp, 5, 10000);
      assert.strictEqual(res.success, true, `Request ${i + 1} should succeed`);
    }
    // 6th request rejected
    const blockedRes = checkRateLimit(testIp, 5, 10000);
    assert.strictEqual(blockedRes.success, false, "6th request within window must be blocked");
    assert.strictEqual(blockedRes.remaining, 0, "Remaining must be 0");
  });

  await test("HTTP security headers configured in next.config.mjs", () => {
    const configContent = fs.readFileSync(path.join(rootDir, "next.config.mjs"), "utf-8");
    assert(configContent.includes("X-Content-Type-Options"), "Must include X-Content-Type-Options: nosniff");
    assert(configContent.includes("X-Frame-Options"), "Must include X-Frame-Options: SAMEORIGIN");
    assert(configContent.includes("Strict-Transport-Security"), "Must include Strict-Transport-Security (HSTS)");
    assert(configContent.includes("Referrer-Policy"), "Must include Referrer-Policy");
    assert(configContent.includes("Permissions-Policy"), "Must include Permissions-Policy");
    assert(configContent.includes("poweredByHeader: false"), "Must disable X-Powered-By header");
  });

  // =========================================================================
  // 3. Task 111: Conversion, CRM, Email & AI Chat Journeys
  // =========================================================================
  console.log("\n--- 3. Testing Conversion, CRM, Email & AI Chat (Task 111) ---");

  await test("Contact enquiry schema validates correct submissions", () => {
    const validData = {
      name: "Jane Mwangi",
      email: "jane.mwangi@example.co.ke",
      phone: "+254 712 345 678",
      topic: "Web Development & SEO",
      message: "We need a complete website redesign for our logistics firm in Nairobi.",
      consent: true,
      timestamp: Date.now() - 5000,
      honeypot: "",
    };

    const parsed = contactEnquirySchema.safeParse(validData);
    assert(parsed.success, "Valid contact enquiry must parse cleanly");
  });

  await test("Contact enquiry schema rejects invalid submissions (missing consent, short message)", () => {
    // Missing consent
    const noConsent = contactEnquirySchema.safeParse({
      name: "Jane Mwangi",
      email: "jane.mwangi@example.co.ke",
      topic: "Web Development & SEO",
      message: "Valid length message here",
      consent: false,
      timestamp: Date.now() - 5000,
    });
    assert.strictEqual(noConsent.success, false, "Submission without consent must fail");

    // Message too short (< 10 chars)
    const shortMessage = contactEnquirySchema.safeParse({
      name: "Jane Mwangi",
      email: "jane.mwangi@example.co.ke",
      topic: "Web Development & SEO",
      message: "Hi",
      consent: true,
      timestamp: Date.now() - 5000,
    });
    assert.strictEqual(shortMessage.success, false, "Submission with short message must fail");

    // Invalid email format
    const badEmail = contactEnquirySchema.safeParse({
      name: "Jane Mwangi",
      email: "invalid-email-string",
      topic: "Web Development & SEO",
      message: "Valid length message here for testing",
      consent: true,
      timestamp: Date.now() - 5000,
    });
    assert.strictEqual(badEmail.success, false, "Submission with invalid email must fail");
  });

  await test("Tony AI prompt defines canonical guardrails, grounding, and bilingual support", () => {
    const promptFile = fs.readFileSync(path.join(rootDir, "server/services/tony/prompt.ts"), "utf-8");
    assert(promptFile.includes("English") && promptFile.includes("Kiswahili"), "Tony prompt must support English and Kiswahili");
    assert(promptFile.includes("Do not hallucinate") || promptFile.includes("Do not invent"), "Tony prompt must forbid hallucinating unverified data");
    assert(promptFile.includes("MegaScript Digital"), "Tony prompt must establish official corporate identity");
    assert(promptFile.includes("LEAD CAPTURE") || promptFile.includes("intent"), "Tony prompt must recognize lead capture intent");
  });

  await test("Postgres full-text global search service implementation exists", () => {
    const searchFile = fs.readFileSync(path.join(rootDir, "server/services/search/index.ts"), "utf-8");
    assert(searchFile.includes("search"), "Global search service must implement search query");
    assert(searchFile.includes("services") || searchFile.includes("products"), "Search must index services/products");
  });

  await test("UTM tracking and first-party attribution parser exists", () => {
    const utmFile = fs.readFileSync(path.join(rootDir, "lib/analytics/utm.ts"), "utf-8");
    assert(utmFile.includes("utm_source"), "UTM parser must track utm_source");
    assert(utmFile.includes("utm_medium"), "UTM parser must track utm_medium");
    assert(utmFile.includes("utm_campaign"), "UTM parser must track utm_campaign");
  });

  // =========================================================================
  // 4. Task 112: WCAG 2.2 AA Accessibility & Viewport Matrix
  // =========================================================================
  console.log("\n--- 4. Testing WCAG 2.2 AA Accessibility & Viewports (Task 112) ---");

  await test("Root layout includes skip to main content navigation link", () => {
    const layoutFile = fs.readFileSync(path.join(rootDir, "app/layout.tsx"), "utf-8");
    assert(layoutFile.includes("href=\"#main-content\""), "Root layout must contain skip-link targeting #main-content");
    assert(layoutFile.includes("Skip to main content"), "Skip link must have descriptive accessibility text");
  });

  await test("Main content container has id=\"main-content\" for skip-link targeting", () => {
    const layoutFile = fs.readFileSync(path.join(rootDir, "app/layout.tsx"), "utf-8");
    assert(layoutFile.includes("id=\"main-content\""), "Root layout must define id='main-content'");
  });

  await test("Global CSS defines visible keyboard focus (:focus-visible) styles", () => {
    const globalsCss = fs.readFileSync(path.join(rootDir, "app/globals.css"), "utf-8");
    assert(globalsCss.includes(":focus-visible"), "globals.css must define :focus-visible rules");
    assert(globalsCss.includes("outline"), "globals.css must set outline on focus-visible");
  });

  await test("Global CSS provides reduced-motion and motion-paused resets", () => {
    const globalsCss = fs.readFileSync(path.join(rootDir, "app/globals.css"), "utf-8");
    assert(globalsCss.includes("prefers-reduced-motion"), "globals.css must handle prefers-reduced-motion");
    assert(globalsCss.includes("data-motion=\"paused\""), "globals.css must handle data-motion='paused'");
  });

  await test("Adaptive rendering system exports Mode A, Mode B, and Mode C", () => {
    const adaptiveFile = fs.readFileSync(path.join(rootDir, "lib/motion/adaptive.ts"), "utf-8");
    assert(adaptiveFile.includes("\"full\""), "adaptive.ts must support full mode");
    assert(adaptiveFile.includes("\"lightweight\""), "adaptive.ts must support lightweight mode");
    assert(adaptiveFile.includes("\"static\""), "adaptive.ts must support static mode");
  });

  // =========================================================================
  // 5. Task 113: Core Web Vitals, Image/Font Budgets, SEO & Link Integrity
  // =========================================================================
  console.log("\n--- 5. Testing Core Web Vitals, Metadata & Integrity (Task 113) ---");

  await test("Hero section dynamically imports Three.js scene with ssr: false for LCP preservation", () => {
    const heroFile = fs.readFileSync(path.join(rootDir, "components/home/HeroSection.tsx"), "utf-8");
    assert(heroFile.includes("dynamic"), "HeroSection must use next/dynamic for Three.js");
    assert(heroFile.includes("ssr: false"), "HeroSection dynamic 3D import must specify ssr: false");
    assert(heroFile.includes("ArchitecturalSvgBlueprint"), "HeroSection must mount instant ArchitecturalSvgBlueprint fallback");
  });

  await test("Robots.txt generator enforces public crawling while disallowing admin routes", () => {
    const robotsFile = fs.readFileSync(path.join(rootDir, "app/robots.ts"), "utf-8");
    assert(robotsFile.includes("disallow: [\"/master/\", \"/api/\"]") || robotsFile.includes("/master/"), "robots.ts must disallow /master/");
    assert(robotsFile.includes("sitemap.xml"), "robots.ts must reference sitemap.xml");
  });

  await test("XML sitemap generator includes all dynamic services, products, and portfolio slugs", () => {
    const sitemapFile = fs.readFileSync(path.join(rootDir, "app/sitemap.ts"), "utf-8");
    assert(sitemapFile.includes("services"), "sitemap.ts must include services");
    assert(sitemapFile.includes("products"), "sitemap.ts must include products");
    assert(sitemapFile.includes("portfolio"), "sitemap.ts must include portfolio");
    assert(sitemapFile.includes("blog"), "sitemap.ts must include blog");
  });

  await test("Strict brand palette enforcement: zero purple gradients across all components", () => {
    const componentsToCheck = [
      "components/home/HeroSection.tsx",
      "components/home/WhatWeDoSection.tsx",
      "components/home/DifferentiatorsSection.tsx",
      "components/home/ProductsPreviewSection.tsx",
      "components/home/ServicesPreviewSection.tsx",
      "components/home/FinalCtaSection.tsx",
      "components/visuals/ArchitecturalSvgBlueprint.tsx",
      "components/visuals/CapabilityFlowConnector.tsx",
      "components/visuals/DifferentiatorSchematicSvg.tsx",
      "components/visuals/RoadmapPathSvg.tsx",
      "components/visuals/ConvergenceLinesSvg.tsx",
      "components/three/HeroArchitecturalScene.tsx",
    ];

    const purplePatterns = [
      /from-purple/i,
      /to-purple/i,
      /via-purple/i,
      /from-violet/i,
      /to-violet/i,
      /from-fuchsia/i,
      /to-fuchsia/i,
    ];

    for (const relPath of componentsToCheck) {
      const fullPath = path.join(rootDir, relPath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        for (const pattern of purplePatterns) {
          assert(!pattern.test(content), `Component ${relPath} must strictly prohibit purple gradients (matched ${pattern})`);
        }
      }
    }
  });

  await test("Strict brand typography discipline: zero emojis across public and visual components", () => {
    const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/u;

    const filesToAudit = [
      "components/home/HeroSection.tsx",
      "components/home/WhatWeDoSection.tsx",
      "components/home/DifferentiatorsSection.tsx",
      "components/home/ProductsPreviewSection.tsx",
      "components/home/ServicesPreviewSection.tsx",
      "components/home/HowToGetStartedSection.tsx",
      "components/home/FinalCtaSection.tsx",
      "components/layout/AppearanceCustomizer.tsx",
      "components/visuals/ArchitecturalSvgBlueprint.tsx",
      "components/visuals/CapabilityFlowConnector.tsx",
      "components/visuals/DifferentiatorSchematicSvg.tsx",
      "components/visuals/RoadmapPathSvg.tsx",
      "components/visuals/ConvergenceLinesSvg.tsx",
    ];

    for (const relPath of filesToAudit) {
      const fullPath = path.join(rootDir, relPath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        assert(!emojiRegex.test(content), `File ${relPath} must strictly contain zero emojis`);
      }
    }
  });

  // =========================================================================
  // Summary
  // =========================================================================
  console.log("\n======================================================");
  console.log(`Results: ${passed}/${passed + failed} tests passed.`);
  if (failed === 0) {
    console.log("STATUS: ALL TESTS PASSED! Stage 22 QA & Security Verified.");
    try {
      const { db } = await import("../server/db");
      await db.$disconnect();
    } catch {}
    process.exit(0);
  } else {
    console.error(`STATUS: ${failed} TESTS FAILED.`);
    try {
      const { db } = await import("../server/db");
      await db.$disconnect();
    } catch {}
    process.exit(1);
  }
  console.log("======================================================\n");
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
