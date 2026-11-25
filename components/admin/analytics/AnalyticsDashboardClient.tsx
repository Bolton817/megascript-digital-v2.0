"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Eye,
  Users,
  UserCheck,
  TrendingUp,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  Compass,
  Search,
  MousePointerClick,
  Layers,
  Plug,
  CheckCircle2,
  AlertTriangle,
  Globe,
  BarChart2,
  Share2,
} from "lucide-react";
import {
  AnalyticsDashboardReport,
  TimeframeOption,
} from "@/server/services/analytics/dashboard";
import { fetchAnalyticsReportAction } from "@/server/actions/analytics";
import { MetricGlossaryModal } from "./MetricGlossaryModal";
import { Button } from "@/components/ui/Button";

interface AnalyticsDashboardClientProps {
  initialReport: AnalyticsDashboardReport;
}

export function AnalyticsDashboardClient({ initialReport }: AnalyticsDashboardClientProps) {
  const [report, setReport] = useState<AnalyticsDashboardReport>(initialReport);
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>(initialReport.timeframe);
  const [activeTab, setActiveTab] = useState<"first-party" | "external">("first-party");
  const [isPending, startTransition] = useTransition();
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTimeframeChange = (timeframe: TimeframeOption) => {
    if (timeframe === selectedTimeframe && !isPending) return;
    setSelectedTimeframe(timeframe);
    startTransition(async () => {
      setErrorMessage(null);
      const res = await fetchAnalyticsReportAction(timeframe);
      if (res.success && res.data) {
        setReport(res.data);
      } else {
        setErrorMessage(res.error || "Failed to load report for the selected period.");
      }
    });
  };

  const handleRefresh = () => {
    startTransition(async () => {
      setErrorMessage(null);
      const res = await fetchAnalyticsReportAction(selectedTimeframe);
      if (res.success && res.data) {
        setReport(res.data);
      } else {
        setErrorMessage(res.error || "Failed to refresh analytics data.");
      }
    });
  };

  const { metrics, channels, campaigns, topRoutes, productClicks, topSearches, externalProviders } = report;

  return (
    <div className="space-y-6">
      {/* Top Header & Timeframe Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-xl border border-border bg-surface">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground font-display">
              Traffic &amp; Lead Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              KDPA 2019 Compliant
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Privacy-preserving internal event telemetry and external provider connectors in disconnected-safe mode (Sheets 073, 074, 076–078).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* Timeframe buttons */}
          <div className="inline-flex rounded-lg border border-border p-1 bg-muted/30">
            {(["24h", "7d", "30d", "90d"] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                onClick={() => handleTimeframeChange(tf)}
                disabled={isPending}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  selectedTimeframe === tf
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tf === "24h" ? "24 Hours" : tf === "7d" ? "7 Days" : tf === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isPending}
            className="gap-1.5"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsGlossaryOpen(true)}
            className="gap-1.5"
            title="Metric Definitions"
          >
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Glossary</span>
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-xs underline font-medium">
            Dismiss
          </button>
        </div>
      )}

      {/* Primary Tab Navigation: First-Party vs External Providers */}
      <div className="flex items-center border-b border-border gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab("first-party")}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${
            activeTab === "first-party"
              ? "text-primary border-b-2 border-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          First-Party Internal Engine
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            Live
          </span>
        </button>

        <button
          onClick={() => setActiveTab("external")}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${
            activeTab === "external"
              ? "text-primary border-b-2 border-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Globe className="w-4 h-4" />
          External Reporting (Google &amp; Meta)
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
            Disconnected-Safe
          </span>
        </button>
      </div>

      {activeTab === "first-party" ? (
        <>
          {/* Executive KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Page Views */}
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Pageviews
                </span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-bold tracking-tight text-foreground font-display">
                  {metrics.totalPageViews.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">First-party telemetry events</div>
              </div>
            </div>

            {/* Unique Sessions */}
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Unique Sessions
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-bold tracking-tight text-foreground font-display">
                  {metrics.uniqueSessions.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Anonymous cookie sessions (ses_*)</div>
              </div>
            </div>

            {/* Inbound Leads */}
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Inbound Leads
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-bold tracking-tight text-foreground font-display">
                  {metrics.totalLeads.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Contact inquiries &amp; chat handoffs</div>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Conversion Rate
                </span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-bold tracking-tight text-foreground font-display">
                  {metrics.conversionRate}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">Leads generated per unique session</div>
              </div>
            </div>
          </div>

          {/* Traffic Channels & Daily Activity Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Traffic Channels (7 cols) */}
            <div className="lg:col-span-7 rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground font-display">
                    Traffic Acquisition Channels
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground">First-touch &amp; session sources</span>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="py-2.5 px-4">Channel</th>
                      <th className="py-2.5 px-4 text-right">Sessions</th>
                      <th className="py-2.5 px-4 text-right">Traffic Share</th>
                      <th className="py-2.5 px-4 text-right">Leads</th>
                      <th className="py-2.5 px-4 text-right">Conv. Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {channels.map((ch) => (
                      <tr key={ch.channel} className="hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-foreground">{ch.channel}</td>
                        <td className="py-2.5 px-4 text-right text-muted-foreground">
                          {ch.sessions.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="inline-flex items-center space-x-2">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${Math.min(100, ch.share)}%` }}
                              />
                            </div>
                            <span className="text-muted-foreground">{ch.share}%</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right font-medium text-foreground">{ch.leads}</td>
                        <td className="py-2.5 px-4 text-right font-semibold text-primary">
                          {ch.conversionRate}%
                        </td>
                      </tr>
                    ))}
                    {channels.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No traffic channels recorded for this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Routes (5 cols) */}
            <div className="lg:col-span-5 rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground font-display">
                    Top Content Routes
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground">Page views</span>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="py-2.5 px-4">Route Path</th>
                      <th className="py-2.5 px-4 text-right">Views</th>
                      <th className="py-2.5 px-4 text-right">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {topRoutes.map((tr) => (
                      <tr key={tr.route} className="hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-4 font-mono text-[11px] text-foreground truncate max-w-[180px]">
                          {tr.route}
                        </td>
                        <td className="py-2.5 px-4 text-right text-muted-foreground font-medium">
                          {tr.views.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-right text-muted-foreground">
                          {tr.percentage}%
                        </td>
                      </tr>
                    ))}
                    {topRoutes.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-muted-foreground">
                          No route views recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* UTM Marketing Campaigns & Product Engagement */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* UTM Attribution Breakdown (7 cols) */}
            <div className="lg:col-span-7 rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground font-display">
                    UTM Campaign Attribution
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground">Multi-touch lead attribution</span>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="py-2.5 px-4">Campaign</th>
                      <th className="py-2.5 px-4">Source / Medium</th>
                      <th className="py-2.5 px-4 text-right">First-Touch</th>
                      <th className="py-2.5 px-4 text-right">Last-Touch</th>
                      <th className="py-2.5 px-4 text-right">Total Leads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {campaigns.map((c) => (
                      <tr key={c.campaign} className="hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-foreground">
                          {c.campaign === "none" ? (
                            <span className="text-muted-foreground italic">Direct / Organic</span>
                          ) : (
                            c.campaign
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-muted-foreground">
                          {c.source} / {c.medium}
                        </td>
                        <td className="py-2.5 px-4 text-right text-muted-foreground">
                          {c.firstTouchCount}
                        </td>
                        <td className="py-2.5 px-4 text-right text-muted-foreground">
                          {c.lastTouchCount}
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-foreground">
                          {c.leads}
                        </td>
                      </tr>
                    ))}
                    {campaigns.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No UTM attributed campaigns recorded for this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Outbound Product Demo Clicks (5 cols) */}
            <div className="lg:col-span-5 rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MousePointerClick className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground font-display">
                    Product Demo Outbound Clicks
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground">Stage 10 outbound links</span>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="py-2.5 px-4">Software Product</th>
                      <th className="py-2.5 px-4 text-right">Outbound Clicks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {productClicks.map((p) => (
                      <tr key={p.productSlug} className="hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-foreground">
                          {p.productName}
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-primary">
                          {p.clicks.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {productClicks.length === 0 && (
                      <tr>
                        <td colSpan={2} className="py-8 text-center text-muted-foreground">
                          No product outbound clicks recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* External Reporting Tab (Google & Meta) */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Analytics 4 Card */}
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-bold text-foreground">Google Analytics 4</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      externalProviders.ga4.status === "CONNECTED"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {externalProviders.ga4.status === "CONNECTED" ? "Connected" : "Not connected"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  External web analytics, session engagement, and organic acquisition data from Google Data API.
                </p>

                {externalProviders.ga4.status === "CONNECTED" && externalProviders.ga4.metrics ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-surface-subtle border border-border text-center">
                      <div>
                        <div className="text-lg font-bold text-foreground">
                          {externalProviders.ga4.metrics.totalUsers}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase">Users</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-foreground">
                          {externalProviders.ga4.metrics.sessions}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase">Sessions</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-foreground">
                          {externalProviders.ga4.metrics.engagementRate}%
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase">Engagement</div>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="font-semibold text-foreground text-[11px] uppercase tracking-wider mb-1">
                        Top Landing Pages (GA4)
                      </div>
                      {externalProviders.ga4.metrics.topLandingPages?.map((lp: any) => (
                        <div key={lp.path} className="flex justify-between py-1 border-b border-border/50">
                          <span className="font-mono text-[11px] text-muted-foreground">{lp.path}</span>
                          <span className="font-medium text-foreground">{lp.views} views</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-border bg-surface-subtle text-xs space-y-2">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Disconnected-Safe Mode Active
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      GA4 metrics are not connected. In accordance with Sheet 074 &amp; 076, metrics are never zeroed or fabricated when external providers are unconfigured.
                    </p>
                    <div className="pt-2">
                      <Link href="/master/integrations">
                        <Button size="sm" variant="outline" className="text-xs gap-1">
                          <Plug className="w-3.5 h-3.5 text-primary" />
                          Connect GA4 in Integration Centre
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border mt-4 text-[11px] text-muted-foreground flex justify-between">
                <span>Data Source: Google Analytics Data API v1beta</span>
                <span>{externalProviders.ga4.lastSyncAt ? `Synced ${new Date(externalProviders.ga4.lastSyncAt).toLocaleDateString()}` : "Unsynced"}</span>
              </div>
            </div>

            {/* Google Search Console Card */}
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-bold text-foreground">Google Search Console</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      externalProviders.searchConsole.status === "CONNECTED"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {externalProviders.searchConsole.status === "CONNECTED" ? "Connected" : "Not connected"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  Organic search visibility, search impressions, click-through rates, and average SERP position.
                </p>

                {externalProviders.searchConsole.status === "CONNECTED" && externalProviders.searchConsole.metrics ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2 p-3 rounded-lg bg-surface-subtle border border-border text-center">
                      <div>
                        <div className="text-base font-bold text-foreground">
                          {externalProviders.searchConsole.metrics.impressions}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase">Impr.</div>
                      </div>
                      <div>
                        <div className="text-base font-bold text-foreground">
                          {externalProviders.searchConsole.metrics.clicks}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase">Clicks</div>
                      </div>
                      <div>
                        <div className="text-base font-bold text-foreground">
                          {externalProviders.searchConsole.metrics.averageCtr}%
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase">Avg CTR</div>
                      </div>
                      <div>
                        <div className="text-base font-bold text-foreground">
                          {externalProviders.searchConsole.metrics.averagePosition}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase">Position</div>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="font-semibold text-foreground text-[11px] uppercase tracking-wider mb-1">
                        Top Organic Queries
                      </div>
                      {externalProviders.searchConsole.metrics.topQueries?.slice(0, 4).map((q: any) => (
                        <div key={q.query} className="flex justify-between py-1 border-b border-border/50 text-[11px]">
                          <span className="font-medium text-foreground truncate max-w-[200px]">{q.query}</span>
                          <span className="text-muted-foreground">{q.clicks} clicks (pos: {q.position})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-border bg-surface-subtle text-xs space-y-2">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Disconnected-Safe Mode Active
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      Search Console property has not been linked yet. Organic query positions and clicks are kept isolated until verified account credentials are configured.
                    </p>
                    <div className="pt-2">
                      <Link href="/master/integrations">
                        <Button size="sm" variant="outline" className="text-xs gap-1">
                          <Plug className="w-3.5 h-3.5 text-primary" />
                          Connect Search Console
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border mt-4 text-[11px] text-muted-foreground flex justify-between">
                <span>Data Source: Search Analytics API</span>
                <span>{externalProviders.searchConsole.lastSyncAt ? `Synced ${new Date(externalProviders.searchConsole.lastSyncAt).toLocaleDateString()}` : "Unsynced"}</span>
              </div>
            </div>
          </div>

          {/* Meta Ads & Conversions API Notice */}
          <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-primary shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  Meta Advertising &amp; Conversion API (CAPI)
                </h4>
                <p className="text-xs text-muted-foreground">
                  Client-side Pixel and server-side Conversions API are gated by affirmative marketing consent (KDPA / Sheet 141).
                </p>
              </div>
            </div>
            <Link href="/master/integrations">
              <Button size="sm" variant="outline" className="text-xs gap-1 shrink-0">
                <Plug className="w-3.5 h-3.5 text-primary" />
                Inspect Meta Config
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Metric Glossary Slide-Over */}
      <MetricGlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
    </div>
  );
}
