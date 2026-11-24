import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Users, Sparkles } from "lucide-react";

interface ProductAudienceProps {
  productName: string;
  audience: string;
  benefits: {
    title: string;
    description: string;
  }[];
}

export function ProductAudience({
  productName,
  audience,
  benefits,
}: ProductAudienceProps) {
  return (
    <Section spacing="lg" variant="default" id="audience">
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Audience Summary Box */}
          <div className="lg:col-span-5 rounded-3xl border border-border bg-surface-muted/70 p-6 sm:p-10 shadow-card space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Target Audience</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Who is {productName} Designed For?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {audience}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Operational Advantages
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Key Value Delivered
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border border-border bg-surface space-y-3 shadow-card hover:shadow-layered transition-all duration-200"
                >
                  <div className="p-2.5 w-fit rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <h4 className="font-display text-sm sm:text-base font-bold text-foreground">
                    {benefit.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
