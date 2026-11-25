"use client";

import React from "react";
import Link from "next/link";
import {
  Globe,
  Code2,
  Smartphone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { useScrollAnimation } from "@/lib/motion/useScrollAnimation";
import { motionPresets } from "@/lib/motion/presets";

export function WhatWeDoSection() {
  const sectionRef = useScrollAnimation((ctx) => {
    const cards = ctx.selector?.(".capability-card");
    const header = ctx.selector?.(".section-header");

    if (header) {
      motionPresets.reveal(header, { y: 20 });
    }
    if (cards && cards.length > 0) {
      motionPresets.stagger(cards, { delay: 0.15, y: 24, stagger: 0.1 });
    }
  });

  return (
    <Section spacing="lg" variant="default" id="what-we-do">
      <div ref={sectionRef}>
        <Container size="lg">
          {/* Section Header */}
          <div className="section-header max-w-3xl mb-12 sm:mb-16">
            <Badge
              variant="outline"
              className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5"
            >
              Core Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
              What We Do
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              We engineer high-speed business websites, custom web applications, and mobile solutions that solve operational bottlenecks and attract high-value clients.
            </p>
          </div>

          {/* Varied 3-Capability Composition (Asymmetrical Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            {/* Card 1: Enterprise Website Development & SEO (Spans 7 cols on desktop) */}
            <div className="capability-card lg:col-span-7 flex flex-col justify-between p-7 sm:p-9 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-card transition-all duration-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary border border-primary/25">
                    <Globe className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <Badge variant="primary" size="sm" className="font-mono text-xs">
                    01_CORE
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground tracking-tight font-display">
                    Website Development &amp; SEO
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Fast, mobile-first websites designed to explain what you do clearly, build trust with prospective clients, and support organic search discoverability from the ground up.
                  </p>
                </div>

                {/* Graphical Blueprint Browser Preview */}
                <div className="rounded-2xl border border-surface-border bg-surface-subtle p-4 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-border text-muted-foreground text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-400/80" />
                      <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                      <span className="ml-2 text-foreground/70 font-sans">https://yourbrand.co.ke</span>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% SEO</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded-lg bg-surface border border-surface-border">
                      <span className="text-muted-foreground block">LCP</span>
                      <span className="font-bold text-foreground">1.1s (Good)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-surface border border-surface-border">
                      <span className="text-muted-foreground block">FID / INP</span>
                      <span className="font-bold text-foreground">&lt; 40ms</span>
                    </div>
                    <div className="p-2 rounded-lg bg-surface border border-surface-border">
                      <span className="text-muted-foreground block">CLS</span>
                      <span className="font-bold text-foreground">0.00 (Zero Shift)</span>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground/80 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Core Web Vitals optimized</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Automated JSON-LD schemas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>100% Client ownership</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Mobile-first fluid layouts</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-surface-border">
                <Link
                  href="/services/website-development-seo"
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover gap-1.5 transition-colors group"
                >
                  <span>Explore Website Development Scope</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Cards 2 & 3: Web Apps & Mobile Apps (Spans 5 cols on desktop, stacked) */}
            <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 justify-between">
              {/* Card 2: Custom Web Application Development */}
              <div className="capability-card flex-1 flex flex-col justify-between p-7 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-card transition-all duration-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-subtle text-primary border border-primary/20">
                      <Code2 className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <Badge variant="outline" size="sm" className="font-mono text-xs">
                      02_CORE
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground tracking-tight font-display">
                      Web Application Development
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Custom browser-based portals, staff dashboards, booking workflows, and databases tailored to how your operations actually function.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border text-foreground/80">
                      Role-Based Access
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border text-foreground/80">
                      PostgreSQL Data
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border text-foreground/80">
                      Type-Safe APIs
                    </span>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-surface-border">
                  <Link
                    href="/services/web-app-development"
                    className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover gap-1.5 transition-colors group"
                  >
                    <span>Explore Web Applications</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Mobile Application Development */}
              <div className="capability-card flex-1 flex flex-col justify-between p-7 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-card transition-all duration-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-subtle text-primary border border-primary/20">
                      <Smartphone className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <Badge variant="outline" size="sm" className="font-mono text-xs">
                      03_CORE
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground tracking-tight font-display">
                      Mobile Application Development
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Practical iOS and Android applications that connect customers and field teams directly with your services and cloud databases.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border text-foreground/80">
                      Cross-Platform
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border text-foreground/80">
                      Offline Resilience
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border text-foreground/80">
                      Local Payments
                    </span>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-surface-border">
                  <Link
                    href="/services/mobile-app-development"
                    className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover gap-1.5 transition-colors group"
                  >
                    <span>Explore Mobile Apps</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
