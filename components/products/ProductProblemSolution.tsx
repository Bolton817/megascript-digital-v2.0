import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { AlertCircle, CheckCircle2, Target } from "lucide-react";

interface ProductProblemSolutionProps {
  productName: string;
  problem: string;
  solution: string;
}

export function ProductProblemSolution({
  productName,
  problem,
  solution,
}: ProductProblemSolutionProps) {
  return (
    <Section spacing="lg" variant="default" id="overview">
      <Container size="lg">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium mb-3">
            <Target className="h-3.5 w-3.5" />
            <span>Problem &amp; Engineering Purpose</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Why We Engineered {productName}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem Card */}
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 sm:p-10 shadow-card space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-mono font-bold text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>The Operational Challenge</span>
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">
              What breaks in existing workflows
            </h3>
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
              {problem}
            </p>
          </div>

          {/* Solution Card */}
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-10 shadow-card space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>The {productName} Architecture</span>
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">
              How the platform solves it
            </h3>
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
              {solution}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
