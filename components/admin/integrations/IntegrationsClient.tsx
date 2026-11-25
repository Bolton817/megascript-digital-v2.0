"use client";

import React, { useState, useTransition } from "react";
import {
  Plug,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Sliders,
  History,
  Lock,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  IntegrationSummary,
  SupportedProvider,
} from "@/server/services/integrations";
import {
  fetchIntegrationsOverviewAction,
  triggerIntegrationSyncAction,
  disconnectIntegrationAction,
} from "@/server/actions/integrations";
import { ConfigureModal } from "./ConfigureModal";
import { SyncHistoryModal } from "./SyncHistoryModal";

interface IntegrationsClientProps {
  initialIntegrations: IntegrationSummary[];
}

export function IntegrationsClient({ initialIntegrations }: IntegrationsClientProps) {
  const [integrations, setIntegrations] = useState<IntegrationSummary[]>(initialIntegrations);
  const [selectedForConfigure, setSelectedForConfigure] = useState<IntegrationSummary | null>(null);
  const [selectedForHistory, setSelectedForHistory] = useState<IntegrationSummary | null>(null);

  const [isPending, startTransition] = useTransition();
  const [actionNotice, setActionNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [syncingProvider, setSyncingProvider] = useState<SupportedProvider | null>(null);

  const reloadOverview = () => {
    startTransition(async () => {
      const res = await fetchIntegrationsOverviewAction();
      if (res.success && res.data) {
        setIntegrations(res.data);
      }
    });
  };

  const handleSyncNow = async (provider: SupportedProvider) => {
    setSyncingProvider(provider);
    setActionNotice(null);

    const res = await triggerIntegrationSyncAction(provider);
    setSyncingProvider(null);

    if (res.success) {
      const count = "recordsCount" in res ? res.recordsCount : 0;
      setActionNotice({
        type: "success",
        message: `Successfully synchronised ${provider} data (${count || 0} records).`,
      });
      reloadOverview();
    } else {
      setActionNotice({
        type: "error",
        message: res.error || `Failed to synchronise ${provider}.`,
      });
    }
  };

  const handleDisconnect = async (provider: SupportedProvider) => {
    if (!confirm(`Are you sure you want to disconnect ${provider}? Credentials will be wiped from secure storage.`)) {
      return;
    }

    startTransition(async () => {
      const res = await disconnectIntegrationAction(provider);
      if (res.success) {
        setActionNotice({
          type: "success",
          message: `${provider} disconnected successfully.`,
        });
        reloadOverview();
      } else {
        setActionNotice({
          type: "error",
          message: res.error || `Failed to disconnect ${provider}.`,
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl border border-border bg-surface">
        <div>
          <div className="flex items-center gap-2">
            <Plug className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">
              Integration Connection Centre
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Centralized external API connectors operating in disconnected-safe mode (TDD Sheets 074, 076–078). Unconfigured providers display setup instructions rather than zero metrics.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={reloadOverview}
          disabled={isPending}
          className="gap-1.5 self-start sm:self-auto shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
          Refresh Status
        </Button>
      </div>

      {actionNotice && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 animate-fade-in ${
            actionNotice.type === "success"
              ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300"
              : "border-rose-200 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionNotice.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{actionNotice.message}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="p-1 rounded text-muted-foreground hover:text-foreground"
          >
            <AlertCircle className="w-3.5 h-3.5 opacity-0" />
            Dismiss
          </button>
        </div>
      )}

      {/* Provider Connector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => {
          const isConnected = item.status === "CONNECTED";
          const isSyncing = syncingProvider === item.provider;

          let badgeVariant = "bg-muted text-muted-foreground";
          let badgeText = "Not connected";
          if (isConnected) {
            badgeVariant = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
            badgeText = "Connected";
          } else if (item.status === "ERROR") {
            badgeVariant = "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300";
            badgeText = "Error";
          } else if (item.status === "PERMISSION_EXPIRED") {
            badgeVariant = "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
            badgeText = "Token Expired";
          }

          return (
            <div
              key={item.provider}
              className="flex flex-col justify-between p-5 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors shadow-sm"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {item.definition.name}
                    </h3>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {item.definition.category}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${badgeVariant}`}>
                    {badgeText}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                  {item.definition.description}
                </p>

                {/* Details list */}
                <div className="space-y-2 py-3 border-y border-border text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Asset / Target:</span>
                    <span className="font-medium text-foreground truncate max-w-[160px]">
                      {item.accountAssetLabel || "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Encrypted Secret:</span>
                    <span className="font-mono text-[11px] text-foreground">
                      {item.maskedSecret}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Sync:</span>
                    <span className="text-foreground">
                      {item.lastSyncAt
                        ? new Date(item.lastSyncAt).toLocaleString("en-KE", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                        : "Never"}
                    </span>
                  </div>

                  {item.lastErrorCategory && (
                    <div className="flex items-center justify-between text-rose-600">
                      <span>Error Flag:</span>
                      <span className="font-semibold">{item.lastErrorCategory}</span>
                    </div>
                  )}
                </div>

                {/* Disconnected state prompt */}
                {!isConnected && (
                  <div className="mt-3 p-2.5 rounded-lg bg-surface-subtle border border-border text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>Disconnected-safe mode active</span>
                    <span className="text-primary font-medium">Setup required</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedForConfigure(item)}
                  className="flex-1 text-xs gap-1"
                >
                  <Sliders className="w-3.5 h-3.5 text-primary" />
                  Configure
                </Button>

                {isConnected && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSyncNow(item.provider)}
                      disabled={isSyncing}
                      className="text-xs px-2.5"
                      title="Sync Now"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-primary" : ""}`} />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedForHistory(item)}
                      className="text-xs px-2.5"
                      title="Sync History"
                    >
                      <History className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(item.provider)}
                      className="text-xs px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      title="Disconnect"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <ConfigureModal
        isOpen={Boolean(selectedForConfigure)}
        onClose={() => setSelectedForConfigure(null)}
        integration={selectedForConfigure}
        onSuccess={reloadOverview}
      />

      <SyncHistoryModal
        isOpen={Boolean(selectedForHistory)}
        onClose={() => setSelectedForHistory(null)}
        providerName={selectedForHistory?.definition.name || ""}
        syncLogs={[]}
      />
    </div>
  );
}
