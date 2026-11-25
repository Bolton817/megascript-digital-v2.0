"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  Users,
  UserCheck,
  MessageSquare,
  Sparkles,
  Mail,
  ExternalLink,
  ChevronRight,
  Activity,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Layers,
  Send,
  Download,
  Filter,
  BarChart3,
  Plug,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OperationsOverviewData } from "@/server/services/overview";
import { IntegrationHealthPanel } from "@/components/admin/IntegrationHealthPanel";
import { ExportModal } from "@/components/admin/ExportModal";

interface OverviewClientProps {
  initialData: OperationsOverviewData;
  user: {
    id: string;
    email: string;
    displayName?: string | null;
    isProtected?: boolean;
  };
  primaryRole: string;
  canExportLeads: boolean;
  canExportAnalytics: boolean;
}

export function OverviewClient({
  initialData,
  user,
  primaryRole,
  canExportLeads,
  canExportAnalytics,
}: OverviewClientProps) {
  const [data, setData] = useState<OperationsOverviewData>(initialData);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<"leads" | "analytics">("leads");

  const timeframeOptions = [
    { label: "7 Days", days: 7 },
    { label: "30 Days", days: 30 },
    { label: "90 Days", days: 90 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome & Administrator Session Bar */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Operations Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {user.displayName || user.email.split("@")[0]}
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            {user.email} &bull; Signed in via Better Auth &bull; 15-Minute Inactivity Protection
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Filter */}
          <div className="flex items-center rounded-xl border border-border bg-surface-muted/30 p-1 text-xs">
            <Calendar className="h-3.5 w-3.5 ml-2 mr-1 text-muted-foreground" />
            {timeframeOptions.map((opt) => (
              <Link
                key={opt.days}
                href={`/master/overview?timeframe=${opt.days}`}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  data.timeframeDays === opt.days
                    ? "bg-surface shadow-sm text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>

          {/* Export Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setExportType("leads");
              setIsExportModalOpen(true);
            }}
            className="text-xs gap-1.5"
            title="Export Records (Task 98)"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          {/* Role Badge */}
          <span className="text-xs px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            {primaryRole}
          </span>
          {user.isProtected && (
            <span className="text-xs px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Protected
            </span>
          )}
        </div>
      </div>

      {/* Provenance & Timeframe Metadata Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-surface-muted/40 border border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>Active Operations Window: <strong className="text-foreground">{data.startDate} – {data.endDate}</strong> ({data.timeframe})</span>
        </div>
        <div className="text-[11px]">
          Strict Provenance &bull; No Fabricated Metrics (TDD Sheet 104)
        </div>
      </div>

      {/* 2. Key Operational Metrics (7 Core Cards - Task 94) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: CRM Leads */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Enquiries
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {data.leads.total}
            </span>
            {data.leads.newCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                {data.leads.newCount} New
              </span>
            )}
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{data.leads.wonCount} won deals ({data.leads.conversionRate}%)</span>
            <Link href="/master/leads" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
              <span>View</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Metric 2: Follow-up Queue */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Follow-ups Due
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {data.followUps.totalPending}
            </span>
            {data.followUps.highUrgencyCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400">
                {data.followUps.highUrgencyCount} Urgent
              </span>
            )}
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{data.followUps.uncontactedCount} uncontacted leads</span>
            <a href="#follow-up-queue" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
              <span>Queue</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Metric 3: Traffic Telemetry */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Site Traffic
            </span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {data.traffic.pageViews}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Views ({data.traffic.uniqueSessions} Sessions)
            </span>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{data.traffic.isGa4Connected ? "GA4 Connected" : "First-Party Engine"}</span>
            <Link href="/master/analytics" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
              <span>Report</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Metric 4: Conversions & Outcomes */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Conversion Rate
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {data.conversions.overallRatePct}%
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Inbound Leads
            </span>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{data.conversions.inboundLeads} leads / {data.conversions.uniqueVisitors} visitors</span>
            <Link href="/master/analytics" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
              <span>Attribution</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Metric 5: Newsletter Audience Growth */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Newsletter Growth
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {data.subscribers.totalConfirmed}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              +{data.subscribers.netGrowthInWindow} in window
            </span>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{data.subscribers.pendingConfirmation} pending double opt-in</span>
            <Link href="/master/newsletter/subscribers" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
              <span>Subscribers</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Metric 6: Campaign Deliverability */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Campaign Delivery
            </span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Send className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {data.campaigns.overallDeliveryRatePct}%
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
              {data.campaigns.totalSent} Sent
            </span>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{data.campaigns.scheduledCount} scheduled campaigns</span>
            <Link href="/master/newsletter/campaigns" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
              <span>Campaigns</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Metric 7: Tony AI Assistant */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm space-y-3 sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tony AI Intelligence Telemetry
            </span>
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {data.tonyAi.totalConversations}
            </span>
            <span className="text-xs text-muted-foreground">
              Conversations &bull; {data.tonyAi.handoffCount} Handoffs ({data.tonyAi.handoffRatePct}%)
            </span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-surface-muted text-muted-foreground ml-auto">
              ${data.tonyAi.costUsd.toFixed(4)} Est. Cost
            </span>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{data.tonyAi.tokensUsed.toLocaleString()} tokens utilized &bull; Grounded Knowledge</span>
            <Link href="/master/conversations" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
              <span>Audits</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Integration Health Panel (Task 97, Sheet 078) */}
      <IntegrationHealthPanel health={data.integrationHealth} />

      {/* 4. Follow-up Action Queue & Recent Broadcast Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="follow-up-queue">
        {/* Left: Follow-up Queue */}
        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Follow-up Action Queue ({data.followUpQueue.length})
              </h3>
            </div>
            <Link href="/master/leads">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                <span>All Leads</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {data.followUpQueue.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
              <CheckCircle2 className="h-6 w-6 mx-auto text-emerald-500 opacity-80" />
              <p className="font-semibold text-foreground">Follow-up queue is clear</p>
              <p>All client enquiries have been promptly addressed.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {data.followUpQueue.map((item) => (
                <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-muted text-muted-foreground border border-border">
                        {item.referenceCode}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                          item.urgency === "HIGH"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                            : item.urgency === "MEDIUM"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {item.urgency}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                      {item.reason}
                    </p>
                    <div className="text-[10px] text-muted-foreground">
                      Assigned to: <strong className="text-foreground">{item.assignedTo}</strong> &bull; {item.hoursWaiting}h waiting
                    </div>
                  </div>

                  <Link
                    href={`/master/leads/${item.id}`}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors shrink-0"
                    title="Respond to inquiry"
                  >
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Broadcast Outcomes */}
        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Recent Broadcast Outcomes
              </h3>
            </div>
            <Link href="/master/newsletter/campaigns">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                <span>Campaign Hub</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {data.recentCampaigns.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">No recent broadcasts</p>
              <p>Dispatch a newsletter campaign to view real-time delivery telemetry.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {data.recentCampaigns.map((camp) => (
                <div key={camp.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5 min-w-0 max-w-sm truncate">
                    <span className="font-bold text-foreground block truncate">
                      {camp.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground block truncate">
                      {camp.subject}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-foreground">{camp.deliveryRate}% delivered</span>
                    <span className="text-[10px] text-muted-foreground block">
                      {camp.recipientsCount} targeted recipients
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Export Modal (Task 98) */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        exportType={exportType}
        timeframeDays={data.timeframeDays}
        userCanExport={exportType === "leads" ? canExportLeads : canExportAnalytics}
      />
    </div>
  );
}
