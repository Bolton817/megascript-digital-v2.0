"use client";

import React, { useState } from "react";
import { PrivacyRequest, PrivacyRequestStatus } from "@prisma/client";
import { PrivacyRequestDrawer } from "./PrivacyRequestDrawer";
import { DataInventoryView } from "./DataInventoryView";
import { getPrivacyRequestsAction } from "@/server/actions/privacy";
import {
  Shield,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Database,
  ExternalLink,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

interface PrivacyDashboardClientProps {
  initialData: {
    requests: PrivacyRequest[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
    };
    metrics: {
      total: number;
      pending: number;
      verifying: number;
      processing: number;
      resolved: number;
      declined: number;
      overdue: number;
    };
  };
}

export function PrivacyDashboardClient({ initialData }: PrivacyDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"queue" | "inventory">("queue");
  const [data, setData] = useState(initialData);
  const [statusFilter, setStatusFilter] = useState<PrivacyRequestStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PrivacyRequest | null>(null);

  const refreshData = async (newStatus = statusFilter, newSearch = search) => {
    setIsLoading(true);
    try {
      const res = await getPrivacyRequestsAction({
        status: newStatus,
        search: newSearch,
        page: 1,
      });
      if (res.success && res.data) {
        setData(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusFilterChange = (newStatus: PrivacyRequestStatus | "ALL") => {
    setStatusFilter(newStatus);
    refreshData(newStatus, search);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refreshData(statusFilter, search);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Trust & Compliance
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              KDPA 2019
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
            Privacy Rights & Data Governance
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage data subject rights requests, statutory SLA deadlines, and sub-processor inventories.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-subtle border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("queue")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "queue"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Requests Queue</span>
            {data.metrics.pending > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600">
                {data.metrics.pending}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "inventory"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Database className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Data Inventory & Processors</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border bg-surface p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Total Requests
          </span>
          <div className="text-2xl font-black text-foreground">{data.metrics.total}</div>
          <span className="text-[11px] text-muted-foreground">All time registered</span>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Pending Action
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {data.metrics.pending}
          </div>
          <span className="text-[11px] text-muted-foreground">Awaiting initial review</span>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            In Processing
          </span>
          <div className="text-2xl font-black text-primary">
            {data.metrics.verifying + data.metrics.processing}
          </div>
          <span className="text-[11px] text-muted-foreground">Verification & fulfillment</span>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Resolved
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {data.metrics.resolved}
          </div>
          <span className="text-[11px] text-muted-foreground">Completed cases</span>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            SLA Overdue
          </span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {data.metrics.overdue}
          </div>
          <span className="text-[11px] text-muted-foreground">&gt; 21 days unresolved</span>
        </div>
      </div>

      {activeTab === "inventory" ? (
        <DataInventoryView />
      ) : (
        /* Requests Queue View */
        <div className="space-y-4">
          {/* Controls Bar: Filters & Search */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(["ALL", "PENDING", "VERIFYING", "PROCESSING", "RESOLVED", "DECLINED"] as const).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusFilterChange(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      statusFilter === st
                        ? "bg-primary text-white shadow-sm"
                        : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search code, email, name..."
                className="w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            </form>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-subtle border-b border-border text-foreground font-bold">
                <tr>
                  <th className="p-3.5">Reference Code</th>
                  <th className="p-3.5">Requester</th>
                  <th className="p-3.5">Request Type</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Statutory Due Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted-foreground">
                {data.requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No privacy rights requests found matching the active filter.
                    </td>
                  </tr>
                ) : (
                  data.requests.map((req) => {
                    const isDueSoon =
                      new Date(req.dueAt).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;
                    const isOverdue =
                      new Date(req.dueAt) < new Date() &&
                      ["PENDING", "VERIFYING", "PROCESSING"].includes(req.status);

                    return (
                      <tr key={req.id} className="hover:bg-surface-subtle/50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-primary">
                          {req.referenceCode}
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-foreground">{req.requesterName}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {req.requesterEmail}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-surface-border text-foreground">
                            {req.requestType}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                              req.status === "RESOLVED"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : req.status === "DECLINED"
                                ? "bg-rose-500/10 text-rose-600"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div
                            className={`font-mono text-[11px] ${
                              isOverdue
                                ? "font-bold text-rose-600"
                                : isDueSoon
                                ? "font-bold text-amber-600"
                                : "text-foreground"
                            }`}
                          >
                            {new Date(req.dueAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {isOverdue ? "Overdue" : "21-day KDPA"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(req)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-surface text-foreground font-semibold hover:bg-surface-muted transition-colors text-xs"
                          >
                            <span>Manage</span>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Case Management Drawer */}
      <PrivacyRequestDrawer
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onUpdated={() => {
          refreshData();
          setSelectedRequest(null);
        }}
      />
    </div>
  );
}
