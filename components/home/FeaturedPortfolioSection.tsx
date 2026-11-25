"use client";

import React, { useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useScrollAnimation } from "@/lib/motion/useScrollAnimation";
import { useMotionPreference } from "@/lib/motion/useMotionPreference";

export function FeaturedPortfolioSection() {
  const shouldAnimate = useMotionPreference();
  const [scrollProgress, setScrollProgress] = useState(0);

  const sectionRef = useScrollAnimation((ctx) => {
    if (!shouldAnimate) return;

    const mm = gsap.matchMedia();

    // Desktop: Horizontal scrub sequence across the 4 portfolio projects
    mm.add("(min-width: 1024px)", () => {
      const track = ctx.selector?.(".portfolio-horizontal-track")?.[0];
      const section = ctx.selector?.(".portfolio-horizontal-container")?.[0];

      if (track && section) {
        gsap.to(track, {
          xPercent: -60,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            start: "top 15%",
            end: () => "+=" + (window.innerHeight * 1.5),
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setScrollProgress(self.progress),
          },
        });
      }
    });

    // Mobile: Natural responsive grid fallback without pinning
    mm.add("(max-width: 1023px)", () => {
      // Natural fluid scrolling, zero scroll hijacking
    });
  });

  const projects = [
    {
      title: "Lucky House Safaris",
      sector: "Tours & Safaris",
      location: "Nairobi, Kenya",
      deliverable: "Multi-page booking platform with live Safari packages, itinerary maps, and WhatsApp reservations.",
      impact: "100% Client owned &bull; Sub-1.2s LCP",
      href: "/portfolio/lucky-house-safaris",
      tag: "LHS",
    },
    {
      title: "Luminary Mtaji Partners",
      sector: "Finance & Advisory",
      location: "Nairobi, Kenya",
      deliverable: "Institutional investment firm portal with interactive advisory calculators and corporate governance disclosures.",
      impact: "KDPA 2019 compliant &bull; Strict confidentiality",
      href: "/portfolio/luminary-mtaji-partners",
      tag: "LMP",
    },
    {
      title: "Skrach Art",
      sector: "Art Organisation",
      location: "East Africa",
      deliverable: "Digital gallery and artist exhibition showcase with high-resolution image-masking and mobile-first catalogue.",
      impact: "Zero layout shift &bull; Fast CDN caching",
      href: "/portfolio/skrach-art",
      tag: "SKA",
    },
    {
      title: "Pwani Logistics Hub",
      sector: "Freight & Transport",
      location: "Mombasa, Kenya",
      deliverable: "Consignment tracking web portal with SMS notifications, driver dispatch views, and container status logging.",
      impact: "Role-based RBAC &bull; PostgreSQL data",
      href: "/portfolio/pwani-logistics",
      tag: "PLH",
    },
  ];

  return (
    <Section spacing="lg" variant="default" id="portfolio">
      <div ref={sectionRef}>
        <Container size="lg">
          {/* Header with Title and Link */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                Demonstrated Proof
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
                Featured Client Engagements
              </h2>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Explore selected systems delivered across East Africa. Tap or hover each card to inspect the business challenge and our delivered engineering scope.
              </p>
            </div>

            <Link href="/portfolio" className="self-start md:self-auto">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                See All Portfolio Work
              </Button>
            </Link>
          </div>

          {/* Desktop Progress Bar Indicator */}
          <div className="hidden lg:block w-full max-w-xs mb-6">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1.5">
              <span>EXPLORATION_DEPTH</span>
              <span className="font-bold text-primary">{Math.round(scrollProgress * 100)}%</span>
            </div>
            <div className="h-1 w-full bg-surface-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-75"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </Container>

        {/* Horizontal Scroll Track Container */}
        <div className="portfolio-horizontal-container overflow-hidden py-4">
          <Container size="lg">
            <div className="portfolio-horizontal-track flex flex-col lg:flex-row gap-6 sm:gap-8 lg:w-[170%] transition-transform">
              {projects.map((proj) => (
                <div
                  key={proj.title}
                  className="portfolio-card w-full lg:w-[420px] shrink-0 p-8 sm:p-9 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-card transition-all duration-300 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs font-medium">
                        {proj.sector}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Hover / tap to inspect
                      </span>
                    </div>

                    <div className="h-28 rounded-2xl bg-primary-subtle/50 border border-primary/15 flex items-center justify-center p-4">
                      <span className="text-3xl font-black font-display text-primary tracking-wider">
                        {proj.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-foreground font-display">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                        {proj.location}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {proj.deliverable}
                    </p>

                    <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border text-[11px] font-mono text-foreground/80 flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: proj.impact }} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-surface-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-mono">Verified Client System</span>
                    <Link
                      href={proj.href}
                      className="inline-flex items-center text-primary font-semibold hover:text-primary-hover gap-1"
                    >
                      <span>Scope details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </Section>
  );
}
