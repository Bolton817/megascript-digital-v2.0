import React from "react";
import Link from "next/link";
import { requirePermission } from "@/features/auth/rbac";
import {
  listAdminConversations,
  getAdminConversationMetrics,
} from "@/server/services/tony/conversation";
import { ConversationStatus } from "@prisma/client";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { Button } from "@/components/ui/Button";
import {
  Bot,
  Search,
  Filter,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  Phone,
} from "lucide-react";

interface ConversationsPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function MasterConversationsPage({
  searchParams,
}: ConversationsPageProps) {
  // Enforce chat.read permission & inactivity tracking
  await requirePermission("chat.read", { isQualifyingActivity: true });

  const resolvedParams = await searchParams;
  const statusParam = resolvedParams.status;
  const search = resolvedParams.search || "";
  const page = parseInt(resolvedParams.page || "1", 10) || 1;

  const validStatus =
    statusParam &&
    Object.values(ConversationStatus).includes(statusParam as ConversationStatus)
      ? (statusParam as ConversationStatus)
      : undefined;

  const [metrics, result] = await Promise.all([
    getAdminConversationMetrics(),
    listAdminConversations({
      status: validStatus,
      search,
      page,
      pageSize: 15,
    }),
  ]);

  const { conversations, totalCount, totalPages } = result;

  const statusTabs: Array<{ id: string; label: string; count?: number }> = [
    { id: "ALL", label: "All Conversations", count: metrics.totalConversations },
    { id: ConversationStatus.ACTIVE, label: "Active", count: metrics.activeConversations },
    {
      id: ConversationStatus.HANDOFF_REQUESTED,
      label: "Handoff Requested",
      count: metrics.handoffConversations,
    },
    { id: ConversationStatus.CLOSED, label: "Closed", count: metrics.closedConversations },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <SessionInactivityGuard />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Link
              href="/master/overview"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-border text-foreground hover:bg-surface-muted transition-colors"
              title="Return to Master Overview"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Stage 14 AI Assistant
                </span>
                <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                  Mock Engine Live
                </span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Tony Conversations &amp; Transcripts
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/master/tony/prompts">
              <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10">
                Prompt &amp; Policy
              </Button>
            </Link>
            <Link href="/master/leads">
              <Button variant="outline" size="sm">
                CRM Leads
              </Button>
            </Link>
            <Link href="/master/newsletter">
              <Button variant="outline" size="sm">
                Newsletter
              </Button>
            </Link>
            <Link href="/master/content">
              <Button variant="outline" size="sm">
                Content Hub
              </Button>
            </Link>
            <Link href="/master/overview">
              <Button variant="outline" size="sm">
                Overview
              </Button>
            </Link>
          </div>
        </header>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span>Total Sessions</span>
            </div>
            <div className="text-2xl font-black text-foreground">
              {metrics.totalConversations}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Active</span>
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {metrics.activeConversations}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 mb-1">
              <Phone className="h-4 w-4" />
              <span>Handoffs</span>
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {metrics.handoffConversations}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span>Closed</span>
            </div>
            <div className="text-2xl font-black text-foreground">
              {metrics.closedConversations}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Bot className="h-4 w-4 text-primary" />
              <span>Total Messages</span>
            </div>
            <div className="text-2xl font-black text-foreground">
              {metrics.totalMessages}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 border-b sm:border-b-0 border-border">
            {statusTabs.map((tab) => {
              const isActive =
                (!statusParam && tab.id === "ALL") || statusParam === tab.id;
              const href =
                tab.id === "ALL"
                  ? `/master/conversations${search ? `?search=${encodeURIComponent(search)}` : ""}`
                  : `/master/conversations?status=${tab.id}${search ? `&search=${encodeURIComponent(search)}` : ""}`;

              return (
                <Link
                  key={tab.id}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
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

          {/* Search Form */}
          <form method="GET" action="/master/conversations" className="relative flex items-center">
            {statusParam && (
              <input type="hidden" name="status" value={statusParam} />
            )}
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search ID, hash, or message..."
              className="pl-9 pr-4 py-1.5 rounded-xl border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-64"
            />
          </form>
        </div>

        {/* Conversation List Table */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
          {conversations.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Bot className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-foreground">
                No conversations found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                {search
                  ? `No conversations match your search query "${search}". Try clearing search filters.`
                  : "No chat conversations have been recorded yet in this view."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-subtle/50 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Session / Visitor Hash</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Lang</th>
                    <th className="py-3 px-4">Messages</th>
                    <th className="py-3 px-4">Last Activity</th>
                    <th className="py-3 px-4">Latest Snippet</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {conversations.map((c) => {
                    const isHandoff = c.status === ConversationStatus.HANDOFF_REQUESTED;
                    const isActive = c.status === ConversationStatus.ACTIVE;

                    return (
                      <tr
                        key={c.id}
                        className="hover:bg-surface-muted/50 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-foreground">
                            {c.id.slice(0, 10)}...
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            hash: {c.visitorTokenHash.slice(0, 8)}...
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isHandoff
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                : isActive
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-muted text-muted-foreground border border-border"
                            }`}
                          >
                            {isHandoff
                              ? "Handoff Requested"
                              : isActive
                              ? "Active"
                              : "Closed"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="uppercase font-mono text-[10px] px-1.5 py-0.5 rounded border border-border bg-surface-subtle">
                            {c.language}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-foreground">
                          {c.messageCount}
                        </td>

                        <td className="py-3.5 px-4 text-muted-foreground text-[11px] whitespace-nowrap">
                          {new Date(c.updatedAt).toLocaleDateString()}{" "}
                          {new Date(c.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs truncate text-muted-foreground">
                          {c.lastMessage?.content || "No messages"}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Link href={`/master/conversations/${c.id}`}>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              Transcript &rarr;
                            </Button>
                          </Link>
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
            <div className="flex items-center justify-between p-4 border-t border-border text-xs text-muted-foreground">
              <span>
                Showing page {page} of {totalPages} ({totalCount} total)
              </span>
              <div className="flex items-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/master/conversations?page=${page - 1}${statusParam ? `&status=${statusParam}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  >
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <ChevronLeft className="h-3 w-3 mr-1" />
                      Previous
                    </Button>
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/master/conversations?page=${page + 1}${statusParam ? `&status=${statusParam}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  >
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Next
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
