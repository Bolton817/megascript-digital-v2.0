import React from "react";
import {
  Store,
  Building,
  HeartHandshake,
  Palette,
  Cpu,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

export function IndustriesSection() {
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
      <Container size="lg">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
            Partner Profiles
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
            Who We Work With
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            We partner with businesses, regional enterprises, and institutions that value clear communication, software reliability, and long-term asset ownership.
          </p>
        </div>

        {/* 5-Audience Structured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {audiences.map((aud, index) => {
            const isFeaturedCustom = aud.id === "custom";
            return (
              <div
                key={aud.id}
                className={`flex flex-col justify-between p-7 rounded-3xl border transition-all duration-200 ${
                  isFeaturedCustom
                    ? "md:col-span-2 lg:col-span-2 bg-gradient-to-br from-surface to-surface-muted/60 border-primary/30 shadow-card"
                    : "bg-surface border-surface-border shadow-xs hover:border-primary/40 hover:shadow-card"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary border border-primary/20">
                      {aud.icon}
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      0{index + 1}_SECTOR
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground tracking-tight font-display">
                      {aud.title}
                    </h3>
                    <p className="text-xs font-semibold text-primary mt-0.5">
                      {aud.tagline}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {aud.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground block mb-2">
                      Typical Delivered Focus:
                    </span>
                    <ul className={`grid gap-2 text-xs text-foreground/85 ${isFeaturedCustom ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                      {aud.deliverables.map((del) => (
                        <li key={del} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-surface-border">
                  <Link
                    href="/contact"
                    className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover gap-1.5 transition-colors group"
                  >
                    <span>Discuss Your Requirements</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
