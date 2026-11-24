import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ArrowRight, MessageCircle, ShieldCheck, CheckCircle2 } from "lucide-react";

interface ServiceCtaProps {
  cta: {
    title: string;
    subtitle: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
}

export function ServiceCta({ cta }: ServiceCtaProps) {
  return (
    <Section spacing="lg" variant="default" id="contact-cta">
      <Container size="lg">
        <div className="relative rounded-3xl border border-border bg-gradient-to-br from-surface-muted/90 via-surface to-surface-muted/80 p-8 sm:p-14 overflow-hidden shadow-card">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Next Steps</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {cta.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {cta.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link href={cta.primaryHref}>
                <Button variant="primary" size="lg" className="gap-2">
                  <span>{cta.primaryLabel}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>

              {cta.secondaryHref && (
                <a
                  href={cta.secondaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-500/20 transition-colors shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>{cta.secondaryLabel || "Chat on WhatsApp"}</span>
                </a>
              )}
            </div>

            <div className="pt-6 border-t border-border flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">100% Client Asset Ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">Transparent Written Quotes</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">Zero Recurring Retainers</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
