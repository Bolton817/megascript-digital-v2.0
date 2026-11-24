import React from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

export function HowToGetStartedSection() {
  const steps = [
    {
      number: "01",
      title: "Enquiry & Project Goals",
      description:
        "Submit your enquiry outlining your business objectives, target audience, preferred timeline, and any existing digital bottlenecks.",
    },
    {
      number: "02",
      title: "Discovery & Scope Definition",
      description:
        "We discuss technical specifications, system architecture, and provide a clear, itemized proposal with transparent budgets and deliverables.",
    },
    {
      number: "03",
      title: "Content & Asset Collection",
      description:
        "You supply your logo, high-resolution imagery, approved text, and third-party account details guided by our simple onboarding checklist.",
    },
    {
      number: "04",
      title: "Accessible Design & Prototyping",
      description:
        "We design mobile-first, responsive layouts adhering to WCAG AA accessibility standards for your review and directional sign-off.",
    },
    {
      number: "05",
      title: "Engineering & Rigorous QA",
      description:
        "We develop the platform with clean semantic code, automated testing, Core Web Vitals optimizations, and end-to-end security audits.",
    },
    {
      number: "06",
      title: "Production Handover & Training",
      description:
        "We launch your platform, verify DNS/TLS certificates, deliver staff training, and hand over complete administrative credentials and code access.",
    },
  ];

  return (
    <Section spacing="lg" variant="subtle" id="how-to-get-started">
      <Container size="lg">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
            Predictable Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How to Get Started
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            A clear, predictable roadmap from initial conversation to operational handover.
          </p>
        </div>

        {/* 6-Step Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-primary font-mono">
                  {step.number}
                </span>
                <CheckCircle2 className="h-5 w-5 text-primary/40" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Duration & Expectation Callout (TDD Sheet 043) */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-surface border border-primary/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary border border-primary/20">
              <Clock className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">
                Typical Standard Project Duration: 2 to 6 Weeks
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                Delivery timelines depend on scope complexity, feedback turnaround speed, and content readiness. We provide a guaranteed milestone schedule upon scope confirmation.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
