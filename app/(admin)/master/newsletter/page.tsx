import React from "react";
import Link from "next/link";
import { requirePermission } from "@/features/auth/rbac";
import { getCampaignMetrics } from "@/server/services/newsletter/campaigns";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { Button } from "@/components/ui/Button";
import {
  Mail,
  Users,
  Send,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Plus,
  Download,
  Clock,
  Sparkles,
  ShieldCheck,
  FileText,
} from "lucide-react";

export default async function MasterNewsletterPage() {
  await requirePermission("newsletter.read", { isQualifyingActivity: true });

  const metrics = await getCampaignMetrics();

  const confirmedCount = metrics.subscribers.CONFIRMED || 0;
  const pendingCount = metrics.subscribers.PENDING || 0;
  const unsubscribedCount = metrics.subscribers.UNSUBSCRIBED || 0;
  const totalSubscribers = metrics.subscribers.TOTAL || 0;

  const totalDeliveries = metrics.deliveries.TOTAL || 0;
  const deliveredCount = metrics.deliveries.DELIVERED || 0;
  const bouncedCount = metrics.deliveries.BOUNCED || 0;
  const sentCount = metrics.deliveries.SENT || 0;

  const deliveryRate =
    totalDeliveries > 0
      ? Math.round(((deliveredCount + sentCount) / totalDeliveries) * 100)
      : 100;

  const bounceRate =
    totalDeliveries > 0
      ? Math.round((bouncedCount / totalDeliveries) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <SessionInactivityGuard />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/master/overview"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Overview
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Marketing &amp; Audience
                </span>
                <h1 className="text-2xl font-bold text-foreground">
                  Newsletter &amp; Email Operations
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <a href="/api/newsletter/export" download>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </a>
            <Link href="/master/newsletter/subscribers">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Users className="h-4 w-4" />
                Subscribers ({confirmedCount})
              </Button>
            </Link>
            <Link href="/master/newsletter/campaigns">
              <Button variant="outline" size="sm" className="gap-1.5">
                <FileText className="h-4 w-4" />
                Campaigns
              </Button>
            </Link>
            <Link href="/master/newsletter/campaigns/new">
              <Button variant="primary" size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                New Campaign
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Confirmed Subscribers */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Confirmed Audience
              </span>
              <Users className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <div className="text-3xl font-black text-foreground">
                {confirmedCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingCount} pending verification &bull; {unsubscribedCount} unsubscribed
              </p>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Total recorded</span>
              <span className="font-semibold text-foreground">{totalSubscribers}</span>
            </div>
          </div>

          {/* Campaigns Overview */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Broadcast Campaigns
              </span>
              <Send className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-3xl font-black text-foreground">
                {metrics.campaigns.SENT || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.campaigns.DRAFT || 0} draft &bull; {metrics.campaigns.SCHEDULED || 0} scheduled
              </p>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Total campaigns</span>
              <span className="font-semibold text-foreground">{metrics.campaigns.TOTAL || 0}</span>
            </div>
          </div>

          {/* Total Deliveries Tracked */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Deliveries
              </span>
              <CheckCircle2 className="h-4 w-4 text-sky-500" />
            </div>
            <div>
              <div className="text-3xl font-black text-foreground">
                {totalDeliveries}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {deliveredCount + sentCount} sent/delivered successfully
              </p>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Bounced / Failed</span>
              <span className="font-semibold text-rose-500">
                {bouncedCount + (metrics.deliveries.FAILED || 0)}
              </span>
            </div>
          </div>

          {/* Delivery Health */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Delivery Health
              </span>
              <ShieldCheck className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <div className="text-3xl font-black text-foreground">
                {deliveryRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Bounce rate: {bounceRate}% (target &lt; 2%)
              </p>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Provider</span>
              <span className="font-semibold text-foreground">Brevo SMTP &amp; Webhooks</span>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/master/newsletter/campaigns/new"
            className="group rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors p-5 flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                Compose Campaign
              </div>
              <p className="text-xs text-muted-foreground">
                Draft a new engineering update or product release announcement.
              </p>
            </div>
            <Plus className="h-5 w-5 text-primary group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/master/newsletter/subscribers"
            className="group rounded-2xl border border-border bg-surface hover:bg-surface-subtle transition-colors p-5 flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Users className="h-4 w-4 text-emerald-500" />
                Audience Directory
              </div>
              <p className="text-xs text-muted-foreground">
                Inspect double opt-in statuses, suppression timestamps, and source channels.
              </p>
            </div>
            <Users className="h-5 w-5 text-muted group-hover:text-foreground transition-colors" />
          </Link>

          <Link
            href="/master/newsletter/campaigns"
            className="group rounded-2xl border border-border bg-surface hover:bg-surface-subtle transition-colors p-5 flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <FileText className="h-4 w-4 text-sky-500" />
                Campaign History
              </div>
              <p className="text-xs text-muted-foreground">
                Review dispatched archives, delivery breakdowns, and scheduled broadcasts.
              </p>
            </div>
            <FileText className="h-5 w-5 text-muted group-hover:text-foreground transition-colors" />
          </Link>
        </div>

        {/* Recent Delivery Audit Log */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Recent Transactional &amp; Broadcast Deliveries
              </h2>
              <p className="text-xs text-muted-foreground">
                Live delivery tracking from Brevo SMTP and transactional email adapters.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-subtle text-muted-foreground border border-border">
              Latest {metrics.recentDeliveries.length} records
            </span>
          </div>

          {metrics.recentDeliveries.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm">
              No email deliveries recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle border-b border-border text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Recipient Email</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Template</th>
                    <th className="px-4 py-3">Provider ID</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {metrics.recentDeliveries.map((del) => {
                    const isDelivered = del.status === "DELIVERED";
                    const isSent = del.status === "SENT";
                    const isBounced = del.status === "BOUNCED";
                    const isFailed = del.status === "FAILED";

                    return (
                      <tr key={del.id} className="hover:bg-surface-subtle/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-foreground font-medium">
                          {del.recipientEmail}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-subtle border border-border text-muted-foreground">
                            {del.messageType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {del.templateId}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground truncate max-w-[140px]">
                          {del.providerId || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              isDelivered
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                                : isSent
                                ? "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-800"
                                : isBounced
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                            }`}
                          >
                            {isDelivered && <CheckCircle2 className="h-3 w-3" />}
                            {isBounced && <AlertTriangle className="h-3 w-3" />}
                            {del.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(del.sentAt).toLocaleString("en-KE", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
