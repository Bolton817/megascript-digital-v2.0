"use client";

import React, { useState, useTransition } from "react";
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
} from "lucide-react";
import {
  AnalyticsDashboardReport,
  TimeframeOption,
} from "@/server/services/analytics/dashboard";
import { fetchAnalyticsReportAction } from "@/server/actions/analytics";
import { MetricGlossaryModal } from "./MetricGlossaryModal";

interface AnalyticsDashboardClientProps {
  initialReport: AnalyticsDashboardReport;
}

export function AnalyticsDashboardClient({ initialReport }: AnalyticsDashboardClientProps) {
  const [report, setReport] = useState<AnalyticsDashboardReport>(initialReport);
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>(initialReport.timeframe);
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

  const { metrics, channels, campaigns, topRoutes, productClicks, topSearches, dailyTrends } = report;

  const timeframeLabels: { key: TimeframeOption; label: string }[] = [
    { key: "24h", label: "Last 24 Hours" },
    { key: "7d", label: "Last 7 Days" },
    { key: "30d", label: "Last 30 Days" },
    { key: "90d", label: "Last 90 Days" },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">
            Traffic &amp; Conversion Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            First-party telemetry streams, marketing attribution, content reach, and user intent
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Selector */}
          <div className="inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
            {timeframeLabels.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTimeframeChange(key)}
                disabled={isPending}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedTimeframe === key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isPending}
            className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm disabled:opacity-50"
            title="Refresh Data"
            aria-label="Refresh telemetry data"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin text-primary" : ""}`} />
          </button>

          {/* Metric Glossary Trigger */}
          <button
            onClick={() => setIsGlossaryOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span>Metric Glossary</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {errorMessage}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Page Views */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Page Views
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold tracking-tight text-foreground font-display">
              {metrics.totalPageViews.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Verified telemetry route events</div>
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
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Trends (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground font-display">Daily Timeline</h2>
            </div>
            <span className="text-xs text-muted-foreground">Recent activity summary</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto max-h-[320px]">
            {dailyTrends.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-8">
                No telemetry recorded for this timeframe
              </div>
            ) : (
              <div className="space-y-2">
                {dailyTrends
                  .slice(-14)
                  .reverse()
                  .map((day) => (
                    <div
                      key={day.date}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors text-xs"
                    >
                      <span className="font-mono text-muted-foreground">{day.date}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-muted-foreground">
                          <strong className="text-foreground">{day.views}</strong> views
                        </span>
                        <span className="text-muted-foreground">
                          <strong className="text-foreground">{day.sessions}</strong> sessions
                        </span>
                        <span className="text-emerald-500 font-semibold">
                          +{day.leads} leads
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UTM Marketing Campaigns Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground font-display">
              Marketing Campaign Attribution (UTM Engine)
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">First-touch vs. Last-touch performance</span>
        </div>
        <div className="overflow-x-auto">
          {campaigns.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No campaign-tagged leads recorded during this window. Standard organic/direct leads appear under
              Channels above.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="py-2.5 px-4">Campaign Name</th>
                  <th className="py-2.5 px-4">Source</th>
                  <th className="py-2.5 px-4">Medium</th>
                  <th className="py-2.5 px-4 text-right">First-Touch Count</th>
                  <th className="py-2.5 px-4 text-right">Last-Touch Count</th>
                  <th className="py-2.5 px-4 text-right">Total Leads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {campaigns.map((camp, idx) => (
                  <tr key={`${camp.campaign}-${idx}`} className="hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-foreground">
                      {camp.campaign}
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground">{camp.source}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{camp.medium}</td>
                    <td className="py-2.5 px-4 text-right text-muted-foreground">
                      {camp.firstTouchCount}
                    </td>
                    <td className="py-2.5 px-4 text-right text-muted-foreground">
                      {camp.lastTouchCount}
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold text-primary">{camp.leads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Content Reach & Discovery Analysis (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Visited Routes */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground font-display">Top Visited Routes</h2>
            </div>
            <span className="text-xs text-muted-foreground">Page view volume</span>
          </div>
          <div className="p-4 flex-1">
            {topRoutes.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-6">
                No route telemetry captured yet
              </div>
            ) : (
              <div className="space-y-2">
                {topRoutes.map((r) => (
                  <div
                    key={r.route}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors text-xs"
                  >
                    <span className="font-mono text-foreground truncate max-w-[280px]">{r.route}</span>
                    <div className="flex items-center space-x-3 text-right">
                      <span className="font-semibold text-foreground">{r.views.toLocaleString()}</span>
                      <span className="text-muted-foreground text-[11px] w-12">{r.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Search Demand & Discovery */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground font-display">
                Top Search Queries
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">User discovery demand</span>
          </div>
          <div className="p-4 flex-1">
            {topSearches.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-6">
                No search queries logged in this timeframe
              </div>
            ) : (
              <div className="space-y-2">
                {topSearches.map((s) => (
                  <div
                    key={s.term}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors text-xs"
                  >
                    <span className="font-medium text-foreground">&ldquo;{s.term}&rdquo;</span>
                    <div className="flex items-center space-x-4 text-right">
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">{s.queriesCount}</strong> queries
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ~{s.avgResults} results
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Outbound Clicks */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MousePointerClick className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground font-display">
              Product Outbound Click-Throughs
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">Developer &amp; client product intent</span>
        </div>
        <div className="p-4">
          {productClicks.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-6">
              No product outbound click events recorded in this period
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {productClicks.map((p) => (
                <div
                  key={p.productSlug}
                  className="p-3.5 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-foreground">{p.productName}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Total Clicks: <strong className="text-foreground">{p.clicks}</strong>
                    </span>
                    <span className="text-[11px]">
                      {new Date(p.lastClickedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metric Glossary Modal */}
      <MetricGlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
    </div>
  );
}
