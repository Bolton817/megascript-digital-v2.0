import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Layers, Target, Compass, CheckCircle2 } from "lucide-react";

export function AboutStory() {
  return (
    <Section spacing="lg" variant="default" id="story">
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium">
              <Compass className="h-3.5 w-3.5" />
              <span>Our Perspective</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Why We Build Differently.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-2">
              Many businesses encounter digital agencies that overpromise automated miracles, deliver bloated templates with endless ongoing lock-ins, or hand over fragile codebases that break the moment a minor update is required.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <div className="p-6 sm:p-8 rounded-3xl border border-border bg-surface-muted/50 shadow-card space-y-4">
              <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
                MegaScript Digital was formed around a simpler, disciplined standard: <span className="text-primary font-bold">treat digital systems as serious business infrastructure.</span>
              </p>
              <p>
                We combine thoughtful interface design, secure serverless cloud architecture, and maintainable codebases so that business owners understand exactly what they own, how it works, and how it serves their customers.
              </p>
              <p>
                Whether engineering a fast commercial website for an East African safari operator or architecting an internal rental ledger platform, our focus remains unchanged: eliminate operational friction, respect client autonomy, and deliver software that works every day without drama.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-6 rounded-3xl border border-border bg-surface shadow-card space-y-3">
                <div className="p-2.5 w-fit rounded-xl bg-primary/10 text-primary">
                  <Target className="h-4 w-4" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Clear Commercial Intent
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every page layout and application route is designed around genuine visitor actions: booking an inquiry, exploring packages, or submitting a qualification form.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-border bg-surface shadow-card space-y-3">
                <div className="p-2.5 w-fit rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Layers className="h-4 w-4" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Zero Agency Hostage Taking
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You own your code repositories, your domain DNS records, and your cloud hosting accounts. We build on your infrastructure so you are never locked in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
