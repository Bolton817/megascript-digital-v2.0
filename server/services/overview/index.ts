import { db } from "@/server/db";
import { LeadStatus, CampaignStatus } from "@prisma/client";
import { getFollowUpQueue } from "@/server/services/crm/leads";
import { getIntegrationHealthOverview } from "@/server/services/integrations/health";

export interface OperationsOverviewData {
  timeframe: string;
  timeframeDays: number;
  startDate: string;
  endDate: string;
  
  // 1. Leads KPI
  leads: {
    total: number;
    newCount: number;
    wonCount: number;
    conversionRate: number;
    source: string;
  };

  // 2. Follow-ups KPI
  followUps: {
    totalPending: number;
    highUrgencyCount: number;
    uncontactedCount: number;
    source: string;
  };

  // 3. Traffic KPI
  traffic: {
    pageViews: number;
    uniqueSessions: number;
    ga4ActiveUsers: number | null;
    isGa4Connected: boolean;
    source: string;
  };

  // 4. Conversions KPI
  conversions: {
    overallRatePct: number;
    inboundLeads: number;
    uniqueVisitors: number;
    source: string;
  };

  // 5. Subscriber Growth KPI
  subscribers: {
    totalConfirmed: number;
    netGrowthInWindow: number;
    pendingConfirmation: number;
    source: string;
  };

  // 6. Campaigns KPI
  campaigns: {
    totalSent: number;
    scheduledCount: number;
    overallDeliveryRatePct: number;
    source: string;
  };

  // 7. Tony AI Usage KPI
  tonyAi: {
    totalConversations: number;
    handoffCount: number;
    handoffRatePct: number;
    tokensUsed: number;
    costUsd: number;
    source: string;
  };

  // Operational Queues
  followUpQueue: Array<{
    id: string;
    referenceCode: string;
    name: string;
    topic: string;
    status: LeadStatus;
    urgency: "HIGH" | "MEDIUM" | "NORMAL";
    reason: string;
    hoursWaiting: number;
    assignedTo: string;
  }>;

  integrationHealth: {
    connectedCount: number;
    needsConfigCount: number;
    errorCount: number;
    totalProviders: number;
    overallStatus: "HEALTHY" | "ATTENTION_REQUIRED" | "SETUP_NEEDED";
    providers: Array<{
      provider: string;
      name: string;
      status: string;
      statusLabel: string;
      isConfigured: boolean;
      actionRequired: boolean;
    }>;
  };

  recentCampaigns: Array<{
    id: string;
    title: string;
    subject: string;
    status: CampaignStatus;
    sentAt: Date | null;
    recipientsCount: number;
    deliveryRate: number;
  }>;
}

