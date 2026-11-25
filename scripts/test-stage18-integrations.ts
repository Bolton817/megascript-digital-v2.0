/**
 * Automated Verification Suite for Stage 18:
 * Google & Meta Analytics Integrations in Disconnected-Safe Mode
 */
import { db } from "../server/db";
import { ConnectionStatus } from "@prisma/client";
import {
  listAllIntegrations,
  getIntegrationDetails,
  saveIntegrationCredentials,
  disconnectIntegration,
  triggerIntegrationSync,
  testProviderCredentials,
} from "../server/services/integrations";
import {
  validateGA4Credentials,
  normalizeGA4PropertyId,
  testGA4Connection,
  syncGA4Report,
} from "../server/services/integrations/google-analytics";
import {
  validateSearchConsoleCredentials,
  normalizeSiteUrl,
  testSearchConsoleConnection,
  syncSearchConsoleData,
} from "../server/services/integrations/google-search-console";
import {
  checkGoogleBusinessEligibility,
  testGoogleBusinessConnection,
} from "../server/services/integrations/google-business";
import {
  validateMetaCredentials,
  hashForMeta,
  testMetaConnection,
} from "../server/services/integrations/meta";
import { generateConversionEventId } from "../lib/analytics/meta-capi";
import { getAnalyticsDashboardReport } from "../server/services/analytics/dashboard";
import {
  encryptToPackedString,
  decryptFromPackedString,
  maskApiKey,
} from "../server/services/security/encryption";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failedCount++;
  }
}

