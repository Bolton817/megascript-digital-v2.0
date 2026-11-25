"use client";

import React from "react";

export function ConvergenceLinesSvg({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20 dark:opacity-25 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Converging perspective perspective rays pointing toward center CTA */}
        <line x1="0" y1="0" x2="500" y2="250" stroke="#0284c7" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="250" y1="0" x2="500" y2="250" stroke="#0284c7" strokeWidth="0.8" />
        <line x1="750" y1="0" x2="500" y2="250" stroke="#0284c7" strokeWidth="0.8" />
        <line x1="1000" y1="0" x2="500" y2="250" stroke="#0284c7" strokeWidth="1" strokeDasharray="6 6" />

        <line x1="0" y1="500" x2="500" y2="250" stroke="#ea580c" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="300" y1="500" x2="500" y2="250" stroke="#ea580c" strokeWidth="0.8" />
        <line x1="700" y1="500" x2="500" y2="250" stroke="#ea580c" strokeWidth="0.8" />
        <line x1="1000" y1="500" x2="500" y2="250" stroke="#ea580c" strokeWidth="1" strokeDasharray="6 6" />

        {/* Central Convergence Target Rings */}
        <circle cx="500" cy="250" r="80" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_40s_linear_infinite] origin-center" />
        <circle cx="500" cy="250" r="140" stroke="#ea580c" strokeWidth="0.75" strokeDasharray="6 6" className="animate-[spin_60s_linear_infinite] origin-center" />
      </svg>
    </div>
  );
}
