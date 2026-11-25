"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ConvergenceLinesSvg } from "@/components/visuals/ConvergenceLinesSvg";
import { motionPresets } from "@/lib/motion/presets";
import { useAdaptiveRendering } from "@/lib/motion/useAdaptiveRendering";

export function FinalCtaSection() {
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);
  const { capabilities } = useAdaptiveRendering();
  const whatsappNumber = "254710398696"; // Official business line
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello MegaScript Digital, I am interested in discussing a new digital project."
  )}`;

  useEffect(() => {
    if (!capabilities.hasFinePointer || !ctaBtnRef.current) return;
    const cleanup = motionPresets.magnetic(ctaBtnRef.current, 0.25);
    return () => cleanup();
  }, [capabilities.hasFinePointer]);

  return (
    <Section spacing="lg" variant="default" id="contact-cta">
      <Container size="lg">
        <div className="relative overflow-hidden rounded-3xl bg-surface border border-surface-border p-8 sm:p-12 lg:p-16 shadow-layered">
          {/* Converging Perspective Grid Vector */}
          <ConvergenceLinesSvg />

          {/* Subtle brand color corner accent glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
              Ready to Move Forward?
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground font-display tracking-tight leading-[1.15]">
              Let&apos;s build something useful for your business.
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Whether you need a high-converting corporate website, a specialized internal web app, or an end-to-end digital overhaul, our engineering team is ready to deliver.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link href="/contact" ref={ctaBtnRef} className="w-full sm:w-auto inline-block">
                <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Start a Project
                </Button>
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" variant="outline" className="w-full sm:w-auto" leftIcon={<MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}>
                  Chat on WhatsApp
                </Button>
              </a>
            </div>

            <div className="pt-8 border-t border-surface-border flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 flex-wrap">
                <Mail className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>Direct Inbox:</span>
                <a
                  href="mailto:info@megascriptdigital.co.ke"
                  className="font-semibold text-foreground hover:text-primary transition-colors break-all sm:break-normal"
                >
                  info@megascriptdigital.co.ke
                </a>
              </div>

              <span className="hidden sm:inline text-surface-border">&bull;</span>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>Nairobi, Kenya</span>
                <span className="text-foreground/80 font-medium">(EAT / UTC+3)</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
