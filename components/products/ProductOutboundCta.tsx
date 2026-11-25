"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink, Sparkles, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics/tracker";

interface ProductOutboundCtaProps {
  productSlug: string;
  productName: string;
  outboundUrl?: string | null;
  ctaLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProductOutboundCta({
  productSlug,
  productName,
  outboundUrl,
  ctaLabel = "Visit Product Website",
  size = "lg",
  className = "",
}: ProductOutboundCtaProps) {
  // If an external destination URL is configured and valid
  const hasValidOutboundUrl =
    typeof outboundUrl === "string" &&
    outboundUrl.trim().length > 0 &&
    (outboundUrl.startsWith("http://") || outboundUrl.startsWith("https://"));

  const handleOutboundClick = () => {
    trackEvent("product_outbound_click", {
      component: "ProductOutboundCta",
      metadata: {
        productSlug,
        productName,
        destination: outboundUrl,
      },
    });
  };

  if (hasValidOutboundUrl) {
    return (
      <a
        href={outboundUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleOutboundClick}
        className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm bg-primary text-white hover:bg-primary-hover ${
          size === "lg" ? "px-6 py-3.5 text-base gap-2.5" : "px-4 py-2 text-sm gap-2"
        } ${className}`}
      >
        <span>{ctaLabel}</span>
        <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
      </a>
    );
  }

  // Graceful fallback when URL is unconfigured (TDD Sheet 175 Safe Fallback)
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 ${className}`}>
      <Link href={`/contact?topic=product-${productSlug}`}>
        <Button variant="primary" size={size} className="gap-2 w-full sm:w-auto">
          <span>Request {productName} Demo</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </Link>
      <div className="flex items-center gap-1.5">
        <Badge variant="outline" size="sm" className="text-[11px] border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-500/10">
          <Sparkles className="h-3 w-3 mr-1" />
          <span>Independent Platform Launching Soon</span>
        </Badge>
      </div>
    </div>
  );
}
