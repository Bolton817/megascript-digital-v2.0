"use client";

import React, { useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FileText,
  Lock,
  Bot,
  Database,
  CloudOff,
  GitBranch,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { DifferentiatorSchematicSvg } from "@/components/visuals/DifferentiatorSchematicSvg";
import { useScrollAnimation } from "@/lib/motion/useScrollAnimation";
import { useMotionPreference } from "@/lib/motion/useMotionPreference";

export function DifferentiatorsSection() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const shouldAnimate = useMotionPreference();

  const sectionRef = useScrollAnimation((ctx) => {
    if (!shouldAnimate) return;

    const mm = gsap.matchMedia();

    // Desktop: Pin Left Narrative Sidebar & Track Active Card Index
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: ".differentiators-wrapper",
        pin: ".differentiators-pinned-sidebar",
        start: "top 12%",
        end: "bottom 85%",
        anticipatePin: 1,
      });

      // Individual trigger callbacks to update active schematic
      const cards = gsap.utils.toArray<HTMLElement>(".differentiator-card");
      cards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 60%",
          end: "bottom 60%",
          onEnter: () => setActiveCardIndex(index),
          onEnterBack: () => setActiveCardIndex(index),
        });
      });
    });

    // Mobile: Natural vertical layout without scroll pinning
    mm.add("(max-width: 1023px)", () => {
      // Intentionally zero pinning on mobile to avoid scroll hijacking
    });
  });

  const differentiators = [
    {
      icon: <FileText className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Carefully Designed Multi-Page Solutions",
      scope: "Standard on All Sites",
      description:
        "We reject one-page template shortcuts. Every engagement receives deliberate information architecture, semantic HTML5 landmarks, responsive layouts, and native technical SEO.",
      details: [
        { label: "Architecture", value: "Multi-Route" },
        { label: "Taxonomy", value: "Hierarchical sitemaps &bull; Accessible navigation &bull; Structured metadata" },
      ],
    },
    {
      icon: <Lock className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "100% Client Ownership from Day 1",
      scope: "Standard on All Sites",
      description:
        "You maintain direct administrative custody of your domain names, DNS, Git repositories, and hosting accounts. We never hold assets hostage or lock you into proprietary platforms.",
      details: [
        { label: "Vendor Lock-in", value: "0% (Zero)" },
        { label: "Custody", value: "Full code handover &bull; Independent accounts &bull; Operational walkthroughs" },
      ],
    },
    {
      icon: <Bot className="h-6 w-6 text-accent" aria-hidden="true" />,
      title: "AI-Powered Assistance (Tony AI)",
      scope: "Available Custom Scope",
      description:
        "Grounded bilingual conversational assistants tailored strictly to your verified business facts. Supports visitors in English and Kiswahili without fabricating details or hallucinating.",
      details: [
        { label: "Scope Guard", value: "Strictly Grounded" },
        { label: "Features", value: "English & Kiswahili &bull; Context boundaries &bull; Lead qualification handoffs" },
      ],
    },
    {
      icon: <Database className="h-6 w-6 text-accent" aria-hidden="true" />,
      title: "Operations CRM & Relational Databases",
      scope: "Available Custom Scope",
      description:
        "Role-based internal consoles for managing customer leads, reviewing immutable audit logs, scheduling appointments, and managing relational PostgreSQL data models.",
      details: [
        { label: "Access Control", value: "Role-Based RBAC" },
        { label: "Security", value: "PostgreSQL database &bull; Inactivity timeouts &bull; Internal note logs" },
      ],
    },
    {
      icon: <CloudOff className="h-6 w-6 text-accent" aria-hidden="true" />,
      title: "Offline-Resilient Business Portals",
      scope: "Available Custom Scope",
      description:
        "Local indexed caching, service-worker network resilience, and queued background synchronization designed specifically for East African intermittent internet realities.",
      details: [
        { label: "Connectivity", value: "Local-First Cache" },
        { label: "Capability", value: "Background sync queues &bull; Offline draft forms &bull; Low-bandwidth mode" },
      ],
    },
    {
      icon: <GitBranch className="h-6 w-6 text-accent" aria-hidden="true" />,
      title: "Predictable Engineering Sprints",
      scope: "Available Custom Scope",
      description:
        "Standard multi-page websites delivered in approximately 2 to 6 weeks. Bespoke web apps and mobile solutions delivered in phased, predictable milestone sprints.",
      details: [
        { label: "Website Timeline", value: "2 to 6 Weeks" },
        { label: "Sprint Model", value: "Weekly recorded demos &bull; Pre-launch security audits &bull; Milestone sign-offs" },
      ],
    },
  ];

  return (
    <Section spacing="lg" variant="subtle" id="differentiators">
      <div ref={sectionRef}>
        <Container size="lg">
          <div className="differentiators-wrapper grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Desktop Left Pinned Narrative Sidebar */}
            <div className="differentiators-pinned-sidebar lg:col-span-4 space-y-6">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                Engineering Principles
              </Badge>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
                What Makes Us Different
              </h2>

              <p className="text-base text-muted-foreground leading-relaxed">
                We provide absolute clarity between standard website foundations and specialized, custom-scoped engineering capabilities.
              </p>

              {/* Dynamic Interactive SVG Schematic */}
              <DifferentiatorSchematicSvg activeStep={activeCardIndex} />
            </div>

            {/* Right Scrollable Cards Column */}
            <div className="lg:col-span-8 space-y-6">
              {differentiators.map((diff, idx) => (
                <div
                  key={diff.title}
                  className={`differentiator-card p-7 sm:p-8 rounded-3xl bg-surface border transition-all duration-300 shadow-xs ${
                    activeCardIndex === idx
                      ? "border-primary/50 shadow-card"
                      : "border-surface-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-subtle text-primary border border-primary/20">
                        {diff.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground font-display">
                          {diff.title}
                        </h3>
                      </div>
                    </div>

                    <Badge
                      variant={diff.scope === "Standard on All Sites" ? "primary" : "outline"}
                      className="self-start sm:self-auto text-[11px] font-mono"
                    >
                      {diff.scope}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                    {diff.description}
                  </p>

                  <div className="mt-5 p-4 rounded-2xl bg-surface-subtle border border-surface-border font-mono text-xs space-y-2">
                    {diff.details.map((item) => (
                      <div key={item.label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                        <span className="text-muted-foreground font-semibold">{item.label}:</span>
                        <span
                          className="text-foreground"
                          dangerouslySetInnerHTML={{ __html: item.value }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
