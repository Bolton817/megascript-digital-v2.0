import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Clock, Lock, Sparkles, Terminal, Code2, Server, Cpu } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 border-b border-surface-border bg-gradient-to-b from-surface-subtle/40 via-background to-background">
      {/* Precision Blueprint Architectural Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, rgb(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* Atmospheric Cyan and Primary Glow (strictly constrained) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-full h-[320px] bg-primary/10 dark:bg-primary/15 blur-[100px] rounded-full" />
      </div>

      <Container size="lg" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Conversion Pathways */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* System Status Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <Badge variant="primary" dot className="px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
                Creative Technology &bull; Digital Engineering
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-foreground font-display leading-[1.12]">
              We build clear, resilient <span className="text-primary">websites</span>, web applications, and <span className="text-foreground">mobile systems</span>.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-normal">
              MegaScript Digital combines disciplined visual design with high-performance software engineering. We create digital systems that explain what you do clearly, attract high-value clients, and operate without friction.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Start a Project
                </Button>
              </Link>
              <Link href="/services" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Explore Capabilities
                </Button>
              </Link>
            </div>

            {/* Verifiable Trust Chips (Truthful, Zero Fabrications) */}
            <div className="pt-6 border-t border-surface-border/80 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                <Lock className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>100% Client Owned</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                <Clock className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>2–6 Wk Delivery Guide</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                <Zap className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>Sub-2.5s LCP Target</span>
              </div>
            </div>
          </div>

          {/* Right Column: Creative-Technology Blueprint Visual Anchor */}
          <div className="lg:col-span-5 relative">
            {/* Visual Frame Container with blueprint corner crosshairs */}
            <div className="relative rounded-3xl border border-surface-border bg-surface/90 p-6 sm:p-7 shadow-layered backdrop-blur-md transition-all hover:border-primary/40">
              {/* Corner Crosshair Accents */}
              <div className="absolute -top-1.5 -left-1.5 h-3 w-3 text-primary/40 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute -top-1.5 -right-1.5 h-3 w-3 text-primary/40 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 text-primary/40 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 text-primary/40 font-mono text-xs select-none pointer-events-none">+</div>

              {/* Blueprint Header */}
              <div className="flex items-center justify-between pb-4 border-b border-surface-border/70 text-xs">
                <div className="flex items-center gap-2 font-mono font-bold text-foreground">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span>ARCHITECTURE_OVERVIEW</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  LOC: NBO_254
                </span>
              </div>

              {/* Visual Node Diagram */}
              <div className="space-y-3.5 py-4 font-mono text-xs">
                {/* Node 1: Presentation & SEO */}
                <div className="p-3.5 rounded-xl border border-primary/25 bg-primary-subtle/50 space-y-1.5">
                  <div className="flex items-center justify-between text-primary font-bold">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5" />
                      01_PRESENTATION_TIER
                    </span>
                    <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">LCP &lt; 2.5s</span>
                  </div>
                  <p className="font-sans text-[11px] text-muted-foreground leading-relaxed">
                    Next.js App Router &bull; Semantic HTML5 &bull; Automated JSON-LD Metadata
                  </p>
                </div>

                {/* Connecting Bus */}
                <div className="flex items-center justify-center text-muted-foreground/50 py-0.5">
                  <div className="w-0.5 h-3 bg-surface-border" />
                </div>

                {/* Node 2: Relational & CMS Tier */}
                <div className="p-3.5 rounded-xl border border-surface-border bg-surface-subtle space-y-1.5">
                  <div className="flex items-center justify-between text-foreground font-bold">
                    <span className="flex items-center gap-1.5">
                      <Server className="h-3.5 w-3.5 text-primary" />
                      02_DATA_&amp;_CMS_TIER
                    </span>
                    <span className="text-[10px] text-muted-foreground font-normal">PostgreSQL</span>
                  </div>
                  <p className="font-sans text-[11px] text-muted-foreground leading-relaxed">
                    Type-Safe Schema &bull; Immutable Audit Trail &bull; Zero Vendor Lock-in
                  </p>
                </div>

                {/* Connecting Bus */}
                <div className="flex items-center justify-center text-muted-foreground/50 py-0.5">
                  <div className="w-0.5 h-3 bg-surface-border" />
                </div>

                {/* Node 3: Growth & Intelligence */}
                <div className="p-3.5 rounded-xl border border-surface-border bg-surface space-y-1.5">
                  <div className="flex items-center justify-between text-foreground font-bold">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-accent" />
                      03_OPERATIONS_&amp;_AI
                    </span>
                    <span className="text-[10px] text-accent font-semibold">Grounded</span>
                  </div>
                  <p className="font-sans text-[11px] text-muted-foreground leading-relaxed">
                    Scoped Tony AI Assistant &bull; M-Pesa Gateways &bull; Automated Workflows
                  </p>
                </div>
              </div>

              {/* Blueprint Footer / Telemetry */}
              <div className="pt-3 border-t border-surface-border/70 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  SYSTEM_STATUS: HEALTHY
                </span>
                <span>CODEBASE: 100% OWNED</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
