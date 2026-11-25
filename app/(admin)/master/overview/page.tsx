import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  Users,
  FileText,
  UserCheck,
  MessageSquare,
  Sparkles,
  Mail,
  ExternalLink,
  ChevronRight,
  Activity,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Layers,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { requireAuthOrRedirect, getUserRolesAndPermissions } from "@/features/auth/rbac";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function MasterOverviewPage() {
  const { user } = await requireAuthOrRedirect();
  const roleInfo = await getUserRolesAndPermissions(user.id);

  // Parallel database analytics & activity queries
  const [
    totalLeads,
    newLeads,
    leads,
    totalConversations,
    handoffsCount,
    conversations,
    publishedServices,
    totalServices,
    publishedProducts,
    publishedPortfolio,
    approvedTestimonials,
    subscribersCount,
    recentRevisions,
  ] = await Promise.all([
    db.lead.count().catch(() => 0),
    db.lead.count({ where: { status: "NEW" } }).catch(() => 0),
    db.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
    db.chatConversation.count().catch(() => 0),
    db.chatConversation.count({ where: { status: "HANDOFF_REQUESTED" } }).catch(() => 0),
    db.chatConversation.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { role: true, content: true, createdAt: true },
        },
      },
    }).catch(() => []),
    db.service.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
    db.service.count().catch(() => 0),
    db.product.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
    db.portfolioProject.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
    db.testimonial.count({ where: { isApproved: true, status: "PUBLISHED" } }).catch(() => 0),
    db.newsletterSubscriber.count({ where: { status: "CONFIRMED" } }).catch(() => 0),
    db.contentRevision.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { displayName: true, email: true } },
      },
    }).catch(() => []),
  ]);

  const primaryRole = roleInfo.isSuperAdmin
    ? "SUPER_ADMIN"
    : roleInfo.roles[0] || "ADMIN";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome & Administrator Session Bar */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Operations Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {user.displayName || user.email.split("@")[0]}
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            {user.email} &bull; Signed in via Better Auth &bull; 15-Minute Inactivity Protection
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            Role: {primaryRole}
          </span>
          {user.isProtected && (
            <span className="text-xs px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Protected Account
            </span>
          )}
        </div>
      </div>

      {/* 2. Key Operational Metrics (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: CRM Leads */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Inquiries
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {totalLeads}
            </span>
            {newLeads > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                {newLeads} New
              </span>
            )}
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Contact, Chat &amp; Hub</span>
            <Link href="/master/leads" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
              <span>View</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Metric 2: Tony AI Chatbot */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tony AI Sessions
            </span>
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {totalConversations}
            </span>
            {handoffsCount > 0 ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                {handoffsCount} Handoffs
              </span>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                Resolved
              </span>
            )}
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Zero Emojis &bull; Grounded</span>
            <Link href="/master/conversations" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
              <span>Audits</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Metric 3: CMS Content Entities */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Published CMS Assets
            </span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {publishedServices + publishedProducts + publishedPortfolio}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              / {totalServices + publishedProducts + publishedPortfolio} Total
            </span>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Services, Products, Work</span>
            <Link href="/master/content" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
              <span>Manage</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Metric 4: Newsletter Subscribers */}
        <div className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Newsletter Audience
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {subscribersCount}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Double Opt-In
            </span>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Brevo Email Transport</span>
            <Link href="/master/newsletter/campaigns" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
              <span>Campaigns</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Dual Column Activity Streams & Operational Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Client Enquiries */}
        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Recent Client Inquiries
              </h2>
            </div>
            <Link href="/master/leads">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                <span>All Leads</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {leads.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-surface-muted/50 border border-dashed border-border text-xs text-muted-foreground">
              No incoming inquiries registered yet.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {leads.map((lead) => (
                <div key={lead.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground truncate">
                        {lead.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-muted text-muted-foreground border border-border">
                        {lead.sourceChannel}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {lead.email} {lead.topic ? `• ${lead.topic}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        lead.status === "NEW"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : lead.status === "CONTACTED"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          : "bg-surface-muted text-muted-foreground"
                      }`}
                    >
                      {lead.status}
                    </span>
                    <Link
                      href={`/master/leads/${lead.id}`}
                      className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
                      title="Inspect enquiry"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Tony AI Conversations */}
        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Recent Tony AI Conversations
              </h2>
            </div>
            <Link href="/master/conversations">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                <span>All Sessions</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {conversations.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-surface-muted/50 border border-dashed border-border text-xs text-muted-foreground">
              No chat conversations recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {conversations.map((c) => {
                const latestMsg = c.messages[0];
                return (
                  <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {c.id.slice(0, 10)}...
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                            c.status === "HANDOFF_REQUESTED"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-primary/10 text-primary border border-primary/20"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate max-w-sm">
                        {latestMsg?.content || "Session initialized"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {c.language.toUpperCase()}
                      </span>
                      <Link
                        href={`/master/conversations/${c.id}`}
                        className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
                        title="View conversation transcript"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. Quick Action Shortcuts & Platform Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/master/newsletter/campaigns/new"
          className="p-5 rounded-2xl border border-surface-border bg-surface hover:border-primary/40 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Campaign Action
            </span>
            <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              Dispatch Newsletter
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Compose, preview, and send transactional email campaign.
            </p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        <Link
          href="/master/tony/prompts"
          className="p-5 rounded-2xl border border-surface-border bg-surface hover:border-primary/40 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              AI Configuration
            </span>
            <h3 className="text-sm font-bold text-foreground group-hover:text-purple-600 transition-colors">
              Tony Prompts &amp; Safety
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Inspect immutable guardrails and versioned system prompts.
            </p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
        </Link>

        <div className="p-5 rounded-2xl border border-surface-border bg-surface flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Security Status
            </span>
            <h3 className="text-sm font-bold text-foreground">
              15-Min Inactivity Guard
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Server invalidates sessions after 15 min idle. Warning at 14 min.
            </p>
          </div>
          <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
        </div>
      </div>
    </div>
  );
}
