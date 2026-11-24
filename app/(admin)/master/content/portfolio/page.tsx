import React from "react";
import Link from "next/link";
import { getAllPortfolioProjects } from "@/server/services/cms/portfolio";
import { PortfolioManagerClient } from "@/components/admin/PortfolioManagerClient";
import { Button } from "@/components/ui/Button";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { Layers, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MasterPortfolioPage() {
  const projects = await getAllPortfolioProjects();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-6 sm:p-12">
      <SessionInactivityGuard />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--border)] gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/master/content"
                className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Content Hub</span>
              </Link>
              <span className="text-xs text-[var(--muted-foreground)]">/</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                Portfolio Showcase
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Layers className="h-5 w-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Manage Portfolio Showcase
              </h1>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              Client case studies, homepage featured project toggles, and publication states.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/master/content">
              <Button variant="outline" size="sm">
                Back to Hub
              </Button>
            </Link>
          </div>
        </header>

        {/* Interactive Manager Table */}
        <PortfolioManagerClient initialProjects={projects} />
      </div>
    </div>
  );
}
