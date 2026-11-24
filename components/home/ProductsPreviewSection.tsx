import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Key, ShoppingCart, CalendarClock, Server, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function ProductsPreviewSection() {
  const products = [
    {
      name: "Fortress",
      slug: "fortress",
      tagline: "AI Website Builder for Fast Launches",
      targetUser: "Small-Business Owners, Founders & Solo Providers",
      description:
        "Guided conversational setup that generates structured multi-section website drafts, readable copy, and responsive layouts in minutes without starting from a blank page.",
      icon: <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />,
      badge: "AI Builder",
      highlights: ["Conversational setup", "Automated section assembly", "Responsive layout preview"],
    },
    {
      name: "LeaseFlow",
      slug: "leaseflow",
      tagline: "Structured Rental & Tenant Management",
      targetUser: "Property Managers, Landlords & Estate Teams",
      description:
        "Centralized rental platform for managing unit directories, tenant lease agreements, scheduled rent tracking, and maintenance requests without scattered chat threads.",
      icon: <Key className="h-6 w-6 text-primary" aria-hidden="true" />,
      badge: "Rental Management",
      highlights: ["Unit & tenant directory", "Scheduled rent tracking", "Maintenance request logs"],
    },
    {
      name: "UzaDigital",
      slug: "uzadigital",
      tagline: "Practical In-Store Point-of-Sale",
      targetUser: "Retail Shops, Boutiques & Local Merchants",
      description:
        "Clean checkout interface with fast item lookups, receipt generation, cash and M-Pesa transaction logging, and daily sales summaries built for busy counters.",
      icon: <ShoppingCart className="h-6 w-6 text-primary" aria-hidden="true" />,
      badge: "Point of Sale",
      highlights: ["Fast item lookups", "Cash & M-Pesa logging", "Daily sales summaries"],
    },
    {
      name: "FM Scheduler",
      slug: "fm-scheduler",
      tagline: "Social Media & Content Calendar",
      targetUser: "Marketing Managers, Agencies & Content Creators",
      description:
        "Visual scheduling calendar for planning multi-platform social posts, caption drafting, media asset organization, and publishing workflows without clutter.",
      icon: <CalendarClock className="h-6 w-6 text-primary" aria-hidden="true" />,
      badge: "Content Scheduling",
      highlights: ["Visual content calendar", "Multi-platform planning", "Draft approval queue"],
    },
  ];

  return (
    <Section spacing="lg" variant="default" id="products">
      <Container size="lg">
        {/* Header with Title and Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
              Proprietary Systems
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
              Independent Software Solutions
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Specialized, standalone software platforms engineered to automate everyday business workflows and eliminate operational friction.
            </p>
          </div>

          <Link href="/products" className="self-start md:self-auto">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
              View All 4 Products
            </Button>
          </Link>
        </div>

        {/* 2x2 Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {products.map((product) => (
            <div
              key={product.slug}
              className="flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-card transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary border border-primary/20">
                    {product.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-medium text-muted-foreground">
                      {product.badge}
                    </Badge>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <Server className="h-3 w-3" />
                      Standalone
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight font-display">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5">
                    {product.tagline}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border text-xs text-muted-foreground space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground block">
                    Target Audience:
                  </span>
                  <p className="font-medium text-foreground/80 leading-normal">
                    {product.targetUser}
                  </p>
                </div>

                <ul className="space-y-1.5 text-xs text-foreground/80 pt-1">
                  {product.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-surface-border">
                <Link
                  href={`/products/${product.slug}`}
                  className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover gap-1.5 transition-colors group"
                >
                  <span>Explore {product.name} Overview</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
