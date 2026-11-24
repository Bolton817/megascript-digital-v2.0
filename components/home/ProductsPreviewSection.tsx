import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Key, ShoppingCart, CalendarClock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

export function ProductsPreviewSection() {
  const products = [
    {
      name: "Fortress",
      slug: "fortress",
      tagline: "Real-Time Access & Incident Monitoring",
      targetUser: "Commercial Security & Facility Directors",
      description:
        "Comprehensive operational security console with live incident telemetry, automated guard checkpoint verification, and rapid alert dispatch.",
      icon: <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />,
      badge: "Security & Operations",
    },
    {
      name: "LeaseFlow",
      slug: "leaseflow",
      tagline: "Automated Commercial Property Management",
      targetUser: "Property Managers & Real Estate Portfolios",
      description:
        "End-to-end leasing management platform handling automated rent tracking, tenant onboarding, maintenance ticketing, and financial statements.",
      icon: <Key className="h-6 w-6 text-primary" aria-hidden="true" />,
      badge: "Real Estate SaaS",
    },
    {
      name: "UzaDigital",
      slug: "uzadigital",
      tagline: "High-Velocity Retail Commerce Engine",
      targetUser: "Multi-Location Retailers & Wholesalers",
      description:
        "Cloud retail e-commerce platform featuring integrated M-Pesa automated reconciliation, instant inventory syncing, and delivery tracking.",
      icon: <ShoppingCart className="h-6 w-6 text-primary" aria-hidden="true" />,
      badge: "E-Commerce",
    },
    {
      name: "FM Scheduler",
      slug: "fm-scheduler",
      tagline: "Facility Maintenance & Workforce Dispatch",
      targetUser: "Facility Teams & Field Service Operators",
      description:
        "Intelligent resource and maintenance dispatch scheduler optimizing preventive maintenance cycles, technician routes, and asset tracking.",
      icon: <CalendarClock className="h-6 w-6 text-primary" aria-hidden="true" />,
      badge: "Field Operations",
    },
  ];

  return (
    <Section spacing="lg" variant="default" id="products">
      <Container size="lg">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
            Proprietary Products
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Independent Software Solutions
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Specialized, standalone software platforms engineered to automate complex workflows and scale enterprise operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {products.map((product) => (
            <div
              key={product.slug}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-subtle border border-primary/20">
                    {product.icon}
                  </div>
                  <Badge variant="outline" className="text-xs font-medium text-muted-foreground">
                    {product.badge}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm font-semibold text-primary mt-0.5">
                    {product.tagline}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-2">
                  <span className="text-xs font-semibold text-foreground/70">
                    Designed for:{" "}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {product.targetUser}
                  </span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-surface-border">
                <Link
                  href={`/products/${product.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover gap-1.5 transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  <span>Explore {product.name} introduction</span>
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
