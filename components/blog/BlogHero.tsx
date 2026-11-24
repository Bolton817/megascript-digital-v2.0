import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, Sparkles } from "lucide-react";

export function BlogHero() {
  return (
    <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 border-b border-border bg-gradient-to-b from-surface-muted/50 to-background">
      <Container size="lg">
        <div className="max-w-3xl space-y-4">
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-bold">
            Engineering &amp; Insights
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
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
