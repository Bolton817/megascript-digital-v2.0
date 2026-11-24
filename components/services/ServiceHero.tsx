import React from "react";
import Link from "next/link";
import { ServiceData } from "@/config/services-data";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TechnicalDetailsModal } from "./TechnicalDetailsModal";
import {
  ArrowRight,
  Clock,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers,
} from "lucide-react";

interface ServiceHeroProps {
  service: ServiceData;
}

export function ServiceHero({ service }: ServiceHeroProps) {
  const isCore = service.category === "CORE";

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 border-b border-border bg-gradient-to-b from-surface-muted/40 via-background to-background">
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Main Editorial Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <Badge
                variant={isCore ? "primary" : "outline"}
                className="text-xs uppercase tracking-wider font-bold"
              >
                {isCore ? "Core Engineering Capability" : "Complementary Growth Service"}
              </Badge>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.12]">
                {service.name}
              </h1>
              <p className="text-lg sm:text-xl font-medium text-primary leading-relaxed">
                {service.tagline}
              </p>
            </div>

            {/* Plain-Language Description */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {service.heroDescription}
            </p>

            {/* Transparent Website Pricing & Timeline Bar (ISOLATED ONLY TO WEBSITE DEV) */}
            {service.pricingGuidance && (
              <div className="p-6 rounded-3xl border border-primary/20 bg-primary/5 shadow-card space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                      <Banknote className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Standard Website Pricing
                      </span>
                      <div className="font-display text-xl sm:text-2xl font-black text-foreground">
                        KSh {service.pricingGuidance.minKsh.toLocaleString()} – KSh{" "}
                        {service.pricingGuidance.maxKsh.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                      <Clock className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Usual Delivery Horizon
                      </span>
                      <div className="font-display text-xl sm:text-2xl font-black text-foreground">
                        {service.pricingGuidance.timeline}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{service.pricingGuidance.disclaimer}</span>
                </div>
              </div>
            )}

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link href={service.cta.primaryHref}>
                <Button variant="primary" size="lg" className="gap-2">
                  <span>{service.cta.primaryLabel}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>

              <TechnicalDetailsModal modalData={service.technicalModal} />
            </div>
          </div>

          {/* Right Architecture / Engineering Spec Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-muted-foreground">
                    Engineering Architecture
                  </span>
                </div>
                <span className="text-[11px] font-mono font-medium text-primary">
                  Spec: {service.slug}
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-surface-muted border border-border space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Cpu className="h-4 w-4 text-primary" />
                    <span>Technical Delivery Standard</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Zero lock-in architecture built on standard web frameworks with full Git source repository access and client asset handover upon milestone completion.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      Classification
                    </span>
                    <span className="font-semibold text-foreground">
                      {isCore ? "Core Engineering" : "Complementary Growth"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      Asset Ownership
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      100% Client Owned
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Terminal className="h-3.5 w-3.5 text-primary" />
                      Scope Clarity
                    </span>
                    <span className="font-semibold text-foreground">
                      Strict Written SOW
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1.5">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      Typical Horizon
                    </span>
                    <span className="font-semibold text-foreground">
                      {service.pricingGuidance?.timeline || "Milestone-based delivery"}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      Direct engineering consultation. Transparent written quotation with milestone sign-offs.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