async function runStage18Tests() {
  console.log("=================================================");
  console.log("   Stage 18: Google & Meta Analytics Test Suite  ");
  console.log("=================================================\n");

  try {
    // ------------------------------------------------------------------------
    // 1. Disconnected-Safe Initial State
    // ------------------------------------------------------------------------
    console.log("--- 1. Testing Disconnected-Safe Operational Guarantees ---");
    const allIntegrations = await listAllIntegrations();
    assert(allIntegrations.length === 7, "Returns all 7 registered providers");

    const ga4 = allIntegrations.find((i) => i.provider === "GA4");
    assert(Boolean(ga4), "Google Analytics 4 registered in provider list");
    assert(
      ga4?.status === ConnectionStatus.NOT_CONNECTED || ga4?.status === ConnectionStatus.CONNECTED,
      "GA4 status is a valid enum (not unhandled or crashing)"
    );

    const gsc = allIntegrations.find((i) => i.provider === "SEARCH_CONSOLE");
    assert(Boolean(gsc), "Google Search Console registered in provider list");

    const meta = allIntegrations.find((i) => i.provider === "META");
    assert(Boolean(meta), "Meta Pixel & Conversions API registered in provider list");

    const gbp = allIntegrations.find((i) => i.provider === "GOOGLE_BUSINESS");
    assert(Boolean(gbp), "Google Business Profile registered in provider list");

    // ------------------------------------------------------------------------
    // 2. Secret Encryption & Masking
    // ------------------------------------------------------------------------
    console.log("\n--- 2. Testing Credential Encryption & Masking ---");
    const rawSecret = "sk-live-1234567890abcdef123456";
    const packed = encryptToPackedString(rawSecret);
    assert(packed.split(":").length === 3, "Encrypted payload packed into iv:authTag:ciphertext format");
    assert(!packed.includes(rawSecret), "Plaintext secret is not present in packed string");

    const decrypted = decryptFromPackedString(packed);
    assert(decrypted === rawSecret, "Decrypted secret matches original plaintext exactly");

    const masked = maskApiKey(rawSecret);
    assert(masked.endsWith("3456"), "Masked API key preserves only the trailing 4 characters");
    assert(!masked.includes("abcdef"), "Internal sensitive characters are masked with bullets");

    // ------------------------------------------------------------------------
    // 3. Google Analytics 4 Adapter & Sync
    // ------------------------------------------------------------------------
    console.log("\n--- 3. Testing Google Analytics 4 Adapter ---");
    const invalidGa4 = validateGA4Credentials({ measurementId: "invalid", propertyId: "abc" });
    assert(!invalidGa4.valid, "Rejects malformed GA4 Measurement ID and Property ID");
    assert(invalidGa4.errors.length >= 2, "Returns explicit validation error messages");

    const validGa4 = validateGA4Credentials({
      measurementId: "G-TEST999999",
      propertyId: "123456789",
    });
    assert(validGa4.valid, "Accepts valid GA4 credentials format");

    const normalizedProp = normalizeGA4PropertyId("123456789");
    assert(normalizedProp === "properties/123456789", "Normalizes numeric property to properties/123456789");

    const ga4Diag = await testGA4Connection(
      { measurementId: "G-TEST999999", propertyId: "properties/999999" },
      true
    );
    assert(ga4Diag.success, "Sandbox connection test succeeds for GA4 test credentials");

    // ------------------------------------------------------------------------
    // 4. Google Search Console Adapter & Sync
    // ------------------------------------------------------------------------
    console.log("\n--- 4. Testing Google Search Console Adapter ---");
    const invalidGsc = validateSearchConsoleCredentials({ siteUrl: "invalid-url" });
    assert(!invalidGsc.valid, "Rejects invalid Search Console site URL prefix");

    const validDomainGsc = validateSearchConsoleCredentials({
      siteUrl: "sc-domain:megascriptdigital.co.ke",
    });
    assert(validDomainGsc.valid, "Accepts valid sc-domain: format");

    const normalizedSite = normalizeSiteUrl("https://megascriptdigital.co.ke");
    assert(normalizedSite.endsWith("/"), "Ensures trailing slash on URL-prefix properties");

    const gscDiag = await testSearchConsoleConnection(
      { siteUrl: "sc-domain:megascriptdigital.co.ke" },
      true
    );
    assert(gscDiag.success, "Sandbox connection test succeeds for Search Console");

    // ------------------------------------------------------------------------
    // 5. Google Business Profile Eligibility (Task 90)
    // ------------------------------------------------------------------------
    console.log("\n--- 5. Testing Google Business Profile Eligibility ---");
    const unverifiedEligibility = checkGoogleBusinessEligibility({});
    assert(!unverifiedEligibility.isEligible, "Flags unconfigured profile as ineligible");
    assert(
      unverifiedEligibility.recommendedAction.includes("Google Maps"),
      "Provides actionable setup guidance"
    );

    const verifiedEligibility = checkGoogleBusinessEligibility({
      locationId: "locations/123",
      accountId: "accounts/456",
    });
    assert(verifiedEligibility.isEligible, "Accepts configured location ID and account ID");

    // ------------------------------------------------------------------------
    // 6. Meta Pixel & Conversions API (CAPI)
    // ------------------------------------------------------------------------
    console.log("\n--- 6. Testing Meta Pixel & CAPI ---");
    const invalidMeta = validateMetaCredentials({ pixelId: "abc" });
    assert(!invalidMeta.valid, "Rejects non-numeric Meta Pixel ID");

    const validMeta = validateMetaCredentials({
      pixelId: "123456789012345",
      capiAccessToken: "EAABtesttoken12345678901234567890",
    });
    assert(validMeta.valid, "Accepts valid numeric Pixel ID and CAPI token");

    const hashedEmail = hashForMeta("Test.User@MegaScriptDigital.co.ke ");
    assert(Boolean(hashedEmail), "Generates SHA-256 hash for customer email");
    assert(hashedEmail?.length === 64, "SHA-256 hash length is exactly 64 hex characters");
    assert(
      hashedEmail === hashForMeta("test.user@megascriptdigital.co.ke"),
      "Normalizes email case and whitespace before hashing"
    );

    const eventId = generateConversionEventId("lead");
    assert(eventId.startsWith("lead_"), "Generates deduplication event_id with prefix");
    assert(eventId.length > 15, "Event ID contains sufficient entropy for deduplication");

    // ------------------------------------------------------------------------
    // 7. Integration Connection Lifecycle & DB Persistence
    // ------------------------------------------------------------------------
    console.log("\n--- 7. Testing Connection Lifecycle & Persistence ---");
    const testAdminUser = await db.user.findFirst();
    const adminId = testAdminUser?.id;

    // Save test GA4 connection
    const savedConn = await saveIntegrationCredentials(
      "GA4",
      {
        accountAssetLabel: "Test Property (G-TEST999999)",
        credentialsPayload: JSON.stringify({
          measurementId: "G-TEST999999",
          propertyId: "999999",
        }),
      },
      adminId
    );
    assert(savedConn.status === ConnectionStatus.CONNECTED, "Connection persists with status CONNECTED");
    assert(Boolean(savedConn.encryptedSecretRef), "Encrypted secret reference is populated");

    // Trigger on-demand sync
    const syncRes = await triggerIntegrationSync("GA4");
    assert(syncRes.success, "On-demand synchronization executes successfully");
    assert(
      (syncRes as any).recordsCount > 0,
      "Sync records count is greater than zero"
    );

    // Verify snapshot in ExternalMetricSnapshot
    const latestSnapshot = await db.externalMetricSnapshot.findFirst({
      where: { provider: "GA4" },
      orderBy: { metricDate: "desc" },
    });
    assert(Boolean(latestSnapshot), "ExternalMetricSnapshot record successfully created");
    assert((latestSnapshot?.metrics as any)?.sessions > 0, "Snapshot contains parsed sessions metric");

    // Verify audit log creation
    if (adminId) {
      const auditRecord = await db.auditLog.findFirst({
        where: {
          action: "INTEGRATION_CONFIGURED",
          targetId: "GA4",
        },
        orderBy: { createdAt: "desc" },
      });
      assert(Boolean(auditRecord), "Audit log record successfully generated for configuration change");
    }

    // ------------------------------------------------------------------------
    // 8. Analytics Dashboard External Reporting Separation (Task 93)
    // ------------------------------------------------------------------------
    console.log("\n--- 8. Testing Dashboard External Reporting Separation ---");
    const dashboardReport = await getAnalyticsDashboardReport("30d");
    assert(Boolean(dashboardReport.externalProviders), "Dashboard report contains externalProviders group");
    assert(
      dashboardReport.externalProviders.ga4.status === ConnectionStatus.CONNECTED,
      "Dashboard reflects GA4 connected state"
    );
    assert(
      Boolean(dashboardReport.externalProviders.ga4.metrics),
      "Dashboard delivers external GA4 metrics snapshot"
    );
    assert(
      dashboardReport.externalProviders.searchConsole.status === ConnectionStatus.NOT_CONNECTED ||
        dashboardReport.externalProviders.searchConsole.status === ConnectionStatus.CONNECTED,
      "Search Console connector status is safely reported"
    );

    // ------------------------------------------------------------------------
    // 9. Disconnect Integration
    // ------------------------------------------------------------------------
    console.log("\n--- 9. Testing Secure Disconnect & Secret Wipe ---");
    const disconnRes = await disconnectIntegration("GA4", adminId);
    assert(disconnRes.success, "Disconnect operation succeeds");

    const disconnRecord = await db.integrationConnection.findUnique({
      where: { provider: "GA4" },
    });
    assert(
      disconnRecord?.status === ConnectionStatus.NOT_CONNECTED,
      "Connection status safely resets to NOT_CONNECTED"
    );
    assert(
      disconnRecord?.encryptedSecretRef === null,
      "Encrypted credentials reference wiped completely from database"
    );

    // ------------------------------------------------------------------------
    // Final Results Summary
    // ------------------------------------------------------------------------
    console.log("\n=================================================");
    console.log(`Results: ${passedCount}/${passedCount + failedCount} tests passed.`);
    if (failedCount === 0) {
      console.log("STATUS: ALL TESTS PASSED SUCCESSFULLY! Stage 18 Verified.");
    } else {
      console.error(`STATUS: ${failedCount} tests failed.`);
      process.exit(1);
    }
  } catch (err) {
    console.error("Unhandled test execution error:", err);
    process.exit(1);
  }
}

runStage18Tests().catch(console.error);
