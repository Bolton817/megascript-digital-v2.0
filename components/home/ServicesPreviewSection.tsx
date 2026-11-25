"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe, Code2, Smartphone, Sparkles, Video, MapPin, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useScrollAnimation } from "@/lib/motion/useScrollAnimation";
import { motionPresets } from "@/lib/motion/presets";
import { useAdaptiveRendering } from "@/lib/motion/useAdaptiveRendering";

export function ServicesPreviewSection() {
  const { isFull } = useAdaptiveRendering();
  const [activeTilt, setActiveTilt] = useState<{ id: string; x: number; y: number } | null>(null);

  const sectionRef = useScrollAnimation((ctx) => {
    const cards = ctx.selector?.(".service-card");
    const header = ctx.selector?.(".section-header");

    if (header) {
      motionPresets.reveal(header, { y: 20 });
    }
    if (cards && cards.length > 0) {
      motionPresets.stagger(cards, { delay: 0.1, y: 24, stagger: 0.08 });
    }
  });

  const coreServices = [
    {
      id: "web-dev",
      icon: <Globe className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Website Development & SEO",
      description:
        "Fast, mobile-first websites designed to explain what you do clearly, build trust with prospective clients, and support organic search discoverability from day one.",
      href: "/services/website-development-seo",
      scope: "Standard Commercial Engagement",
      highlights: ["Core Web Vitals optimized", "Automated JSON-LD schemas", "100% Client ownership"],
    },
    {
      id: "web-app",
      icon: <Code2 className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Web Application Development",
      description:
        "Custom browser-based business portals, operational dashboards, and client tools built on relational databases, type-safe APIs, and role-based access control.",
      href: "/services/web-app-development",
      scope: "Bespoke Enterprise Scope",
      highlights: ["Role-based access control", "PostgreSQL database models", "Automated business workflows"],
    },
    {
      id: "mobile-app",
      icon: <Smartphone className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Mobile Application Development",
      description:
        "Practical iOS and Android mobile solutions that connect customers and field teams directly with your services, cloud storage, and localized payment gateways.",
      href: "/services/mobile-app-development",
      scope: "Bespoke Mobile Scope",
      highlights: ["Cross-platform iOS & Android", "Offline resilience", "M-Pesa payment flows"],
    },
  ];

  const complementaryServices = [
    {
      icon: <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />,
      title: "Graphic Design & Brand Systems",
      description: "Cohesive visual identities, typography guidelines, and digital brand collateral.",
      href: "/services/graphic-design",
    },
    {
      icon: <Video className="h-5 w-5 text-accent" aria-hidden="true" />,
      title: "Professional Video Editing",
      description: "Clear promotional video editing, product demos, reels, and business storytelling.",
      href: "/services/video-editing",
    },
    {
      icon: <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />,
      title: "Google Maps & Local Search Visibility",
      description: "Google Business Profile optimization to help local customers discover your physical presence.",
      href: "/services/google-maps-visibility",
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-accent" aria-hidden="true" />,
      title: "Business Technology Coaching",
      description: "Structured advisory on digital readiness, operational automation, and tool selection.",
      href: "/services/business-coaching",
    },
  ];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>, id: string) {
    if (!isFull) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setActiveTilt({ id, x: x * 8, y: y * -8 });
  }

  function handleMouseLeave() {
    setActiveTilt(null);
  }

  return (
    <Section spacing="lg" variant="subtle" id="services">
      <div ref={sectionRef}>
        <Container size="lg">
          {/* Header */}
          <div className="section-header flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                Service Catalog
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
                Our Services
              </h2>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Seven structured service offerings designed to build, scale, and protect your digital infrastructure.
              </p>
            </div>

            <Link href="/services" className="self-start md:self-auto">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All 7 Services
              </Button>
            </Link>
          </div>

          {/* Core Services with 2.5D Tilt Perspective */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Core Engineering Services (Primary Practice)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {coreServices.map((service) => {
                const isHovered = activeTilt?.id === service.id;
                const tiltStyle =
                  isFull && isHovered
                    ? {
                        transform: `perspective(1000px) rotateX(${activeTilt.y}deg) rotateY(${activeTilt.x}deg) translateY(-4px)`,
                      }
                    : {};

                return (
                  <div
                    key={service.id}
                    onMouseMove={(e) => handleMouseMove(e, service.id)}
                    onMouseLeave={handleMouseLeave}
                    style={tiltStyle}
                    className="service-card flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-card transition-all duration-200"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary border border-primary/20">
                          {service.icon}
                        </div>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {service.scope}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold text-foreground font-display">
                        {service.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>

                      <ul className="pt-2 space-y-1.5 text-xs text-foreground/80">
                        {service.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-5 mt-6 border-t border-surface-border">
                      <Link
                        href={service.href}
                        className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover gap-1.5 group"
                      >
                        <span>Inspect Practice Scope</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Complementary Services */}
          <div>
            <div className="flex items-center gap-2 mb-6 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span>Complementary Creative &amp; Advisory Services</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {complementaryServices.map((comp) => (
                <div
                  key={comp.title}
                  className="p-6 rounded-2xl bg-surface border border-surface-border shadow-xs hover:border-primary/30 hover:shadow-sm transition-all duration-200 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle text-accent border border-accent/20">
                      {comp.icon}
                    </div>
                    <h4 className="text-base font-bold text-foreground font-display">
                      {comp.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {comp.description}
                    </p>
                  </div>
                  <Link
                    href={comp.href}
                    className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary-hover gap-1 group pt-2"
                  >
                    <span>View Service</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
