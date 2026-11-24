import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { KeyRound, ShieldAlert, BadgePercent, Sparkles, ShieldCheck } from "lucide-react";

export function AboutValues() {
  const values = [
    {
      title: "Direct Client Asset Ownership",
      icon: <KeyRound className="h-5 w-5 text-primary" />,
      tag: "Autonomous Control",
      description:
        "We build exclusively on your accounts. You own your code repositories, your domain registrar accounts, and your cloud hosting environments upon milestone completion.",
    },
    {
      title: "Commercial & Pricing Transparency",
      icon: <BadgePercent className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      tag: "No Hidden Costs",
      description:
        "Standard website development pricing is transparently published (KSh 35,000–125,000). For custom applications, scopes and fees are agreed upon in writing before work begins.",
    },
    {
      title: "Security by Architecture",
      icon: <ShieldAlert className="h-5 w-5 text-primary" />,
      tag: "DPA 2019 Compliant",
      description:
        "We implement server-authoritative RBAC, parameterized database connections, encrypted session cookies, and strict data protection practices adhering to Kenya's DPA 2019.",
    },
    {
      title: "Honest Engineering Capabilities",
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
      tag: "Zero Hype",
      description:
        "We do not make unverified claims of automated profits, overnight viral traffic, or artificial intelligence miracles. We build reliable, testable digital software that serves your business.",
    },
  ];

  return (
    <Section spacing="lg" variant="default" id="values">
      <Container size="lg">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Guiding Principles</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Built on Practical Integrity
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            The core principles that guide every client interaction, architectural decision, and software deployment at MegaScript Digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-card hover:shadow-layered transition-all duration-300 space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 w-fit rounded-2xl bg-surface-muted border border-border group-hover:scale-105 transition-transform duration-200">
                  {val.icon}
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-surface-muted border border-border text-muted-foreground">
                  {val.tag}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-foreground tracking-tight">
                {val.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
