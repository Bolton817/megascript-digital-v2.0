"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMotionPreference } from "@/lib/motion/useMotionPreference";

interface ThreeCanvasWrapperProps {
  children: (props: { isVisible: boolean }) => React.ReactNode;
  fallback: React.ReactNode;
  className?: string;
  minHeight?: string;
}

export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function ThreeCanvasWrapper({
  children,
  fallback,
  className = "",
  minHeight = "320px",
}: ThreeCanvasWrapperProps) {
  const shouldAnimate = useMotionPreference();
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  useEffect(() => {
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

  if (hasWebGL === false || !shouldAnimate) {
    return (
      <div className={className} style={{ minHeight }}>
        {fallback}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className} style={{ minHeight }}>
      {hasWebGL ? children({ isVisible }) : fallback}
    </div>
  );
}
