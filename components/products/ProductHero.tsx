import React from "react";
import { ProductData } from "@/config/products-data";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ProductOutboundCta } from "./ProductOutboundCta";
import { ShieldCheck, Server } from "lucide-react";

interface ProductHeroProps {
  product: ProductData;
  outboundUrl?: string | null;
}

export function ProductHero({ product, outboundUrl }: ProductHeroProps) {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-muted)]/50 to-[var(--background)]">
      <Container size="lg">
        <div className="max-w-4xl space-y-6">
          {/* Badge & Independent Product Indicator */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="primary" className="text-xs uppercase tracking-wider font-bold">
              {product.badge}
            </Badge>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[11px] font-medium text-[var(--muted-foreground)]">
              <Server className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Independent Platform • Dedicated Cloud Architecture</span>
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--foreground)] leading-[1.15]">
              {product.name}
            </h1>
            <p className="text-lg sm:text-xl font-medium text-[var(--primary)] leading-relaxed">
              {product.tagline}
            </p>
          </div>

          {/* Overview */}
          <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed max-w-3xl">
            {product.overview}
          </p>

          {/* Outbound CTA & Notice */}
          <div className="pt-4 space-y-4">
            <ProductOutboundCta
              productSlug={product.slug}
              productName={product.name}
              outboundUrl={outboundUrl}
              ctaLabel={product.ctaLabel}
              size="lg"
            />

            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Engineered &amp; supported by MegaScript Digital. Separate user accounts and dedicated data storage.
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
