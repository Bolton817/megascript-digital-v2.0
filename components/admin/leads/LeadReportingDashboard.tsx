"use client";

import React, { useState } from "react";
import {
  Clock,
  TrendingUp,
  UserCheck,
  Target,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
} from "lucide-react";
import { LeadReportingData } from "@/server/services/crm/reporting";

interface LeadReportingDashboardProps {
  data: LeadReportingData;
  isAnalystView?: boolean;
}

export function LeadReportingDashboard({ data, isAnalystView = false }: LeadReportingDashboardProps) {
  return (
    <div className="space-y-6">
      {/* 1. Header Provenance & Privacy Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-surface-muted/30">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          <span>Report Period: <strong className="text-foreground">{data.timeframe}</strong></span>
          <span>&bull;</span>
          <span>Data Provenance: <strong className="text-foreground">PostgreSQL CRM &amp; Event Timelines (Sheet 105)</strong></span>
        </div>
        {isAnalystView && (
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            Analyst Read-Only &bull; PII Masked
          </span>
        )}
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Average Response Time */}
        <div className="p-5 rounded-2xl border border-surface-border bg-surface space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Avg Response Time
            </span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground">
              {data.avgResponseHours !== null ? `${data.avgResponseHours}h` : "N/A"}
            </span>
            <span className="text-[11px] text-muted-foreground">from creation</span>
          </div>
          <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
            Target SLA: &lt; 24h across all channels
          </div>
        </div>

        {/* Card 2: Conversion to Won */}
        <div className="p-5 rounded-2xl border border-surface-border bg-surface space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Deal Close Rate
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground">
              {data.totalLeads > 0
                ? `${Number(((data.wonLeads / data.totalLeads) * 100).toFixed(1))}%`
                : "0%"}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {data.wonLeads} of {data.totalLeads} won
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
            Active funnel: {data.qualifiedLeads + data.proposalSentLeads} in negotiation
          </div>
        </div>

        {/* Card 3: Uncontacted Rate */}
        <div className="p-5 rounded-2xl border border-surface-border bg-surface space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Uncontacted Leads
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground">
              {data.responseTimeDistribution.uncontacted}
            </span>
            <span className="text-[11px] text-muted-foreground">
              awaiting first touch
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
            {data.responseTimeDistribution.overTwentyFourHours} pending &gt; 24h
          </div>
        </div>

        {/* Card 4: Top Inbound Source */}
        <div className="p-5 rounded-2xl border border-surface-border bg-surface space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Leading Channel
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 truncate">
            <span className="text-lg font-bold text-foreground truncate">
              {data.sourceBreakdown[0]?.channel || "Direct"}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
            {data.sourceBreakdown[0]?.leadsCount || 0} enquiries registered
          </div>
        </div>
      </div>

      {/* 3. Response Time SLA Distribution */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Lead Response Time Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center space-y-1">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              &lt; 1 Hour
            </span>
            <p className="text-xl font-black text-foreground">
              {data.responseTimeDistribution.underOneHour}
            </p>
            <span className="text-[10px] text-muted-foreground">Immediate SLA</span>
          </div>

          <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 text-center space-y-1">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
              1 – 6 Hours
            </span>
            <p className="text-xl font-black text-foreground">
              {data.responseTimeDistribution.oneToSixHours}
            </p>
            <span className="text-[10px] text-muted-foreground">Same business day</span>
          </div>

          <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-center space-y-1">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
              6 – 24 Hours
            </span>
            <p className="text-xl font-black text-foreground">
              {data.responseTimeDistribution.sixToTwentyFourHours}
            </p>
            <span className="text-[10px] text-muted-foreground">Next morning</span>
          </div>

          <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-center space-y-1">
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">
              &gt; 24 Hours
            </span>
            <p className="text-xl font-black text-foreground">
              {data.responseTimeDistribution.overTwentyFourHours}
            </p>
            <span className="text-[10px] text-muted-foreground">SLA exceeded</span>
          </div>

          <div className="p-3 rounded-xl border border-border bg-surface-muted/30 text-center space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              Uncontacted
            </span>
            <p className="text-xl font-black text-foreground">
              {data.responseTimeDistribution.uncontacted}
            </p>
            <span className="text-[10px] text-muted-foreground">In queue</span>
          </div>
        </div>
      </div>

      {/* 4. Conversion Funnel & Source Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Conversion Funnel */}
        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Enquiry-to-Deal Conversion Funnel
          </h3>
          <div className="space-y-3">
            {data.funnelProgression.map((stage) => {
              const pct = data.totalLeads > 0 ? (stage.count / data.totalLeads) * 100 : 0;
              return (
                <div key={stage.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{stage.stage}</span>
                    <span className="text-muted-foreground">
                      <strong>{stage.count}</strong> ({stage.conversionRate}% conversion)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(3, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Inbound Source Breakdown */}
        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Source Channel Performance
          </h3>
          {data.sourceBreakdown.length === 0 ? (
            <p className="text-xs text-muted-foreground">No source channels recorded in timeframe.</p>
          ) : (
            <div className="divide-y divide-border/60">
              {data.sourceBreakdown.map((src) => (
                <div key={src.channel} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground capitalize">
                      {src.channel.replace(/-/g, " ")}
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      {src.wonCount} won deals closed
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-foreground">{src.leadsCount} leads</span>
                    <span className="text-[10px] block text-emerald-600 dark:text-emerald-400 font-semibold">
                      {src.conversionRate}% win rate
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
