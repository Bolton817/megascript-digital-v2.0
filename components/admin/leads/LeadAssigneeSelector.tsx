"use client";

import React, { useState, useTransition } from "react";
import { assignLeadAction } from "@/server/actions/leads";
import { Loader2 } from "lucide-react";

interface UserOption {
  id: string;
  name: string | null;
  email: string;
}

export function LeadAssigneeSelector({
  leadId,
  assignedUserId,
  users,
  disabled = false,
}: {
  leadId: string;
  assignedUserId: string | null;
  users: UserOption[];
  disabled?: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string>(assignedUserId || "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAssigneeChange = (newUserId: string) => {
    const targetId = newUserId === "" ? null : newUserId;
    if (targetId === assignedUserId || disabled || isPending) return;

    setSelectedId(newUserId);
    setError(null);

    startTransition(async () => {
      try {
        const res = await assignLeadAction(leadId, targetId);
        if (!res.success) {
          setError("Failed to update assignee");
          setSelectedId(assignedUserId || "");
        }
      } catch (err: any) {
        setError(err.message || "Failed to update assignee");
        setSelectedId(assignedUserId || "");
      }
    });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <label
          htmlFor={`assignee-select-${leadId}`}
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          Assignee:
        </label>
        <div className="relative inline-flex items-center">
          <select
            id={`assignee-select-${leadId}`}
            value={selectedId}
            onChange={(e) => handleAssigneeChange(e.target.value)}
            disabled={disabled || isPending}
            className="text-xs font-medium rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          >
            <option value="">-- Unassigned --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name ? `${u.name} (${u.email})` : u.email}
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
