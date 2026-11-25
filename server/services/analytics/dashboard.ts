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

/**
 * Classifies a channel name from UTM parameters or sourceChannel string.
 */
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
  return "Direct / Unknown";
}

/**
 * Aggregates first-party telemetry events, UTM attribution, leads, and search queries.
 */
export async function getAnalyticsDashboardData(timeframe: TimeframeOption = "30d"): Promise<AnalyticsDashboardReport> {
  const { startDate, endDate } = getTimeframeDates(timeframe);

  // 1. Fetch telemetry events
  const events = await db.analyticsEvent.findMany({
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
      component: true,
      sourceChannel: true,
      sessionId: true,
      metadata: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // 2. Fetch leads created in this timeframe with UTM attribution
  const leads = await db.lead.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      utmAttribution: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // 3. Fetch search query logs in this timeframe
  const searchLogs = await db.searchQueryLog.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // --- Compute Key Metrics ---
  const pageViewEvents = events.filter((e) => e.eventName === "page_view");
  const totalPageViews = pageViewEvents.length;

  const sessionIds = new Set<string>();
  events.forEach((e) => {
    if (e.sessionId) sessionIds.add(e.sessionId);
  });
  const uniqueSessions = Math.max(sessionIds.size, totalPageViews > 0 ? 1 : 0);

  const totalLeads = leads.length;
  const conversionRate = uniqueSessions > 0 ? Number(((totalLeads / uniqueSessions) * 100).toFixed(2)) : 0;

  // --- Compute Channel Breakdown ---
  const channelMap = new Map<string, { sessions: Set<string>; leads: number }>();
  const allChannels = [
    "Organic Search",
    "Direct / Unknown",
    "Paid Search / Ads",
    "Social Media",
    "Referral",
    "Tony AI Chat",
    "Email Campaign",
  ];

  allChannels.forEach((ch) => channelMap.set(ch, { sessions: new Set<string>(), leads: 0 }));

  // Attribute sessions
  events.forEach((e) => {
    const ch = classifyChannel(e.sourceChannel, null, e.sourceChannel);
    if (!channelMap.has(ch)) {
      channelMap.set(ch, { sessions: new Set<string>(), leads: 0 });
    }
    if (e.sessionId) {
      channelMap.get(ch)!.sessions.add(e.sessionId);
    }
  });

  // Attribute leads
  leads.forEach((l) => {
    const utm = l.utmAttribution;
    const ch = classifyChannel(
      utm?.lastTouchSource || utm?.utmSource || utm?.firstTouchSource,
      utm?.lastTouchMedium || utm?.utmMedium || utm?.firstTouchMedium,
      l.sourceChannel
    );
    if (!channelMap.has(ch)) {
      channelMap.set(ch, { sessions: new Set<string>(), leads: 0 });
    }
    channelMap.get(ch)!.leads += 1;
  });

  const channels: ChannelBreakdown[] = Array.from(channelMap.entries())
    .map(([channel, data]) => {
      const sessCount = data.sessions.size;
      const leadCount = data.leads;
      const rate = sessCount > 0 ? Number(((leadCount / sessCount) * 100).toFixed(2)) : 0;
      const share = uniqueSessions > 0 ? Number(((sessCount / uniqueSessions) * 100).toFixed(1)) : 0;
      return {
        channel,
        sessions: sessCount,
        leads: leadCount,
        conversionRate: rate,
        share,
      };
    })
    .sort((a, b) => b.sessions - a.sessions || b.leads - a.leads);

  // --- Compute UTM Campaigns Breakdown ---
  const campaignMap = new Map<string, UTMCampaignData>();
  leads.forEach((l) => {
    const utm = l.utmAttribution;
    if (!utm) return;

    const campaignKey = utm.lastTouchCampaign || utm.utmCampaign || utm.firstTouchCampaign || "none";
    const source = utm.lastTouchSource || utm.utmSource || utm.firstTouchSource || "direct";
    const medium = utm.lastTouchMedium || utm.utmMedium || utm.firstTouchMedium || "direct";

    const key = `${campaignKey}__${source}__${medium}`;
    if (!campaignMap.has(key)) {
      campaignMap.set(key, {
        campaign: campaignKey,
        source,
        medium,
        leads: 0,
        firstTouchCount: 0,
        lastTouchCount: 0,
      });
    }

    const item = campaignMap.get(key)!;
    item.leads += 1;
    if (utm.firstTouchCampaign === campaignKey || (campaignKey === "none" && !utm.firstTouchCampaign)) {
      item.firstTouchCount += 1;
    }
    if (utm.lastTouchCampaign === campaignKey || (campaignKey === "none" && !utm.lastTouchCampaign)) {
      item.lastTouchCount += 1;
    }
  });

  const campaigns: UTMCampaignData[] = Array.from(campaignMap.values()).sort((a, b) => b.leads - a.leads);

  // --- Top Visited Routes ---
  const routeCounts = new Map<string, number>();
  pageViewEvents.forEach((e) => {
    const cleanRoute = e.route || "/";
    routeCounts.set(cleanRoute, (routeCounts.get(cleanRoute) || 0) + 1);
  });

  const topRoutes: TopRouteData[] = Array.from(routeCounts.entries())
    .map(([route, views]) => ({
      route,
      views,
      percentage: totalPageViews > 0 ? Number(((views / totalPageViews) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // --- Product Outbound Clicks ---
  const productClickMap = new Map<string, { name: string; clicks: number; lastClicked: Date }>();
  events
    .filter((e) => e.eventName === "product_outbound_click")
    .forEach((e) => {
      const meta = (e.metadata as any) || {};
      const slug = meta.productSlug || meta.slug || e.route.replace("/products/", "") || "unknown-product";
      const name = meta.productName || meta.title || slug;
      if (!productClickMap.has(slug)) {
        productClickMap.set(slug, { name, clicks: 0, lastClicked: e.createdAt });
      }
      const p = productClickMap.get(slug)!;
      p.clicks += 1;
      if (e.createdAt > p.lastClicked) {
        p.lastClicked = e.createdAt;
      }
    });

  const productClicks: ProductClickData[] = Array.from(productClickMap.entries())
    .map(([productSlug, info]) => ({
      productSlug,
      productName: info.name,
      clicks: info.clicks,
      lastClickedAt: info.lastClicked.toISOString(),
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

  // Initialize dates
  const cur = new Date(startDate);
  while (cur <= endDate) {
    const key = cur.toISOString().split("T")[0];
    dateMap.set(key, { views: 0, sessions: new Set<string>(), leads: 0 });
    cur.setDate(cur.getDate() + 1);
  }

  // Populate views and sessions
  events.forEach((e) => {
    const day = e.createdAt.toISOString().split("T")[0];
    if (dateMap.has(day)) {
      const entry = dateMap.get(day)!;
      if (e.eventName === "page_view") entry.views += 1;
      if (e.sessionId) entry.sessions.add(e.sessionId);
    }
  });

  // Populate leads
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
  };
}
