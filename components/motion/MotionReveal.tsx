"use client";

import React from "react";
import gsap from "gsap";
import { useScrollAnimation } from "@/lib/motion/useScrollAnimation";
import { motionPresets } from "@/lib/motion/presets";
import { useMotionPreference } from "@/lib/motion/useMotionPreference";

interface MotionRevealProps {
  children: React.ReactNode;
  preset?: "reveal" | "stagger" | "textEntrance";
  className?: string;
  delay?: number;
  y?: number;
}

export function MotionReveal({
  children,
  preset = "reveal",
  className = "",
  delay = 0,
  y = 28,
}: MotionRevealProps) {
  const shouldAnimate = useMotionPreference();

  const ref = useScrollAnimation((ctx: gsap.Context) => {
    if (!shouldAnimate || !ref.current) return;

    if (preset === "reveal") {
      motionPresets.reveal(ref.current, { delay, y });
    } else if (preset === "textEntrance") {
      motionPresets.textEntrance(ref.current, { delay, y });
    } else if (preset === "stagger") {
      const items = Array.from(ref.current.children);
      if (items.length > 0) {
        motionPresets.stagger(items, { delay, y });
      }
    }
  }, [preset, delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
