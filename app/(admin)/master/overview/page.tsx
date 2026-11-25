import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  Users,
  ShieldAlert,
  FileText,
  UserCheck,
  MessageSquare,
  Sparkles,
  Mail,
  ExternalLink,
  ChevronRight,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { requireAuthOrRedirect, getUserRolesAndPermissions } from "@/features/auth/rbac";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function MasterOverviewPage() {
  const { user } = await requireAuthOrRedirect();
  const roleInfo = await getUserRolesAndPermissions(user.id);

  // Aggregate high-level operational counts
  const [leadCount, conversationCount, subscriberCount, contentRevisionCount] = await Promise.all([
    db.lead.count().catch(() => 0),
    db.chatConversation.count().catch(() => 0),
    db.newsletterSubscriber.count().catch(() => 0),
    db.contentRevision.count().catch(() => 0),
  ]);

  const primaryRole = roleInfo.isSuperAdmin
    ? "SUPER_ADMIN"
    : roleInfo.roles[0] || "ADMIN";

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      {/* 15-minute Inactivity Guard */}
      <SessionInactivityGuard />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-xl shadow-md">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  /master Operations Console
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Live
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Operations &amp; CMS Overview
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Public Website</span>
              </Button>
            </Link>
            <SignOutButton />
          </div>
        </header>

        {/* User Session Banner */}
        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Authenticated Administrator
              </span>
            </div>
            <h2 className="text-lg font-bold text-foreground">
              {user.displayName || user.email}
            </h2>
            <p className="text-xs text-muted-foreground font-mono">
              {user.email} &bull; User ID: {user.id.slice(0, 12)}...
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

        {/* Operations Modules Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Administrative Modules
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. CMS Content Hub */}
            <Link
              href="/master/content"
              className="group p-5 rounded-2xl border border-surface-border bg-surface hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {contentRevisionCount} Revisions
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    Content Management (CMS)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Manage services, product showcases, client portfolio, and testimonials with instant revision rollback.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Open Content Hub</span>
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 2. CRM Leads */}
            <Link
              href="/master/leads"
              className="group p-5 rounded-2xl border border-surface-border bg-surface hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {leadCount} Leads
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    CRM Leads &amp; Inquiries
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    View incoming leads from the contact form, floating hub, and Tony AI qualification with source attribution.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Open CRM Console</span>
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. Tony AI Conversations */}
            <Link
              href="/master/conversations"
              className="group p-5 rounded-2xl border border-surface-border bg-surface hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {conversationCount} Sessions
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    Tony AI Conversations
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Audit visitor chat sessions, latency, token consumption, intent transitions, and human handoff requests.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-primary">
                <span>View Transcripts</span>
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 4. Tony Prompts & Policy */}
            <Link
              href="/master/tony/prompts"
              className="group p-5 rounded-2xl border border-surface-border bg-surface hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    v1.0.0 Active
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    Tony Prompts &amp; Safety
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Inspect immutable platform safety guardrails, versioned system prompts, token budgets, and rollback controls.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Manage Prompts</span>
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 5. Newsletter Campaigns */}
            <Link
              href="/master/newsletter"
              className="group p-5 rounded-2xl border border-surface-border bg-surface hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {subscriberCount} Subscribers
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    Newsletter Campaigns
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Manage Brevo subscriber lists, double opt-in verification, campaign dispatches, and delivery webhooks.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Audience &amp; Campaigns</span>
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 6. Security & Inactivity Policy */}
            <div className="p-5 rounded-2xl border border-surface-border bg-surface flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    Enforced
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground">
                    Security &amp; Inactivity Policy
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    15-minute idle session revocation, advisory warning at 14 minutes, and immutable Super Admin protection.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>15-Min Inactivity Auto-Expiry</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
