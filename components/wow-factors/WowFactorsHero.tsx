import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Terminal, ShieldCheck, Cpu } from "lucide-react";

export function WowFactorsHero() {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 border-b border-border bg-gradient-to-b from-surface-muted/50 via-background to-background">
      <Container size="lg">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium">
            <Cpu className="h-3.5 w-3.5" />
            <span>Applied Engineering &amp; Interactive Sandboxes</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.12]">
            Engineering &amp; Interactive Showcases
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Beyond standard business websites, we engineer custom software architectures, real-time AI assistants, and high-velocity workflow systems. Explore our working prototypes, sandbox demos, and architectural concepts below.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">Interactive Sandboxes</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="font-medium text-foreground">Full-Stack Proofs of Concept</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-foreground">Truthfully Labeled Prototypes</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
