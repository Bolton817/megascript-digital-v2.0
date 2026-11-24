import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Terminal, ShieldCheck } from "lucide-react";

export function WowFactorsHero() {
  return (
    <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-muted)]/50 to-[var(--background)]">
      <Container size="lg">
        <div className="max-w-3xl space-y-4">
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-bold">
            Capability Prototypes
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--foreground)] leading-[1.15]">
            Engineering &amp; Interactive Showcases
          </h1>

          <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
            Beyond standard business websites, we engineer custom software architectures, real-time AI assistants, and high-velocity workflow systems. Explore our working prototypes, sandbox demos, and architectural concepts below.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[var(--muted-foreground)]">
            <div className="flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-[var(--primary)]" />
              <span>Interactive Sandboxes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Full-Stack Proofs of Concept</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Truthfully Labeled Prototypes</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
