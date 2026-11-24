import React from "react";
import Link from "next/link";
import { ArrowRight, Globe, Code2, Smartphone, Sparkles, Video, MapPin, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

export function ServicesPreviewSection() {
  const coreServices = [
    {
      icon: <Globe className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Website Development & Technical SEO",
      description:
        "Custom, high-speed corporate websites optimized for technical search indexation, accessibility, and high conversion rates across all viewports.",
      href: "/services/website-development-seo",
      category: "Core Engineering",
    },
    {
      icon: <Code2 className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Custom Web Application Development",
      description:
        "Scalable operational software, business portals, and internal automated systems built on robust databases and modern API architectures.",
      href: "/services/web-app-development",
      category: "Core Engineering",
    },
    {
      icon: <Smartphone className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Mobile Application Development",
      description:
        "High-performance native and cross-platform iOS & Android mobile apps engineered for speed, offline resilience, and localized payment flows.",
      href: "/services/mobile-app-development",
      category: "Core Engineering",
    },
  ];

  const complementaryServices = [
    {
      icon: <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />,
      title: "Graphic Design & Brand Systems",
      description: "Cohesive corporate identities, design systems, and digital marketing collateral.",
      href: "/services/graphic-design",
    },
    {
      icon: <Video className="h-5 w-5 text-accent" aria-hidden="true" />,
      title: "Professional Video Editing",
      description: "Engaging commercial showreels, social clips, and corporate documentary post-production.",
      href: "/services/video-editing",
    },
    {
      icon: <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />,
      title: "Google Maps & Local Search Visibility",
      description: "Local SEO optimization, verified business profile ranking, and customer direction flows.",
      href: "/services/google-maps-visibility",
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-accent" aria-hidden="true" />,
      title: "Business Technology Coaching",
      description: "Strategic guidance on tool selection, system architecture, and operational modernization.",
      href: "/services/business-coaching",
    },
  ];

  return (
    <Section spacing="lg" variant="subtle" id="services">
      <Container size="lg">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
            Comprehensive Solutions
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Our Services
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            End-to-end digital capabilities designed to build, scale, and protect your digital presence.
          </p>
        </div>

        {/* Core Services Grid */}
        <div className="mb-12">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">
            Core Engineering Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {coreServices.map((service) => (
              <div
                key={service.title}
                className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-subtle border border-primary/20">
                    {service.icon}
                  </div>
                  <h4 className="text-xl font-bold text-foreground tracking-tight">
                    {service.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-surface-border">
                  <Link
                    href={service.href}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover gap-1.5 transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    <span>View service details</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complementary Growth Services Grid */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">
            Complementary Growth &amp; Visibility Services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {complementaryServices.map((service) => (
              <div
                key={service.title}
                className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-surface border border-surface-border shadow-xs hover:border-accent/40 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                    {service.icon}
                  </div>
                  <h4 className="text-base font-bold text-foreground tracking-tight">
                    {service.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-surface-border">
                  <Link
                    href={service.href}
                    className="inline-flex items-center text-xs font-semibold text-accent hover:underline gap-1 transition-colors"
                  >
                    <span>Explore details</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
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
