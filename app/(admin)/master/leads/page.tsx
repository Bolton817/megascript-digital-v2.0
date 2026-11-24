import React from "react";
import Link from "next/link";
import { requirePermission } from "@/features/auth/rbac";
import { getLeads, getLeadMetrics } from "@/server/services/crm/leads";
import { LeadStatus } from "@prisma/client";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { LeadStatusBadge } from "@/components/admin/leads/LeadStatusSelector";
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
  }>;
}

export default async function MasterLeadsPage({ searchParams }: LeadsPageProps) {
  // Enforce leads.read permission & inactivity tracking
  await requirePermission("leads.read", { isQualifyingActivity: true });

  const resolvedParams = await searchParams;
  const statusParam = resolvedParams.status;
  const search = resolvedParams.search || "";
  const page = parseInt(resolvedParams.page || "1", 10) || 1;

  const validStatus =
    statusParam && Object.values(LeadStatus).includes(statusParam as LeadStatus)
      ? (statusParam as LeadStatus)
      : undefined;

  const [metrics, result] = await Promise.all([
    getLeadMetrics(),
    getLeads({
      status: validStatus,
      search,
      page,
      pageSize: 15,
    }),
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

  const currentTab = statusParam || "ALL";

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

          <div className="flex items-center gap-3">
            <Link href="/master/content">
              <Button variant="outline" size="sm">
                Content Hub
              </Button>
            </Link>
            <Link href="/master/overview">
              <Button variant="outline" size="sm">
                Console Overview
              </Button>
            </Link>
          </div>
        </header>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <span className="text-xs text-muted-foreground uppercase font-semibold">
              Total Leads
            </span>
            <div className="text-2xl font-extrabold text-foreground mt-1">
              {metrics.totalLeads}
            </div>
          </div>
          <div className="rounded-2xl border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/40 p-4 shadow-sm">
            <span className="text-xs text-sky-700 dark:text-sky-300 uppercase font-semibold">
              New Uncontacted
            </span>
            <div className="text-2xl font-extrabold text-sky-700 dark:text-sky-300 mt-1">
              {metrics.newLeads}
            </div>
          </div>
          <div className="rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/40 p-4 shadow-sm">
            <span className="text-xs text-purple-700 dark:text-purple-300 uppercase font-semibold">
              In Qualification
            </span>
            <div className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 mt-1">
              {metrics.qualifiedLeads}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-4 shadow-sm">
            <span className="text-xs text-emerald-700 dark:text-emerald-300 uppercase font-semibold">
              Won / Converted
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
              {metrics.wonLeads}
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Form */}
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm space-y-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-3">
            {statusTabs.map((tab) => {
              const isActive = currentTab === tab.id;
              const href =
                tab.id === "ALL"
                  ? `/master/leads${search ? `?search=${encodeURIComponent(search)}` : ""}`
                  : `/master/leads?status=${tab.id}${
                      search ? `&search=${encodeURIComponent(search)}` : ""
                    }`;

              return (
                <Link
                  key={tab.id}
                  href={href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-subtle"
                  }`}
                >
                  {tab.label}
                  {typeof tab.count === "number" && (
                    <span
                      className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-surface-border text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search Bar Form */}
          <form method="GET" action="/master/leads" className="flex items-center gap-2">
            {validStatus && (
              <input type="hidden" name="status" value={validStatus} />
            )}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by name, email, reference code, or topic..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button type="submit" variant="primary" size="sm">
              Search
            </Button>
            {search && (
              <Link
                href={
                  validStatus
                    ? `/master/leads?status=${validStatus}`
                    : "/master/leads"
                }
              >
                <Button type="button" variant="outline" size="sm">
                  Clear
                </Button>
              </Link>
            )}
          </form>
        </div>

        {/* Leads Data Table */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-muted-foreground font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Client Name &amp; Email</th>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Received</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground/50" />
                        <span className="font-semibold text-sm">
                          No enquiry records found
                        </span>
                        <span className="text-xs max-w-sm">
                          {search || statusParam
                            ? "Try adjusting your search query or status filter."
                            : "New website contact enquiries will automatically appear here."}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const formattedDate = new Intl.DateTimeFormat("en-KE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(lead.createdAt));

                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-surface-subtle/60 transition-colors"
                      >
                        {/* Reference Code */}
                        <td className="py-3 px-4 font-mono font-bold text-primary">
                          <Link
                            href={`/master/leads/${lead.id}`}
                            className="hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
                          >
                            {lead.referenceCode}
                          </Link>
                        </td>

                        {/* Name & Email */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-foreground">
                            {lead.name}
                          </div>
                          <div className="text-muted-foreground text-[11px]">
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="text-muted-foreground text-[10px]">
                              {lead.phone}
                            </div>
                          )}
                        </td>

                        {/* Topic */}
                        <td className="py-3 px-4">
                          <span className="font-medium text-foreground">
                            {lead.topic}
                          </span>
                          <span className="text-muted-foreground block text-[10px] truncate max-w-[220px]">
                            {lead.message}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <LeadStatusBadge status={lead.status} />
                        </td>

                        {/* Assigned To */}
                        <td className="py-3 px-4 text-muted-foreground">
                          {lead.assignedUser ? (
                            <span className="inline-flex items-center gap-1 font-medium text-foreground">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              {lead.assignedUser.name || lead.assignedUser.email}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/60 italic">
                              Unassigned
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                          {formattedDate}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <Link href={`/master/leads/${lead.id}`}>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              Manage
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border bg-surface-subtle">
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages} ({totalCount} total)
              </span>
              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Link
                    href={`/master/leads?page=${page - 1}${
                      validStatus ? `&status=${validStatus}` : ""
                    }${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  >
                    <Button variant="outline" size="sm" className="gap-1">
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>Previous</span>
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" disabled className="gap-1">
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </Button>
                )}

                {page < totalPages ? (
                  <Link
                    href={`/master/leads?page=${page + 1}${
                      validStatus ? `&status=${validStatus}` : ""
                    }${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  >
                    <Button variant="outline" size="sm" className="gap-1">
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" disabled className="gap-1">
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
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
