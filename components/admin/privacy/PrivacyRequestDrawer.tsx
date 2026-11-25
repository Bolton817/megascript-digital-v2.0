"use client";

import React, { useState, useEffect } from "react";
import { PrivacyRequest, PrivacyRequestStatus } from "@prisma/client";
import { getRequesterDataMatchAction, updatePrivacyRequestStatusAction } from "@/server/actions/privacy";
import {
  X,
  Shield,
  Clock,
  User,
  Mail,
  FileText,
  Search,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

interface PrivacyRequestDrawerProps {
  request: PrivacyRequest | null;
  onClose: () => void;
  onUpdated: () => void;
}

export function PrivacyRequestDrawer({ request, onClose, onUpdated }: PrivacyRequestDrawerProps) {
  const [status, setStatus] = useState<PrivacyRequestStatus>("PENDING");
  const [outcomeDetails, setOutcomeDetails] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Automated Data Matching State
  const [isMatching, setIsMatching] = useState(false);
  const [matchData, setMatchData] = useState<any>(null);

  useEffect(() => {
    if (request) {
      setStatus(request.status);
      setOutcomeDetails(request.outcomeDetails || "");
      setSaveMessage(null);

      // Trigger automated data matching
      setIsMatching(true);
      getRequesterDataMatchAction(request.requesterEmail)
        .then((res) => {
          if (res.success) {
            setMatchData(res.data);
          }
        })
        .finally(() => setIsMatching(false));
    }
  }, [request]);

  if (!request) return null;

  const handleUpdate = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await updatePrivacyRequestStatusAction({
        id: request.id,
        status,
        outcomeDetails: outcomeDetails.trim(),
      });
      if (res.success) {
        setSaveMessage("Status and resolution notes updated successfully.");
        onUpdated();
      } else {
        setSaveMessage(res.error || "Failed to update request.");
      }
    } catch {
      setSaveMessage("An error occurred while updating status.");
    } finally {
      setIsSaving(false);
    }
  };

  const isOverdue =
    ["PENDING", "VERIFYING", "PROCESSING"].includes(request.status) &&
    new Date(request.dueAt) < new Date();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-xl h-full bg-surface text-foreground shadow-2xl flex flex-col border-l border-border overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border p-5 bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">
                  {request.referenceCode}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-border text-foreground font-semibold">
                  {request.requestType}
                </span>
              </div>
              <h2 className="text-sm font-bold text-foreground">
                Privacy Rights Case Management
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs scrollbar-thin">
          {/* Statutory SLA Countdown */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isOverdue
                ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400"
                : "border-border bg-surface-subtle text-foreground"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
              <div>
                <span className="font-bold block">
                  {isOverdue ? "Statutory SLA Overdue (KDPA 21-Day Limit)" : "KDPA Statutory Due Date"}
                </span>
                <span className="text-[11px] opacity-80 font-mono">
                  Due by: {new Date(request.dueAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                isOverdue
                  ? "bg-rose-500/20 text-rose-700 dark:text-rose-300"
                  : "bg-surface-border text-foreground"
              }`}
            >
              {request.status}
            </span>
          </div>

          {/* Requester Identity Details */}
          <div className="space-y-3">
            <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px]">
              Requester Information
            </h3>
            <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Full Name:</span>
                <span className="font-bold text-foreground">{request.requesterName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email Address:</span>
                <span className="font-mono font-semibold text-foreground">{request.requesterEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Received At:</span>
                <span className="font-mono text-muted-foreground">
                  {new Date(request.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Request Details Content */}
          <div className="space-y-2">
            <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px]">
              Requester Specification / Scope
            </h3>
            <div className="rounded-xl border border-border bg-surface-subtle p-3.5 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {request.requestDetails}
            </div>
          </div>

          {/* Automated Data Matching Section (Sheet 142) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>Automated Data Matching Tool</span>
              </h3>
              {isMatching && (
                <span className="text-[10px] text-muted-foreground animate-pulse">Scanning records...</span>
              )}
            </div>

            {matchData ? (
              <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-surface-subtle border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase block">CRM Enquiries</span>
                    <span className="font-bold text-sm text-foreground">{matchData.leadsCount}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-subtle border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase block">Newsletter</span>
                    <span className="font-bold text-sm text-foreground">
                      {matchData.isSubscriber ? "Subscribed" : "Not Found"}
                    </span>
                  </div>
                </div>

                {matchData.leads && matchData.leads.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Matched Enquiries:</span>
                    <div className="divide-y divide-border/60 border border-border rounded-lg overflow-hidden">
                      {matchData.leads.map((l: any) => (
                        <div key={l.id} className="p-2 bg-surface-subtle flex items-center justify-between text-[11px]">
                          <div>
                            <span className="font-mono font-bold text-foreground">{l.referenceCode}</span>
                            <span className="text-muted-foreground ml-2">({l.topic})</span>
                          </div>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-border text-foreground">
                            {l.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-dashed border-border text-center text-muted-foreground text-xs">
                Scanning database for matched records...
              </div>
            )}
          </div>

          {/* Status Progression & Resolution Notes */}
          <div className="space-y-3 border-t border-border pt-4">
            <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px]">
              Case Resolution & Workflow
            </h3>

            <div className="space-y-2">
              <label htmlFor="status" className="block text-muted-foreground text-[11px]">
                Update Request Status:
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as PrivacyRequestStatus)}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="PENDING">PENDING - Initial Receipt</option>
                <option value="VERIFYING">VERIFYING - Identity Under Verification</option>
                <option value="PROCESSING">PROCESSING - Fulfilling Access/Deletion</option>
                <option value="RESOLVED">RESOLVED - Case Closed & Communicated</option>
                <option value="DECLINED">DECLINED - Statutory Exemption Applied</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="outcomeDetails" className="block text-muted-foreground text-[11px]">
                Resolution Notes / Outcome Explanation:
              </label>
              <textarea
                id="outcomeDetails"
                rows={3}
                value={outcomeDetails}
                onChange={(e) => setOutcomeDetails(e.target.value)}
                placeholder="Document actions taken (e.g. data export sent, leads anonymized, verified via phone on 25 Nov)..."
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed resize-none"
              />
            </div>

            {saveMessage && (
              <div className="p-2.5 rounded-lg border border-border bg-surface-subtle text-xs text-foreground flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                <span>{saveMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="border-t border-border p-4 bg-surface-subtle flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border bg-surface text-foreground font-semibold hover:bg-surface-muted transition-colors text-xs"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-sm transition-all text-xs disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Status & Audit"}
          </button>
        </div>
      </div>
    </div>
  );
}
