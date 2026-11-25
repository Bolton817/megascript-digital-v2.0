"use client";

export type RenderingMode = "full" | "lightweight" | "static";
export type VisualQualitySetting = "auto" | "lightweight";

export interface DeviceCapabilities {
  hasWebGL: boolean;
  isLowMemory: boolean;
  isLowConcurrency: boolean;
  isSlowConnection: boolean;
  isSaveData: boolean;
  hasFinePointer: boolean;
  prefersMoreContrast: boolean;
}

export function isWebGLSupported(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function getDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === "undefined") {
    return {
      hasWebGL: false,
      isLowMemory: false,
      isLowConcurrency: false,
      isSlowConnection: false,
      isSaveData: false,
      hasFinePointer: true,
      prefersMoreContrast: false,
    };
  }

  // 1. WebGL Support
  const hasWebGL = isWebGLSupported();

  // 2. Hardware Memory (navigator.deviceMemory in GB)
  const nav = navigator as any;
  const memory = typeof nav.deviceMemory === "number" ? nav.deviceMemory : null;
  const isLowMemory = memory !== null && memory < 4;

  // 3. Hardware Concurrency (CPU Cores)
  const cores = typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency : null;
  const isLowConcurrency = cores !== null && cores <= 4;

  // 4. Network Connection (Network Information API)
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  const isSaveData = Boolean(conn?.saveData);
  const effectiveType = conn?.effectiveType ? String(conn.effectiveType).toLowerCase() : "";
  const isSlowConnection = ["slow-2g", "2g", "3g"].includes(effectiveType);

  // 5. Pointer Capabilities
  let hasFinePointer = true;
  try {
    hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  } catch {
    hasFinePointer = true;
  }

  // 6. Contrast Preference
  let prefersMoreContrast = false;
  try {
    prefersMoreContrast = window.matchMedia("(prefers-contrast: more)").matches;
  } catch {
    prefersMoreContrast = false;
  }

  return {
    hasWebGL,
    isLowMemory,
    isLowConcurrency,
    isSlowConnection,
    isSaveData,
    hasFinePointer,
    prefersMoreContrast,
  };
}

export function determineRenderingMode(
  motionPreference: string | null,
  qualitySetting: string | null,
  capabilities: DeviceCapabilities,
  reducedMotion: boolean
): RenderingMode {
  // Rule 1: Master motion pause or OS prefers-reduced-motion always enforces Mode C (Static)
  if (motionPreference === "paused" || reducedMotion) {
    return "static";
  }

  // Rule 2: Explicit user preference for Lightweight experience selects Mode B
  if (qualitySetting === "lightweight") {
    return "lightweight";
  }

  // Rule 3: Network constraints (saveData or 2G/3G connections) select Mode B
  if (capabilities.isSaveData || capabilities.isSlowConnection) {
    return "lightweight";
  }

  // Rule 4: Constrained hardware (low memory or low CPU cores) selects Mode B
  if (capabilities.isLowMemory || capabilities.isLowConcurrency) {
    return "lightweight";
  }

  // Rule 5: Lack of WebGL support selects Mode B
  if (!capabilities.hasWebGL) {
    return "lightweight";
  }

  // Default: Capable hardware, stable network, and active motion selects Mode A (Full)
  return "full";
}
