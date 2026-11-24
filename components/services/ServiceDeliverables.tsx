import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CheckCircle, PlusCircle } from "lucide-react";

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
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            Scope Clarity
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)] mt-2">
            What is Included vs. Custom Scoped
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
            We believe in complete commercial transparency. Here is a clear breakdown of what comes standard with our {serviceName} engagements and what is scoped as specialized additions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Standard Inclusions Card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[var(--border)] pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Standard Inclusions
              </span>
              <h3 className="text-xl font-bold text-[var(--foreground)] mt-1">
                Included in Standard Engagements
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Core deliverables provided on every project to guarantee quality and security.
              </p>
            </div>

            <ul className="space-y-4">
              {includedStandard.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Custom Scoped Card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[var(--border)] pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                Available Enhancements
              </span>
              <h3 className="text-xl font-bold text-[var(--foreground)] mt-1">
                Custom Scoped Additions
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Advanced features and specialized modules quoted on an as-needed basis.
              </p>
            </div>

            <ul className="space-y-4">
              {customScoped.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                  <PlusCircle className="h-5 w-5 text-[var(--primary)] shrink-0 mt-0.5" aria-hidden="true" />
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
