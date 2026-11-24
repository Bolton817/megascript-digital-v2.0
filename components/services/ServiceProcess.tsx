import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

interface ServiceProcessProps {
  steps: ProcessStep[];
  serviceName: string;
}

export function ServiceProcess({ steps, serviceName }: ServiceProcessProps) {
  return (
    <Section spacing="lg" variant="subtle" id="process">
      <Container size="lg">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            Our Method
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)] mt-2">
            How We Deliver Your {serviceName}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
            A structured, collaborative development process designed to remove surprises, maintain timeline velocity, and deliver lasting business value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white font-black text-sm shadow-sm">
                  {String(item.step).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
