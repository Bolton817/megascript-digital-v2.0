import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  Search,
  FileCode2,
  Cpu,
  CheckCircle2,
  Headphones,
  Compass,
} from "lucide-react";

export function AboutApproach() {
  const steps = [
    {
      number: "01",
      title: "Understand the Problem",
      icon: <Search className="h-5 w-5 text-primary" />,
      description:
        "We interview your team to identify actual workflow friction, customer communication breakdowns, and system goals before writing a single line of code.",
    },
    {
      number: "02",
      title: "Plan the Solution",
      icon: <FileCode2 className="h-5 w-5 text-primary" />,
      description:
        "We draft clear data schemas, interaction flows, and precise scope boundaries so that project deliverables, costs, and timelines are fully understood in advance.",
    },
    {
      number: "03",
      title: "Build Thoughtfully",
      icon: <Cpu className="h-5 w-5 text-primary" />,
      description:
        "We implement clean, type-safe Next.js and Prisma systems using resilient database connection pooling, accessible UI primitives, and mobile-first responsive styling.",
    },
    {
      number: "04",
      title: "Test Rigorously",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      description:
        "Every page and API route is audited against automated test suites, WCAG AA accessibility standards, zero console errors, and Core Web Vitals performance benchmarks.",
    },
    {
      number: "05",
      title: "Support & Handover",
      icon: <Headphones className="h-5 w-5 text-primary" />,
      description:
        "We transfer complete ownership of domain records, cloud environments, and codebases to your business, backed by ongoing operational monitoring and maintenance.",
    },
  ];

  return (
    <Section spacing="lg" variant="subtle" id="approach">
      <Container size="lg">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium mb-3">
            <Compass className="h-3.5 w-3.5" />
            <span>Operating Methodology</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How We Build Systems
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Our disciplined five-step delivery model guarantees predictable scopes, transparent budgets, and zero launch surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-card hover:shadow-layered transition-all duration-300 space-y-5 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-surface-muted border border-border group-hover:scale-105 transition-transform duration-200">
                    {step.icon}
                  </div>
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    PHASE {step.number}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-lg font-bold text-foreground tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
