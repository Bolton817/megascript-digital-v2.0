"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useScrollAnimation } from "@/lib/motion/useScrollAnimation";
import { gsap } from "@/lib/motion/init";

interface FeaturedProject {
  slug: string;
  name: string;
  industry: string;
  businessDescription: string;
  deliveredScope: string;
  liveUrl: string;
  monogram: string;
}

export function FeaturedPortfolioSection() {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  const projects: FeaturedProject[] = [
    {
      slug: "lucky-house-safaris",
      name: "Lucky House Safaris",
      industry: "Tours & Safaris",
      businessDescription:
        "A tour and safari company organizing guided travel experiences and itineraries across East Africa.",
      deliveredScope:
        "Responsive safari tour showcase and direct inquiry pipeline tailored to help international travelers explore packages clearly.",
      liveUrl: "https://luckyhousetc.co.ke/",
      monogram: "LHS",
    },
    {
      slug: "luminary-mtaji-partners",
      name: "Luminary Mtaji Partners",
      industry: "Finance & Advisory",
      businessDescription:
        "A finance and advisory company providing structured financial solutions to businesses and clients.",
      deliveredScope:
        "Corporate digital presence and brand presentation built for institutional credibility, regulatory clarity, and direct client inquiries.",
      liveUrl: "https://luminarymtajipartners.co.ke/",
      monogram: "LMP",
    },
    {
      slug: "skrach-art",
      name: "Skrach Art",
      industry: "Art Organisation",
      businessDescription:
        "A community-focused art organization supporting creative expression, artist mentorship, and cultural development.",
      deliveredScope:
        "Official website setup designed to communicate programs, showcase community work, and streamline outreach contact pathways.",
      liveUrl: "https://skrachart.co.ke/",
      monogram: "SKA",
    },
    {
      slug: "abwa-world",
      name: "ABWA World",
      industry: "Non-Profit Organisation",
      businessDescription:
        "Action for Better World Association (ABWA), an international non-profit organization focused on community outreach.",
      deliveredScope:
        "Public web platform structured to present community initiatives clearly, support public outreach, and simplify ongoing updates.",
      liveUrl: "https://abwaworld.org/",
      monogram: "ABW",
    },
  ];

  const toggleOverlay = (slug: string) => {
    setActiveOverlay((prev) => (prev === slug ? null : slug));
  };

  const sectionRef = useScrollAnimation((ctx) => {
    const mm = gsap.matchMedia();

    // Desktop: Horizontal scrub sequence across cards
    mm.add("(min-width: 1024px)", () => {
      const track = ctx.selector?.(".portfolio-horizontal-track");
      const wrapper = ctx.selector?.(".portfolio-horizontal-wrapper");

      if (track && wrapper) {
        gsap.to(track, {
          xPercent: -35,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            pin: true,
            start: "top 18%",
            end: () => "+=800",
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    });

    // Mobile Alternative (Task 106): Clean responsive grid, zero pinning
    mm.add("(max-width: 1023px)", () => {
      const cards = ctx.selector?.(".portfolio-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cards[0],
              start: "top 85%",
            },
          }
        );
      }
    });
  });

  return (
    <Section spacing="lg" variant="default" id="featured-work">
      <div ref={sectionRef}>
        <Container size="lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5"
              >
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
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                See All Portfolio Work
              </Button>
            </Link>
          </div>

          {/* Desktop Horizontal Track Wrapper / Mobile Responsive Grid */}
          <div className="portfolio-horizontal-wrapper overflow-hidden">
            <div className="portfolio-horizontal-track grid grid-cols-1 md:grid-cols-2 lg:flex lg:w-[150%] gap-6 sm:gap-8">
              {projects.map((project) => {
                const isRevealed = activeOverlay === project.slug;

                return (
                  <div
                    key={project.slug}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isRevealed}
                    aria-label={`${project.name} - Tap to view project details`}
                    onClick={() => toggleOverlay(project.slug)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleOverlay(project.slug);
                      }
                    }}
                    className="portfolio-card lg:w-1/4 group relative min-h-[300px] sm:min-h-[320px] rounded-3xl bg-surface border border-surface-border p-8 flex flex-col justify-between overflow-hidden shadow-xs hover:border-primary/50 hover:shadow-card transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {/* Default State: Typographic Brand Mark & Industry */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="text-xs font-semibold text-muted-foreground"
                        >
                          {project.industry}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium group-hover:text-primary transition-colors">
                          {isRevealed ? "Tap to dismiss" : "Hover / tap to inspect"}
                        </span>
                      </div>

                      <div className="pt-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-subtle text-primary font-black font-mono text-2xl tracking-wider border border-primary/20 shadow-xs mb-4">
                          {project.monogram}
                        </div>
                        <h3 className="text-2xl font-extrabold text-foreground tracking-tight font-display">
                          {project.name}
                        </h3>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-surface-border flex items-center justify-between text-xs text-muted-foreground">
                      <span>Verified Client System</span>
                      <span className="text-primary font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Scope details &rarr;
                      </span>
                    </div>

                    {/* Interactive Overlay */}
                    <div
                      className={`absolute inset-0 bg-surface/98 backdrop-blur-md p-8 flex flex-col justify-between transition-all duration-300 ${
                        isRevealed
                          ? "opacity-100 pointer-events-auto translate-y-0"
                          : "opacity-0 pointer-events-none translate-y-4 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0"
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-surface-border pb-3">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                            DELIVERED_SCOPE
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Tap to close
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground">
                            Business Overview
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {project.businessDescription}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground">
                            Engineering Deliverables
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {project.deliveredScope}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-surface-border flex items-center justify-between">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                        >
                          <span>Visit Live Website</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {project.monogram}_PROD
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
