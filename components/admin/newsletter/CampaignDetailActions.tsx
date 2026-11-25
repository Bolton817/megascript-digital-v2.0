"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  sendTestCampaignAction,
  sendCampaignNowAction,
  cancelCampaignAction,
  deleteCampaignAction,
  scheduleCampaignAction,
} from "@/server/actions/newsletter";
import { CampaignStatus } from "@prisma/client";
import {
  Send,
  Mail,
  Trash2,
  Clock,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

interface CampaignDetailActionsProps {
  campaignId: string;
  status: CampaignStatus;
  confirmedCount: number;
}

export function CampaignDetailActions({
  campaignId,
  status,
  confirmedCount,
}: CampaignDetailActionsProps) {
  const router = useRouter();

  // Test send state
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testFeedback, setTestFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Dispatch state
  const [isSendingNow, setIsSendingNow] = useState(false);
  const [dispatchFeedback, setDispatchFeedback] = useState<string | null>(null);

  // Schedule state
  const [scheduleDate, setScheduleDate] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);

  // General action state
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes("@")) return;

    setIsSendingTest(true);
    setTestFeedback(null);

    try {
      const res = await sendTestCampaignAction(campaignId, testEmail.trim());
      if (res.success) {
        setTestFeedback({
          success: true,
          message: `Test preview email successfully dispatched to ${testEmail}.`,
        });
      } else {
        setTestFeedback({
          success: false,
          message: res.error || "Failed to dispatch test email.",
        });
      }
    } catch {
      setTestFeedback({
        success: false,
        message: "Network error sending test preview.",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSendNow = async () => {
    if (
      !confirm(
        `CRITICAL BROADCAST ACTION:\n\nAre you sure you want to dispatch this campaign NOW to all ${confirmedCount} confirmed subscribers?\n\nThis will immediately send broadcast emails and cannot be undone.`
      )
    ) {
      return;
    }

    setIsSendingNow(true);
    setDispatchFeedback(null);

    try {
      const res = await sendCampaignNowAction(campaignId);
      if (res.success) {
        setDispatchFeedback(
          `Campaign dispatched successfully to ${res.successCount} subscribers (${res.failCount} failed).`
        );
        router.refresh();
      } else {
        alert(res.error || "Failed to dispatch campaign");
      }
    } catch {
      alert("Error dispatching broadcast campaign.");
    } finally {
      setIsSendingNow(false);
    }
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleDate) return;

    setIsScheduling(true);
    try {
      const res = await scheduleCampaignAction(campaignId, scheduleDate);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Failed to schedule campaign");
      }
    } catch {
      alert("Error scheduling campaign");
    } finally {
      setIsScheduling(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this campaign?")) return;

    setIsCancelling(true);
    try {
      const res = await cancelCampaignAction(campaignId);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Failed to cancel");
      }
    } catch {
      alert("Error cancelling campaign");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this campaign? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteCampaignAction(campaignId);
      if (res.success) {
        router.push("/master/newsletter/campaigns");
      } else {
        alert("Failed to delete campaign");
      }
    } catch {
      alert("Error deleting campaign");
    } finally {
      setIsDeleting(false);
    }
  };

  const isSent = status === CampaignStatus.SENT;

  return (
    <div className="space-y-6">
      {/* Test Preview Dispatch Box */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 font-bold text-foreground text-sm">
          <Mail className="h-4 w-4 text-primary" />
          <span>Send Test Preview</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Send a rendered preview to an internal reviewer or client before broadcasting.
        </p>

        {testFeedback && (
          <div
            className={`rounded-xl p-3 text-xs flex items-start gap-2 ${
              testFeedback.success
                ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                : "bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200"
            }`}
          >
            {testFeedback.success ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span>{testFeedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSendTest} className="flex gap-2">
          <Input
            type="email"
            required
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="reviewer@example.com"
            className="flex-1 text-xs"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            isLoading={isSendingTest}
            className="gap-1.5 shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
            Send Test
          </Button>
        </form>
      </div>

      {/* Broadcast Dispatch & Controls */}
      {!isSent ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Production Broadcast Gate
              </span>
              <h3 className="text-base font-bold text-foreground">
                Live Campaign Dispatch
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
              {confirmedCount} Recipients
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Dispatching will queue individual emails with cryptographic one-click unsubscribe headers and track delivery in the database.
          </p>

          {dispatchFeedback && (
            <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 p-3 text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{dispatchFeedback}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSendNow}
              isLoading={isSendingNow}
              disabled={confirmedCount === 0}
              className="gap-2 flex-1 justify-center"
            >
              <Send className="h-4 w-4" />
              Send Broadcast Now ({confirmedCount} Confirmed)
            </Button>

            {status !== CampaignStatus.CANCELLED && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleCancel}
                isLoading={isCancelling}
                className="gap-1.5 text-muted-foreground hover:text-rose-600"
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleDelete}
              isLoading={isDeleting}
              className="gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>

          {/* Schedule Form */}
          <div className="pt-4 border-t border-primary/10">
              <form onSubmit={handleSchedule} className="flex items-center gap-2">
                <Input
                  type="datetime-local"
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="text-xs flex-1"
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  isLoading={isScheduling}
                  className="gap-1.5 shrink-0"
                >
                  <Clock className="h-3.5 w-3.5" />
                  Schedule
                </Button>
              </form>
            </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Campaign Dispatched</span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            This broadcast campaign has already completed dispatch to subscribers. Content is archived and read-only.
          </p>
        </div>
      )}
    </div>
  );
}
