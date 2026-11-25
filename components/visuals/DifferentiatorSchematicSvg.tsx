"use client";

import React from "react";

export interface DifferentiatorSchematicSvgProps {
  activeStep?: number;
  className?: string;
}

export function DifferentiatorSchematicSvg({
  activeStep = 0,
  className = "",
}: DifferentiatorSchematicSvgProps) {
  const steps = [
    { id: 0, label: "MULTI_PAGE_ARCH", code: "01", fill: "#0284c7" },
    { id: 1, label: "CLIENT_CUSTODY_100%", code: "02", fill: "#0284c7" },
    { id: 2, label: "SCOPED_TONY_AI", code: "03", fill: "#ea580c" },
    { id: 3, label: "RELATIONAL_PGSQL", code: "04", fill: "#0284c7" },
    { id: 4, label: "OFFLINE_RESILIENCE", code: "05", fill: "#0284c7" },
    { id: 5, label: "ZERO_LOCKIN_HANDOVER", code: "06", fill: "#ea580c" },
  ];

  const current = steps[Math.min(Math.max(activeStep, 0), steps.length - 1)];

  return (
    <div className={`p-4 rounded-2xl border border-surface-border bg-surface-subtle/80 font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-surface-border text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5 font-bold text-foreground">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          ACTIVE_SYSTEM_SCHEMATIC
        </span>
        <span className="text-primary font-bold">NODE_{current.code}</span>
      </div>

      <svg
        viewBox="0 0 320 140"
        className="w-full h-32 my-2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Schematic Circuit Lines */}
        <line x1="30" y1="70" x2="290" y2="70" stroke="currentColor" strokeWidth="1" className="text-surface-border" />
        <line x1="80" y1="30" x2="80" y2="110" stroke="currentColor" strokeWidth="1" className="text-surface-border" />
        <line x1="160" y1="20" x2="160" y2="120" stroke="currentColor" strokeWidth="1" className="text-surface-border" />
        <line x1="240" y1="30" x2="240" y2="110" stroke="currentColor" strokeWidth="1" className="text-surface-border" />

        {/* Central Hub Node */}
        <rect
          x="130"
          y="50"
          width="60"
          height="40"
          rx="8"
          fill="currentColor"
          className="text-surface"
          stroke={current.fill}
          strokeWidth="2"
        />
        <text
          x="160"
          y="74"
          textAnchor="middle"
          fill={current.fill}
          fontSize="10"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {current.code}
        </text>

        {/* Satellite Gateway Nodes */}
        <circle cx="80" cy="70" r="10" fill="currentColor" className="text-surface" stroke="#0284c7" strokeWidth="1.5" />
        <circle cx="240" cy="70" r="10" fill="currentColor" className="text-surface" stroke="#ea580c" strokeWidth="1.5" />
        <circle cx="160" cy="25" r="6" fill="#0284c7" opacity="0.6" />
        <circle cx="160" cy="115" r="6" fill="#ea580c" opacity="0.6" />

        {/* Highlight Pulse Rings around active hub */}
        <circle
          cx="160"
          cy="70"
          r="36"
          stroke={current.fill}
          strokeWidth="1"
          strokeDasharray="4 4"
          className="animate-[spin_10s_linear_infinite] origin-center opacity-40"
        />
      </svg>

      <div className="pt-2 border-t border-surface-border flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">SUBSYSTEM:</span>
        <span className="font-bold text-foreground">{current.label}</span>
      </div>
    </div>
  );
}
