"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAndPersistAttribution } from "@/lib/analytics/utm";
import { trackEvent } from "@/lib/analytics/tracker";

function UTMTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (pathname?.startsWith("/master")) return;

    const currentParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer || "";

    const attribution = captureAndPersistAttribution(currentParams, referrer, pathname);

    const fullRoute = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    if (lastTrackedPath.current !== fullRoute) {
      lastTrackedPath.current = fullRoute;

      trackEvent("page_view", {
        route: pathname,
        sourceChannel: attribution.lastTouch?.source || attribution.firstTouch?.source || "direct",
        metadata: {
          referrerDomain: referrer ? new URL(referrer).hostname : "direct",
          campaign: attribution.lastTouch?.campaign || attribution.firstTouch?.campaign,
        },
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function UTMTracker() {
  return (
    <Suspense fallback={null}>
      <UTMTrackerInner />
    </Suspense>
  );
}
