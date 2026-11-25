"use client";

import React from "react";
import {
  Store,
  Building,
  HeartHandshake,
  Palette,
  Cpu,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { useScrollAnimation } from "@/lib/motion/useScrollAnimation";
import { motionPresets } from "@/lib/motion/presets";

export function IndustriesSection() {
  const sectionRef = useScrollAnimation((ctx) => {
    const cards = ctx.selector?.(".industry-card");
    const header = ctx.selector?.(".section-header");

    if (header) {
      motionPresets.reveal(header, { y: 20 });
    }
    if (cards && cards.length > 0) {
      motionPresets.stagger(cards, { delay: 0.1, y: 22, stagger: 0.08 });
    }
  });

  const audiences = [
    {
      id: "sme",
      icon: <Store className="h-6 w-6 text-primary" />,
      title: "Small & Medium Businesses",
      tagline: "Commercial Credibility & Lead Capture",
      description:
        "Growing companies that need a credible, high-speed digital presence to clearly explain their services, capture qualified customer enquiries, and compete with established competitors.",
      deliverables: [
        "Fast, responsive multi-page corporate websites",
        "Direct WhatsApp and phone lead pathways",
        "100% direct domain and codebase ownership",
        "Predictable 2–6 week project delivery",
      ],
    },
    {
      id: "corporate",
      icon: <Building className="h-6 w-6 text-primary" />,
      title: "Established Companies & Regional Brands",
      tagline: "Operational Dashboards & Systems Modernization",
      description:
        "Enterprises seeking to modernize legacy interfaces, automate repetitive paper workflows, and deploy secure internal tools that scale with their teams.",
      deliverables: [
        "Custom browser-based web applications",
        "Role-based staff and client portals (RBAC)",
        "PostgreSQL relational data architectures",
        "Immutable audit trails and security controls",
      ],
    },
    {
      id: "institutions",
      icon: <HeartHandshake className="h-6 w-6 text-primary" />,
      title: "Institutions & Non-Profit Organisations",
      tagline: "Stakeholder Transparency & Program Outreach",
      description:
        "Mission-driven organizations requiring clear program presentation, accessible public reporting, and streamlined outreach to donors and community partners.",
      deliverables: [
        "Public program platforms and initiative hubs",
        "Transparent stakeholder and impact reporting",
        "WCAG AA accessible contrast and typography",
        "Intuitive team publishing workflows",
      ],
    },
    {
      id: "agencies",
      icon: <Palette className="h-6 w-6 text-primary" />,
      title: "Agencies & Creative Professionals",
      tagline: "Technical Engineering & Execution Partner",
      description:
        "Design studios, marketing consultants, and creative professionals who need a dependable software engineering partner to execute complex client projects flawlessly.",
      deliverables: [
        "Clean, type-safe Next.js implementation",
        "Core Web Vitals performance guarantees",
        "Custom interactive layouts and micro-motion",
        "White-glove technical handover",
      ],
    },
    {
      id: "custom",
      icon: <Cpu className="h-6 w-6 text-accent" />,
      title: "Organisations Requiring Custom Digital Systems",
      tagline: "Bespoke Business Logic & Localized Workflows",
      description:
        "Businesses outgrowing generic SaaS templates or scattered spreadsheets who require tailored software tailored to local East African operating realities.",
      deliverables: [
        "Localized M-Pesa Daraja payment workflows",
        "Rental management and tenant ledgers (LeaseFlow)",
        "Counter point-of-sale systems (UzaDigital)",
        "Dedicated creator schedules (FM Scheduler)",
      ],
    },
  ];

  return (
    <Section spacing="lg" variant="default" id="who-we-work-with">
      <div ref={sectionRef}>
        <Container size="lg">
          {/* Section Header */}
          <div className="section-header max-w-3xl mb-12 sm:mb-16">
            <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
              Partner Profiles
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
              Who We Work With
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              We engineer digital platforms for ambitious founders, established East African institutions, and agencies seeking disciplined technical execution.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {audiences.map((aud) => (
              <div
                key={aud.id}
                className="industry-card flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-card transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary border border-primary/20">
                    {aud.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground tracking-tight font-display">
                    {aud.title}
                  </h3>
                  <span className="text-xs font-semibold text-primary block">
                    {aud.tagline}
                  </span>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {aud.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-surface-border/70 space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block font-bold">
                    Key Deliverables:
                  </span>
                  <ul className="space-y-1.5 text-xs text-foreground/80">
                    {aud.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-1.5">
                        <span className="text-primary font-bold mt-0.5">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </Section>
  );
}
