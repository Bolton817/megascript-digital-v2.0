import React from "react";
import Link from "next/link";
import { getAllServices } from "@/server/services/cms/services";
import { ServiceManagerClient } from "@/components/admin/ServiceManagerClient";
import { Button } from "@/components/ui/Button";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { Briefcase, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MasterServicesPage() {
  const services = await getAllServices();

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
                Services Catalog
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <div className="p-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <Briefcase className="h-5 w-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Manage Services Catalog
              </h1>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              Core &amp; Complementary service pages, publication status toggles, and instant cache revalidation.
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
        <ServiceManagerClient initialServices={services} />
      </div>
    </div>
  );
}
