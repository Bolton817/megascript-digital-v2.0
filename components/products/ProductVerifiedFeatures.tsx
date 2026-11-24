import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, ShieldCheck } from "lucide-react";

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
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Verified Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-2">
            Core Features in {productName}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every feature listed below is verified in the active product release. We do not claim unverified automations or non-existent integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  {feature.isRoadmap && (
                    <Badge variant="outline" size="sm" className="text-[10px]">
                      Roadmap Item
                    </Badge>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-4 rounded-xl bg-surface border border-border flex items-center gap-3 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Verified MVP Feature Set. Detailed feature specifications are documented on the official {productName} platform.
          </span>
        </div>
      </Container>
    </Section>
  );
}