export async function getOperationsOverview(timeframeDays: number = 30): Promise<OperationsOverviewData> {
  const now = new Date();
  const since = new Date(Date.now() - timeframeDays * 24 * 60 * 60 * 1000);

  const [
    // Leads
    leadsInWindow,
    newLeadsCount,
    wonLeadsCount,
    
    // Follow-ups
    followUpData,

    // Traffic
    eventsInWindow,
    uniqueSessionsGroup,
    ga4Snapshot,

    // Subscribers
    totalSubscribers,
    subscribersInWindow,
    pendingSubscribers,

    // Campaigns
    campaignsInWindow,
    allDeliveriesInWindow,

    // Tony AI
    conversationsInWindow,
    handoffsInWindow,
    aiUsageInWindow,

    // Integration Health
    healthSummary,
  ] = await Promise.all([
    db.lead.count({ where: { createdAt: { gte: since } } }),
    db.lead.count({ where: { status: LeadStatus.NEW, createdAt: { gte: since } } }),
    db.lead.count({ where: { status: LeadStatus.WON, createdAt: { gte: since } } }),

    getFollowUpQueue(6),

    db.analyticsEvent.count({ where: { createdAt: { gte: since } } }),
    db.analyticsEvent.findMany({
      where: { createdAt: { gte: since }, sessionId: { not: null } },
      distinct: ["sessionId"],
      select: { sessionId: true },
    }),
    db.externalMetricSnapshot.findFirst({
      where: { provider: "GA4", metricDate: { gte: since } },
      orderBy: { metricDate: "desc" },
    }),

    db.newsletterSubscriber.count({ where: { status: "CONFIRMED" } }),
    db.newsletterSubscriber.count({ where: { status: "CONFIRMED", consentTimestamp: { gte: since } } }),
    db.newsletterSubscriber.count({ where: { status: "PENDING" } }),

    db.newsletterCampaign.findMany({
      where: { createdAt: { gte: since } },
      include: { deliveries: { select: { status: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.emailDelivery.groupBy({
      by: ["status"],
      where: { sentAt: { gte: since } },
      _count: { status: true },
    }),

    db.chatConversation.count({ where: { startedAt: { gte: since } } }),
    db.chatConversation.count({ where: { status: "HANDOFF_REQUESTED", startedAt: { gte: since } } }),
    db.aIUsageRecord.aggregate({
      where: { createdAt: { gte: since } },
      _sum: { tokensPrompt: true, tokensOutput: true, costUsd: true },
    }),

    getIntegrationHealthOverview(),
  ]);

  const uniqueSessions = uniqueSessionsGroup.length;
  const leadConvRate = uniqueSessions > 0 ? Number(((leadsInWindow / uniqueSessions) * 100).toFixed(1)) : 0;

  // Delivery rate
  let totalDels = 0;
  let successfulDels = 0;
  allDeliveriesInWindow.forEach((d) => {
    totalDels += d._count.status;
    if (d.status === "DELIVERED" || d.status === "SENT") {
      successfulDels += d._count.status;
    }
  });
  const overallDelRate = totalDels > 0 ? Number(((successfulDels / totalDels) * 100).toFixed(1)) : 100;

  // GA4 metric
  const ga4Metrics = ga4Snapshot?.metrics as Record<string, any> | undefined;
  const ga4ActiveUsers = ga4Metrics?.activeUsers ? Number(ga4Metrics.activeUsers) : null;
  const isGa4Connected = Boolean(healthSummary.providers.find((p) => p.provider === "GA4" && p.status === "CONNECTED"));

  // Recent campaigns mapped
  const recentCampaigns = campaignsInWindow.map((c) => {
    let delCount = 0;
    c.deliveries.forEach((d) => {
      if (d.status === "DELIVERED" || d.status === "SENT") delCount++;
    });
    const totalRec = c.deliveries.length;
    const rate = totalRec > 0 ? Number(((delCount / totalRec) * 100).toFixed(1)) : 0;
    return {
      id: c.id,
      title: c.title,
      subject: c.subject,
      status: c.status,
      sentAt: c.sentAt,
      recipientsCount: totalRec,
      deliveryRate: rate,
    };
  });

  const totalTokens = (aiUsageInWindow._sum.tokensPrompt || 0) + (aiUsageInWindow._sum.tokensOutput || 0);
  const totalCost = Number((aiUsageInWindow._sum.costUsd || 0).toFixed(4));
  const handoffRate = conversationsInWindow > 0 ? Number(((handoffsInWindow / conversationsInWindow) * 100).toFixed(1)) : 0;

  return {
    timeframe: `Past ${timeframeDays} Days`,
    timeframeDays,
    startDate: since.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    endDate: now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),

    leads: {
      total: leadsInWindow,
      newCount: newLeadsCount,
      wonCount: wonLeadsCount,
      conversionRate: leadsInWindow > 0 ? Number(((wonLeadsCount / leadsInWindow) * 100).toFixed(1)) : 0,
      source: "PostgreSQL CRM (Sheet 105)",
    },

    followUps: {
      totalPending: followUpData.totalNeedingFollowUp,
      highUrgencyCount: followUpData.items.filter((i) => i.urgency === "HIGH").length,
      uncontactedCount: followUpData.items.filter((i) => i.status === LeadStatus.NEW).length,
      source: "CRM Response Queue (Sheet 106)",
    },

    traffic: {
      pageViews: eventsInWindow,
      uniqueSessions,
      ga4ActiveUsers,
      isGa4Connected,
      source: isGa4Connected ? "First-Party Engine + GA4 API" : "First-Party Telemetry (Sheet 074)",
    },

    conversions: {
      overallRatePct: leadConvRate,
      inboundLeads: leadsInWindow,
      uniqueVisitors: uniqueSessions,
      source: "Internal Attribution Engine (Sheet 073)",
    },

    subscribers: {
      totalConfirmed: totalSubscribers,
      netGrowthInWindow: subscribersInWindow,
      pendingConfirmation: pendingSubscribers,
      source: "Double Opt-In Directory (Sheet 070)",
    },

    campaigns: {
      totalSent: campaignsInWindow.filter((c) => c.status === CampaignStatus.SENT).length,
      scheduledCount: campaignsInWindow.filter((c) => c.status === CampaignStatus.SCHEDULED).length,
      overallDeliveryRatePct: overallDelRate,
      source: "Brevo Transactional & Campaign Engine (Sheet 071)",
    },

    tonyAi: {
      totalConversations: conversationsInWindow,
      handoffCount: handoffsInWindow,
      handoffRatePct: handoffRate,
      tokensUsed: totalTokens,
      costUsd: totalCost,
      source: "Tony AI Telemetry & Usage (Sheet 122)",
    },

    followUpQueue: followUpData.items,

    integrationHealth: {
      connectedCount: healthSummary.connectedCount,
      needsConfigCount: healthSummary.needsConfigCount,
      errorCount: healthSummary.errorCount,
      totalProviders: healthSummary.totalProviders,
      overallStatus: healthSummary.overallStatus,
      providers: healthSummary.providers.map((p) => ({
        provider: p.provider,
        name: p.name,
        status: p.status,
        statusLabel: p.statusLabel,
        isConfigured: p.isConfigured,
        actionRequired: p.actionRequired,
      })),
    },

    recentCampaigns,
  };
}
