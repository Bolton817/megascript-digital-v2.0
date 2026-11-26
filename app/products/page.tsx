import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { PRODUCTS_DATA } from "@/config/products-data";
import { getAllProducts } from "@/server/services/cms/products";
import { ProductOutboundCta } from "@/components/products/ProductOutboundCta";
import {
  Sparkles,
  Building2,
  ShoppingCart,
  CalendarCheck2,
  ArrowRight,
  ShieldCheck,
  Server,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Independent Software Products | MegaScript Digital Kenya",
  description:
    "Explore our dedicated software platforms: Fortress (AI Website Builder), LeaseFlow (Rental Management), UzaDigital (Point-of-Sale), and FM Scheduler.",
  alternates: {
    canonical: "https://megascriptdigital.co.ke/products",
  },
};

export default async function ProductsCatalogPage() {
  const iconMap: Record<string, React.ReactNode> = {
    fortress: <Sparkles className="h-6 w-6 text-amber-500" />,
    leaseflow: <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
    uzadigital: <ShoppingCart className="h-6 w-6 text-primary" />,
    "fm-scheduler": <CalendarCheck2 className="h-6 w-6 text-sky-600 dark:text-sky-400" />,
  };

  // Fetch database products to get any configured live outbound URLs
  const dbProducts = await getAllProducts();
  const dbUrlMap = new Map(dbProducts.map((p) => [p.slug, p.outboundUrl]));

  const productsList = Object.values(PRODUCTS_DATA);

  return (
    <main id="main-content" className="min-h-screen pb-16 sm:pb-24">
      {/* Header */}
      <section className="pt-20 pb-12 sm:pt-24 sm:pb-16 border-b border-border bg-gradient-to-b from-surface-muted/40 via-background to-background">
        <Container size="lg">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium">
              <Layers className="h-3.5 w-3.5" />
              <span>Proprietary Cloud Platforms</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Independent Software Products
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Purpose-built software platforms developed and maintained by MegaScript Digital. Each system operates on its own dedicated cloud infrastructure tailored to distinct industry workflows.
            </p>
          </div>
        </Container>
      </section>

      {/* Product Showcase Grid */}
      <Section spacing="lg" variant="default" id="catalog">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {productsList.map((product) => {
              const liveOutboundUrl = dbUrlMap.get(product.slug) || product.defaultOutboundUrl;

              return (
                <div
                  key={product.slug}
                  className="flex flex-col justify-between p-6 sm:p-10 rounded-3xl border border-border bg-surface shadow-card hover:border-primary/40 hover:shadow-layered transition-all duration-300 group"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="p-3.5 rounded-2xl bg-surface-muted border border-border group-hover:scale-105 transition-transform duration-200">
                        {iconMap[product.slug]}
                      </div>
                      <Badge variant="outline" size="sm" className="font-mono text-xs font-semibold">
                        {product.badge}
                      </Badge>
                    </div>

                    <div className="space-y-2.5">
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                        {product.name}
                      </h2>
                      <p className="text-sm font-semibold text-primary">
                        {product.tagline}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                        {product.overview}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface-muted border border-border text-xs text-muted-foreground space-y-1">
                      <strong className="text-foreground block font-mono text-[11px] uppercase tracking-wider">
                        Engineered For:
                      </strong>
                      <p>{product.audience}</p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center text-xs sm:text-sm font-semibold text-foreground hover:text-primary gap-1.5 transition-colors"
                    >
                      <span>Explore Product Architecture</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>

                    <ProductOutboundCta
                      productSlug={product.slug}
                      productName={product.name}
                      outboundUrl={liveOutboundUrl}
                      ctaLabel={product.ctaLabel}
                      size="sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Independence Disclaimer Banner */}
          <div className="mt-12 p-6 rounded-3xl bg-surface-muted border border-border flex items-start gap-4 text-xs text-muted-foreground shadow-sm">
            <Server className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-foreground font-semibold">
                Architecture &amp; Platform Independence:
              </strong>
              <p className="leading-relaxed">
                Fortress, LeaseFlow, UzaDigital, and FM Scheduler operate on independent production domains with isolated tenant databases and dedicated user authentication. User accounts, tenant records, and software subscriptions are managed directly on each respective platform.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
