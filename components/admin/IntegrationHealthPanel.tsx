"use client";

import React from "react";
import Link from "next/link";
import {
  Plug,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

interface ProviderHealth {
  provider: string;
  name: string;
  status: string;
  statusLabel: string;
  isConfigured: boolean;
  actionRequired: boolean;
}

interface IntegrationHealthPanelProps {
  health: {
    connectedCount: number;
    needsConfigCount: number;
    errorCount: number;
    totalProviders: number;
    overallStatus: "HEALTHY" | "ATTENTION_REQUIRED" | "SETUP_NEEDED";
    providers: ProviderHealth[];
  };
}

export function IntegrationHealthPanel({ health }: IntegrationHealthPanelProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONNECTED":
        return {
          icon: CheckCircle2,
          classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          text: "Connected",
        };
      case "ERROR":
        return {
          icon: XCircle,
          classes: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
          text: "Sync Failed",
        };
      case "NEEDS_CONFIGURATION":
        return {
          icon: AlertTriangle,
          classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          text: "Setup required",
        };
      default:
        return {
          icon: Plug,
          classes: "bg-surface-muted text-muted-foreground border-border",
          text: "Not connected",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Plug className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Integration Health &amp; Connectors
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Operating in disconnected-safe mode (TDD Sheets 074, 078). Real-time API telemetry across 7 connectors.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              health.overallStatus === "HEALTHY"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : health.overallStatus === "ATTENTION_REQUIRED"
                ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            }`}
          >
            {health.connectedCount} / {health.totalProviders} Active
          </span>
          <Link
            href="/master/integrations"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>Connection Centre</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Grid of Providers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {health.providers.map((p) => {
          const badge = getStatusBadge(p.status);
          const Icon = badge.icon;

          return (
            <div
              key={p.provider}
              className="p-3.5 rounded-xl border border-border bg-surface-muted/30 flex flex-col justify-between space-y-2 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-xs text-foreground truncate">
                  {p.name}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border shrink-0 ${badge.classes}`}
                >
                  <Icon className="h-2.5 w-2.5" />
                  <span>{badge.text}</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                <span>{p.isConfigured ? "Encrypted secret active" : "Disconnected-safe"}</span>
                <Link
                  href="/master/integrations"
                  className="font-semibold text-primary hover:underline"
                >
                  Manage
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
