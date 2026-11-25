"use client";

import { useState, useEffect } from "react";

export function useMotionPreference(): boolean {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    function evaluatePreference() {
      // 1. Check data-motion attribute set on <html> by ThemeProvider / AppearanceCustomizer
      const htmlMotion = document.documentElement.getAttribute("data-motion");
      if (htmlMotion === "paused") {
        setShouldAnimate(false);
        return;
      }

      // 2. Check OS prefers-reduced-motion media query
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setShouldAnimate(false);
        return;
      }

      setShouldAnimate(true);
    }

    evaluatePreference();

    function handleMotionChange() {
      evaluatePreference();
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMediaChange = () => evaluatePreference();

    window.addEventListener("megascript-motion-change", handleMotionChange);
    mediaQuery.addEventListener("change", handleMediaChange);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-motion") {
          evaluatePreference();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });

    return () => {
      window.removeEventListener("megascript-motion-change", handleMotionChange);
      mediaQuery.removeEventListener("change", handleMediaChange);
      observer.disconnect();
    };
  }, []);

  return shouldAnimate;
}
