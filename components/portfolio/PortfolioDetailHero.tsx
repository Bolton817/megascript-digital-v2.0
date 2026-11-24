import React from "react";
import Link from "next/link";
import { PortfolioProjectData } from "@/config/portfolio-data";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";

interface PortfolioDetailHeroProps {
  project: PortfolioProjectData;
}

export function PortfolioDetailHero({ project }: PortfolioDetailHeroProps) {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 border-b border-border bg-gradient-to-b from-surface-muted/50 via-background to-background">
      <Container size="lg">
        <div className="max-w-4xl space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <Link href="/portfolio" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Portfolio</span>
            </Link>
            <span>/</span>
            <span className="text-foreground truncate">{project.businessName}</span>
          </div>

          {/* Identity & Badges */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-16 w-16 rounded-3xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black font-mono text-xl tracking-wider shadow-card">
              {project.monogram}
            </div>
            <div className="space-y-1">
              <Badge variant="outline" size="sm" className="font-mono text-xs font-semibold">
                {project.industry}
              </Badge>
              {project.isFeatured && (
                <span className="block text-xs font-semibold text-primary">
                  Homepage Featured Client
                </span>
              )}
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-3">
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.12]">
              {project.businessName}
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
              {project.businessDescription}
            </p>
          </div>

          {/* Action Links */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-semibold rounded-2xl px-6 py-3 text-sm gap-2 bg-primary text-white hover:bg-primary-hover transition-all shadow-card"
              >
                <span>Visit Verified Client Website</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-medium text-foreground">Independent Client Domain &bull; Direct Client Ownership</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
