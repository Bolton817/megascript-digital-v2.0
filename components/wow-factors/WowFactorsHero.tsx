"use client";

import React from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { Container } from "@/components/ui/Container";
import { Terminal, ShieldCheck, Cpu, Box } from "lucide-react";
import { ThreeCanvasWrapper } from "@/components/three/ThreeCanvasWrapper";
import { useScrollAnimation } from "@/lib/motion/useScrollAnimation";
import { motionPresets } from "@/lib/motion/presets";
import type { WowFactorsSceneProps } from "@/components/three/WowFactorsScene";

const WowFactorsScene = dynamic<WowFactorsSceneProps>(
  () =>
    import("@/components/three/WowFactorsScene").then(
      (mod) => mod.WowFactorsScene
    ),
  { ssr: false }
);

export function WowFactorsHero() {
  const heroRef = useScrollAnimation((ctx: gsap.Context) => {
    const heading = ctx.selector?.("h1");
    if (heading) {
      motionPresets.textEntrance(heading, { delay: 0.1 });
    }
  });

  const staticFallback = (
    <div className="w-full h-full min-h-[260px] rounded-3xl border border-surface-border bg-surface-subtle/60 p-6 flex flex-col justify-between font-mono text-xs text-muted-foreground">
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <span className="flex items-center gap-1.5 font-bold text-foreground">
          <Terminal className="h-4 w-4 text-primary" />
          PROTOTYPE_SANDBOX
        </span>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">
          LIVE_ENGINEERING
        </span>
      </div>
      <div className="py-6 text-center space-y-1">
        <div className="text-sm font-semibold text-foreground">
          Interactive Lattice &amp; Sandboxes
        </div>
        <p className="text-[11px] text-muted-foreground font-sans">
          GPU acceleration &bull; Raycasted interaction &bull; Zero heavy assets
        </p>
      </div>
      <div className="pt-3 border-t border-surface-border flex items-center justify-between text-[11px]">
        <span>STATUS: ACTIVE</span>
        <span>LATENCY: &lt; 16ms</span>
      </div>
    </div>
  );

  return (
    <section
      ref={heroRef}
      className="relative pt-20 pb-16 sm:pt-24 sm:pb-24 border-b border-border bg-gradient-to-b from-surface-muted/50 via-background to-background overflow-hidden"
    >
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium">
              <Cpu className="h-3.5 w-3.5" />
              <span>Applied Engineering &amp; Interactive Sandboxes</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.12]">
              Engineering &amp; Interactive Showcases
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Beyond standard business websites, we engineer custom software architectures, real-time AI assistants, and high-velocity workflow systems. Explore our working prototypes, sandbox demos, and architectural concepts below.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">Interactive Sandboxes</span>
              </div>
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-accent" />
                <span className="font-medium text-foreground">Selective Three.js</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-foreground">Truthfully Labeled Prototypes</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl border border-surface-border bg-surface/90 p-5 shadow-layered backdrop-blur-md">
              <ThreeCanvasWrapper
                fallback={staticFallback}
                className="w-full h-full min-h-[260px] flex items-center justify-center"
              >
                {({ isVisible }: { isVisible: boolean }) => (
                  <WowFactorsScene isVisible={isVisible} />
                )}
              </ThreeCanvasWrapper>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
