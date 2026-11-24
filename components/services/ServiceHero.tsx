import React from "react";
import Link from "next/link";
import { ServiceData } from "@/config/services-data";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TechnicalDetailsModal } from "./TechnicalDetailsModal";
import { ArrowRight, Clock, Banknote, ShieldCheck } from "lucide-react";

interface ServiceHeroProps {
  service: ServiceData;
}

export function ServiceHero({ service }: ServiceHeroProps) {
  const isCore = service.category === "CORE";

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 border-b border-border bg-gradient-to-b from-surface-muted/50 to-background">
      <Container size="lg">
        <div className="max-w-4xl space-y-6">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant={isCore ? "primary" : "outline"}
              className="text-xs uppercase tracking-wider font-bold"
            >
              {isCore ? "Core Engineering Service" : "Complementary Growth Service"}
            </Badge>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
              {service.name}
            </h1>
            <p className="text-lg sm:text-xl font-medium text-primary leading-relaxed">
              {service.tagline}
            </p>
          </div>

          {/* Plain-Language Description */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {service.heroDescription}
          </p>

          {/* Transparent Website Pricing & Timeline Bar (ISOLATED ONLY TO WEBSITE DEV) */}
          {service.pricingGuidance && (
            <div className="mt-8 p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                    <Banknote className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Standard Website Pricing
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-foreground">
                      KSh {service.pricingGuidance.minKsh.toLocaleString()} – KSh{" "}
                      {service.pricingGuidance.maxKsh.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Usual Project Timeline
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-foreground">
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
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link href={service.cta.primaryHref}>
              <Button variant="primary" size="lg" className="gap-2">
                <span>{service.cta.primaryLabel}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>

            <TechnicalDetailsModal modalData={service.technicalModal} />
          </div>
        </div>
      </Container>
    </section>
  );
}
