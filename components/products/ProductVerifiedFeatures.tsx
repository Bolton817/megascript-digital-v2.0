import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, ShieldCheck, Cpu } from "lucide-react";

interface VerifiedFeature {
  title: string;
  description: string;
  isRoadmap?: boolean;
}

interface ProductVerifiedFeaturesProps {
  productName: string;
  features: VerifiedFeature[];
}

export function ProductVerifiedFeatures({
  productName,
  features,
}: ProductVerifiedFeaturesProps) {
  return (
    <Section spacing="lg" variant="subtle" id="features">
      <Container size="lg">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium mb-3">
            <Cpu className="h-3.5 w-3.5" />
            <span>Verified System Capabilities</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Core Features in {productName}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every feature listed below is verified in the active product release. We do not claim unverified automations or non-existent integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-card hover:shadow-layered transition-all duration-300 space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-200">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  {feature.isRoadmap && (
                    <Badge variant="outline" size="sm" className="text-[10px] font-mono">
                      Roadmap Item
                    </Badge>
                  )}
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-foreground tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 text-xs text-muted-foreground shadow-sm">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Verified MVP Feature Set. Detailed feature specifications, API documentation, and platform roadmaps are managed directly on the official {productName} instance.
          </span>
        </div>
      </Container>
    </Section>
  );
}
