"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import {
  ArrowRight,
  Zap,
  Clock,
  Lock,
  Terminal,
  Layers,
  Box,
  ChevronDown,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ThreeCanvasWrapper } from "@/components/three/ThreeCanvasWrapper";
import { ArchitecturalSvgBlueprint } from "@/components/visuals/ArchitecturalSvgBlueprint";
import { useScrollAnimation } from "@/lib/motion/useScrollAnimation";
import { motionPresets } from "@/lib/motion/presets";
import { useAdaptiveRendering } from "@/lib/motion/useAdaptiveRendering";
import type { HeroArchitecturalSceneProps } from "@/components/three/HeroArchitecturalScene";

const HeroArchitecturalScene = dynamic<HeroArchitecturalSceneProps>(
  () =>
    import("@/components/three/HeroArchitecturalScene").then(
      (mod) => mod.HeroArchitecturalScene
    ),
  { ssr: false }
);

export function HeroSection() {
  const [activeView, setActiveView] = useState<"3d" | "blueprint">("3d");
  const { isFull, isStatic } = useAdaptiveRendering();

  const leftColRef = useScrollAnimation((ctx: gsap.Context) => {
    const headline = ctx.selector?.("h1");
    const chips = ctx.selector?.(".trust-chip");
    const ctas = ctx.selector?.(".hero-cta-group");

    if (headline) {
      motionPresets.textEntrance(headline, { delay: 0.05 });
    }
    if (ctas && ctas.length > 0) {
      motionPresets.reveal(ctas, { delay: 0.2, y: 14 });
    }
    if (chips && chips.length > 0) {
      motionPresets.stagger(chips, { delay: 0.35, y: 14 });
    }
  });

  const blueprintFallback = (
    <ArchitecturalSvgBlueprint mode={isStatic ? "static" : "animated"} />
  );

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 border-b border-surface-border bg-gradient-to-b from-surface-subtle/40 via-background to-background">
      {/* Precision Blueprint Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, rgb(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* Subtle Brand Accent Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-full h-[320px] bg-primary/10 dark:bg-primary/15 blur-[100px] rounded-full" />
      </div>

      <Container size="lg" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Immediate Content & Coordinated Entrances */}
          <div ref={leftColRef} className="lg:col-span-7 space-y-7 text-left">
            <div className="inline-flex items-center gap-2">
              <Badge variant="primary" dot className="px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
                Creative Technology &bull; Digital Engineering
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-foreground font-display leading-[1.12]">
              We build clear, resilient <span className="text-primary">websites</span>, web applications, and <span className="text-foreground">mobile systems</span>.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-normal">
              MegaScript Digital combines disciplined visual design with high-performance software engineering. We create digital systems that explain what you do clearly, attract high-value clients, and operate without friction.
            </p>

            <div className="hero-cta-group flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
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

            <div className="pt-6 border-t border-surface-border/80 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="trust-chip flex items-center gap-2 text-xs font-medium text-foreground/80">
                <Lock className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>100% Client Owned</span>
              </div>
              <div className="trust-chip flex items-center gap-2 text-xs font-medium text-foreground/80">
                <Clock className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>2–6 Wk Delivery Guide</span>
              </div>
              <div className="trust-chip flex items-center gap-2 text-xs font-medium text-foreground/80">
                <Zap className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>Sub-2.5s LCP Target</span>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Visual Card (3D / High-Contrast Blueprint) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl border border-surface-border bg-surface/90 p-6 sm:p-7 shadow-layered backdrop-blur-md transition-all hover:border-primary/40 min-h-[440px] flex flex-col justify-between">
              {/* Corner Engineering Crosshairs */}
              <div className="absolute -top-1.5 -left-1.5 h-3 w-3 text-primary/40 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute -top-1.5 -right-1.5 h-3 w-3 text-primary/40 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 text-primary/40 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 text-primary/40 font-mono text-xs select-none pointer-events-none">+</div>

              <div className="flex items-center justify-between pb-3.5 border-b border-surface-border/70 text-xs">
                <div className="flex items-center gap-2 font-mono font-bold text-foreground">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span>ARCHITECTURE_OVERVIEW</span>
                </div>

                {/* View Switcher Pills */}
                <div className="flex items-center gap-1 bg-surface-muted/80 p-0.5 rounded-lg border border-surface-border">
                  <button
                    type="button"
                    onClick={() => setActiveView("3d")}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono font-semibold transition-all ${
                      activeView === "3d" && isFull
                        ? "bg-surface text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Interactive 3D Architectural Model"
                  >
                    <Box className="h-3 w-3" />
                    <span>3D</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView("blueprint")}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono font-semibold transition-all ${
                      activeView === "blueprint" || !isFull
                        ? "bg-surface text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="High-Contrast Vector Blueprint Diagram"
                  >
                    <Layers className="h-3 w-3" />
                    <span>Nodes</span>
                  </button>
                </div>
              </div>

              {/* Visual Body */}
              <div className="flex-1 flex items-center justify-center py-2">
                {activeView === "3d" && isFull ? (
                  <ThreeCanvasWrapper
                    fallback={blueprintFallback}
                    className="w-full h-full min-h-[310px] flex items-center justify-center"
                  >
                    {({ isVisible }: { isVisible: boolean }) => (
                      <HeroArchitecturalScene isVisible={isVisible} />
                    )}
                  </ThreeCanvasWrapper>
                ) : (
                  blueprintFallback
                )}
              </div>

              {/* Card Footer Status */}
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

        {/* Directional Visual Indicator into What We Do */}
        <div className="pt-12 flex justify-center">
          <a
            href="#what-we-do"
            aria-label="Scroll to What We Do"
            className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group"
          >
            <span className="font-mono text-[10px] tracking-wider uppercase font-semibold">Explore Engineering Scope</span>
            <ChevronDown className="h-4 w-4 animate-bounce text-primary/60 group-hover:text-primary transition-colors" />
          </a>
        </div>
      </Container>
    </section>
  );
}
