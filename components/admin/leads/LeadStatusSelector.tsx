"use client";

import React, { useState, useTransition } from "react";
import { LeadStatus } from "@prisma/client";
import { updateLeadStatusAction } from "@/server/actions/leads";
import { Loader2 } from "lucide-react";

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  NEW: {
    label: "New Enquiry",
    bg: "bg-sky-50 dark:bg-sky-950/50",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-300 dark:border-sky-800",
  },
  CONTACTED: {
    label: "Contacted",
    bg: "bg-blue-50 dark:bg-blue-950/50",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-800",
  },
  QUALIFIED: {
    label: "Qualified",
    bg: "bg-purple-50 dark:bg-purple-950/50",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-300 dark:border-purple-800",
  },
  PROPOSAL_SENT: {
    label: "Proposal Sent",
    bg: "bg-amber-50 dark:bg-amber-950/50",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-800",
  },
  WON: {
    label: "Won / Contract",
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-800",
  },
  LOST: {
    label: "Lost",
    bg: "bg-slate-100 dark:bg-slate-900",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-300 dark:border-slate-800",
  },
  SPAM: {
    label: "Spam",
    bg: "bg-rose-50 dark:bg-rose-950/50",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-300 dark:border-rose-800",
  },
  CLOSED: {
    label: "Closed",
    bg: "bg-slate-100 dark:bg-slate-900",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-300 dark:border-slate-800",
  },
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const conf = STATUS_CONFIG[status] || STATUS_CONFIG.NEW;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${conf.bg} ${conf.text} ${conf.border}`}
    >
      {conf.label}
    </span>
  );
}

export function LeadStatusSelector({
  leadId,
  currentStatus,
  disabled = false,
}: {
  leadId: string;
  currentStatus: LeadStatus;
  disabled?: boolean;
}) {
  const [status, setStatus] = useState<LeadStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = (newStatus: LeadStatus) => {
    if (newStatus === status || disabled || isPending) return;

    setStatus(newStatus);
    setError(null);

    startTransition(async () => {
      try {
        const res = await updateLeadStatusAction(leadId, newStatus);
        if (!res.success) {
          setError("Failed to update lead status");
          setStatus(currentStatus);
        }
      } catch (err: any) {
        setError(err.message || "Failed to update lead status");
        setStatus(currentStatus);
      }
    });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <label
          htmlFor={`status-select-${leadId}`}
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          Status:
        </label>
        <div className="relative inline-flex items-center">
          <select
            id={`status-select-${leadId}`}
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
            disabled={disabled || isPending}
            className="text-xs font-semibold rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          >
            {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
              <option key={key} value={key}>
                {conf.label}
              </option>
            ))}
          </select>
          {isPending && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary ml-2" />
          )}
        </div>
      </div>
      {error && <span className="text-[11px] text-rose-500">{error}</span>}
    </div>
  );
}
