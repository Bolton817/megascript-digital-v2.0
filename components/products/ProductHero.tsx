import React from "react";
import { ProductData } from "@/config/products-data";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ProductOutboundCta } from "./ProductOutboundCta";
import { ShieldCheck, Server, Sparkles, Terminal, Layers, ArrowRight, CheckCircle2, Clock, Smartphone } from "lucide-react";

interface ProductHeroProps {
  product: ProductData;
  outboundUrl?: string | null;
}

export function ProductHero({ product, outboundUrl }: ProductHeroProps) {
  // Render distinctive visual composition diagram tailored to each product
  const renderProductIllustration = () => {
    switch (product.slug) {
      case "fortress":
        return (
          <div className="relative rounded-3xl border border-surface-border bg-surface p-6 sm:p-7 shadow-layered font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5 text-primary font-bold">
                <Terminal className="h-3.5 w-3.5" />
                FORTRESS_ASSEMBLY_ENGINE
              </span>
              <span className="text-[10px] text-accent font-semibold">AI_ASSISTED</span>
            </div>

            <div className="space-y-3 font-sans">
              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                  01. Conversational Prompt Input
                </span>
                <p className="text-xs text-foreground font-medium">
                  &ldquo;East African safari operator requiring tour showcase and inquiry forms.&rdquo;
                </p>
              </div>

              <div className="flex justify-center text-muted-foreground">
                <span className="text-xs font-mono">&darr; Section Assembly Pipeline</span>
              </div>

              <div className="p-3.5 rounded-xl border border-primary/30 bg-primary-subtle/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-primary font-mono">
                  <span>02. Generated Blueprint Layout</span>
                  <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">320px – 1440px</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono">
                  <div className="p-1 rounded bg-surface border border-surface-border text-foreground/80">Hero</div>
                  <div className="p-1 rounded bg-surface border border-surface-border text-foreground/80">Tours</div>
                  <div className="p-1 rounded bg-surface border border-surface-border text-foreground/80">Trust</div>
                  <div className="p-1 rounded bg-surface border border-surface-border text-foreground/80">Inquiry</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                [Conceptual Demonstration &bull; Fortress System]
              </span>
              <span>ZERO_BLANK_PAGE</span>
            </div>
          </div>
        );

      case "leaseflow":
        return (
          <div className="relative rounded-3xl border border-surface-border bg-surface p-6 sm:p-7 shadow-layered font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5 text-primary font-bold">
                <Terminal className="h-3.5 w-3.5" />
                LEASEFLOW_RENTAL_LEDGER
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">UNIT_TRACKER</span>
            </div>

            <div className="space-y-2.5 font-sans">
              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-foreground block">Unit 4B &bull; Residential</span>
                  <span className="text-[11px] text-muted-foreground">Tenant: Active Lease</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  PAID ON TIME
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-foreground block">Unit 2A &bull; Commercial</span>
                  <span className="text-[11px] text-muted-foreground">Due: 5th of Month</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  DUE IN 3 DAYS
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-foreground block">Unit 7C &bull; Residential</span>
                  <span className="text-[11px] text-muted-foreground">Maintenance: Plumbing Inspection</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  LOGGED
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                [Conceptual Workflow &bull; LeaseFlow Platform]
              </span>
              <span>NO_SCATTERED_NOTES</span>
            </div>
          </div>
        );

      case "uzadigital":
        return (
          <div className="relative rounded-3xl border border-surface-border bg-surface p-6 sm:p-7 shadow-layered font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5 text-primary font-bold">
                <Terminal className="h-3.5 w-3.5" />
                UZADIGITAL_POS_REGISTER
              </span>
              <span className="text-[10px] text-primary font-semibold">CHECKOUT_ENGINE</span>
            </div>

            <div className="space-y-3 font-sans">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface-subtle border border-surface-border">
                  <span className="text-[10px] font-mono text-muted-foreground block">ITEM SCAN</span>
                  <span className="font-bold text-foreground">Artisan Roast 500g</span>
                  <span className="text-primary font-bold block text-[11px] mt-0.5">KSh 1,200</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-subtle border border-surface-border">
                  <span className="text-[10px] font-mono text-muted-foreground block">ITEM SCAN</span>
                  <span className="font-bold text-foreground">Ceramic Dripper</span>
                  <span className="text-primary font-bold block text-[11px] mt-0.5">KSh 2,400</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-primary/30 bg-primary-subtle/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span>Cart Total:</span>
                  <span className="text-primary text-sm font-mono">KSh 3,600</span>
                </div>
                <div className="flex items-center gap-2 pt-1 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    M-Pesa STK Push
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-foreground/80">
                    Cash
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                [Conceptual Interface Concept &bull; UzaDigital POS]
              </span>
              <span>RAPID_CHECKOUT</span>
            </div>
          </div>
        );

      case "fm-scheduler":
        return (
          <div className="relative rounded-3xl border border-surface-border bg-surface p-6 sm:p-7 shadow-layered font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5 text-primary font-bold">
                <Terminal className="h-3.5 w-3.5" />
                FM_SCHEDULER_CALENDAR
              </span>
              <span className="text-[10px] text-accent font-semibold">CONTENT_DISPATCH</span>
            </div>

            <div className="space-y-2.5 font-sans">
              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-foreground block">Monday 09:00 AM</span>
                  <span className="text-[11px] text-muted-foreground">Reel Dispatch &bull; Instagram &amp; TikTok</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary-subtle text-primary">
                  SCHEDULED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-foreground block">Wednesday 02:00 PM</span>
                  <span className="text-[11px] text-muted-foreground">Client Appearance Booking &bull; 2h</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  CONFIRMED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-foreground block">Friday 11:30 AM</span>
                  <span className="text-[11px] text-muted-foreground">Weekly Newsletter Broadcast</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-accent/10 text-accent">
                  IN QUEUE
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                [Conceptual Workflow Preview &bull; FM Scheduler]
              </span>
              <span>ONE_CALENDAR</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-24 border-b border-surface-border bg-gradient-to-b from-surface-subtle/50 via-background to-background">
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Product Details and Outbound CTA */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badge & Independent Product Indicator */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="primary" className="text-xs uppercase tracking-wider font-bold">
                {product.badge}
              </Badge>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-surface-border bg-surface text-[11px] font-medium text-muted-foreground">
                <Server className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Independent Platform &bull; Dedicated Cloud Architecture</span>
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-display leading-[1.15]">
                {product.name}
              </h1>
              <p className="text-lg sm:text-xl font-medium text-primary leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* Overview */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl font-normal">
              {product.overview}
            </p>

            {/* Outbound CTA & Notice */}
            <div className="pt-2 space-y-3">
              <ProductOutboundCta
                productSlug={product.slug}
                productName={product.name}
                outboundUrl={outboundUrl}
                ctaLabel={product.ctaLabel}
                size="lg"
              />

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Engineered &amp; supported by MegaScript Digital. Separate user accounts and dedicated data storage.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Tailored Product Diagram Card */}
          <div className="lg:col-span-5">
            {renderProductIllustration()}
          </div>
        </div>
      </Container>
    </section>
  );
}
