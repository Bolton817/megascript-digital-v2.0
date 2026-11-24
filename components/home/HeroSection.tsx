import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Clock, Lock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 border-b border-surface-border bg-gradient-to-b from-surface-subtle/50 to-background">
      {/* Subtle geometric background grid for technical tone */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(rgb(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* Subtle ambient cyan glow behind hero (isolated in overflow-clipped layer) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-full h-[260px] bg-primary/5 blur-3xl rounded-full" />
      </div>

      <Container size="lg" className="relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2">
            <Badge variant="primary" dot className="px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
              Digital Engineering &amp; Growth Partner
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground font-display leading-[1.15]">
            We engineer resilient websites, custom web applications, and mobile digital solutions.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
            From Nairobi to regional enterprises, MegaScript Digital builds fast, secure, and revenue-driving digital platforms backed by robust infrastructure, technical SEO, and dedicated engineering.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Start a Project
              </Button>
            </Link>
            <Link href="#featured-work" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Our Work
              </Button>
            </Link>
          </div>

          {/* Verifiable Trust Metrics Bar (TDD Sheet 035) */}
          <div className="pt-8 border-t border-surface-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-3.5 rounded-2xl bg-surface border border-surface-border/90 shadow-xs hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 text-primary font-bold text-base sm:text-lg">
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="font-mono">11+ Projects</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Delivered across East Africa</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-surface-border/90 shadow-xs hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 text-primary font-bold text-base sm:text-lg">
                <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="font-mono">2–6 Weeks</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Typical standard delivery</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-surface-border/90 shadow-xs hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 text-primary font-bold text-base sm:text-lg">
                <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="font-mono">100% Owned</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Client owns domain &amp; code</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-surface-border/90 shadow-xs hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 text-primary font-bold text-base sm:text-lg">
                <Zap className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="font-mono">Fast &amp; SEO-First</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Core Web Vitals optimized</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
