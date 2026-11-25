import { db } from "@/server/db";

export type TimeframeOption = "24h" | "7d" | "30d" | "90d";

export interface MetricCardData {
  totalPageViews: number;
  uniqueSessions: number;
  totalLeads: number;
  conversionRate: number; // e.g. 2.45 (%)
}

export interface ChannelBreakdown {
  channel: string;
  sessions: number;
  leads: number;
  conversionRate: number;
  share: number; // percentage of total traffic
}

export interface UTMCampaignData {
  campaign: string;
  source: string;
  medium: string;
  leads: number;
  firstTouchCount: number;
  lastTouchCount: number;
}

export interface TopRouteData {
  route: string;
  views: number;
  percentage: number;
}

export interface ProductClickData {
  productSlug: string;
  productName: string;
  clicks: number;
  lastClickedAt: string;
}

export interface SearchTermData {
  term: string;
  queriesCount: number;
  avgResults: number;
}

export interface DailyTrendPoint {
  date: string;
  views: number;
  sessions: number;
  leads: number;
}

export interface ExternalProviderSummary {
  status: string; // "CONNECTED" | "NOT_CONNECTED" | "NEEDS_CONFIGURATION" | "ERROR"
  accountAssetLabel: string | null;
  lastSyncAt: string | null;
  metrics: Record<string, any> | null;
}

export interface ExternalProvidersReport {
  ga4: ExternalProviderSummary;
  searchConsole: ExternalProviderSummary;
  meta: ExternalProviderSummary;
}

export interface AnalyticsDashboardReport {
  timeframe: TimeframeOption;
  startDate: string;
  endDate: string;
  metrics: MetricCardData;
  channels: ChannelBreakdown[];
  campaigns: UTMCampaignData[];
  topRoutes: TopRouteData[];
  productClicks: ProductClickData[];
  topSearches: SearchTermData[];
  dailyTrends: DailyTrendPoint[];
  externalProviders: ExternalProvidersReport;
}

export function getTimeframeDates(timeframe: TimeframeOption): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  const msInDay = 24 * 60 * 60 * 1000;
  let durationMs = 30 * msInDay;

  if (timeframe === "24h") {
    durationMs = 1 * msInDay;
  } else if (timeframe === "7d") {
    durationMs = 7 * msInDay;
  } else if (timeframe === "30d") {
    durationMs = 30 * msInDay;
  } else if (timeframe === "90d") {
    durationMs = 90 * msInDay;
  }

  const startDate = new Date(endDate.getTime() - durationMs);
  return { startDate, endDate };
}

function classifyChannel(source?: string | null, medium?: string | null, sourceChannel?: string | null): string {
  const s = (source || "").toLowerCase();
  const m = (medium || "").toLowerCase();
  const sc = (sourceChannel || "").toLowerCase();

  if (sc === "tony-chat" || s === "tony-chat") return "Tony AI Chat";
  if (m === "cpc" || m === "paid" || m === "ppc" || m === "ad" || m === "ads") return "Paid Search / Ads";
  if (m === "social" || s === "twitter" || s === "x.com" || s === "linkedin" || s === "facebook" || s === "meta" || s === "instagram") return "Social Media";
  if (m === "referral" || s.includes("referral")) return "Referral";
  if (m === "organic" || s === "google" || s === "bing" || s === "yahoo" || s === "duckduckgo") return "Organic Search";
  if (m === "email" || s === "newsletter") return "Email Campaign";
  if (s === "direct" || (!s && !m)) return "Direct / Bookmark";

  return "Other / Campaign";
}

