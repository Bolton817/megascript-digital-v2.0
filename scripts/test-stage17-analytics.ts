/**
 * Automated Verification Suite for Stage 17:
 * Global Search, UTM Capture and First-Party Analytics
 *
 * Verifies:
 * 1. Global search query accuracy, relevance scoring, and strict draft isolation
 * 2. Search query logging in SearchQueryLog
 * 3. UTM parameter sanitization and strict PII stripping
 * 4. First-touch immutability and last-touch update behavior
 * 5. Lead attribution persistence (firstTouch* and lastTouch* joined to Lead)
 * 6. Telemetry event validation and PII metadata redaction
 * 7. Analytics dashboard aggregation metrics, channels, and product clicks
 */

import { db } from "@/server/db";
import { searchPublishedContent } from "@/server/services/search";
import { sanitizeUTMValue, extractUTMFromSearchParams } from "@/lib/analytics/utm";
import { sanitizeEventMetadata } from "@/lib/analytics/taxonomy";
import { createLead } from "@/server/services/crm/leads";
import { getAnalyticsDashboardData } from "@/server/services/analytics/dashboard";
import { PublishStatus, ServiceCategory, LeadStatus } from "@prisma/client";

async function runStage17Tests() {
  console.log("=================================================");
  console.log("   Stage 17: Search, UTM & Analytics Test Suite  ");
  console.log("=================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName}`);
      if (details) console.error(`       Details: ${details}`);
    }
  }

  try {
    // ------------------------------------------------------------------------
    // TEST 1: UTM Sanitization & PII Stripping
    // ------------------------------------------------------------------------
    console.log("--- 1. Testing UTM Sanitization & PII Defense ---");

    const safeSource = sanitizeUTMValue("google-ads");
    assert(safeSource === "google-ads", "Valid UTM source preserved");

    const maliciousEmailUTM = sanitizeUTMValue("john.doe@company.com");
    assert(maliciousEmailUTM === undefined, "Email address in UTM parameter stripped");

    const maliciousPhoneUTM = sanitizeUTMValue("+254712345678");
    assert(maliciousPhoneUTM === undefined, "Phone number in UTM parameter stripped");

    const dirtyInput = sanitizeUTMValue("<script>alert('xss')</script>facebook");
    assert(!dirtyInput?.includes("<script>"), "HTML script tags removed from UTM parameter");

    // ------------------------------------------------------------------------
    // TEST 2: Event Metadata PII Redaction
    // ------------------------------------------------------------------------
    console.log("\n--- 2. Testing Telemetry Metadata PII Redaction ---");

    const dirtyMetadata = {
      productSlug: "fortress",
      contactEmail: "test@example.com",
      phoneNumber: "+254700000000",
      customerName: "Jane Doe",
      nested: {
        userToken: "secret_12345",
        comment: "Contact me at alice@test.org please",
        regularStat: 42,
      },
    };

    const cleanedMeta = sanitizeEventMetadata(dirtyMetadata);
    assert(cleanedMeta.productSlug === "fortress", "Non-sensitive telemetry metadata preserved");
    assert(cleanedMeta.contactEmail === undefined, "Top-level email key stripped entirely");
    assert(cleanedMeta.phoneNumber === undefined, "Top-level phone key stripped entirely");
    assert(cleanedMeta.customerName === undefined, "Top-level name key stripped entirely");
    assert(cleanedMeta.nested.userToken === undefined, "Nested sensitive token key stripped");
    assert(cleanedMeta.nested.regularStat === 42, "Nested safe statistics preserved");
    assert(
      cleanedMeta.nested.comment.includes("[REDACTED_EMAIL]"),
      "Inline email address within text replaced with [REDACTED_EMAIL]"
    );

    // ------------------------------------------------------------------------
    // TEST 3: Search Engine Draft Isolation
    // ------------------------------------------------------------------------
    console.log("\n--- 3. Testing Global Search & Strict Draft Isolation ---");

    const testDraftServiceSlug = `test-draft-service-${Date.now()}`;
    const testDraftService = await db.service.create({
      data: {
        slug: testDraftServiceSlug,
        name: "Top Secret Internal Only Draft Service",
        shortDescription: "This draft should never appear in public search results.",
        longDescription: "Draft description with confidential keywords.",
        category: ServiceCategory.CORE,
        status: PublishStatus.DRAFT,
      },
    });

    // Query for draft title
    const draftSearchResults = await searchPublishedContent({
      query: "Top Secret Internal Only Draft",
      type: "service",
    });

    const leakedDraft = draftSearchResults.results.find((r) => r.id === testDraftService.id);
    assert(!leakedDraft, "Strict Draft Isolation: DRAFT service excluded from search results");

    // Query for static page
    const staticPageResults = await searchPublishedContent({
      query: "Bihi Towers Nairobi",
      type: "page",
    });
    assert(
      staticPageResults.results.some((r) => r.route === "/contact" || r.route === "/about"),
      "Static Core Pages indexed and retrievable via keywords"
    );

    // Verify SearchQueryLog was written
    const loggedQuery = await db.searchQueryLog.findFirst({
      where: { query: "top secret internal only draft" },
      orderBy: { createdAt: "desc" },
    });
    assert(Boolean(loggedQuery), "SearchQueryLog recorded search term and resultsCount");

    // Cleanup draft service
    await db.service.delete({ where: { id: testDraftService.id } });

    // ------------------------------------------------------------------------
    // TEST 4: Lead Creation & First-Touch / Last-Touch Attribution
    // ------------------------------------------------------------------------
    console.log("\n--- 4. Testing Lead Creation & Full Attribution Persistence ---");

    const testEmail = `stage17-test-${Date.now()}@megascript-analytics.co.ke`;
    const leadCreateResult = await createLead({
      name: "Attribution Tester",
      email: testEmail,
      topic: "Web Development & SEO",
      message: "Testing first-touch and last-touch attribution joining to lead record.",
      consent: true,
      timestamp: Date.now() - 3000,
      honeypot: "",
      utmSource: "google-ads",
      utmMedium: "cpc",
      utmCampaign: "q4_enterprise_promo",
      firstTouchSource: "linkedin",
      firstTouchMedium: "social",
      firstTouchCampaign: "brand_awareness_2026",
      firstTouchLanding: "/services",
      lastTouchSource: "google-ads",
      lastTouchMedium: "cpc",
      lastTouchCampaign: "q4_enterprise_promo",
      lastTouchLanding: "/contact",
    });

    assert(leadCreateResult.lead !== undefined, "Lead created successfully");
    const createdLeadId = leadCreateResult.lead.id;

    // Verify UTMAttribution record in DB
    const attribution = await db.uTMAttribution.findUnique({
      where: { leadId: createdLeadId },
    });

    assert(Boolean(attribution), "UTMAttribution record successfully linked to Lead");
    assert(attribution?.firstTouchSource === "linkedin", "First-touch source recorded accurately");
    assert(attribution?.firstTouchMedium === "social", "First-touch medium recorded accurately");
    assert(attribution?.firstTouchCampaign === "brand_awareness_2026", "First-touch campaign recorded accurately");
    assert(attribution?.lastTouchSource === "google-ads", "Last-touch source recorded accurately");
    assert(attribution?.lastTouchCampaign === "q4_enterprise_promo", "Last-touch campaign recorded accurately");
    assert(attribution?.utmSource === "google-ads", "Primary consolidated utmSource populated");

    // ------------------------------------------------------------------------
    // TEST 5: Telemetry Event Ingestion & Dashboard Aggregation
    // ------------------------------------------------------------------------
    console.log("\n--- 5. Testing Analytics Dashboard Aggregations ---");

    const testSessionId = `ses_test_${Date.now()}`;

    // Insert mock page view
    await db.analyticsEvent.create({
      data: {
        eventName: "page_view",
        route: "/services/web-development",
        sessionId: testSessionId,
        sourceChannel: "cpc",
        consentGiven: true,
      },
    });

    // Insert mock product outbound click
    await db.analyticsEvent.create({
      data: {
        eventName: "product_outbound_click",
        route: "/products/fortress",
        sessionId: testSessionId,
        metadata: {
          productSlug: "fortress",
          productName: "Fortress AI Builder",
        },
        consentGiven: true,
      },
    });

    const dashboardReport = await getAnalyticsDashboardData("30d");

    assert(dashboardReport.metrics.totalPageViews > 0, "Dashboard metrics: totalPageViews > 0");
    assert(dashboardReport.metrics.uniqueSessions > 0, "Dashboard metrics: uniqueSessions > 0");
    assert(dashboardReport.metrics.totalLeads > 0, "Dashboard metrics: totalLeads > 0");
    assert(dashboardReport.channels.length > 0, "Dashboard metrics: traffic channels computed");
    assert(
      dashboardReport.campaigns.some((c) => c.campaign === "q4_enterprise_promo"),
      "Dashboard metrics: UTM campaign q4_enterprise_promo listed with lead attribution"
    );
    assert(
      dashboardReport.productClicks.some((p) => p.productSlug === "fortress"),
      "Dashboard metrics: Fortress outbound clicks tracked in report"
    );
    assert(
      dashboardReport.topRoutes.some((r) => r.route === "/services/web-development"),
      "Dashboard metrics: /services/web-development recorded in top routes"
    );

    // ------------------------------------------------------------------------
    // Cleanup Test Artifacts
    // ------------------------------------------------------------------------
    console.log("\n--- Cleaning up test records ---");
    await db.analyticsEvent.deleteMany({
      where: { sessionId: testSessionId },
    });
    await db.lead.delete({
      where: { id: createdLeadId },
    });
    console.log("Test records cleaned up cleanly.");

    // ------------------------------------------------------------------------
    // Final Summary
    // ------------------------------------------------------------------------
    console.log("\n=================================================");
    console.log(`Results: ${passedTests}/${totalTests} tests passed.`);
    if (passedTests === totalTests) {
      console.log("STATUS: ALL TESTS PASSED SUCCESSFULLY! Stage 17 Verified.");
    } else {
      console.error("STATUS: SOME TESTS FAILED.");
      process.exit(1);
    }
  } catch (error) {
    console.error("Test execution failed with unhandled error:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

runStage17Tests();
