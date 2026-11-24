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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Audience Summary Box */}
          <div className="rounded-2xl border border-border bg-surface-muted p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Users className="h-4 w-4" aria-hidden="true" />
              <span>Target Audience</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              Who is {productName} Designed For?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {audience}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Operational Advantages
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Key Value Delivered
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-border bg-surface space-y-2.5 shadow-sm"
                >
                  <div className="p-2 w-fit rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">
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
