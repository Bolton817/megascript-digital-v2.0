import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, CheckCircle2, Layers } from "lucide-react";

export function PortfolioHero() {
  return (
    <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-24 border-b border-border bg-gradient-to-b from-surface-muted/50 via-background to-background">
      <Container size="lg">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium">
            <Layers className="h-3.5 w-3.5" />
            <span>Verified Commercial Deployments</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.12]">
            Selected Client Engagements
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Real commercial web platforms, corporate digital storefronts, and software solutions built for East African businesses, tour operators, financial firms, and community organizations.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-foreground">11 Live Client Deployments</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-foreground">Full Client Ownership Guaranteed</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
