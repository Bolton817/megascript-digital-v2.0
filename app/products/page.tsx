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
    uzadigital: <ShoppingCart className="h-6 w-6 text-[var(--primary)]" />,
    "fm-scheduler": <CalendarCheck2 className="h-6 w-6 text-sky-600 dark:text-sky-400" />,
  };

  // Fetch database products to get any configured live outbound URLs
  const dbProducts = await getAllProducts();
  const dbUrlMap = new Map(dbProducts.map((p) => [p.slug, p.outboundUrl]));

  const productsList = Object.values(PRODUCTS_DATA);

  return (
    <main id="main-content" className="min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Header */}
      <section className="pb-12 sm:pb-16 border-b border-[var(--border)]">
        <Container size="lg">
          <div className="max-w-3xl space-y-4">
            <Badge variant="outline" className="text-xs uppercase tracking-wider font-bold">
              Software Solutions
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--foreground)]">
              Independent Software Products
            </h1>
            <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
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
                  className="flex flex-col justify-between p-6 sm:p-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm hover:border-[var(--primary)]/40 hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)]">
                        {iconMap[product.slug]}
                      </div>
                      <Badge variant="outline" size="sm" className="font-semibold text-xs">
                        {product.badge}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
                        {product.name}
                      </h2>
                      <p className="text-sm font-semibold text-[var(--primary)]">
                        {product.tagline}
                      </p>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed pt-1">
                        {product.overview}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-xs text-[var(--muted-foreground)] space-y-1">
                      <strong className="text-[var(--foreground)] block">
                        Designed For:
                      </strong>
                      <p>{product.audience}</p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center text-xs sm:text-sm font-semibold text-[var(--foreground)] hover:text-[var(--primary)] gap-1.5 transition-colors"
                    >
                      <span>Explore Product Overview</span>
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
          <div className="mt-12 p-6 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-start gap-4 text-xs text-[var(--muted-foreground)]">
            <Server className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-[var(--foreground)] font-semibold">
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
