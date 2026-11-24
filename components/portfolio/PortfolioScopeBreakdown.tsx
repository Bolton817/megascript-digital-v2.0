import React from "react";
import Link from "next/link";
import { PortfolioProjectData } from "@/config/portfolio-data";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles, Layers } from "lucide-react";

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
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 sm:p-10 shadow-card space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-mono font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>The Challenge</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                Operational Friction Before Engagement
              </h2>
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                {project.challengeSummary}
              </p>
            </div>

            {/* The Business Outcome */}
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-10 shadow-card space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>The Result</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                Delivered Operational Impact
              </h2>
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                {project.businessOutcome}
              </p>
            </div>
          </div>

          {/* Detailed Delivered Deliverables */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium">
                <Layers className="h-3.5 w-3.5" />
                <span>Engineering Scope</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
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
                  className="rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-4 shadow-card hover:shadow-layered transition-all duration-300"
                >
                  <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
                    <span>{scope.area}</span>
                  </h3>
                  <ul className="space-y-3">
                    {scope.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
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
          <div className="p-8 sm:p-10 rounded-3xl border border-border bg-surface-muted/70 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-card">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Need a Similar Solution?</span>
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">
                Explore Our Core Development Services
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Learn more about our transparent website pricing, custom application engineering, and rapid turnaround timelines.
              </p>
            </div>

            <Link
              href={`/services/${project.relatedServiceSlug}`}
              className="inline-flex items-center justify-center font-semibold rounded-2xl px-6 py-3 text-xs sm:text-sm gap-2 bg-primary text-white hover:bg-primary-hover transition-all shadow-sm shrink-0"
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
