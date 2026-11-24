import React from "react";
import Link from "next/link";
import { PortfolioProjectData } from "@/config/portfolio-data";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, ExternalLink } from "lucide-react";

interface PortfolioCardProps {
  project: PortfolioProjectData;
}

export function PortfolioCard({ project }: PortfolioCardProps) {
  return (
    <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-card hover:border-primary/40 hover:shadow-layered transition-all duration-300 group">
      <div className="space-y-5">
        {/* Top Header: Monogram Avatar & Sector Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black font-mono text-sm tracking-wider group-hover:scale-105 transition-transform duration-200">
              {project.monogram}
            </div>
            {project.isFeatured && (
              <Badge variant="primary" size="sm" className="text-[10px] uppercase font-mono font-bold">
                Featured
              </Badge>
            )}
          </div>
          <Badge variant="outline" size="sm" className="text-xs font-mono font-medium text-muted-foreground">
            {project.industry}
          </Badge>
        </div>

        {/* Client Title & Description */}
        <div className="space-y-2">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {project.businessName}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {project.businessDescription}
          </p>
        </div>

        {/* Delivered Scope Box */}
        <div className="p-4 rounded-2xl bg-surface-muted/70 border border-border space-y-1.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground block">
            Delivered Scope:
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {project.deliveredWork}
          </p>
        </div>
      </div>

      {/* Footer Navigation Actions */}
      <div className="pt-6 mt-6 border-t border-border flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/portfolio/${project.slug}`}
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover gap-1.5 transition-colors focus-visible:outline-none focus-visible:underline"
        >
          <span>Read Case Profile</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>

        {project.externalUrl && (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-muted transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}
