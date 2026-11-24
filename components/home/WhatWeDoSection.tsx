import React from "react";
import Link from "next/link";
import { Globe, Code2, Smartphone, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

export function WhatWeDoSection() {
  const capabilities = [
    {
      icon: <Globe className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Enterprise Website Development & SEO",
      description:
        "High-performance corporate websites built on Next.js and modern serverless infrastructure. Engineered for technical search visibility, fast page loads, and intuitive content management.",
      link: "/services/website-development-and-seo",
      highlights: ["Core Web Vitals optimized", "Structured metadata & JSON-LD", "Full client ownership"],
    },
    {
      icon: <Code2 className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Custom Web Application Engineering",
      description:
        "Bespoke operational dashboards, workflow automation tools, and customer portals. Backed by resilient PostgreSQL databases, type-safe APIs, and role-based access control.",
      link: "/services/web-application-development",
      highlights: ["Role-based access control", "Relational database models", "Secure API integrations"],
    },
    {
      icon: <Smartphone className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Mobile Application Development",
      description:
        "Fluid cross-platform iOS and Android mobile solutions built for transactional utility, customer engagement, and field operational efficiency with offline-first capabilities.",
      link: "/services/mobile-application-development",
      highlights: ["Cross-platform iOS & Android", "Offline resilience", "M-Pesa payment flows"],
    },
  ];

  return (
    <Section spacing="lg" variant="default" id="what-we-do">
      <Container size="lg">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
            Capabilities &amp; Scope
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            What We Do
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            We design, build, and optimize software platforms that resolve operational bottlenecks and attract high-value customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-subtle border border-primary/20">
                  {cap.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  {cap.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cap.description}
                </p>

                <ul className="pt-2 space-y-1.5">
                  {cap.highlights.map((h) => (
                    <li key={h} className="text-xs text-foreground/80 font-medium flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-surface-border">
                <Link
                  href={cap.link}
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover gap-1.5 transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
