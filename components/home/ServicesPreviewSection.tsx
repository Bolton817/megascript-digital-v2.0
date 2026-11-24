import React from "react";
import Link from "next/link";
import { ArrowRight, Globe, Code2, Smartphone, Sparkles, Video, MapPin, TrendingUp, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function ServicesPreviewSection() {
  const coreServices = [
    {
      icon: <Globe className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Website Development & SEO",
      description:
        "Fast, mobile-first websites designed to explain what you do clearly, build trust with prospective clients, and support organic search discoverability from day one.",
      href: "/services/website-development-seo",
      scope: "Standard Commercial Engagement",
      highlights: ["Core Web Vitals optimized", "Automated JSON-LD schemas", "100% Client ownership"],
    },
    {
      icon: <Code2 className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Web Application Development",
      description:
        "Custom browser-based business portals, operational dashboards, and client tools built on relational databases, type-safe APIs, and role-based access control.",
      href: "/services/web-app-development",
      scope: "Bespoke Enterprise Scope",
      highlights: ["Role-based access control", "PostgreSQL database models", "Automated business workflows"],
    },
    {
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

  return (
    <Section spacing="lg" variant="subtle" id="services">
      <Container size="lg">
        {/* Header with Title and Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
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

        {/* 1. Core Engineering Services (3 Large Elevated Cards) */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Core Engineering Services (Primary Practice)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {coreServices.map((service, idx) => (
              <div
                key={service.title}
                className="flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-card transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary border border-primary/20">
                      {service.icon}
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      0{idx + 1}_CORE
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-foreground tracking-tight font-display">
                      {service.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-primary block mt-0.5">
                      {service.scope}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="pt-2 space-y-1.5 text-xs text-foreground/85">
                    {service.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-surface-border">
                  <Link
                    href={service.href}
                    className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover gap-1.5 transition-colors group"
                  >
                    <span>View Service Scope &amp; Details</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Complementary Growth Services (4 Compact Cards) */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Complementary Brand, Media &amp; Visibility Services
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {complementaryServices.map((service, idx) => (
              <div
                key={service.title}
                className="flex flex-col justify-between p-6 rounded-2xl bg-surface border border-surface-border shadow-xs hover:border-accent/40 hover:shadow-xs transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle text-accent border border-accent/20">
                      {service.icon}
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      0{idx + 4}_COMP
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-foreground tracking-tight font-display">
                    {service.title}
                  </h4>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-surface-border">
                  <Link
                    href={service.href}
                    className="inline-flex items-center text-xs font-semibold text-accent hover:underline gap-1 transition-colors group"
                  >
                    <span>Inspect details</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
