import React from "react";
import Link from "next/link";
import { PortfolioProjectData } from "@/config/portfolio-data";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

interface PortfolioScopeBreakdownProps {
  project: PortfolioProjectData;
}

export function PortfolioScopeBreakdown({ project }: PortfolioScopeBreakdownProps) {
  return (
    <Section spacing="lg" variant="default" id="scope-breakdown">
      <Container size="lg">
        <div className="max-w-4xl space-y-12">
          {/* Challenge & Outcome Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Operational Challenge */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>The Challenge</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Operational Friction Before Engagement
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {project.challengeSummary}
              </p>
            </div>

            {/* The Business Outcome */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>The Result</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Delivered Operational Impact
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {project.businessOutcome}
              </p>
            </div>
          </div>

          {/* Detailed Delivered Deliverables */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Delivered Engineering Scope
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                What MegaScript Delivered
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Factual scope boundaries delivered and deployed for {project.businessName}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.deliveredScopeDetails.map((scope, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-surface p-6 space-y-4 shadow-xs"
                >
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span>{scope.area}</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {scope.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Related Service Bridge Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface-muted flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Need a Similar Solution?</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Explore Our Core Development Services
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Learn more about our transparent website pricing, custom application engineering, and rapid turnaround timelines.
              </p>
            </div>

            <Link
              href={`/services/${project.relatedServiceSlug}`}
              className="inline-flex items-center justify-center font-semibold rounded-xl px-5 py-2.5 text-xs sm:text-sm gap-2 bg-primary text-white hover:bg-primary-hover transition-all shrink-0"
            >
              <span>Explore Related Service</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
