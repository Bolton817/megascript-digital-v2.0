"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useScrollAnimation } from "@/lib/motion/useScrollAnimation";
import { motionPresets } from "@/lib/motion/presets";

export function PricingExpectationsSection() {
  const standardWebsiteInclusions = [
    "Full-stack Next.js architecture with instant static load speeds",
    "Tailwind CSS responsive design optimized for 320px to 1440px+ viewports",
    "Complete technical SEO foundations: XML sitemap, robots.txt, OpenGraph tags",
    "Mobile-first navigation, accessible forms, and touch interactions",
    "Direct WhatsApp business hub, email delivery, and contact forms",
    "100% client administrative custody of domain, code, and cloud hosting accounts",
    "Staff CMS training walkthrough and comprehensive operational guides",
    "Pre-launch security verification and SSL/TLS configuration",
  ];

  const sectionRef = useScrollAnimation((ctx) => {
    const card = ctx.selector?.(".pricing-main-card");
    const header = ctx.selector?.(".section-header");

    if (header) {
      motionPresets.reveal(header, { y: 20 });
    }
    if (card && card.length > 0) {
      motionPresets.reveal(card, { delay: 0.15, y: 24 });
    }
  });

  return (
    <Section spacing="lg" variant="default" id="pricing">
      <div ref={sectionRef}>
        <Container size="lg">
          {/* Section Header */}
          <div className="section-header max-w-3xl mb-12 sm:mb-16">
            <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
              Transparent Commercials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
              Transparent Pricing &amp; Scope Expectations
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              We believe in honest numbers, defined deliverables, and upfront agreements before any work begins.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Pricing Box (7 cols) */}
            <div className="pricing-main-card lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-surface border border-surface-border shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Indicative Commercial Guide
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mt-1 font-display">
                    Standard Corporate Websites
                  </h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-medium text-muted-foreground block">
                    Budget Guide
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-primary font-mono tracking-tight">
                    KSh 35,000 – 125,000
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Indicative pricing applies strictly to standard multi-page business websites. Final quotations depend on exact page counts, custom visual assets, specialized interactive workflows, and content readiness.
              </p>

              {/* Scope Qualification Notice */}
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border flex items-start gap-3 text-xs text-muted-foreground">
                <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground font-semibold">Important Scope Boundary: </strong>
                  This range does not apply to custom web applications or mobile apps, which are quoted individually following architectural discovery.
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
                  Included in standard corporate website engagements:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {standardWebsiteInclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-foreground/80 leading-normal">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground">
                  No surprises. Written itemized proposal before kickoff.
                </span>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button variant="primary" size="sm" className="w-full sm:w-auto" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Request a Formal Proposal
                  </Button>
                </Link>
              </div>
            </div>

            {/* Guarantees & Clarifications (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 sm:p-7 rounded-3xl bg-surface-subtle border border-surface-border space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Fixed-Price Milestone Commitments</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Every project starts with a written Statement of Work (SOW). Scope is agreed upon before invoice generation, preventing scope creep and unexpected billing.
                </p>
              </div>

              <div className="p-6 sm:p-7 rounded-3xl bg-surface-subtle border border-surface-border space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm font-mono">
                  <span>PAYMENT_STRUCTURE</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Transparent milestone payments: 40% project deposit upon SOW execution, 30% upon interactive staging approval, and 30% upon production deployment and ownership handover.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
