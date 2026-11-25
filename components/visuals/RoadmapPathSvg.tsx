"use client";

import React, { useRef, useEffect } from "react";
import { motionPresets } from "@/lib/motion/presets";
import { useMotionPreference } from "@/lib/motion/useMotionPreference";

export function RoadmapPathSvg({ className = "" }: { className?: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const shouldAnimate = useMotionPreference();

  useEffect(() => {
    if (!shouldAnimate || !pathRef.current) return;
    motionPresets.svgPathDraw(pathRef.current, {
      start: "top 75%",
      end: "bottom 30%",
      scrub: 1,
    });
  }, [shouldAnimate]);

  return (
    <div className={`w-full overflow-hidden select-none pointer-events-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 80"
        className="w-full h-16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background static dashed guide */}
        <path
          d="M 50 40 Q 300 10, 600 40 T 1150 40"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="8 8"
          className="text-surface-border/60"
        />

        {/* Dynamic scroll-drawn road track */}
        <path
          ref={pathRef}
          d="M 50 40 Q 300 10, 600 40 T 1150 40"
          stroke="#0284c7"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="opacity-80"
        />

        {/* Key Milestone Nodes */}
        <circle cx="50" cy="40" r="5" fill="#0284c7" />
        <circle cx="320" cy="30" r="4" fill="#0284c7" opacity="0.7" />
        <circle cx="600" cy="40" r="5" fill="#ea580c" />
        <circle cx="880" cy="48" r="4" fill="#0284c7" opacity="0.7" />
        <circle cx="1150" cy="40" r="6" fill="#0284c7" />
      </svg>
    </div>
  );
}
