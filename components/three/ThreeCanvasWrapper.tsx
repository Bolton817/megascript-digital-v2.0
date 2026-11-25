"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAdaptiveRendering } from "@/lib/motion/useAdaptiveRendering";
import { isWebGLSupported } from "@/lib/motion/adaptive";

interface ThreeCanvasWrapperProps {
  children: (props: { isVisible: boolean }) => React.ReactNode;
  fallback: React.ReactNode;
  className?: string;
  minHeight?: string;
}

export function isWebGLAvailable(): boolean {
  return isWebGLSupported();
}

export function ThreeCanvasWrapper({
  children,
  fallback,
  className = "",
  minHeight = "320px",
}: ThreeCanvasWrapperProps) {
  const { isFull } = useAdaptiveRendering();
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!containerRef.current || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry?.isIntersecting ?? false);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const shouldAnimate = useAdaptiveRendering().isStatic === false;
  const hasWebGL = isWebGLSupported();

  // When WebGL is unavailable, motion is paused, before client mount, or Adaptive Mode is not full, immediately render fallback
  if (!mounted || hasWebGL === false || !shouldAnimate || !isFull) {
    return (
      <div className={className} style={{ minHeight }}>
        {fallback}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className} style={{ minHeight }}>
      {children({ isVisible })}
    </div>
  );
}
