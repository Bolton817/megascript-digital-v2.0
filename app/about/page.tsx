import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutApproach } from "@/components/about/AboutApproach";
import { AboutValues } from "@/components/about/AboutValues";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Briefcase, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | MegaScript Digital Kenya",
  description:
    "Learn about MegaScript Digital: our mission, disciplined software engineering methodology, client ownership guarantees, and practical digital solutions.",
  alternates: {
    canonical: "https://megascriptdigital.co.ke/about",
  },
};

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <AboutHero />

      {/* Story & Agency Perspective */}
      <AboutStory />

      {/* 5-Step Operating Methodology */}
      <AboutApproach />

      {/* Core Principles & Values */}
      <AboutValues />

      {/* Conversion & Navigation CTA */}
      <Section spacing="lg" variant="default" className="border-t border-border">
        <Container size="lg">
          <div className="rounded-3xl border border-border bg-surface-muted/70 p-8 sm:p-14 text-center space-y-6 max-w-4xl mx-auto shadow-card">
            <div className="space-y-3 max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Ready to Build With Clarity?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Explore our verified client portfolio, inspect our core development offerings, or start an initial project conversation with our engineering team.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/contact">
                <Button variant="primary" size="lg" className="gap-2">
                  <span>Start a Conversation</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/portfolio">
                <Button variant="outline" size="lg" className="gap-2">
                  <Layers className="h-4 w-4" />
                  <span>View Client Portfolio</span>
                </Button>
              </Link>

              <Link href="/services">
                <Button variant="ghost" size="lg" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Explore Services</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
