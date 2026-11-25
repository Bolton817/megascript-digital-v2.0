"use client";

import React from "react";

export function CapabilityFlowConnector({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full py-4 select-none pointer-events-none hidden lg:block ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1000 60"
        className="w-full h-14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Guide Line */}
        <line
          x1="120"
          y1="30"
          x2="880"
          y2="30"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          className="text-surface-border"
        />

        {/* Animated Data Bus (Sky-Blue #0284c7) */}
        <line
          x1="120"
          y1="30"
          x2="880"
          y2="30"
          stroke="#0284c7"
          strokeWidth="2"
          strokeDasharray="40 180"
          strokeLinecap="round"
          className="opacity-70 animate-[pulse_3s_ease-in-out_infinite]"
        />

        {/* Node 1: Website Dev Gateway */}
        <circle cx="240" cy="30" r="7" fill="#0284c7" fillOpacity="0.15" stroke="#0284c7" strokeWidth="2" />
        <circle cx="240" cy="30" r="3" fill="#0284c7" />
        <text x="240" y="52" textAnchor="middle" fill="#0284c7" fontSize="9" fontFamily="monospace" fontWeight="bold">
          01_WEB_TIER
        </text>

        {/* Node 2: Web App Gateway */}
        <circle cx="500" cy="30" r="7" fill="#0284c7" fillOpacity="0.15" stroke="#0284c7" strokeWidth="2" />
        <circle cx="500" cy="30" r="3" fill="#0284c7" />
        <text x="500" y="52" textAnchor="middle" fill="#0284c7" fontSize="9" fontFamily="monospace" fontWeight="bold">
          02_APP_TIER
        </text>

        {/* Node 3: Mobile App Gateway */}
        <circle cx="760" cy="30" r="7" fill="#ea580c" fillOpacity="0.15" stroke="#ea580c" strokeWidth="2" />
        <circle cx="760" cy="30" r="3" fill="#ea580c" />
        <text x="760" y="52" textAnchor="middle" fill="#ea580c" fontSize="9" fontFamily="monospace" fontWeight="bold">
          03_MOBILE_TIER
        </text>
      </svg>
    </div>
  );
}
