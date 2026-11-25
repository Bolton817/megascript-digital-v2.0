"use client";

import React, { useState } from "react";
import { Download, X, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { exportLeadsAction, exportAnalyticsAction } from "@/server/actions/export";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportType: "leads" | "analytics";
  timeframeDays?: number;
  userCanExport: boolean;
}

export function ExportModal({
  isOpen,
  onClose,
  exportType,
  timeframeDays = 30,
  userCanExport,
}: ExportModalProps) {
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [anonymize, setAnonymize] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setError(null);
    setIsExporting(true);
    setSuccess(false);

    try {
      let result;
      if (exportType === "leads") {
        result = await exportLeadsAction({
          format,
          anonymize,
          timeframeDays,
        });
      } else {
        result = await exportAnalyticsAction({
          format,
          timeframeDays,
        });
      }

      // Trigger browser download
      const blob = new Blob([result.content], { type: result.contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "Export failed due to permission or server restriction.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              {exportType === "leads" ? "Export CRM Inquiries" : "Export Analytics Metrics"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Permission Gate Warning */}
        {!userCanExport ? (
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span className="text-xs font-bold">Export Permission Required</span>
            </div>
            <p className="text-xs leading-relaxed">
              Your assigned role (e.g. Analyst or Editor) does not have authorization to extract raw records. Exports are restricted to Super Administrators and operational Managers with active audit logging.
            </p>
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Format Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">File Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat("csv")}
                  className={`p-3 rounded-xl border text-left space-y-0.5 transition-colors ${
                    format === "csv"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-surface-muted/30 text-foreground"
                  }`}
                >
                  <span className="text-xs font-bold block">CSV Spreadsheet</span>
                  <span className="text-[10px] text-muted-foreground block">
                    Excel &amp; Google Sheets compatible
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat("json")}
                  className={`p-3 rounded-xl border text-left space-y-0.5 transition-colors ${
                    format === "json"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-surface-muted/30 text-foreground"
                  }`}
                >
                  <span className="text-xs font-bold block">JSON Structured</span>
                  <span className="text-[10px] text-muted-foreground block">
                    Developer &amp; programmatic ingestion
                  </span>
                </button>
              </div>
            </div>

            {/* Privacy Anonymization Checkbox (Leads Only) */}
            {exportType === "leads" && (
              <div className="p-3.5 rounded-xl border border-border bg-surface-muted/30 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={anonymize}
                    onChange={(e) => setAnonymize(e.target.checked)}
                    className="mt-0.5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground">
                      Anonymize Contact PII (KDPA Compliance)
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Masks full names, email addresses, and phone numbers. Preserves reference code, topic, channel, and UTM attribution for privacy-safe reporting.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Audit Log Notice */}
            <div className="p-3 rounded-xl bg-surface-muted/50 border border-border/80 flex items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>This download will be permanently logged in the immutable admin audit trail.</span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Export generated successfully. Download starting...</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" onClick={onClose} disabled={isExporting}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExport}
                disabled={isExporting}
                className="gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isExporting ? "Generating..." : "Download Export"}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
