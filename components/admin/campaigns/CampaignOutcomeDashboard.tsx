"use client";

import React from "react";
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { CampaignOutcomeData } from "@/server/services/newsletter/campaign-analytics";

interface CampaignOutcomeDashboardProps {
  data: CampaignOutcomeData;
}

export function CampaignOutcomeDashboard({ data }: CampaignOutcomeDashboardProps) {
  return (
    <div className="space-y-6">
      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Deliverability Rate */}
        <div className="p-5 rounded-2xl border border-surface-border bg-surface space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Overall Deliverability
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground">
              {data.overallDeliveryRate}%
            </span>
            <span className="text-[11px] text-muted-foreground">success rate</span>
          </div>
          <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
            {data.totalDelivered} of {data.totalRecipientsTargeted} delivered
          </div>
        </div>

        {/* Total Campaigns Sent */}
        <div className="p-5 rounded-2xl border border-surface-border bg-surface space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Dispatched Broadcasts
            </span>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Send className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground">
              {data.sentCampaignsCount}
            </span>
            <span className="text-[11px] text-muted-foreground">
              / {data.totalCampaigns} total
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
            {data.scheduledCount} scheduled &bull; {data.draftCount} drafts
          </div>
        </div>

        {/* Bounced Emails */}
        <div className="p-5 rounded-2xl border border-surface-border bg-surface space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Bounced Inboxes
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground">
              {data.totalBounced}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {data.totalRecipientsTargeted > 0
                ? `${((data.totalBounced / data.totalRecipientsTargeted) * 100).toFixed(1)}%`
                : "0%"}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
            Automatic suppression active
          </div>
        </div>

        {/* Transport Provider */}
        <div className="p-5 rounded-2xl border border-surface-border bg-surface space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Email Transport
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">Brevo API</span>
          </div>
          <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
            Transactional &amp; Double Opt-In
          </div>
        </div>
      </div>

      {/* 2. Campaign Outcome Performance Table */}
      <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Broadcast Outcome Log
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Individual broadcast metrics, delivery rates, and bounce statistics ({data.timeframe}).
            </p>
          </div>
        </div>

        {data.campaigns.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No campaigns dispatched in the selected period.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-muted/40 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
                  <th className="py-3 px-4">Campaign Title &amp; Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Dispatched Date</th>
                  <th className="py-3 px-4 text-right">Recipients</th>
                  <th className="py-3 px-4 text-right">Delivered</th>
                  <th className="py-3 px-4 text-right">Deliverability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-muted/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 max-w-sm truncate">
                        <span className="font-bold text-foreground block truncate">
                          {c.title}
                        </span>
                        <span className="text-[11px] text-muted-foreground block truncate">
                          {c.subject}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          c.status === "SENT"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : c.status === "SCHEDULED"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                            : "bg-surface-muted text-muted-foreground"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px]">
                      {c.sentAt
                        ? new Date(c.sentAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Not sent"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">
                      {c.recipientsCount}
                    </td>
                    <td className="py-3.5 px-4 text-right text-muted-foreground font-mono">
                      {c.deliveredCount}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-surface-muted overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${c.deliveryRate}%` }}
                          />
                        </div>
                        <span className="font-bold text-foreground text-[11px]">
                          {c.deliveryRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
