import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Code2, Compass, ShieldCheck, Terminal, MapPin, Sparkles } from "lucide-react";

export function AboutHero() {
  return (
    <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-24 border-b border-border bg-gradient-to-b from-surface-muted/50 via-background to-background">
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium">
              <Compass className="h-3.5 w-3.5" />
              <span>About MegaScript Digital</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.12]">
              Engineered for Operational Clarity.
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
              MegaScript Digital is a Kenyan digital engineering and software consultancy. We build high-speed corporate websites, custom web applications, mobile platforms, and specialized software systems tailored to real business workflows.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">Nairobi, Kenya &bull; East Africa</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-foreground">Full-Stack Engineering</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-foreground">Direct Client Asset Ownership</span>
              </div>
            </div>
          </div>

          {/* Right Blueprint Studio Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-muted-foreground">
                    Engineering Studio
                  </span>
                </div>
                <span className="text-[11px] font-mono text-primary font-semibold">
                  NBO / EST. 2024
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-surface-muted border border-border space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Terminal className="h-4 w-4 text-primary" />
                    <span>The Engineering Charter</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Software is not marketing fluff—it is operational infrastructure. We build clean, high-performance systems that clients own completely.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl border border-border bg-surface-muted/60 space-y-1">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase">Core Focus</span>
                    <div className="font-display text-sm font-bold text-foreground">Modern Web &amp; Apps</div>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-border bg-surface-muted/60 space-y-1">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase">Philosophy</span>
                    <div className="font-display text-sm font-bold text-foreground">Zero Retainers</div>
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
