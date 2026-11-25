"use client";

import React, { useState, useEffect } from "react";
import { useMotionPreference } from "@/lib/motion/useMotionPreference";

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  const shouldAnimate = useMotionPreference();

  useEffect(() => {
    if (!shouldAnimate || typeof window === "undefined") {
      setProgress(0);
      return;
    }

    function handleScroll() {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const progressFraction = Math.min(Math.max(currentScroll / totalHeight, 0), 1);
      setProgress(progressFraction * 100);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [shouldAnimate]);

  if (!shouldAnimate || progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-label="Reading and scroll progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 right-0 h-[3px] bg-primary z-50 origin-left pointer-events-none transition-transform duration-75 ease-out shadow-xs"
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  );
}
