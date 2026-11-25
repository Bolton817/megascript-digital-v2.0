import React from "react";
import Link from "next/link";
import { requirePermission } from "@/features/auth/rbac";
import { getCampaigns } from "@/server/services/newsletter/campaigns";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { Button } from "@/components/ui/Button";
import {
  FileText,
  Plus,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";

interface CampaignsPageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

export default async function MasterCampaignsPage({ searchParams }: CampaignsPageProps) {
  await requirePermission("newsletter.read", { isQualifyingActivity: true });

  const resolvedParams = await searchParams;
  const statusParam = resolvedParams.status;
  const page = parseInt(resolvedParams.page || "1", 10) || 1;

  const result = await getCampaigns({
    status: statusParam,
    page,
    pageSize: 15,
  });

  const { campaigns, total, totalPages, statusCounts } = result;

  const statusTabs = [
    { id: "ALL", label: "All Campaigns", count: statusCounts.ALL },
    { id: "DRAFT", label: "Drafts", count: statusCounts.DRAFT },
    { id: "SCHEDULED", label: "Scheduled", count: statusCounts.SCHEDULED },
    { id: "SENT", label: "Dispatched", count: statusCounts.SENT },
    { id: "CANCELLED", label: "Cancelled", count: statusCounts.CANCELLED },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <SessionInactivityGuard />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <Link
              href="/master/newsletter"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Newsletter Overview
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Broadcast Library
                </span>
                <h1 className="text-2xl font-bold text-foreground">
                  Newsletter Campaigns
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/master/newsletter/campaigns/new">
              <Button variant="primary" size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                New Campaign
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {statusTabs.map((tab) => {
            const isActive =
              (!statusParam && tab.id === "ALL") || statusParam === tab.id;
            const queryParams = new URLSearchParams();
            if (tab.id !== "ALL") queryParams.set("status", tab.id);

            return (
              <Link
                key={tab.id}
                href={`/master/newsletter/campaigns?${queryParams.toString()}`}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-foreground text-background font-semibold"
                    : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface-subtle"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? "bg-background/20 text-background"
                      : "bg-surface-subtle text-muted-foreground"
                  }`}
                >
                  {tab.count ?? 0}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          {campaigns.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-12 text-center text-muted-foreground text-sm">
              <FileText className="h-8 w-8 text-muted mx-auto mb-3" />
              <p>No campaigns found in this view.</p>
              <Link href="/master/newsletter/campaigns/new" className="inline-block mt-4">
                <Button variant="primary" size="sm">
                  Create First Campaign
                </Button>
              </Link>
            </div>
          ) : (
            campaigns.map((camp) => {
              const isSent = camp.status === "SENT";
              const isScheduled = camp.status === "SCHEDULED";
              const isDraft = camp.status === "DRAFT";
              const isCancelled = camp.status === "CANCELLED";

              return (
                <div
                  key={camp.id}
                  className="rounded-2xl border border-border bg-surface p-5 shadow-sm hover:border-primary/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
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
                        {camp.status}
                      </span>
                      <h2 className="text-base font-bold text-foreground">
                        {camp.title}
                      </h2>
                    </div>

                    <p className="text-xs text-foreground font-medium flex items-center gap-1.5">
                      <span className="text-muted-foreground">Subject:</span>
                      {camp.subject}
                    </p>

                    {camp.preheader && (
                      <p className="text-xs text-muted-foreground truncate max-w-xl">
                        {camp.preheader}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1 flex-wrap">
                      <span>Created: {new Date(camp.createdAt).toLocaleDateString("en-KE")}</span>
                      {camp.sentAt && (
                        <span>Dispatched: {new Date(camp.sentAt).toLocaleString("en-KE")}</span>
                      )}
                      {camp.scheduledAt && (
                        <span>Scheduled: {new Date(camp.scheduledAt).toLocaleString("en-KE")}</span>
                      )}
                      <span>Deliveries: {camp._count.deliveries}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/master/newsletter/campaigns/${camp.id}`}>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        Manage Campaign
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 rounded-xl border border-border bg-surface flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Page {page} of {totalPages} ({total} campaigns)
              </span>
              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Link
                    href={`/master/newsletter/campaigns?page=${page - 1}${
                      statusParam ? `&status=${statusParam}` : ""
                    }`}
                  >
                    <Button variant="outline" size="sm" className="gap-1">
                      <ChevronLeft className="h-3.5 w-3.5" /> Previous
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" disabled className="gap-1 opacity-50">
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                  </Button>
                )}

                {page < totalPages ? (
                  <Link
                    href={`/master/newsletter/campaigns?page=${page + 1}${
                      statusParam ? `&status=${statusParam}` : ""
                    }`}
                  >
                    <Button variant="outline" size="sm" className="gap-1">
                      Next <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" disabled className="gap-1 opacity-50">
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
