import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { KeyRound, ShieldAlert, BadgePercent, Sparkles } from "lucide-react";

export function AboutValues() {
  const values = [
    {
      title: "Direct Client Ownership",
      icon: <KeyRound className="h-5 w-5 text-primary" />,
      description:
        "We build exclusively on your accounts. You own your code repositories, your domain registrar accounts, and your cloud hosting environments.",
    },
    {
      title: "Pricing Transparency",
      icon: <BadgePercent className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      description:
        "Standard website development pricing is transparently published (KSh 35,000–125,000). For custom applications, scopes and fees are agreed upon in writing before work begins.",
    },
    {
      title: "Security by Architecture",
      icon: <ShieldAlert className="h-5 w-5 text-primary" />,
      description:
        "We implement server-authoritative RBAC, parameterized database connections, encrypted session cookies, and strict data protection practices adhering to Kenya's DPA 2019.",
    },
    {
      title: "Honest Capabilities",
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
      description:
        "We do not make unverified claims of automated profits, overnight viral traffic, or artificial intelligence miracles. We build reliable, testable digital software that serves your business.",
    },
  ];

  return (
    <Section spacing="lg" variant="default" id="values">
      <Container size="lg">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Our Principles
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-2">
            Built on Practical Integrity
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            The values that guide every client interaction, engineering decision, and software deployment at MegaScript Digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl border border-border bg-surface-muted space-y-3 shadow-xs"
            >
              <div className="p-3 w-fit rounded-xl bg-surface border border-border">
                {val.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">
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
