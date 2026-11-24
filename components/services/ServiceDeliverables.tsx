import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CheckCircle, PlusCircle, ShieldCheck, Sparkles } from "lucide-react";

interface ServiceDeliverablesProps {
  includedStandard: string[];
  customScoped: string[];
  serviceName: string;
}

export function ServiceDeliverables({
  includedStandard,
  customScoped,
  serviceName,
}: ServiceDeliverablesProps) {
  return (
    <Section spacing="lg" variant="default" id="deliverables">
      <Container size="lg">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Scope Boundaries</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            What is Included vs. Custom Scoped
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            We believe in complete commercial transparency. Here is a clear breakdown of what comes standard with our {serviceName} engagements and what is scoped as specialized additions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Standard Inclusions Card */}
          <div className="rounded-3xl border border-emerald-500/20 bg-surface p-6 sm:p-10 shadow-card space-y-6">
            <div className="border-b border-border pb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Standard Deliverables</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-3">
                Included in Standard Engagements
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5">
                Core deliverables provided on every project to guarantee performance, security, and client independence.
              </p>
            </div>

            <ul className="space-y-4">
              {includedStandard.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-foreground leading-relaxed">
                  <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Custom Scoped Card */}
          <div className="rounded-3xl border border-border bg-surface-muted/60 p-6 sm:p-10 shadow-card space-y-6">
            <div className="border-b border-border pb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Available Enhancements</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-3">
                Custom Scoped Additions
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5">
                Advanced features and specialized modules quoted on an as-needed basis based on your functional requirements.
              </p>
            </div>

            <ul className="space-y-4">
              {customScoped.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <div className="p-1 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                    <PlusCircle className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
