import React from "react";
import Link from "next/link";
import { WowFactorData } from "@/config/wow-factors-data";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, ArrowRight, ExternalLink, Terminal, Sparkles } from "lucide-react";

interface WowFactorCardProps {
  demo: WowFactorData;
}

export function WowFactorCard({ demo }: WowFactorCardProps) {
  const isLiveDemo = demo.demonstrationType === "LIVE_DEMO";

  return (
    <div className="flex flex-col justify-between p-6 sm:p-10 rounded-3xl border border-border bg-surface shadow-card hover:border-primary/40 hover:shadow-layered transition-all duration-300 group">
      <div className="space-y-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" size="sm" className="font-mono text-xs font-semibold">
            {demo.category}
          </Badge>

          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
              isLiveDemo
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
            }`}
          >
            {demo.typeBadgeLabel}
          </span>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {demo.title}
          </h2>
          <p className="text-sm font-semibold text-primary">
            {demo.tagline}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
            {demo.summary}
          </p>
        </div>

        {/* Technical Capabilities List */}
        <div className="space-y-2.5 pt-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground block">
            Engineered Capabilities:
          </span>
          <ul className="space-y-2">
            {demo.capabilities.map((cap, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{cap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Operational Value Box */}
        <div className="p-4 rounded-2xl bg-surface-muted border border-border text-xs text-muted-foreground space-y-1">
          <strong className="text-foreground block font-mono text-[11px] uppercase tracking-wider">
            Operational Value:
          </strong>
          <p className="leading-relaxed">{demo.operationalValue}</p>
        </div>
      </div>

      {/* Footer Action Links */}
      <div className="pt-6 mt-6 border-t border-border flex flex-wrap items-center justify-between gap-3">
        {demo.demoUrl ? (
          <Link
            href={demo.demoUrl}
            className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover gap-1.5 transition-colors focus-visible:outline-none focus-visible:underline"
          >
            <span>{demo.ctaText}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : (
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            <Terminal className="h-3.5 w-3.5" />
            <span>Active on Website Shell</span>
          </div>
        )}

        <Link
          href={`/contact?topic=custom-solution`}
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground gap-1.5 px-3.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-muted transition-colors"
        >
          <span>Request Custom Build</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
