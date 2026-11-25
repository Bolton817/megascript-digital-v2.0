import React from "react";
import Link from "next/link";
import { requirePermission } from "@/features/auth/rbac";
import { getSubscribers } from "@/server/services/newsletter/subscribers";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { SubscriberRowAction } from "@/components/admin/newsletter/SubscriberRowAction";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Search,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle2,
  Clock,
  UserX,
} from "lucide-react";

interface SubscribersPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function MasterSubscribersPage({ searchParams }: SubscribersPageProps) {
  await requirePermission("newsletter.read", { isQualifyingActivity: true });

  const resolvedParams = await searchParams;
  const statusParam = resolvedParams.status;
  const search = resolvedParams.search || "";
  const page = parseInt(resolvedParams.page || "1", 10) || 1;

  const result = await getSubscribers({
    status: statusParam,
    search,
    page,
    pageSize: 20,
  });

  const { subscribers, total, totalPages, statusCounts } = result;

  const statusTabs = [
    { id: "ALL", label: "All Records", count: statusCounts.ALL },
    { id: "CONFIRMED", label: "Confirmed", count: statusCounts.CONFIRMED },
    { id: "PENDING", label: "Pending Verification", count: statusCounts.PENDING },
    { id: "UNSUBSCRIBED", label: "Unsubscribed", count: statusCounts.UNSUBSCRIBED },
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  Audience Directory
                </span>
                <h1 className="text-2xl font-bold text-foreground">
                  Newsletter Subscribers
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a href="/api/newsletter/export" download>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-4 w-4" />
                Export CSV ({statusCounts.ALL})
              </Button>
            </a>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {statusTabs.map((tab) => {
            const isActive =
              (!statusParam && tab.id === "ALL") || statusParam === tab.id;
            const queryParams = new URLSearchParams();
            if (tab.id !== "ALL") queryParams.set("status", tab.id);
            if (search) queryParams.set("search", search);

            return (
              <Link
                key={tab.id}
                href={`/master/newsletter/subscribers?${queryParams.toString()}`}
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

        {/* Search Bar */}
        <form
          method="GET"
          action="/master/newsletter/subscribers"
          className="flex items-center gap-3"
        >
          {statusParam && <input type="hidden" name="status" value={statusParam} />}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by email or subscriber name..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button type="submit" variant="primary" size="sm">
            Search
          </Button>
          {search && (
            <Link
              href={`/master/newsletter/subscribers${
                statusParam ? `?status=${statusParam}` : ""
              }`}
            >
              <Button type="button" variant="outline" size="sm">
                Clear
              </Button>
            </Link>
          )}
        </form>

        {/* Subscribers Table */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
          {subscribers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm">
              No subscribers found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle border-b border-border text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Subscriber</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Consent Source</th>
                    <th className="px-4 py-3">Consent Timestamp</th>
                    <th className="px-4 py-3">Unsubscribed At</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {subscribers.map((sub) => {
                    const isConfirmed = sub.status === "CONFIRMED";
                    const isPending = sub.status === "PENDING";
                    const isUnsub = sub.status === "UNSUBSCRIBED";

                    return (
                      <tr key={sub.id} className="hover:bg-surface-subtle/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-mono text-foreground font-medium">
                            {sub.email}
                          </div>
                          {sub.name && (
                            <div className="text-[11px] text-muted-foreground">
                              {sub.name}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              isConfirmed
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                                : isPending
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                                : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700"
                            }`}
                          >
                            {isConfirmed && <CheckCircle2 className="h-3 w-3" />}
                            {isPending && <Clock className="h-3 w-3" />}
                            {isUnsub && <UserX className="h-3 w-3" />}
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                          {sub.consentSource}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(sub.consentTimestamp).toLocaleDateString("en-KE", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {sub.unsubscribeTimestamp
                            ? new Date(sub.unsubscribeTimestamp).toLocaleDateString("en-KE", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <SubscriberRowAction
                            subscriberEmail={sub.email}
                            currentStatus={sub.status}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing page {page} of {totalPages} ({total} subscribers)
              </span>
              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Link
                    href={`/master/newsletter/subscribers?page=${page - 1}${
                      statusParam ? `&status=${statusParam}` : ""
                    }${search ? `&search=${search}` : ""}`}
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
                    href={`/master/newsletter/subscribers?page=${page + 1}${
                      statusParam ? `&status=${statusParam}` : ""
                    }${search ? `&search=${search}` : ""}`}
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
