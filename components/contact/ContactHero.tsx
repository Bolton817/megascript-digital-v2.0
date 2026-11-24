import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Clock, ShieldCheck, MessageSquare } from "lucide-react";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-16 bg-surface-subtle border-b border-surface-border">
      {/* Background glow & subtle grid */}
      <div
        className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-10 -z-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container>
        <div className="max-w-3xl space-y-6">
          <Badge variant="primary" size="md">
            Start a Conversation
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground font-display leading-[1.12]">
            Let&apos;s build software and systems that{" "}
            <span className="text-primary">grow your business</span>.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Whether you need a performant website, custom web application,
            mobile app, or technical advice, share your requirements below. We
            offer transparent scoping, architectural honesty, and zero sales
            pressure.
          </p>

          {/* Value Commitments */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-surface-border/60">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-foreground block">
                  24-Hour SLA
                </span>
                <span className="text-muted-foreground">
                  Response within 1 business day
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-foreground block">
                  NDA Ready
                </span>
                <span className="text-muted-foreground">
                  Confidential scoping on request
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-foreground block">
                  Direct Engineers
                </span>
                <span className="text-muted-foreground">
                  Talk directly with technical leads
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
