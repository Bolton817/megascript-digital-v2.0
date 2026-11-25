"use client";

import React, { useEffect } from "react";
import { X, BookOpen, ShieldCheck, Target, ArrowRightLeft, MousePointerClick, Search, HelpCircle } from "lucide-react";

interface MetricGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MetricGlossaryModal({ isOpen, onClose }: MetricGlossaryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const glossaryItems = [
    {
      title: "Page Views",
      icon: BookOpen,
      tag: "Raw Volume",
      description:
        "Total count of page view events registered across the public website. Captured via client-side telemetry on initial route load and client navigation transitions.",
    },
    {
      title: "Unique Sessions",
      icon: Target,
      tag: "Audience",
      description:
        "Number of distinct browsing sessions initiated by visitors. Each session is tagged with an anonymous pseudo-random identifier (ses_...) stored in a session cookie. Resets when the browser session terminates.",
    },
    {
      title: "Conversion Rate",
      icon: ArrowRightLeft,
      tag: "Performance",
      description:
        "Calculated as (Total Inbound Leads / Unique Sessions) × 100%. Represents the efficiency of visitor traffic turning into high-intent client inquiries across contact forms and Tony AI chat handoffs.",
    },
    {
      title: "First-Touch Attribution",
      icon: Target,
      tag: "Acquisition",
      description:
        "The original marketing channel, referring URL, or UTM parameter set that introduced the visitor to Megascript for the very first time. Stored client-side and treated as strictly immutable once captured.",
    },
    {
      title: "Last-Touch Attribution",
      icon: ArrowRightLeft,
      tag: "Conversion",
      description:
        "The marketing channel, campaign, or referral source active during the visit in which the client completed an inquiry submission or Tony AI chat handoff.",
    },
    {
      title: "Product Outbound Clicks",
      icon: MousePointerClick,
      tag: "Intent",
      description:
        "Telemetry events logging click-throughs from Megascript digital product showcase profiles (e.g. Fortress) to live product deployments and demo instances.",
    },
    {
      title: "Search Query Volume",
      icon: Search,
      tag: "Discovery",
      description:
        "Telemetry logs generated when visitors perform queries via the global command palette or dedicated search page. Used to identify content gaps and service demand.",
    },
    {
      title: "Privacy & PII Protection",
      icon: ShieldCheck,
      tag: "Compliance",
      description:
        "Strict compliance with privacy regulations (including KDPA). Analytics telemetry explicitly strips and redacts email addresses, phone numbers, customer names, and credit card patterns prior to database ingestion.",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="metric-glossary-title"
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 id="metric-glossary-title" className="text-base font-semibold text-foreground font-display">
                Analytics Metric Glossary & Data Provenance
              </h2>
              <p className="text-xs text-muted-foreground">
                Authoritative specifications for first-party telemetry and attribution metrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close glossary modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-3.5 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground leading-relaxed">
            All telemetry metrics presented in the Master Operations Console are collected via Megascript&apos;s
            first-party ingestion pipeline. No third-party tracking scripts or invasive profiling cookies are utilized.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {glossaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-3.5 rounded-lg border border-border bg-card/60 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{item.title}</span>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-border bg-muted/20">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Close Glossary
          </button>
        </div>
      </div>
    </div>
  );
}
