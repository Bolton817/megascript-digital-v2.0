import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Layers, Lightbulb, Target } from "lucide-react";

export function AboutStory() {
  return (
    <Section spacing="lg" variant="default" id="story">
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              Our Perspective
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
              Why We Build Differently
            </h2>
          </div>

          <div className="lg:col-span-2 space-y-6 text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
            <p>
              Many businesses encounter digital agencies that overpromise automated miracles, deliver bloated templates with endless ongoing lock-ins, or hand over fragile codebases that break the moment a minor update is required.
            </p>
            <p>
              MegaScript Digital was formed around a simpler, disciplined discipline: treat digital systems as serious business infrastructure. We combine thoughtful interface design, secure serverless cloud architecture, and maintainable codebases so that business owners understand exactly what they own, how it works, and how it serves their customers.
            </p>
            <p>
              Whether engineering a fast commercial website for an East African safari operator or architecting an internal rental ledger platform, our focus remains unchanged: eliminate operational friction, respect client autonomy, and deliver software that works every day without drama.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] space-y-2">
                <div className="p-2 w-fit rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Target className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">
                  Clear Commercial Intent
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  Every page layout and application route is designed around genuine visitor actions: booking an inquiry, exploring packages, or submitting a qualification form.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] space-y-2">
                <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Layers className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">
                  No Agency Hostage Taking
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
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
