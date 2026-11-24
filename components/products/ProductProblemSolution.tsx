import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { AlertCircle, CheckCircle2 } from "lucide-react";

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
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            Problem &amp; Purpose
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)] mt-2">
            Why We Engineered {productName}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem Card */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>The Operational Challenge</span>
            </div>
            <p className="text-sm sm:text-base text-[var(--foreground)] leading-relaxed">
              {problem}
            </p>
          </div>

          {/* Solution Card */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>The {productName} Solution</span>
            </div>
            <p className="text-sm sm:text-base text-[var(--foreground)] leading-relaxed">
              {solution}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
