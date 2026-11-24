import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { WOW_FACTORS_DATA } from "@/config/wow-factors-data";
import { WowFactorsHero } from "@/components/wow-factors/WowFactorsHero";
import { WowFactorCard } from "@/components/wow-factors/WowFactorCard";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Engineering Prototypes & Wow Factors | MegaScript Digital Kenya",
  description:
    "Explore interactive software demonstrations, real-time AI agents, rental dashboards, and high-velocity checkout engines engineered by MegaScript Digital.",
  alternates: {
    canonical: "https://megascriptdigital.co.ke/wow-factors",
  },
};

export default function WowFactorsPage() {
  const demos = Object.values(WOW_FACTORS_DATA);

  return (
    <main id="main-content" className="min-h-screen pb-16 sm:pb-24">
      {/* Hero Section */}
      <WowFactorsHero />

      {/* Demos Showcase Grid */}
      <Section spacing="lg" variant="default" id="showcase">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {demos.map((demo) => (
              <WowFactorCard key={demo.slug} demo={demo} />
            ))}
          </div>

          {/* Truthful Showcase Disclosure Banner (TDD Sheet 060) */}
          <div className="mt-12 p-6 rounded-3xl bg-surface-muted/70 border border-border flex items-start gap-4 text-xs text-muted-foreground shadow-card">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-foreground font-semibold">
                Truthful Demonstration &amp; Sandbox Integrity:
              </strong>
              <p className="leading-relaxed">
                Items featured in this showcase are classified as Live Working Demos, Visual Concepts, or Illustrative Prototypes. They demonstrate actual engineering capabilities, interface paradigms, and cloud architectures. Illustrative prototypes are not represented as client-deployed systems unless explicitly stated in verified case profiles.
              </p>
            </div>
          </div>

          {/* Bottom Conversion Section */}
          <div className="mt-16 rounded-3xl border border-border bg-surface-muted/70 p-8 sm:p-14 text-center space-y-6 max-w-4xl mx-auto shadow-card">
            <div className="space-y-3 max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Have a Complex System in Mind?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Whether you need a custom client portal, automated billing pipelines, or specialized operational tools, our engineering team builds solutions tailored to your exact business rules.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/contact?topic=custom-solution">
                <Button variant="primary" size="lg" className="gap-2">
                  <span>Discuss Your Architecture</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/services/web-app-development">
                <Button variant="outline" size="lg">
                  <span>Web App Development Scope</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
