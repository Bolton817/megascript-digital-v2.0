import React from "react";
import { KeyRound, Gauge, Search, Handshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

export function DifferentiatorsSection() {
  const differentiators = [
    {
      icon: <KeyRound className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "100% Client Ownership from Day 1",
      description:
        "You retain direct administrative ownership of your domain names, code repositories, DNS, and hosting accounts. We never hold your digital assets hostage or lock you into proprietary platforms.",
    },
    {
      icon: <Gauge className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Engineered for Core Web Vitals & Speed",
      description:
        "We reject bloated visual-builder themes and slow plugins. Every application is built with clean semantics, pre-rendered static routes, and optimized font budgets for instant mobile loading.",
    },
    {
      icon: <Search className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Architectural Technical SEO",
      description:
        "SEO is not an afterthought or an expensive add-on. Valid structured data, dynamic XML sitemaps, semantic hierarchy, and OpenGraph tags are built directly into the codebase.",
    },
    {
      icon: <Handshake className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: "Self-Sufficiency & Structured Handover",
      description:
        "We conduct video walkthroughs, provide clear operational guides, and configure intuitive CMS editing so your team can publish and update content without paying a developer for every edit.",
    },
  ];

  return (
    <Section spacing="lg" variant="subtle" id="differentiators">
      <Container size="lg">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
            The MegaScript Standard
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            What Makes Us Different
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            We reject opaque agency retainers, bloated dependencies, and proprietary lock-in. Here is how we build differently:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {differentiators.map((diff) => (
            <div
              key={diff.title}
              className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle border border-primary/20">
                  {diff.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    {diff.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {diff.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
