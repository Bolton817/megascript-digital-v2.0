import React from "react";
import Link from "next/link";
import { getAllTestimonials } from "@/server/services/cms/testimonials";
import { TestimonialManagerClient } from "@/components/admin/TestimonialManagerClient";
import { Button } from "@/components/ui/Button";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { MessageSquare, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MasterTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <SessionInactivityGuard />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/master/content"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Content Hub</span>
              </Link>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Testimonials
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Manage Client Testimonials
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Truthful client reviews, recorded written approval evidence, and publication moderation in compliance with TDD Sheet 063.
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
        <TestimonialManagerClient initialTestimonials={testimonials} />
      </div>
    </div>
  );
}
