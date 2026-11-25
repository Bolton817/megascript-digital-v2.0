import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth/rbac";
import { getCampaignById } from "@/server/services/newsletter/campaigns";
import { db } from "@/server/db";
import { SubscriberStatus } from "@prisma/client";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { CampaignDetailActions } from "@/components/admin/newsletter/CampaignDetailActions";
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Mail,
  Send,
  Calendar,
} from "lucide-react";

interface CampaignDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  await requirePermission("newsletter.read", { isQualifyingActivity: true });

  const { id } = await params;
  const [campaign, confirmedCount] = await Promise.all([
    getCampaignById(id),
    db.newsletterSubscriber.count({
      where: { status: SubscriberStatus.CONFIRMED },
    }),
  ]);

  if (!campaign) {
    notFound();
  }

  const isSent = campaign.status === "SENT";
  const isScheduled = campaign.status === "SCHEDULED";
  const isDraft = campaign.status === "DRAFT";
  const isCancelled = campaign.status === "CANCELLED";

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <SessionInactivityGuard />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <Link
              href="/master/newsletter/campaigns"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Campaigns
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      isSent
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                        : isScheduled
                        ? "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-800"
                        : isDraft
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                        : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    {isSent && <CheckCircle2 className="h-3 w-3" />}
                    {isScheduled && <Clock className="h-3 w-3" />}
                    {isDraft && <FileText className="h-3 w-3" />}
                    {isCancelled && <XCircle className="h-3 w-3" />}
                    {campaign.status}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    ID: {campaign.id}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-foreground mt-1">
                  {campaign.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Queued / Sent
            </span>
            <div className="text-2xl font-black text-foreground mt-1">
              {campaign.deliveryStats.SENT + campaign.deliveryStats.DELIVERED}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
              Delivered
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {campaign.deliveryStats.DELIVERED}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">
              Bounced
            </span>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {campaign.deliveryStats.BOUNCED}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">
              Failed
            </span>
            <div className="text-2xl font-black text-rose-600 mt-1">
              {campaign.deliveryStats.FAILED}
            </div>
          </div>
        </div>

        {/* Action Controls (Send test, Broadcast live, Schedule, Cancel, Delete) */}
        <CampaignDetailActions
          campaignId={campaign.id}
          status={campaign.status}
          confirmedCount={confirmedCount}
        />

        {/* Email Content Preview */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4">
          <div className="space-y-1.5 pb-4 border-b border-border">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Email Metadata &amp; Content
            </h2>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>
                <strong className="text-foreground">Subject Line:</strong> {campaign.subject}
              </div>
              {campaign.preheader && (
                <div>
                  <strong className="text-foreground">Preheader Snippet:</strong> {campaign.preheader}
                </div>
              )}
              {campaign.scheduledAt && (
                <div className="flex items-center gap-1.5 text-primary">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Scheduled for: {new Date(campaign.scheduledAt).toLocaleString("en-KE")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rendered HTML Container */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 max-w-[560px] mx-auto text-slate-900 shadow-sm">
            <div className="border-b border-slate-200 pb-3 mb-5">
              <span className="text-base font-bold text-slate-900">
                MegaScript <span className="text-sky-600">Digital</span>
              </span>
            </div>
            <div
              className="prose prose-sm max-w-none text-slate-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: campaign.body }}
            />
            <hr className="my-5 border-slate-200" />
            <div className="text-center text-[11px] text-slate-400">
              <p>&copy; {new Date().getFullYear()} MegaScript Digital &bull; Nairobi, Kenya</p>
              <p className="mt-1 text-slate-400">
                Unsubscribe link injected dynamically per subscriber
              </p>
            </div>
          </div>
        </div>

        {/* Individual Deliveries Table for this Campaign */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">
              Delivery Logs ({campaign.deliveries.length})
            </h3>
            <span className="text-xs text-muted-foreground">
              {campaign.deliveries.length > 0 ? "Showing recent records" : "No dispatches yet"}
            </span>
          </div>

          {campaign.deliveries.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No recipient dispatches recorded for this campaign yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle border-b border-border text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Recipient</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Provider ID</th>
                    <th className="px-4 py-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {campaign.deliveries.map((del) => (
                    <tr key={del.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-foreground font-medium">
                        {del.recipientEmail}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            del.status === "DELIVERED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : del.status === "SENT"
                              ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {del.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground truncate max-w-[160px]">
                        {del.providerId || "—"}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {new Date(del.sentAt).toLocaleString("en-KE")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