export async function getAnalyticsDashboardReport(
  timeframe: TimeframeOption = "30d"
): Promise<AnalyticsDashboardReport> {
  const { startDate, endDate } = getTimeframeDates(timeframe);

  const [events, leads, searchLogs, connections, ga4Snapshot, gscSnapshot] = await Promise.all([
    db.analyticsEvent.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        eventName: true,
        route: true,
        sourceChannel: true,
        sessionId: true,
        metadata: true,
        createdAt: true,
      },
    }),
    db.lead.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        utmAttribution: true,
      },
    }),
    db.searchQueryLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.integrationConnection.findMany({
      where: {
        provider: { in: ["GA4", "SEARCH_CONSOLE", "META"] },
      },
    }),
    db.externalMetricSnapshot.findFirst({
      where: { provider: "GA4" },
      orderBy: { metricDate: "desc" },
    }),
    db.externalMetricSnapshot.findFirst({
      where: { provider: "SEARCH_CONSOLE" },
      orderBy: { metricDate: "desc" },
    }),
  ]);

  // Aggregate External Provider Summaries
  const connMap = new Map<string, (typeof connections)[number]>();
  connections.forEach((c) => connMap.set(c.provider, c));

  const ga4Conn = connMap.get("GA4");
  const gscConn = connMap.get("SEARCH_CONSOLE");
  const metaConn = connMap.get("META");

  const externalProviders: ExternalProvidersReport = {
    ga4: {
      status: ga4Conn?.status || "NOT_CONNECTED",
      accountAssetLabel: ga4Conn?.accountAssetLabel || null,
      lastSyncAt: ga4Conn?.lastSyncAt?.toISOString() || null,
      metrics: ga4Snapshot?.metrics ? (ga4Snapshot.metrics as any) : null,
    },
    searchConsole: {
      status: gscConn?.status || "NOT_CONNECTED",
      accountAssetLabel: gscConn?.accountAssetLabel || null,
      lastSyncAt: gscConn?.lastSyncAt?.toISOString() || null,
      metrics: gscSnapshot?.metrics ? (gscSnapshot.metrics as any) : null,
    },
    meta: {
      status: metaConn?.status || "NOT_CONNECTED",
      accountAssetLabel: metaConn?.accountAssetLabel || null,
      lastSyncAt: metaConn?.lastSyncAt?.toISOString() || null,
      metrics: null,
    },
  };

  // --- KPI Cards ---
  const totalPageViews = events.filter((e) => e.eventName === "page_view").length;
  const uniqueSessionIds = new Set<string>();
  events.forEach((e) => {
    if (e.sessionId) uniqueSessionIds.add(e.sessionId);
  });
  const uniqueSessions = uniqueSessionIds.size;
  const totalLeads = leads.length;
  const conversionRate =
    uniqueSessions > 0 ? Number(((totalLeads / uniqueSessions) * 100).toFixed(2)) : 0;

  // --- Traffic Channels ---
  const channelMap = new Map<string, { sessions: Set<string>; leads: number }>();
  events.forEach((e) => {
    const meta = e.metadata as Record<string, any> | null;
    const channelName = classifyChannel(
      meta?.utmSource || meta?.utm_source,
      meta?.utmMedium || meta?.utm_medium,
      e.sourceChannel
    );

    if (!channelMap.has(channelName)) {
      channelMap.set(channelName, { sessions: new Set(), leads: 0 });
    }
    if (e.sessionId) {
      channelMap.get(channelName)!.sessions.add(e.sessionId);
    }
  });

  leads.forEach((l) => {
    const utm = l.utmAttribution;
    const channelName = classifyChannel(
      utm?.firstTouchSource || utm?.utmSource,
      utm?.firstTouchMedium || utm?.utmMedium,
      null
    );

    if (!channelMap.has(channelName)) {
      channelMap.set(channelName, { sessions: new Set(), leads: 0 });
    }
    channelMap.get(channelName)!.leads += 1;
  });

  const channels: ChannelBreakdown[] = Array.from(channelMap.entries())
    .map(([channel, data]) => {
      const sessCount = data.sessions.size;
      const share = uniqueSessions > 0 ? Number(((sessCount / uniqueSessions) * 100).toFixed(1)) : 0;
      const conv = sessCount > 0 ? Number(((data.leads / sessCount) * 100).toFixed(2)) : 0;
      return {
        channel,
        sessions: sessCount,
        leads: data.leads,
        conversionRate: conv,
        share,
      };
    })
    .sort((a, b) => b.sessions - a.sessions);

  // --- UTM Campaigns ---
  const campaignMap = new Map<
    string,
    { source: string; medium: string; leads: number; firstTouch: number; lastTouch: number }
  >();

  leads.forEach((l) => {
    const utm = l.utmAttribution;
    if (!utm) return;

    const campaign = utm.utmCampaign || utm.firstTouchCampaign || utm.lastTouchCampaign || "none";
    const source = utm.utmSource || utm.firstTouchSource || "none";
    const medium = utm.utmMedium || utm.firstTouchMedium || "none";

    if (!campaignMap.has(campaign)) {
      campaignMap.set(campaign, { source, medium, leads: 0, firstTouch: 0, lastTouch: 0 });
    }

    const entry = campaignMap.get(campaign)!;
    entry.leads += 1;
    if (utm.firstTouchCampaign === campaign) entry.firstTouch += 1;
    if (utm.lastTouchCampaign === campaign) entry.lastTouch += 1;
  });

  const campaigns: UTMCampaignData[] = Array.from(campaignMap.entries()).map(([cName, data]) => ({
    campaign: cName,
    source: data.source,
    medium: data.medium,
    leads: data.leads,
    firstTouchCount: data.firstTouch,
    lastTouchCount: data.lastTouch,
  }));

  // --- Top Routes ---
  const routeMap = new Map<string, number>();
  events
    .filter((e) => e.eventName === "page_view")
    .forEach((e) => {
      const r = e.route || "/";
      routeMap.set(r, (routeMap.get(r) || 0) + 1);
    });

  const topRoutes: TopRouteData[] = Array.from(routeMap.entries())
    .map(([route, count]) => ({
      route,
      views: count,
      percentage: totalPageViews > 0 ? Number(((count / totalPageViews) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // --- Product Outbound Clicks ---
  const productMap = new Map<string, { clicks: number; lastClicked: Date }>();
  events
    .filter((e) => e.eventName === "product_click" || e.eventName === "product_outbound_click")
    .forEach((e) => {
      const meta = e.metadata as Record<string, any> | null;
      const slug = meta?.productSlug || "unknown";
      if (!productMap.has(slug)) {
        productMap.set(slug, { clicks: 0, lastClicked: e.createdAt });
      }
      const item = productMap.get(slug)!;
      item.clicks += 1;
      if (e.createdAt > item.lastClicked) item.lastClicked = e.createdAt;
    });

  const productNames: Record<string, string> = {
    fortress: "Fortress (AI Website Builder)",
    leaseflow: "LeaseFlow (Rental Management)",
    uzadigital: "UzaDigital (POS Software)",
    "fm-scheduler": "FM Scheduler (Creator Suite)",
  };

  const productClicks: ProductClickData[] = Array.from(productMap.entries())
    .map(([slug, val]) => ({
      productSlug: slug,
      productName: productNames[slug] || slug.toUpperCase(),
      clicks: val.clicks,
      lastClickedAt: val.lastClicked.toISOString(),
    }))
    .sort((a, b) => b.clicks - a.clicks);

  // --- Top Search Queries ---
  const searchMap = new Map<string, { count: number; totalResults: number }>();
  searchLogs.forEach((s) => {
    const cleanTerm = s.query.trim().toLowerCase();
    if (!cleanTerm) return;
    if (!searchMap.has(cleanTerm)) {
      searchMap.set(cleanTerm, { count: 0, totalResults: 0 });
    }
    const item = searchMap.get(cleanTerm)!;
    item.count += 1;
    item.totalResults += s.resultCount;
  });

  const topSearches: SearchTermData[] = Array.from(searchMap.entries())
    .map(([term, data]) => ({
      term,
      queriesCount: data.count,
      avgResults: data.count > 0 ? Number((data.totalResults / data.count).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.queriesCount - a.queriesCount)
    .slice(0, 15);

  // --- Daily Trends ---
  const dateMap = new Map<string, { views: number; sessions: Set<string>; leads: number }>();

  const cur = new Date(startDate);
  while (cur <= endDate) {
    const key = cur.toISOString().split("T")[0];
    dateMap.set(key, { views: 0, sessions: new Set<string>(), leads: 0 });
    cur.setDate(cur.getDate() + 1);
  }

  events.forEach((e) => {
    const day = e.createdAt.toISOString().split("T")[0];
    if (dateMap.has(day)) {
      const entry = dateMap.get(day)!;
      if (e.eventName === "page_view") entry.views += 1;
      if (e.sessionId) entry.sessions.add(e.sessionId);
    }
  });

  leads.forEach((l) => {
    const day = l.createdAt.toISOString().split("T")[0];
    if (dateMap.has(day)) {
      dateMap.get(day)!.leads += 1;
    }
  });

  const dailyTrends: DailyTrendPoint[] = Array.from(dateMap.entries()).map(([date, val]) => ({
    date,
    views: val.views,
    sessions: val.sessions.size,
    leads: val.leads,
  }));

  return {
    timeframe,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    metrics: {
      totalPageViews,
      uniqueSessions,
      totalLeads,
      conversionRate,
    },
    channels,
    campaigns,
    topRoutes,
    productClicks,
    topSearches,
    dailyTrends,
    externalProviders,
  };
}

export const getAnalyticsDashboardData = getAnalyticsDashboardReport;
