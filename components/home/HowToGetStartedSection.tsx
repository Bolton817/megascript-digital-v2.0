"use client";

import React from "react";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RoadmapPathSvg } from "@/components/visuals/RoadmapPathSvg";
import { useScrollAnimation } from "@/lib/motion/useScrollAnimation";
import { motionPresets } from "@/lib/motion/presets";

export function HowToGetStartedSection() {
  const sectionRef = useScrollAnimation((ctx) => {
    const steps = ctx.selector?.(".roadmap-step");
    const header = ctx.selector?.(".section-header");

    if (header) {
      motionPresets.reveal(header, { y: 20 });
    }
    if (steps && steps.length > 0) {
      motionPresets.stagger(steps, { delay: 0.1, y: 24, stagger: 0.06 });
    }
  });

  const steps = [
    {
      number: "01",
      title: "Enquiry",
      description:
        "Submit your initial enquiry outlining your business objectives, target audience, preferred timeline, and any current digital challenges.",
    },
    {
      number: "02",
      title: "Discovery",
      description:
        "We discuss technical requirements, evaluate your current assets, and clarify whether your project fits standard website scope or custom engineering.",
    },
    {
      number: "03",
      title: "Proposal & Scope",
      description:
        "You receive an itemized, transparent proposal detailing deliverables, milestone schedules, commercial terms, and scope boundaries.",
    },
    {
      number: "04",
      title: "Content & Access Collection",
      description:
        "We collect your brand logos, approved copy, high-resolution imagery, and DNS/domain access guided by our straightforward onboarding checklist.",
    },
    {
      number: "05",
      title: "Design",
      description:
        "We design mobile-first layouts focused on plain-language readability, visual hierarchy, user trust, and WCAG AA contrast compliance.",
    },
    {
      number: "06",
      title: "Development",
      description:
        "We engineer the platform using modern frameworks, semantic HTML5, pre-rendered routes, Core Web Vitals optimizations, and end-to-end security audits.",
    },
    {
      number: "07",
      title: "Review & Testing",
      description:
        "We conduct rigorous cross-viewport verification across 320px to 1440px+, review staged pages with your team, and refine copy before public release.",
    },
    {
      number: "08",
      title: "Launch & Handover",
      description:
        "We deploy to production, verify DNS/TLS certificates, deliver staff training, and hand over complete repository and administrative access.",
    },
  ];

  return (
    <Section spacing="lg" variant="subtle" id="how-to-get-started">
      <div ref={sectionRef}>
        <Container size="lg">
          {/* Section Header */}
          <div className="section-header flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                Predictable Roadmap
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
                How to Get Started
              </h2>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                An eight-step engineering roadmap from initial conversation to production launch and complete client handover.
              </p>
            </div>

            <Link href="/contact" className="self-start md:self-auto">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Start with Step 01
              </Button>
            </Link>
          </div>

          {/* Progressive Scroll-Drawn SVG Roadmap Track */}
          <RoadmapPathSvg className="mb-4 hidden sm:block" />

          {/* 8-Step Timeline Grid (4 cols on desktop, 2 on tablet, 1 on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="roadmap-step relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-card transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-primary font-mono tracking-tight">
                      {step.number}
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-primary/40" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight font-display">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Duration & Delivery Qualifications */}
          <div className="mt-12 p-7 sm:p-8 rounded-3xl bg-surface border border-primary/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-subtle text-primary border border-primary/20">
                <Clock className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-base font-bold text-foreground font-display">
                  Indicative Standard Website Timeline: Approximately 2 to 6 Weeks
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                  Delivery estimates apply specifically to standard multi-page websites. Actual turnaround depends on scope complexity, timely feedback, and content readiness. Web applications and mobile apps are scheduled according to architectural specifications.
                </p>
              </div>
            </div>

            <Link href="/contact" className="w-full sm:w-auto shrink-0">
              <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                Request Project Timeline
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </Section>
  );
}
