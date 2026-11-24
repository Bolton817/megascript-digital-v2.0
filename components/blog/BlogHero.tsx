import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, Sparkles, Terminal } from "lucide-react";

export function BlogHero() {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 border-b border-border bg-gradient-to-b from-surface-muted/50 via-background to-background">
      <Container size="lg">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Engineering Insights &amp; Operational Perspectives</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.12]">
            Practical Digital &amp; Technology Guides
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Straightforward technical guides, operational checklists, and architectural perspectives for business owners, founders, and engineering teams in Kenya.
          </p>
        </div>
      </Container>
    </section>
  );
}
