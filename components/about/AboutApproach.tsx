import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  Search,
  FileCode2,
  Cpu,
  CheckCircle2,
  Headphones,
} from "lucide-react";

export function AboutApproach() {
  const steps = [
    {
      number: "01",
      title: "Understand the Problem",
      icon: <Search className="h-5 w-5 text-[var(--primary)]" />,
      description:
        "We interview your team to identify actual workflow friction, customer communication breakdowns, and system goals before writing a single line of code.",
    },
    {
      number: "02",
      title: "Plan the Solution",
      icon: <FileCode2 className="h-5 w-5 text-[var(--primary)]" />,
      description:
        "We draft clear data schemas, interaction flows, and precise scope boundaries so that project deliverables, costs, and timelines are fully understood in advance.",
    },
    {
      number: "03",
      title: "Build Thoughtfully",
      icon: <Cpu className="h-5 w-5 text-[var(--primary)]" />,
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
      icon: <Headphones className="h-5 w-5 text-[var(--primary)]" />,
      description:
        "We transfer complete ownership of domain records, cloud environments, and codebases to your business, backed by ongoing operational monitoring and maintenance.",
    },
  ];

  return (
    <Section spacing="lg" variant="subtle" id="approach">
      <Container size="lg">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            Operating Methodology
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)] mt-2">
            How We Build Systems
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
            Our disciplined five-step delivery model guarantees predictable scopes, transparent budgets, and zero launch surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
                    {step.icon}
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--muted-foreground)]">
                    STEP {step.number}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
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
