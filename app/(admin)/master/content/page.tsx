import React from "react";
import Link from "next/link";
import { db } from "@/server/db";
import {
  FileText,
  Briefcase,
  Layers,
  Sparkles,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Eye,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";

export const dynamic = "force-dynamic";

export default async function MasterContentHubPage() {
  // Aggregate CMS metrics
  const [
    servicesCount,
    servicesPublishedCount,
    productsCount,
    productsPublishedCount,
    portfolioCount,
    portfolioFeaturedCount,
    testimonialsCount,
    testimonialsApprovedCount,
    pagesCount,
    recentRevisions,
  ] = await Promise.all([
    db.service.count(),
    db.service.count({ where: { status: "PUBLISHED" } }),
    db.product.count(),
    db.product.count({ where: { status: "PUBLISHED" } }),
    db.portfolioProject.count(),
    db.portfolioProject.count({ where: { isFeatured: true, status: "PUBLISHED" } }),
    db.testimonial.count(),
    db.testimonial.count({ where: { isApproved: true, status: "PUBLISHED" } }),
    db.page.count(),
    db.contentRevision.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            displayName: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <SessionInactivityGuard />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/master/overview"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
              >
                /master Operations
              </Link>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Content Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              CMS Content Management &amp; Revisions
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage live services, independent products, portfolio showcase, testimonials, and audit revisions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/api/preview?path=/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                <span>Enter Draft Preview</span>
              </Button>
            </Link>
            <Link href="/master/overview">
              <Button variant="outline" size="sm">
                Console Overview
              </Button>
            </Link>
          </div>
        </header>

        {/* CMS Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Module 1: Services Catalog */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between hover:border-primary transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Briefcase className="h-6 w-6" />
                </div>
                <Badge variant="outline" size="sm">
                  {servicesPublishedCount}/{servicesCount} Published
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold">Services Catalog</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  3 Core services and 4 Complementary services with descriptions, categories, and SEO metadata.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-border mt-6 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                {servicesCount} Active Records
              </span>
              <Link href="/master/content/services">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  <span>Manage</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Module 2: Portfolio Showcase */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between hover:border-primary transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Layers className="h-6 w-6" />
                </div>
                <Badge variant="outline" size="sm">
                  {portfolioFeaturedCount} Featured on Home
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold">Portfolio Showcase</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  11 Client engagements. Enforces strict zero-screenshot and zero-tech-stack-label policy.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-border mt-6 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                {portfolioCount} Total Projects
              </span>
              <Link href="/master/content/portfolio">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  <span>Manage</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Module 3: Independent Products */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between hover:border-primary transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-6 w-6" />
                </div>
                <Badge variant="outline" size="sm">
                  {productsPublishedCount}/{productsCount} Live
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold">Independent Products</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Fortress (AI Builder), LeaseFlow, UzaDigital, and FM Scheduler independent landing profiles.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-border mt-6 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                {productsCount} SaaS Products
              </span>
              <Link href="/master/content/products">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  <span>Manage</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Module 4: Client Testimonials */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <Badge variant="outline" size="sm">
                  {testimonialsApprovedCount} Approved
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold">Testimonials</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Verified client feedback with recorded approval evidence and display ordering.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-border mt-6 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                {testimonialsCount} Total Records
              </span>
              <Link href="/master/content/testimonials">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  <span>Manage</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Module 5: Static Pages */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <FileText className="h-6 w-6" />
                </div>
                <Badge variant="outline" size="sm">
                  {pagesCount} Pages
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold">Static &amp; Policy Pages</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Terms, Privacy Notice, Cookie Policy, and standalone informational landing routes.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-border mt-6 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                App Router
              </span>
              <Badge variant="neutral" size="sm">
                Zero Leakage
              </Badge>
            </div>
          </div>

          {/* Module 6: Revision & Rollback Engine */}
          <div className="rounded-2xl border border-border bg-surface-muted p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-foreground/5 text-foreground">
                  <History className="h-6 w-6" />
                </div>
                <Badge variant="primary" size="sm">
                  Immutable
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold">Revision History</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Every change to services, products, pages, and portfolio creates a versioned snapshot with rollback capability.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-border mt-6 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono">ContentRevision</span>
              <span>Automated</span>
            </div>
          </div>
        </div>

        {/* Recent Revision Log */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Recent Content Revisions</h2>
            </div>
            <span className="text-xs text-muted-foreground">
              Showing last {recentRevisions.length} records
            </span>
          </div>

          {recentRevisions.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4">
              No content revisions recorded yet. Edits made in CMS modules will appear here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-2.5 font-semibold">Entity Type</th>
                    <th className="py-2.5 font-semibold">Version</th>
                    <th className="py-2.5 font-semibold">Author</th>
                    <th className="py-2.5 font-semibold">Timestamp</th>
                    <th className="py-2.5 font-semibold">Entity ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentRevisions.map((rev) => (
                    <tr key={rev.id} className="hover:bg-surface-muted transition-colors">
                      <td className="py-3 font-semibold">
                        <Badge variant="outline" size="sm">
                          {rev.entityType}
                        </Badge>
                      </td>
                      <td className="py-3 font-mono font-bold text-primary">
                        v{rev.version}
                      </td>
                      <td className="py-3 text-foreground">
                        {rev.user?.displayName || rev.user?.email || "System"}
                      </td>
                      <td className="py-3 text-muted-foreground font-mono">
                        {rev.createdAt.toLocaleString("en-GB", { timeZone: "Africa/Nairobi" })} EAT
                      </td>
                      <td className="py-3 font-mono text-muted-foreground truncate max-w-[120px]">
                        {rev.entityId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Security & Zero Leakage Policy Note */}
        <div className="p-4 rounded-xl bg-surface-muted border border-border flex items-start gap-3 text-xs text-muted-foreground">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-foreground">
              Zero Draft Leakage &amp; RBAC Boundary:
            </strong>
            <p>
              Public queries automatically filter items with status <code className="font-mono text-primary">DRAFT</code> or <code className="font-mono text-primary">ARCHIVED</code>. Users with the <code className="font-mono text-primary">EDITOR</code> role can write and publish content, but are strictly barred from modifying users, roles, or security settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
