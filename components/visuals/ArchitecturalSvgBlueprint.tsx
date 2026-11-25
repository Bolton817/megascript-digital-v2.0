"use client";

import React from "react";
import { Code2, Server, Cpu } from "lucide-react";

export interface ArchitecturalSvgBlueprintProps {
  mode?: "animated" | "static";
  className?: string;
}

export function ArchitecturalSvgBlueprint({
  mode = "animated",
  className = "",
}: ArchitecturalSvgBlueprintProps) {
  const isAnimated = mode === "animated";

  return (
    <div className={`w-full flex flex-col justify-between ${className}`}>
      {/* SVG Isometric Schematic */}
      <div className="relative w-full h-[200px] flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full max-w-[360px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="High-contrast system architectural blueprint"
        >
          {/* Blueprint Grid Lines */}
          <defs>
            <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-surface-border/60" />
            </pattern>
          </defs>
          <rect width="400" height="200" fill="url(#blueprint-grid)" opacity="0.7" />

          {/* Isometric Orbital Ring */}
          <ellipse
            cx="200"
            cy="100"
            rx="120"
            ry="45"
            stroke="#0284c7"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className={isAnimated ? "animate-[spin_24s_linear_infinite] origin-center opacity-40" : "opacity-30"}
          />

          {/* Outer Geometric Wireframe (Icosahedron projection) */}
          <g className="text-[#0284c7] transition-all duration-300">
            <polygon
              points="200,30 290,75 270,145 200,170 130,145 110,75"
              fill="none"
              stroke="#0284c7"
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="opacity-75"
            />
            {/* Internal lattice ribs */}
            <line x1="200" y1="30" x2="200" y2="170" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
            <line x1="110" y1="75" x2="290" y2="75" stroke="#0284c7" strokeWidth="0.8" opacity="0.4" />
            <line x1="130" y1="145" x2="270" y2="145" stroke="#0284c7" strokeWidth="0.8" opacity="0.4" />
            <line x1="200" y1="30" x2="130" y2="145" stroke="#0284c7" strokeWidth="0.75" opacity="0.35" />
            <line x1="200" y1="30" x2="270" y2="145" stroke="#0284c7" strokeWidth="0.75" opacity="0.35" />
            <line x1="200" y1="170" x2="110" y2="75" stroke="#0284c7" strokeWidth="0.75" opacity="0.35" />
            <line x1="200" y1="170" x2="290" y2="75" stroke="#0284c7" strokeWidth="0.75" opacity="0.35" />
          </g>

          {/* Central Nested Core Octahedron (Warm Orange #ea580c) */}
          <g className="text-[#ea580c]">
            <polygon
              points="200,65 240,100 200,135 160,100"
              fill="#ea580c"
              fillOpacity="0.08"
              stroke="#ea580c"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <line x1="200" y1="65" x2="200" y2="135" stroke="#ea580c" strokeWidth="1.2" strokeDasharray="2 2" />
            <line x1="160" y1="100" x2="240" y2="100" stroke="#ea580c" strokeWidth="1.2" strokeDasharray="2 2" />
          </g>

          {/* Active Node Points with Signal Pulse */}
          <circle cx="200" cy="30" r="3.5" fill="#0284c7" />
          <circle cx="290" cy="75" r="3" fill="#0284c7" />
          <circle cx="270" cy="145" r="3" fill="#0284c7" />
          <circle cx="200" cy="170" r="3.5" fill="#0284c7" />
          <circle cx="130" cy="145" r="3" fill="#0284c7" />
          <circle cx="110" cy="75" r="3" fill="#0284c7" />
          <circle cx="200" cy="100" r="4" fill="#ea580c" className={isAnimated ? "animate-pulse" : ""} />

          {/* Technical coordinate callouts */}
          <text x="296" y="73" fill="#0284c7" fontSize="8" fontFamily="monospace" fontWeight="bold">V_NODE_01</text>
          <text x="68" y="77" fill="#0284c7" fontSize="8" fontFamily="monospace" fontWeight="bold">V_NODE_02</text>
          <text x="206" y="103" fill="#ea580c" fontSize="8" fontFamily="monospace" fontWeight="bold">CORE_00</text>
        </svg>
      </div>

      {/* Structured Tier Cards (High Contrast & Semantic) */}
      <div className="space-y-2.5 pt-2 font-mono text-xs">
        <div className="p-3 rounded-xl border border-primary/30 bg-primary-subtle/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Code2 className="h-4 w-4 shrink-0" />
            <span>01_PRESENTATION_TIER</span>
          </div>
          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono font-semibold">
            LCP &lt; 2.5s
          </span>
        </div>

        <div className="p-3 rounded-xl border border-surface-border bg-surface-subtle flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Server className="h-4 w-4 text-primary shrink-0" />
            <span>02_DATA_&amp;_CMS_TIER</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold">
            PostgreSQL
          </span>
        </div>

        <div className="p-3 rounded-xl border border-surface-border bg-surface flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Cpu className="h-4 w-4 text-accent shrink-0" />
            <span>03_OPERATIONS_&amp;_AI</span>
          </div>
          <span className="text-[10px] text-accent font-semibold">
            Grounded AI
          </span>
        </div>
      </div>
    </div>
  );
}
