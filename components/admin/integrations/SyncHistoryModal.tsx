"use client";

import React from "react";
import { X, CheckCircle2, AlertCircle, Clock, Database } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SyncLog {
  id: string;
  status: string;
  recordsCount: number;
  errorMessage: string | null;
  createdAt: Date | string;
}

interface SyncHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  syncLogs: SyncLog[];
}

export function SyncHistoryModal({
  isOpen,
  onClose,
  providerName,
  syncLogs,
}: SyncHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-subtle">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Sync History: {providerName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {syncLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No synchronisation logs recorded yet for this provider.
            </div>
          ) : (
            <div className="space-y-3">
              {syncLogs.map((log) => {
                const isSuccess = log.status === "SUCCESS";
                const dateStr = new Date(log.createdAt).toLocaleString("en-KE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                });

                return (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-lg border border-border bg-surface flex items-start gap-3 text-sm"
                  >
                    {isSuccess ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-foreground">
                          {isSuccess ? "Sync Succeeded" : "Sync Failed"}
                        </span>
                        <span className="text-xs text-muted-foreground">{dateStr}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Records Processed: <span className="font-semibold text-foreground">{log.recordsCount}</span>
                      </p>
                      {log.errorMessage && (
                        <p className="text-xs text-rose-600 mt-1 bg-rose-50 dark:bg-rose-950/30 p-2 rounded border border-rose-200 dark:border-rose-900">
                          {log.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-border bg-surface-subtle flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
