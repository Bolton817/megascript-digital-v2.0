import { db } from "../server/db";
import { getOperationsOverview } from "../server/services/overview";
import { getFollowUpQueue } from "../server/services/crm/leads";
import { getLeadReportingMetrics } from "../server/services/crm/reporting";
import { getCampaignOutcomeAnalytics } from "../server/services/newsletter/campaign-analytics";
import {
  createAdminNotification,
  getAdminNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../server/services/notifications";
import { getIntegrationHealthOverview } from "../server/services/integrations/health";
import { exportLeadsData, exportAnalyticsData } from "../server/services/export";
import { LeadStatus, NotificationType, NotificationSeverity, RoleName, CampaignStatus } from "@prisma/client";

async function runStage19Tests() {
  console.log("======================================================");
  console.log("  Stage 19: CRM Analytics & Operations Test Suite     ");
  console.log("======================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // --- Seed clean test records ---
  const testEmail = `test.stage19.${Date.now()}@example.com`;
  const adminRole = RoleName.ADMIN;

  try {
    // 1. Create a test lead with events for response time calculation
    const testLead = await db.lead.create({
      data: {
        referenceCode: `TEST-STG19-${Date.now().toString(36).toUpperCase()}`,
        name: "Stage 19 Test Client",
        email: testEmail,
        normalizedEmail: testEmail.toLowerCase(),
        topic: "Cloud ERP & Automation",
        message: "Need urgent consultation for manufacturing portal.",
        status: LeadStatus.NEW,
        sourceChannel: "contact-form",
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36 hours ago (HIGH urgency)
      },
    });

    // Initial event
    await db.leadEvent.create({
      data: {
        leadId: testLead.id,
        eventType: "LEAD_CREATED",
        description: "Enquiry submitted via contact form",
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
      },
    });

    // First action 3 hours after creation
    await db.leadEvent.create({
      data: {
        leadId: testLead.id,
        eventType: "STATUS_CHANGED",
        description: "Status changed from NEW to CONTACTED",
        createdAt: new Date(Date.now() - 33 * 60 * 60 * 1000),
      },
    });

    // Create UTM attribution
    await db.uTMAttribution.create({
      data: {
        leadId: testLead.id,
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "erp_automation_2026",
      },
    });

    // 2. Create test campaign with email deliveries
    const testCampaign = await db.newsletterCampaign.create({
      data: {
        title: "Stage 19 Outcome Verification",
        subject: "Executive Systems Update",
        body: "<p>Operational test content</p>",
        status: CampaignStatus.SENT,
        sentAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    });

    await db.emailDelivery.createMany({
      data: [
        {
          recipientEmail: "rec1@example.com",
          campaignId: testCampaign.id,
          templateId: "tpl_1",
          messageType: "CAMPAIGN",
          status: "DELIVERED",
          sentAt: new Date(),
        },
        {
          recipientEmail: "rec2@example.com",
          campaignId: testCampaign.id,
          templateId: "tpl_1",
          messageType: "CAMPAIGN",
          status: "DELIVERED",
          sentAt: new Date(),
        },
        {
          recipientEmail: "rec3@example.com",
          campaignId: testCampaign.id,
          templateId: "tpl_1",
          messageType: "CAMPAIGN",
          status: "BOUNCED",
          sentAt: new Date(),
        },
      ],
    });

    // -----------------------------------------------------------------
    // Section 1: Overview Metrics (Task 94, Sheet 104)
    // -----------------------------------------------------------------
    console.log("\n--- 1. Testing Operations Overview Metrics (Task 94) ---");
    const overview = await getOperationsOverview(30);

    assert(overview.timeframe === "Past 30 Days", "Overview timeframe correctly labeled");
    assert(typeof overview.startDate === "string" && overview.startDate.length > 0, "Start date formatted");
    assert(typeof overview.endDate === "string" && overview.endDate.length > 0, "End date formatted");
    assert(overview.leads.total > 0, "Leads total counted in window");
    assert(overview.leads.source.includes("PostgreSQL CRM"), "Leads provenance source tagged");
    assert(overview.traffic.source.includes("Sheet 074") || overview.traffic.source.includes("First-Party"), "Traffic provenance tagged");
    assert(overview.conversions.source.includes("Attribution"), "Conversions provenance tagged");
    assert(overview.subscribers.source.includes("Double Opt-In"), "Subscribers provenance tagged");
    assert(overview.campaigns.source.includes("Brevo"), "Campaigns provenance tagged");
    assert(overview.tonyAi.source.includes("Tony AI"), "Tony AI provenance tagged");
    assert(Array.isArray(overview.followUpQueue), "Follow-up queue array present");

    // -----------------------------------------------------------------
    // Section 2: Follow-up Queue (Task 94)
    // -----------------------------------------------------------------
    console.log("\n--- 2. Testing Follow-up Queue & Urgency Sorting ---");
    const followUps = await getFollowUpQueue(20);

    assert(followUps.totalNeedingFollowUp > 0, "Follow-ups detected pending work");
    const foundTestLead = followUps.items.find((i) => i.id === testLead.id);
    assert(Boolean(foundTestLead), "Test lead included in follow-up queue");
    if (foundTestLead) {
      assert(foundTestLead.hoursWaiting >= 30, "Hours waiting computed accurately (>30h)");
      assert(foundTestLead.urgency === "HIGH" || foundTestLead.urgency === "MEDIUM", "Urgency calculated correctly");
    }

    // -----------------------------------------------------------------
    // Section 3: Campaign Outcomes Dashboard (Task 95, Sheet 071)
    // -----------------------------------------------------------------
    console.log("\n--- 3. Testing Campaign Status & Outcome Analytics (Task 95) ---");
    const outcomes = await getCampaignOutcomeAnalytics(90);

    assert(outcomes.totalCampaigns > 0, "Campaigns retrieved in timeframe");
    assert(outcomes.sentCampaignsCount > 0, "Sent campaigns count computed");
    const campaignRow = outcomes.campaigns.find((c) => c.id === testCampaign.id);
    assert(Boolean(campaignRow), "Test campaign found in outcomes log");
    if (campaignRow) {
      assert(campaignRow.recipientsCount === 3, "Recipients counted correctly (3 deliveries)");
      assert(campaignRow.deliveredCount === 2, "Delivered count computed (2)");
      assert(campaignRow.bouncedCount === 1, "Bounced count computed (1)");
      assert(campaignRow.deliveryRate === 66.7, `Delivery rate computed as 66.7% (got ${campaignRow.deliveryRate}%)`);
    }

    // -----------------------------------------------------------------
    // Section 4: Lead Response Time & Source Reporting (Task 96, Sheet 105)
    // -----------------------------------------------------------------
    console.log("\n--- 4. Testing Lead Response & Source Reporting (Task 96) ---");
    const reporting = await getLeadReportingMetrics(30);

    assert(reporting.totalLeads > 0, "Reporting total leads > 0");
    assert(reporting.avgResponseHours !== null && reporting.avgResponseHours > 0, `Average response time computed (${reporting.avgResponseHours}h)`);
    assert(reporting.responseTimeDistribution.oneToSixHours > 0, "Test lead placed in 1-6 hour SLA bucket");
    assert(reporting.funnelProgression.length === 5, "5 funnel stages mapped");
    assert(reporting.funnelProgression[0].stage === "Total Enquiries", "First funnel stage is Total Enquiries");

    const erpCampaign = reporting.campaignAttribution.find((c) => c.campaign === "erp_automation_2026");
    assert(Boolean(erpCampaign), "UTM campaign attribution mapped in lead reporting");

    // -----------------------------------------------------------------
    // Section 5: Admin Notifications & Alert Center (Task 97, Sheet 112)
    // -----------------------------------------------------------------
    console.log("\n--- 5. Testing Admin Notifications & Alert Center (Task 97) ---");
    const idempotencyKey = `test_alert_${Date.now()}`;

    const notif1 = await createAdminNotification({
      type: NotificationType.NEW_LEAD,
      severity: NotificationSeverity.INFO,
      title: "Test Lead Notification",
      message: "Lead received from test suite",
      linkUrl: `/master/leads/${testLead.id}`,
      targetRole: RoleName.ADMIN,
      idempotencyKey,
    });
    assert(Boolean(notif1.id), "Notification created successfully");
    assert(!notif1.isRead, "Initial notification is unread");

    // Test Idempotency: duplicate key should return existing unread alert
    const notif2 = await createAdminNotification({
      type: NotificationType.NEW_LEAD,
      severity: NotificationSeverity.INFO,
      title: "Duplicate Call",
      message: "Should be deduped",
      idempotencyKey,
    });
    assert(notif2.id === notif1.id, "Idempotent duplicate alert call deduplicated");

    // Test Retrieval
    const notifList = await getAdminNotifications({
      userId: "dummy-user",
      roles: [RoleName.ADMIN],
      isSuperAdmin: false,
    });
    assert(notifList.unreadCount > 0, "Unread notification count > 0");
    const foundNotif = notifList.notifications.find((n) => n.id === notif1.id);
    assert(Boolean(foundNotif), "Target-role notification retrieved by Admin");

    // Test Mark as Read
    await markNotificationAsRead(notif1.id);
    const updatedNotif = await db.notification.findUnique({ where: { id: notif1.id } });
    assert(updatedNotif?.isRead === true, "Notification successfully marked as read");
    assert(Boolean(updatedNotif?.readAt), "readAt timestamp populated");

    // Test Mark All as Read
    await markAllNotificationsAsRead({
      userId: "dummy-user",
      roles: [RoleName.ADMIN],
      isSuperAdmin: true,
    });

    // -----------------------------------------------------------------
    // Section 6: Integration Health Panel (Task 97)
    // -----------------------------------------------------------------
    console.log("\n--- 6. Testing Integration Health Panel (Task 97) ---");
    const health = await getIntegrationHealthOverview();

    assert(health.totalProviders === 7, `All 7 providers tracked in health panel (got ${health.totalProviders})`);
    assert(typeof health.overallStatus === "string", "Overall status computed");
    const ga4Def = health.providers.find((p) => p.provider === "GA4");
    assert(Boolean(ga4Def), "GA4 tracked in health summary");
    const brevoDef = health.providers.find((p) => p.provider === "BREVO");
    assert(Boolean(brevoDef), "Brevo tracked in health summary");

    // -----------------------------------------------------------------
    // Section 7: Export Permissions & KDPA Privacy (Task 98, Sheet 105, 140)
    // -----------------------------------------------------------------
    console.log("\n--- 7. Testing Export Security & Privacy Gating (Task 98) ---");
    const realUser = await db.user.findFirst();
    const testActorId = realUser?.id || "unspecified";

    // 7.1 Unauthorized role (e.g. Analyst lacking leads.export) must be rejected
    let unauthorizedBlocked = false;
    try {
      await exportLeadsData({
        actorId: testActorId,
        hasExportPermission: false,
      });
    } catch (err: any) {
      if (err.name === "ForbiddenError" || err.message.includes("Forbidden")) {
        unauthorizedBlocked = true;
      }
    }
    assert(unauthorizedBlocked, "Unauthorized role rejected with ForbiddenError when exporting leads");

    // 7.2 Authorized export succeeds and generates CSV
    const authorizedExport = await exportLeadsData({
      actorId: testActorId,
      hasExportPermission: true,
      format: "csv",
      anonymize: false,
    });
    assert(authorizedExport.contentType === "text/csv", "CSV export format returned");
    assert(authorizedExport.content.includes("Reference,Date,Name,Email"), "CSV headers present");
    assert(authorizedExport.content.includes(testLead.name), "Authorized export contains unmasked client name");

    // 7.3 Privacy Anonymization mode redacts customer PII (KDPA 2019)
    const anonymizedExport = await exportLeadsData({
      actorId: testActorId,
      hasExportPermission: true,
      format: "csv",
      anonymize: true,
    });
    assert(!anonymizedExport.content.includes(testLead.name), "Anonymized export redacts customer name");
    assert(!anonymizedExport.content.includes(testLead.email), "Anonymized export redacts customer email");
    assert(anonymizedExport.content.includes("REDACTED"), "REDACTED placeholder used in anonymized export");
    assert(anonymizedExport.content.includes(testLead.referenceCode), "Reference code preserved in anonymized export");

    // 7.4 Audit log entry created
    const exportAudit = await db.auditLog.findFirst({
      where: { action: "EXPORT_LEADS" },
      orderBy: { createdAt: "desc" },
    });
    assert(Boolean(exportAudit), "Export action recorded in immutable AuditLog");
    assert(exportAudit?.actorId === testActorId, "Audit log records actor ID");

    // 7.5 Analytics export
    const analyticsExport = await exportAnalyticsData({
      actorId: testActorId,
      hasExportPermission: true,
      format: "csv",
      timeframeDays: 30,
    });
    assert(analyticsExport.contentType === "text/csv", "Analytics CSV export generated");
    assert(analyticsExport.content.includes("Metric,Value"), "Analytics CSV headers present");

    // --- Cleanup test records ---
    console.log("\n--- Cleaning up test records ---");
    await db.emailDelivery.deleteMany({ where: { campaignId: testCampaign.id } });
    await db.newsletterCampaign.delete({ where: { id: testCampaign.id } });
    await db.uTMAttribution.deleteMany({ where: { leadId: testLead.id } });
    await db.leadEvent.deleteMany({ where: { leadId: testLead.id } });
    await db.lead.delete({ where: { id: testLead.id } });
    await db.notification.deleteMany({ where: { idempotencyKey } });
    console.log("Test records cleaned up cleanly.");

  } catch (error) {
    console.error("Test execution threw error:", error);
    failed++;
  }

  console.log("\n======================================================");
  console.log(`Results: ${passed} passed, ${failed} failed.`);
  if (failed === 0) {
    console.log("STATUS: ALL TESTS PASSED SUCCESSFULLY! Stage 19 Verified.");
  } else {
    console.error("STATUS: TESTS FAILED. Review errors above.");
    process.exit(1);
  }
}

runStage19Tests().catch((err) => {
  console.error(err);
  process.exit(1);
});
