import React from "react";
import Link from "next/link";
import { requirePermission } from "@/features/auth/rbac";
import { getCampaigns } from "@/server/services/newsletter/campaigns";
import { getCampaignOutcomeAnalytics } from "@/server/services/newsletter/campaign-analytics";
import { CampaignOutcomeDashboard } from "@/components/admin/campaigns/CampaignOutcomeDashboard";
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
  BarChart2,
  ListFilter,
} from "lucide-react";

interface CampaignsPageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
    tab?: string;
  }>;
}

export default async function MasterCampaignsPage({ searchParams }: CampaignsPageProps) {
  await requirePermission("newsletter.read", { isQualifyingActivity: true });

  const resolvedParams = await searchParams;
  const statusParam = resolvedParams.status;
  const page = parseInt(resolvedParams.page || "1", 10) || 1;
  const currentTab = (resolvedParams.tab === "outcomes" ? "outcomes" : "library") as "library" | "outcomes";

  const [result, outcomeData] = await Promise.all([
    getCampaigns({
      status: statusParam,
      page,
      pageSize: 15,
    }),
    currentTab === "outcomes" ? getCampaignOutcomeAnalytics(90) : Promise.resolve(null),
  ]);

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
              href="/master/newsletter/subscribers"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Subscriber Directory
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Communications Engine
                </span>
                <h1 className="text-2xl font-bold text-foreground">
                  Newsletter Broadcasts &amp; Outcomes
                </h1>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Switcher Tabs (Task 95) */}
            <div className="flex items-center rounded-xl border border-border bg-surface-muted/30 p-1 text-xs">
              <Link
                href="/master/newsletter/campaigns?tab=library"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  currentTab === "library"
                    ? "bg-surface shadow-sm text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ListFilter className="h-3.5 w-3.5" />
                <span>Broadcast Library</span>
              </Link>
              <Link
                href="/master/newsletter/campaigns?tab=outcomes"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  currentTab === "outcomes"
                    ? "bg-surface shadow-sm text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BarChart2 className="h-3.5 w-3.5" />
                <span>Outcome Analytics</span>
              </Link>
            </div>

            <Link href="/master/newsletter/campaigns/new">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                <Plus className="h-4 w-4" />
                New Campaign
              </Button>
            </Link>
          </div>
        </div>

        {currentTab === "outcomes" && outcomeData ? (
          /* Task 95: Campaign Status and Outcome Dashboard */
          <CampaignOutcomeDashboard data={outcomeData} />
        ) : (
          /* Broadcast Library View */
          <>
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
                    href={
                      queryParams.toString()
                        ? `/master/newsletter/campaigns?${queryParams.toString()}`
                        : "/master/newsletter/campaigns"
                    }
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-surface-muted text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Campaign Cards List */}
            {campaigns.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-muted-foreground">
                  <Send className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">
                    No campaigns found
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {statusParam
                      ? `There are currently no campaigns marked as "${statusParam}".`
                      : "Create your first broadcast draft to start connecting with your audience."}
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/master/newsletter/campaigns/new">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Plus className="h-4 w-4" />
                      Create Campaign
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {campaigns.map((c) => {
                  const statusColors: Record<string, string> = {
                    DRAFT: "bg-surface-muted text-muted-foreground border-border",
                    SCHEDULED:
                      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                    SENT: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                    CANCELLED:
                      "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
                  };

                  return (
                    <div
                      key={c.id}
                      className="rounded-2xl border border-border bg-surface p-5 transition-all hover:border-primary/40 hover:shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <h3 className="text-base font-bold text-foreground">
                              {c.title}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                statusColors[c.status] || "bg-surface-muted"
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-primary">
                            Subject: {c.subject}
                          </p>
                          {c.preheader && (
                            <p className="text-xs text-muted-foreground italic">
                              Preheader: {c.preheader}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                          <Link href={`/master/newsletter/campaigns/${c.id}`}>
                            <Button variant="outline" size="sm" className="text-xs">
                              Manage Broadcast
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] text-muted-foreground border-t border-border pt-3">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            Created:{" "}
                            {new Date(c.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        {c.scheduledAt && c.status === "SCHEDULED" && (
                          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              Scheduled for:{" "}
                              {new Date(c.scheduledAt).toLocaleString("en-GB", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}

                        {c.sentAt && c.status === "SENT" && (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>
                              Dispatched:{" "}
                              {new Date(c.sentAt).toLocaleString("en-GB", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}

                        <div className="ml-auto flex items-center gap-1">
                          <span className="font-semibold text-foreground">
                            {c._count.deliveries}
                          </span>
                          <span>recipients tracked</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
                <span>
                  Showing page {page} of {totalPages} ({total} campaigns total)
                </span>
                <div className="flex items-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/master/newsletter/campaigns?page=${page - 1}${
                        statusParam ? `&status=${statusParam}` : ""
                      }`}
                    >
                      <Button variant="outline" size="sm" className="gap-1 text-xs">
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Previous
                      </Button>
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={`/master/newsletter/campaigns?page=${page + 1}${
                        statusParam ? `&status=${statusParam}` : ""
                      }`}
                    >
                      <Button variant="outline" size="sm" className="gap-1 text-xs">
                        Next
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
