import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Compass } from "lucide-react";

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium mb-3">
            <Compass className="h-3.5 w-3.5" />
            <span>Delivery Methodology</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How We Deliver Your {serviceName}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            A structured, collaborative development process designed to remove surprises, maintain timeline velocity, and deliver lasting business value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-card hover:shadow-layered transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white font-mono font-black text-sm shadow-sm group-hover:scale-105 transition-transform duration-200">
                    {String(item.step).padStart(2, "0")}
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Phase {item.step} of {steps.length}
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
