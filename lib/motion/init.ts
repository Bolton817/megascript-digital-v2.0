"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let isScrollTriggerRegistered = false;

export function registerGsapPlugins(): void {
  if (typeof window === "undefined") return;
  if (!isScrollTriggerRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isScrollTriggerRegistered = true;
  }
}

export function cleanupScrollTriggers(): void {
  if (typeof window === "undefined") return;
  if (isScrollTriggerRegistered) {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }
}

export { gsap, ScrollTrigger };
