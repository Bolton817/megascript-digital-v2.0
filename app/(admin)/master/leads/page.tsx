import React from "react";
import Link from "next/link";
import { requirePermission, requireAuthOrRedirect, hasPermission, getUserRolesAndPermissions } from "@/features/auth/rbac";
import { getLeads, getLeadMetrics } from "@/server/services/crm/leads";
import { getLeadReportingMetrics } from "@/server/services/crm/reporting";
import { LeadStatus } from "@prisma/client";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { LeadStatusBadge } from "@/components/admin/leads/LeadStatusSelector";
import { LeadsHeaderActions } from "@/components/admin/leads/LeadsHeaderActions";
import { LeadReportingDashboard } from "@/components/admin/leads/LeadReportingDashboard";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Search,
  Filter,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface LeadsPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
    tab?: string;
  }>;
}

export default async function MasterLeadsPage({ searchParams }: LeadsPageProps) {
  // Enforce leads.read permission & inactivity tracking
  await requirePermission("leads.read", { isQualifyingActivity: true });

  const { user } = await requireAuthOrRedirect();
  const roleInfo = await getUserRolesAndPermissions(user.id);
  const canExport = await hasPermission(user.id, "leads.export");

  const resolvedParams = await searchParams;
  const statusParam = resolvedParams.status;
  const search = resolvedParams.search || "";
  const page = parseInt(resolvedParams.page || "1", 10) || 1;
  const currentTab = (resolvedParams.tab === "reporting" ? "reporting" : "list") as "list" | "reporting";

  const validStatus =
    statusParam && Object.values(LeadStatus).includes(statusParam as LeadStatus)
      ? (statusParam as LeadStatus)
      : undefined;

  const [metrics, result, reportingData] = await Promise.all([
    getLeadMetrics(),
    getLeads({
      status: validStatus,
      search,
      page,
      pageSize: 15,
    }),
    currentTab === "reporting" ? getLeadReportingMetrics(30) : Promise.resolve(null),
  ]);

  const { leads, totalCount, totalPages } = result;

  const statusTabs: Array<{ id: string; label: string; count?: number }> = [
    { id: "ALL", label: "All Enquiries", count: metrics.totalLeads },
    { id: LeadStatus.NEW, label: "New", count: metrics.newLeads },
    { id: LeadStatus.CONTACTED, label: "Contacted", count: metrics.contactedLeads },
    { id: LeadStatus.QUALIFIED, label: "Qualified", count: metrics.qualifiedLeads },
    { id: LeadStatus.PROPOSAL_SENT, label: "Proposal Sent" },
    { id: LeadStatus.WON, label: "Won", count: metrics.wonLeads },
    { id: LeadStatus.LOST, label: "Lost" },
    { id: LeadStatus.SPAM, label: "Spam" },
    { id: LeadStatus.CLOSED, label: "Closed" },
  ];

  const currentStatusTab = statusParam || "ALL";

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-12">
      <SessionInactivityGuard />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation / Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Link
              href="/master/overview"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface border border-border transition-colors"
              title="Back to Overview"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  /master CRM
                </span>
                <span className="text-xs text-muted-foreground">&bull;</span>
                <span className="text-xs text-muted-foreground">
                  {totalCount} Total Enquiries
                </span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Lead Management &amp; Client Enquiries
              </h1>
            </div>
          </div>

          {/* Action Toolbar with Tab Switcher & Export (Tasks 96 & 98) */}
          <LeadsHeaderActions currentTab={currentTab} userCanExport={canExport} />
        </header>

        {currentTab === "reporting" && reportingData ? (
          /* Task 96: Performance & Source Reporting Dashboard */
          <LeadReportingDashboard
            data={reportingData}
            isAnalystView={!canExport && roleInfo.roles.includes("ANALYST" as any)}
          />
        ) : (
          /* Inquiry Workspace List */
          <>
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  Total Leads
                </span>
                <div className="text-2xl font-black text-foreground mt-1">
                  {metrics.totalLeads}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  New Uncontacted
                </span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {metrics.newLeads}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  Qualified Pipeline
                </span>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                  {metrics.qualifiedLeads}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  Won Deals
                </span>
                <div className="text-2xl font-black text-primary mt-1">
                  {metrics.wonLeads}
                </div>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border text-xs">
              {statusTabs.map((tab) => {
                const isActive = currentStatusTab === tab.id;
                const href =
                  tab.id === "ALL"
                    ? "/master/leads"
                    : `/master/leads?status=${tab.id}${search ? `&search=${encodeURIComponent(search)}` : ""}`;

                return (
                  <Link
                    key={tab.id}
                    href={href}
                    className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-muted"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {typeof tab.count === "number" && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-surface-muted text-muted-foreground"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Search Input Bar */}
            <form method="GET" action="/master/leads" className="flex items-center gap-3">
              {validStatus && <input type="hidden" name="status" value={validStatus} />}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search by client name, email, or reference code..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button type="submit" variant="outline" size="sm" className="text-xs">
                Filter
              </Button>
              {search && (
                <Link
                  href={validStatus ? `/master/leads?status=${validStatus}` : "/master/leads"}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Link>
              )}
            </form>

            {/* Leads Table */}
            <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm">
              {leads.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <div className="mx-auto w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center text-muted-foreground">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">No enquiries found</h3>
                  <p className="text-xs text-muted-foreground">
                    {search
                      ? "Try refining your search terms or status filter."
                      : "No customer leads registered in this category yet."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-surface-muted/40 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
                        <th className="py-3 px-4">Reference &amp; Contact</th>
                        <th className="py-3 px-4">Topic &amp; Message</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Channel / Attribution</th>
                        <th className="py-3 px-4">Assignee</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {leads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="hover:bg-surface-muted/30 transition-colors group"
                        >
                          {/* Reference & Contact */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <span className="font-mono text-[10px] font-bold text-primary block">
                                {lead.referenceCode}
                              </span>
                              <span className="font-semibold text-foreground block">
                                {lead.name}
                              </span>
                              <span className="text-[11px] text-muted-foreground block">
                                {lead.email}
                              </span>
                            </div>
                          </td>

                          {/* Topic & Message */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="space-y-1">
                              <span className="font-semibold text-foreground block truncate">
                                {lead.topic}
                              </span>
                              <p className="text-[11px] text-muted-foreground line-clamp-2">
                                {lead.message}
                              </p>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <LeadStatusBadge status={lead.status} />
                          </td>

                          {/* Channel / Attribution */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-muted text-muted-foreground border border-border inline-block capitalize">
                                {lead.sourceChannel.replace(/-/g, " ")}
                              </span>
                              {lead.utmAttribution?.utmCampaign && (
                                <span className="text-[10px] text-muted-foreground block truncate">
                                  Camp: {lead.utmAttribution.utmCampaign}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Assignee */}
                          <td className="py-3.5 px-4 text-muted-foreground">
                            {lead.assignedUser?.name || "Unassigned"}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <Link
                              href={`/master/leads/${lead.id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-foreground hover:bg-surface-muted transition-colors font-medium text-[11px]"
                            >
                              <span>Manage</span>
                              <ChevronRight className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
                <span>
                  Showing page {page} of {totalPages} ({totalCount} total)
                </span>
                <div className="flex items-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/master/leads?page=${page - 1}${validStatus ? `&status=${validStatus}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                    >
                      <Button variant="outline" size="sm" className="gap-1 text-xs">
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Previous
                      </Button>
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={`/master/leads?page=${page + 1}${validStatus ? `&status=${validStatus}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
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
