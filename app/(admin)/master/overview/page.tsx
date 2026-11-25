import Link from "next/link";
import { ShieldCheck, Clock, Users, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";

export default function MasterOverviewPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      {/* 15-minute Inactivity Guard */}
      <SessionInactivityGuard />

      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-black text-lg shadow-sm">
              M
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                /master Operations Console
              </span>
              <h1 className="text-2xl font-bold text-foreground">
                Overview &amp; Security Policy
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/master/leads">
              <Button variant="primary" size="sm">
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
            <Link href="/master/login">
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Session Status */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-2">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              <span>Session Active</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Better Auth session verified with server-side allowlist enforcement.
            </p>
          </div>

          {/* Card 2: 15-Minute Inactivity Policy */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-2">
              <Clock className="h-5 w-5" aria-hidden="true" />
              <span>15-Min Inactivity Expiry</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Server invalidates sessions after 15 minutes of idle time. Advisory modal warns at 14 minutes.
            </p>
          </div>

          {/* Card 3: RBAC & Protected Account */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm mb-2">
              <Users className="h-5 w-5" aria-hidden="true" />
              <span>RBAC &amp; Protected Account</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Super Admin, Admin, Editor, Marketing Manager, Analyst roles enforced. Primary Super Admin is immutable.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Stage 06 Security &amp; RBAC Baseline
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The session inactivity engine, role-based access control (RBAC), and immutable account safeguards are active and enforced at the database and serverless API boundaries.
          </p>
          <div className="p-4 rounded-xl bg-surface-muted border border-border flex items-start gap-3 text-xs text-muted-foreground">
            <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground">Immutable Super Administrator:</strong> The account <code className="font-mono text-primary">megascriptdigital@gmail.com</code> is protected against deletion, deactivation, suspension, and demotion.
            </div>
          </div>
        </div>

        {/* Stage 12 CRM & Lead Management Card */}
        <div className="rounded-2xl border border-primary/20 bg-primary-subtle/30 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Stage 12 CRM Operations
            </span>
            <h2 className="text-lg font-bold text-foreground">
              Lead Capture &amp; Client Enquiries
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              Manage incoming website enquiries, review full client messages, track lifecycle status, assign internal team owners, and maintain an audit trail of internal notes.
            </p>
          </div>
          <Link href="/master/leads">
            <Button variant="primary" size="md" className="shrink-0">
              Open CRM Console &rarr;
            </Button>
          </Link>
        </div>

        {/* Stage 13 Newsletter & Transactional Email Card */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Stage 13 Marketing &amp; Email
            </span>
            <h2 className="text-lg font-bold text-foreground">
              Newsletter &amp; Broadcast Campaigns
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              Double opt-in subscribers, welcome onboarding sequence, Brevo transactional delivery tracking, campaign drafts, preview test sends, and webhook bounce handling.
            </p>
          </div>
          <Link href="/master/newsletter">
            <Button variant="primary" size="md" className="shrink-0">
              Open Newsletter Hub &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
