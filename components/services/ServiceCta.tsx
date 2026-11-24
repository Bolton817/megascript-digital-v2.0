import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";

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
        <div className="relative rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-muted)] via-[var(--surface)] to-[var(--surface-muted)] p-8 sm:p-14 overflow-hidden shadow-sm">
          <div className="max-w-2xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              Next Steps
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight">
              {cta.title}
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-500/20 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>{cta.secondaryLabel || "Chat on WhatsApp"}</span>
                </a>
              )}
            </div>

            <div className="pt-6 border-t border-[var(--border)] flex flex-wrap items-center gap-6 text-xs text-[var(--muted-foreground)]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Client Asset Ownership</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Transparent Written Quotes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Recurring Agency Retainers</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
