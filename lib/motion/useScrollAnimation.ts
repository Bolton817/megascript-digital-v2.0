"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { registerGsapPlugins } from "./init";
import { useMotionPreference } from "./useMotionPreference";

export type AnimationScopeCallback = (context: gsap.Context) => void;

export function useScrollAnimation(
  callback: AnimationScopeCallback,
  deps: React.DependencyList = []
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldAnimate = useMotionPreference();

  useEffect(() => {
    if (!shouldAnimate || typeof window === "undefined" || !containerRef.current) {
      return;
    }

    registerGsapPlugins();

    const ctx = gsap.context((self) => {
      callback(self);
    }, containerRef);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAnimate, ...deps]);

  return containerRef;
}
