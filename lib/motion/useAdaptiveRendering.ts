"use client";

import { useState, useEffect } from "react";
import {
  RenderingMode,
  DeviceCapabilities,
  getDeviceCapabilities,
  determineRenderingMode,
} from "./adaptive";

export interface AdaptiveRenderingState {
  mode: RenderingMode;
  isFull: boolean;
  isLightweight: boolean;
  isStatic: boolean;
  capabilities: DeviceCapabilities;
}

export function useAdaptiveRendering(): AdaptiveRenderingState {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() => getDeviceCapabilities());
  const [mode, setMode] = useState<RenderingMode>("full");

  useEffect(() => {
    const caps = getDeviceCapabilities();
    setCapabilities(caps);

    function evaluate() {
      const htmlMotion = document.documentElement.getAttribute("data-motion");
      const htmlQuality = document.documentElement.getAttribute("data-visual-quality");
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const isReduced = mediaQuery.matches;

      const newMode = determineRenderingMode(htmlMotion, htmlQuality, caps, isReduced);
      setMode(newMode);
    }

    evaluate();

    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const contrastMedia = window.matchMedia("(prefers-contrast: more)");

    const handleMediaChange = () => evaluate();
    const handleCustomChange = () => evaluate();

    window.addEventListener("megascript-motion-change", handleCustomChange);
    window.addEventListener("megascript-quality-change", handleCustomChange);
    motionMedia.addEventListener("change", handleMediaChange);
    contrastMedia.addEventListener("change", handleMediaChange);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (
          m.type === "attributes" &&
          (m.attributeName === "data-motion" || m.attributeName === "data-visual-quality")
        ) {
          evaluate();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion", "data-visual-quality"],
    });

    return () => {
      window.removeEventListener("megascript-motion-change", handleCustomChange);
      window.removeEventListener("megascript-quality-change", handleCustomChange);
      motionMedia.removeEventListener("change", handleMediaChange);
      contrastMedia.removeEventListener("change", handleMediaChange);
      observer.disconnect();
    };
  }, []);

  return {
    mode,
    isFull: mode === "full",
    isLightweight: mode === "lightweight",
    isStatic: mode === "static",
    capabilities,
  };
}
