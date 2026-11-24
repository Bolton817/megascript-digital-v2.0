import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { SERVICES_DATA } from "@/config/services-data";
import {
  Globe,
  Code2,
  Smartphone,
  Sparkles,
  Video,
  MapPin,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Core & Complementary Services | MegaScript Digital Kenya",
  description:
    "Explore our complete digital capabilities: high-speed websites, custom web applications, mobile apps, graphic design, video editing, and local visibility.",
  alternates: {
    canonical: "https://megascriptdigital.co.ke/services",
  },
};

export default function ServicesCatalogPage() {
  const iconMap: Record<string, React.ReactNode> = {
    "website-development-seo": <Globe className="h-6 w-6 text-[var(--primary)]" />,
    "web-app-development": <Code2 className="h-6 w-6 text-[var(--primary)]" />,
    "mobile-app-development": <Smartphone className="h-6 w-6 text-[var(--primary)]" />,
    "graphic-design": <Sparkles className="h-5 w-5 text-amber-500" />,
    "video-editing": <Video className="h-5 w-5 text-amber-500" />,
    "google-maps-visibility": <MapPin className="h-5 w-5 text-amber-500" />,
    "business-coaching": <TrendingUp className="h-5 w-5 text-amber-500" />,
  };

  const allServices = Object.values(SERVICES_DATA);
  const coreServices = allServices.filter((s) => s.category === "CORE");
  const complementaryServices = allServices.filter((s) => s.category === "COMPLEMENTARY");

  return (
    <main id="main-content" className="min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Header */}
      <section className="pb-12 sm:pb-16 border-b border-[var(--border)]">
        <Container size="lg">
          <div className="max-w-3xl space-y-4">
            <Badge variant="outline" className="text-xs uppercase tracking-wider font-bold">
              Full Service Capabilities
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--foreground)]">
              Services &amp; Digital Engineering
            </h1>
            <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
              We engineer dependable digital systems designed to clarify what you do, streamline operations, and support sustainable business growth.
            </p>
          </div>
        </Container>
      </section>

      {/* Core Engineering Services */}
      <Section spacing="lg" variant="default" id="core-services">
        <Container size="lg">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              Foundation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)] mt-1">
              Core Engineering Services
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2">
              Bespoke digital architecture built with modern codebases, full client asset ownership, and zero lock-in retainers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {coreServices.map((service) => (
              <div
                key={service.slug}
                className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm hover:border-[var(--primary)]/40 hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                    {iconMap[service.slug]}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] tracking-tight">
                    {service.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[var(--border)]">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center text-xs sm:text-sm font-semibold text-[var(--primary)] hover:underline gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                  >
                    <span>Explore service details</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Complementary Growth Services */}
      <Section spacing="lg" variant="subtle" id="complementary-services">
        <Container size="lg">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Visibility &amp; Brand
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)] mt-1">
              Complementary Growth Services
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2">
              Creative and strategic capabilities that elevate your visual identity, local discovery, and operational readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {complementaryServices.map((service) => (
              <div
                key={service.slug}
                className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm hover:border-amber-500/40 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
                    {iconMap[service.slug]}
                  </div>
                  <h3 className="text-base font-bold text-[var(--foreground)] tracking-tight">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--border)]">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline gap-1 transition-colors"
                  >
                    <span>View details</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
