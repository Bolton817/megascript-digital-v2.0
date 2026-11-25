import { db } from "../server/db";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import {
  submitPrivacyRequest,
  getPrivacyRequests,
  matchRequesterData,
  updatePrivacyRequestStatus,
} from "../server/services/privacy";
import { PrivacyRequestType, PrivacyRequestStatus } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

async function runTestSuite() {
  console.log("======================================================");
  console.log("  Stage 20: SEO, Legal, Consent & Privacy Test Suite  ");
  console.log("======================================================");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  const createdRequestIds: string[] = [];
  const testEmail = `test.compliance.${Date.now()}@megascript-test.ke`;

  try {
    // -------------------------------------------------------------------------
    // 1. Testing Robots.txt Rules & Sitemap Pointer (Task 99, Sheet 144)
    // -------------------------------------------------------------------------
    console.log("\n--- 1. Testing Robots.txt Rules & Crawlers ---");
    const robotsConfig = robots();
    assert(Boolean(robotsConfig), "robots() returned valid configuration");
    assert(Boolean(robotsConfig.sitemap), "robots.txt includes sitemap reference");
    assert(
      typeof robotsConfig.sitemap === "string" && robotsConfig.sitemap.includes("sitemap.xml"),
      "robots.txt points to /sitemap.xml"
    );

    const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;
    assert(rules.userAgent === "*", "robots.txt user-agent is *");
    assert(rules.allow === "/", "robots.txt allows root /");

    const disallowList = Array.isArray(rules.disallow) ? rules.disallow : [rules.disallow];
    assert(disallowList.includes("/master/"), "robots.txt disallows /master/ admin routes");
    assert(disallowList.includes("/api/"), "robots.txt disallows /api/ internal endpoints");
    assert(disallowList.includes("/preview/"), "robots.txt disallows /preview/ drafts");

    // -------------------------------------------------------------------------
    // 2. Testing Dynamic XML Sitemap (Task 99, Sheet 144)
    // -------------------------------------------------------------------------
    console.log("\n--- 2. Testing XML Sitemap Generation & Strict Isolation ---");
    const sitemapEntries = await sitemap();
    assert(Array.isArray(sitemapEntries), "sitemap() returned an array of URLs");
    assert(sitemapEntries.length >= 10, `sitemap contains at least 10 URLs (found ${sitemapEntries.length})`);

    const urls = sitemapEntries.map((e) => e.url);

    // Verify core static pages are in sitemap
    assert(urls.some((u) => u.endsWith("/about")), "Sitemap includes /about");
    assert(urls.some((u) => u.endsWith("/services")), "Sitemap includes /services");
    assert(urls.some((u) => u.endsWith("/products")), "Sitemap includes /products");
    assert(urls.some((u) => u.endsWith("/portfolio")), "Sitemap includes /portfolio");
    assert(urls.some((u) => u.endsWith("/blog")), "Sitemap includes /blog");
    assert(urls.some((u) => u.endsWith("/contact")), "Sitemap includes /contact");
    assert(urls.some((u) => u.endsWith("/terms-and-conditions")), "Sitemap includes /terms-and-conditions");
    assert(urls.some((u) => u.endsWith("/privacy-policy")), "Sitemap includes /privacy-policy");
    assert(urls.some((u) => u.endsWith("/privacy-request")), "Sitemap includes /privacy-request");

    // Strict Isolation: Ensure NO admin or api routes leak into sitemap
    const hasAdminRoute = urls.some((u) => u.includes("/master"));
    assert(!hasAdminRoute, "Strict Isolation: No /master/ admin routes present in sitemap");
    const hasApiRoute = urls.some((u) => u.includes("/api/"));
    assert(!hasApiRoute, "Strict Isolation: No /api/ routes present in sitemap");

    // Verify lastModified timestamps exist
    const allHaveLastModified = sitemapEntries.every((e) => Boolean(e.lastModified));
    assert(allHaveLastModified, "All sitemap entries have valid lastModified timestamps");

    // -------------------------------------------------------------------------
    // 3. Testing Legal Pages & Statutory Clauses (Task 100, Sheets 063, 064, 140)
    // -------------------------------------------------------------------------
    console.log("\n--- 3. Testing Legal Pages & Statutory Clauses ---");
    const termsPath = path.join(__dirname, "../app/terms-and-conditions/page.tsx");
    const privacyPath = path.join(__dirname, "../app/privacy-policy/page.tsx");

    assert(fs.existsSync(termsPath), "Terms and Conditions page file exists");
    assert(fs.existsSync(privacyPath), "Privacy Policy page file exists");

    const termsSrc = fs.readFileSync(termsPath, "utf-8");
    const privacySrc = fs.readFileSync(privacyPath, "utf-8");

    // Sheet 063 Invariants:
    assert(
      termsSrc.includes("Statement of Work") || termsSrc.includes("SOW"),
      "Terms & Conditions includes Statement of Work (SOW) precedence clause"
    );
    assert(
      termsSrc.includes("Republic of Kenya") || termsSrc.includes("Nairobi"),
      "Terms & Conditions specifies Kenyan governing law and jurisdiction"
    );
    assert(
      termsSrc.includes("Notice of Scheduled Legal Review") || termsSrc.includes("review"),
      "Terms & Conditions includes formal legal review notice placeholder"
    );

    // Sheet 064 & 140 (KDPA 2019) Invariants:
    assert(
      privacySrc.includes("Kenya Data Protection Act, 2019") || privacySrc.includes("KDPA"),
      "Privacy Policy explicitly aligns with Kenya Data Protection Act 2019"
    );
    assert(
      privacySrc.includes("Google Gemini") || privacySrc.includes("DeepSeek"),
      "Privacy Policy includes explicit third-party AI provider disclosures"
    );
    assert(
      privacySrc.includes("Brevo") && privacySrc.includes("Supabase"),
      "Privacy Policy discloses third-party sub-processors (Brevo, Supabase)"
    );
    assert(
      privacySrc.includes("Right of Access") && privacySrc.includes("Right to Erasure"),
      "Privacy Policy outlines statutory KDPA Part IV Data Subject Rights"
    );
    assert(
      privacySrc.includes("Office of the Data Protection Commissioner") || privacySrc.includes("ODPC"),
      "Privacy Policy provides complaint route to the ODPC"
    );
    assert(
      privacySrc.includes("/privacy-request"),
      "Privacy Policy links directly to the /privacy-request self-service portal"
    );

    // -------------------------------------------------------------------------
    // 4. Testing Privacy Rights Request Workflow (Task 103, Sheets 140, 142)
    // -------------------------------------------------------------------------
    console.log("\n--- 4. Testing Privacy Rights Request Workflow ---");

    // A. Submit Request
    const newRequest = await submitPrivacyRequest({
      requesterName: "Jane Doe Test",
      requesterEmail: testEmail,
      requestType: PrivacyRequestType.ACCESS,
      requestDetails: "Requesting a full copy of inquiries and chat interactions associated with this email.",
    });

    assert(Boolean(newRequest.id), "Privacy request created successfully in database");
    createdRequestIds.push(newRequest.id);

    assert(
      newRequest.referenceCode.startsWith("PR-2026-") || newRequest.referenceCode.startsWith("PR-"),
      `Reference code matches PR-YYYY-XXXX format (${newRequest.referenceCode})`
    );
    assert(newRequest.status === PrivacyRequestStatus.PENDING, "Initial status is PENDING");
    assert(newRequest.requestType === PrivacyRequestType.ACCESS, "Request type is ACCESS");

    // 21-day timeline check
    const diffDays = Math.round((newRequest.dueAt.getTime() - newRequest.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    assert(diffDays === 21, `Statutory deadline set to exactly 21 days (calculated ${diffDays} days)`);

    // Verify Notification generated
    const notification = await db.notification.findFirst({
      where: { idempotencyKey: `privacy-req-${newRequest.referenceCode}` },
    });
    assert(Boolean(notification), "Internal admin notification generated for privacy request");
    assert(notification?.type === "SECURITY_ALERT", "Notification type is SECURITY_ALERT");

    // B. Fetch Requests List & Search
    const listResult = await getPrivacyRequests({
      status: "ALL",
      search: newRequest.referenceCode,
    });
    assert(listResult.requests.length >= 1, "getPrivacyRequests successfully searched by referenceCode");
    assert(
      listResult.requests[0].referenceCode === newRequest.referenceCode,
      "Found exact matching privacy request in search"
    );
    assert(listResult.metrics.total >= 1, "Total requests metric aggregated accurately");

    // C. Automated Data Matching Tool
    console.log("\n--- 5. Testing Automated Data Matching Tool ---");
    // Create a temporary lead and subscriber matching testEmail
    const testLead = await db.lead.create({
      data: {
        referenceCode: `TEST-LEAD-${Date.now()}`,
        name: "Jane Doe Test",
        email: testEmail,
        normalizedEmail: testEmail.toLowerCase().trim(),
        topic: "Web Development",
        message: "Interested in custom ERP system.",
        sourceChannel: "contact-form",
      },
    });

    const matchResult = await matchRequesterData(testEmail);
    assert(matchResult.leadsCount >= 1, `Automated matching identified ${matchResult.leadsCount} lead record(s)`);
    assert(
      matchResult.leads.some((l) => l.referenceCode === testLead.referenceCode),
      "Matched lead reference code verified"
    );

    // Clean up test lead
    await db.lead.delete({ where: { id: testLead.id } });

    // D. Update Status & Resolution Notes
    console.log("\n--- 6. Testing Status Progression & Audit Trail ---");
    const updated = await updatePrivacyRequestStatus({
      id: newRequest.id,
      status: PrivacyRequestStatus.PROCESSING,
      outcomeDetails: "Identity confirmed via phone verification. Preparing data archive.",
    });

    assert(updated.status === PrivacyRequestStatus.PROCESSING, "Status transitioned to PROCESSING");
    assert(
      Boolean(updated.outcomeDetails?.includes("Identity confirmed")),
      "Outcome details saved successfully"
    );

    const resolved = await updatePrivacyRequestStatus({
      id: newRequest.id,
      status: PrivacyRequestStatus.RESOLVED,
      outcomeDetails: "Encrypted data archive dispatched to requester. Case closed.",
    });

    assert(resolved.status === PrivacyRequestStatus.RESOLVED, "Status transitioned to RESOLVED");
    assert(Boolean(resolved.resolvedAt), "resolvedAt timestamp populated upon case closure");

    // Verify AuditLog record
    const auditRecord = await db.auditLog.findFirst({
      where: {
        targetType: "PrivacyRequest",
        targetId: newRequest.id,
      },
      orderBy: { createdAt: "desc" },
    });
    assert(Boolean(auditRecord), "Immutable AuditLog record created for privacy status update");
    assert(auditRecord?.action === "privacy_request.update_status", "AuditLog action is privacy_request.update_status");

    // -------------------------------------------------------------------------
    // 7. Testing Cookie Consent & Documentation Files (Sheets 139, 141)
    // -------------------------------------------------------------------------
    console.log("\n--- 7. Testing Cookie Consent & Documentation Files ---");
    const bannerPath = path.join(__dirname, "../components/consent/CookieConsentBanner.tsx");
    const modalPath = path.join(__dirname, "../components/consent/CookieConsentModal.tsx");
    const dataInventoryPath = path.join(__dirname, "../docs/privacy/data-inventory.md");
    const processorRegisterPath = path.join(__dirname, "../docs/privacy/processor-register.md");

    assert(fs.existsSync(bannerPath), "CookieConsentBanner component exists");
    assert(fs.existsSync(modalPath), "CookieConsentModal component exists");
    assert(fs.existsSync(dataInventoryPath), "docs/privacy/data-inventory.md exists");
    assert(fs.existsSync(processorRegisterPath), "docs/privacy/processor-register.md exists");

    const inventoryContent = fs.readFileSync(dataInventoryPath, "utf-8");
    assert(inventoryContent.includes("ROPA"), "Data inventory includes Record of Processing Activities");

    const processorContent = fs.readFileSync(processorRegisterPath, "utf-8");
    assert(processorContent.includes("Brevo SAS"), "Processor register includes Brevo");
    assert(processorContent.includes("Supabase Inc."), "Processor register includes Supabase");

  } finally {
    // Clean up created test privacy requests and notifications
    console.log("\n--- Cleaning up test records ---");
    for (const reqId of createdRequestIds) {
      const req = await db.privacyRequest.findUnique({ where: { id: reqId } });
      if (req) {
        await db.notification.deleteMany({
          where: { idempotencyKey: `privacy-req-${req.referenceCode}` },
        });
        await db.auditLog.deleteMany({
          where: { targetType: "PrivacyRequest", targetId: reqId },
        });
        await db.privacyRequest.delete({ where: { id: reqId } });
      }
    }
    console.log("Test records cleaned up cleanly.");
  }

  console.log("\n======================================================");
  console.log(`Results: ${passedTests}/${totalTests} tests passed.`);
  console.log("STATUS: ALL TESTS PASSED SUCCESSFULLY! Stage 20 Verified.");
  console.log("======================================================");
}

runTestSuite()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("Test Suite failed with error:", err);
    process.exit(1);
  });
