"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  SlidersHorizontal,
  Sun,
  Moon,
  Play,
  Pause,
  RotateCcw,
  X,
  Sparkles,
  Zap,
  Gauge,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function AppearanceCustomizer() {
  const {
    theme,
    setTheme,
    motion,
    setMotion,
    visualQuality,
    setVisualQuality,
    textSize,
    setTextSize,
    resetToDefaults,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 left-20 sm:left-24 z-40">
      {/* Floating Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls="appearance-customizer-panel"
        aria-label="Website appearance, motion, and accessibility settings"
        title="Customization Settings (Theme, Font Size, Motion, Rendering)"
        className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-surface-border bg-surface/95 text-foreground shadow-card backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-primary/50 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <SlidersHorizontal className="h-5 w-5 text-primary transition-transform duration-200 group-hover:rotate-45" />
        <span className="sr-only">Appearance &amp; Accessibility Settings</span>

        {(theme === "dark" || motion === "paused" || visualQuality === "lightweight" || textSize !== "default") && (
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-surface" />
        )}
      </button>

      {/* Flyout Customization Panel */}
      {isOpen && (
        <div
          id="appearance-customizer-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="customizer-heading"
          className="absolute bottom-14 left-0 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-surface-border bg-surface/98 p-5 shadow-layered backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2
                id="customizer-heading"
                className="text-sm font-bold text-foreground tracking-tight"
              >
                Website Preferences
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close preferences panel"
              className="rounded-lg p-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 pt-3.5">
            {/* 1. Theme / Appearance Mode */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                Appearance
              </label>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Theme selection">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  aria-pressed={theme === "light"}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    theme === "light"
                      ? "bg-primary-subtle text-primary border-primary/40 shadow-xs"
                      : "bg-surface-subtle text-muted-foreground border-surface-border hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  <span>Bright</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  aria-pressed={theme === "dark"}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    theme === "dark"
                      ? "bg-primary-subtle text-primary border-primary/40 shadow-xs"
                      : "bg-surface-subtle text-muted-foreground border-surface-border hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  <span>Dark</span>
                </button>
              </div>
            </div>

            {/* 2. Motion / Animations (Master Pause) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Motion
                </label>
                <span className="text-[10px] text-muted-foreground">
                  Respects OS reduced motion
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Motion preference">
                <button
                  type="button"
                  onClick={() => setMotion("active")}
                  aria-pressed={motion === "active"}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    motion === "active"
                      ? "bg-primary-subtle text-primary border-primary/40 shadow-xs"
                      : "bg-surface-subtle text-muted-foreground border-surface-border hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Active</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMotion("paused")}
                  aria-pressed={motion === "paused"}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    motion === "paused"
                      ? "bg-primary-subtle text-primary border-primary/40 shadow-xs"
                      : "bg-surface-subtle text-muted-foreground border-surface-border hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  <Pause className="h-3.5 w-3.5" />
                  <span>Paused</span>
                </button>
              </div>
            </div>

            {/* 3. Rendering Quality (Adaptive vs Lightweight) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Visual Rendering
                </label>
                <span className="text-[10px] text-muted-foreground">
                  Adaptive 3D / SVG
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Visual quality selection">
                <button
                  type="button"
                  onClick={() => setVisualQuality("auto")}
                  aria-pressed={visualQuality === "auto"}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    visualQuality === "auto"
                      ? "bg-primary-subtle text-primary border-primary/40 shadow-xs"
                      : "bg-surface-subtle text-muted-foreground border-surface-border hover:bg-surface-muted hover:text-foreground"
                  }`}
                  title="Automatically adjusts between full 3D and lightweight SVG based on device performance"
                >
                  <Gauge className="h-3.5 w-3.5" />
                  <span>Auto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisualQuality("lightweight")}
                  aria-pressed={visualQuality === "lightweight"}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    visualQuality === "lightweight"
                      ? "bg-primary-subtle text-primary border-primary/40 shadow-xs"
                      : "bg-surface-subtle text-muted-foreground border-surface-border hover:bg-surface-muted hover:text-foreground"
                  }`}
                  title="Forces optimized high-contrast SVG and CSS vector visuals"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Lightweight</span>
                </button>
              </div>
            </div>

            {/* 4. Font Size Customization */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Font Size
                </label>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {textSize === "sm" ? "14px (87.5%)" : textSize === "lg" ? "18px (112.5%)" : "16px (100%)"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Font size selection">
                <button
                  type="button"
                  onClick={() => setTextSize("sm")}
                  aria-pressed={textSize === "sm"}
                  className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    textSize === "sm"
                      ? "bg-primary-subtle text-primary border-primary/40 shadow-xs"
                      : "bg-surface-subtle text-muted-foreground border-surface-border hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  <span className="text-[11px] font-bold">A-</span>
                  <span className="text-[10px] opacity-75">Small</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTextSize("default")}
                  aria-pressed={textSize === "default"}
                  className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    textSize === "default"
                      ? "bg-primary-subtle text-primary border-primary/40 shadow-xs"
                      : "bg-surface-subtle text-muted-foreground border-surface-border hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  <span className="text-xs font-bold">A</span>
                  <span className="text-[10px] opacity-75">Default</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTextSize("lg")}
                  aria-pressed={textSize === "lg"}
                  className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    textSize === "lg"
                      ? "bg-primary-subtle text-primary border-primary/40 shadow-xs"
                      : "bg-surface-subtle text-muted-foreground border-surface-border hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  <span className="text-sm font-bold">A+</span>
                  <span className="text-[10px] opacity-75">Large</span>
                </button>
              </div>
            </div>

            {/* 5. Reset Action */}
            <div className="pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={resetToDefaults}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restore Default Preferences</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
