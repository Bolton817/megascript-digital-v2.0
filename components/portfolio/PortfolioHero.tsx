import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export function PortfolioHero() {
  return (
    <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-muted)]/50 to-[var(--background)]">
      <Container size="lg">
        <div className="max-w-3xl space-y-4">
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-bold">
            Verified Client Work
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--foreground)] leading-[1.15]">
            Selected Client Engagements
          </h1>

          <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
            Real commercial web platforms, corporate digital storefronts, and software solutions built for East African businesses, tour operators, financial firms, and community organizations.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[var(--muted-foreground)]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>11 Live Client Deployments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Full Client Ownership Guaranteed</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
