import React from "react";
import Link from "next/link";
import { PortfolioProjectData } from "@/config/portfolio-data";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";

interface PortfolioDetailHeroProps {
  project: PortfolioProjectData;
}

export function PortfolioDetailHero({ project }: PortfolioDetailHeroProps) {
  return (
    <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-muted)]/50 to-[var(--background)]">
      <Container size="lg">
        <div className="max-w-4xl space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            <Link href="/portfolio" className="hover:text-[var(--primary)] transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Portfolio</span>
            </Link>
            <span>/</span>
            <span className="text-[var(--foreground)] truncate">{project.businessName}</span>
          </div>

          {/* Identity & Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 flex items-center justify-center font-black font-mono text-base tracking-wider">
              {project.monogram}
            </div>
            <div className="space-y-0.5">
              <Badge variant="outline" size="sm" className="font-semibold text-xs">
                {project.industry}
              </Badge>
              {project.isFeatured && (
                <span className="block text-[11px] font-semibold text-[var(--primary)]">
                  Homepage Featured Client
                </span>
              )}
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--foreground)] leading-[1.15]">
              {project.businessName}
            </h1>
            <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
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
                className="inline-flex items-center justify-center font-semibold rounded-xl px-5 py-2.5 text-sm gap-2 bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all shadow-xs"
              >
                <span>Visit Verified Client Website</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}

            <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Independent Client Domain &bull; Direct Client Ownership</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
