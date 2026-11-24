"use client";

import React, { useState, useTransition } from "react";
import { addLeadNoteAction } from "@/server/actions/leads";
import { Button } from "@/components/ui/Button";
import { PlusCircle, Loader2 } from "lucide-react";

export function LeadNoteForm({
  leadId,
  disabled = false,
}: {
  leadId: string;
  disabled?: boolean;
}) {
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = note.trim();
    if (!trimmed || isPending || disabled) return;

    setError(null);
    startTransition(async () => {
      try {
        const res = await addLeadNoteAction(leadId, trimmed, true);
        if (res.success) {
          setNote("");
        } else {
          setError("Failed to add note.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to add note.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-xs text-rose-500">{error}</p>}
      <div className="space-y-1.5">
        <label
          htmlFor={`note-input-${leadId}`}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block"
        >
          Add Internal Note
        </label>
        <textarea
          id={`note-input-${leadId}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Record follow-up calls, meeting notes, budget constraints, or qualification details..."
          rows={3}
          disabled={disabled || isPending}
          className="w-full rounded-xl border border-surface-border bg-surface px-3 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y disabled:opacity-50"
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!note.trim() || disabled || isPending}
          isLoading={isPending}
          className="gap-1.5 text-xs"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Post Note</span>
        </Button>
      </div>
    </form>
  );
}
