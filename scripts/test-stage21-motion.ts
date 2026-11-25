import fs from "fs";
import path from "path";
import { MOTION_DURATIONS, MOTION_EASINGS } from "../lib/motion/tokens";
import { motionPresets } from "../lib/motion/presets";
import { isWebGLAvailable } from "../components/three/ThreeCanvasWrapper";

console.log("======================================================");
console.log("  Stage 21: GSAP Motion & Selective Three.js Test Suite ");
console.log("======================================================");

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}${details ? ` - ${details}` : ""}`);
    failCount++;
  }
}

async function runTests() {
  const rootDir = process.cwd();

  // --- 1. Testing Named Motion Presets (Task 104, Spec Sheet 031) ---
  console.log("\n--- 1. Testing Named Motion Presets & Tokens ---");
  assert(typeof MOTION_DURATIONS.fast === "number" && MOTION_DURATIONS.fast === 0.3, "MOTION_DURATIONS.fast is 0.3s");
  assert(typeof MOTION_DURATIONS.base === "number" && MOTION_DURATIONS.base === 0.5, "MOTION_DURATIONS.base is 0.5s");
  assert(typeof MOTION_DURATIONS.slow === "number" && MOTION_DURATIONS.slow === 0.8, "MOTION_DURATIONS.slow is 0.8s");
  assert(typeof MOTION_DURATIONS.deliberate === "number" && MOTION_DURATIONS.deliberate === 1.2, "MOTION_DURATIONS.deliberate is 1.2s");
  assert(MOTION_EASINGS.power2Out === "power2.out", "MOTION_EASINGS includes power2.out");
  assert(MOTION_EASINGS.power3Out === "power3.out", "MOTION_EASINGS includes power3.out");

  assert(typeof motionPresets.reveal === "function", "Preset: reveal exists");
  assert(typeof motionPresets.stagger === "function", "Preset: stagger exists");
  assert(typeof motionPresets.textEntrance === "function", "Preset: textEntrance exists");
  assert(typeof motionPresets.parallax === "function", "Preset: parallax exists");
  assert(typeof motionPresets.pinStory === "function", "Preset: pinStory exists");
  assert(typeof motionPresets.horizontalSequence === "function", "Preset: horizontalSequence exists");
  assert(typeof motionPresets.scrollProgress === "function", "Preset: scrollProgress exists");

  // --- 2. Testing Selective Animation Sections (Task 105, Spec Sheet 031) ---
  console.log("\n--- 2. Testing Audited Animated Sections ---");
  const heroFile = fs.readFileSync(path.join(rootDir, "components/home/HeroSection.tsx"), "utf-8");
  assert(heroFile.includes("HeroArchitecturalScene"), "HeroSection imports HeroArchitecturalScene");
  assert(heroFile.includes("textEntrance"), "HeroSection uses textEntrance preset for headline");
  assert(heroFile.includes("trust-chip"), "HeroSection targets trust-chip elements for stagger entrance");

  const whatWeDoFile = fs.readFileSync(path.join(rootDir, "components/home/WhatWeDoSection.tsx"), "utf-8");
  assert(whatWeDoFile.includes("capability-card"), "WhatWeDoSection defines capability-card targets");
  assert(whatWeDoFile.includes("stagger"), "WhatWeDoSection applies stagger preset to capability cards");

  const diffFile = fs.readFileSync(path.join(rootDir, "components/home/DifferentiatorsSection.tsx"), "utf-8");
  assert(diffFile.includes("differentiators-pinned-sidebar"), "DifferentiatorsSection has pinned sidebar target");
  assert(diffFile.includes("differentiator-card"), "DifferentiatorsSection targets differentiator cards");

  const portFile = fs.readFileSync(path.join(rootDir, "components/home/FeaturedPortfolioSection.tsx"), "utf-8");
  assert(portFile.includes("portfolio-horizontal-track"), "FeaturedPortfolioSection defines horizontal track");
  assert(portFile.includes("portfolio-card"), "FeaturedPortfolioSection targets portfolio cards");

  const wowHeroFile = fs.readFileSync(path.join(rootDir, "components/wow-factors/WowFactorsHero.tsx"), "utf-8");
  assert(wowHeroFile.includes("WowFactorsScene"), "WowFactorsHero imports WowFactorsScene");
  assert(wowHeroFile.includes("ThreeCanvasWrapper"), "WowFactorsHero wraps 3D scene in ThreeCanvasWrapper");

  const layoutFile = fs.readFileSync(path.join(rootDir, "app/layout.tsx"), "utf-8");
  assert(layoutFile.includes("ScrollProgressBar"), "app/layout.tsx mounts ScrollProgressBar component");

  // --- 3. Testing Mobile Alternatives (Task 106, Spec Sheet 031) ---
  console.log("\n--- 3. Testing Mobile Alternatives for Pinned & Horizontal Sequences ---");
  assert(diffFile.includes("gsap.matchMedia()"), "DifferentiatorsSection uses gsap.matchMedia()");
  assert(diffFile.includes("(min-width: 1024px)"), "DifferentiatorsSection desktop breakpoint (min-width: 1024px)");
  assert(diffFile.includes("(max-width: 1023px)"), "DifferentiatorsSection mobile alternative (max-width: 1023px)");
  assert(diffFile.includes("anticipatePin"), "DifferentiatorsSection uses anticipatePin on desktop");

  assert(portFile.includes("gsap.matchMedia()"), "FeaturedPortfolioSection uses gsap.matchMedia()");
  assert(portFile.includes("(min-width: 1024px)"), "FeaturedPortfolioSection desktop breakpoint (min-width: 1024px)");
  assert(portFile.includes("(max-width: 1023px)"), "FeaturedPortfolioSection mobile alternative (max-width: 1023px)");

  // --- 4. Testing Selective Three.js Scenes & GPU Lifecycle (Task 107, Spec Sheet 032) ---
  console.log("\n--- 4. Testing Selective Three.js Scenes, Fallback & GPU Lifecycle ---");
  assert(typeof isWebGLAvailable === "function", "isWebGLAvailable helper is exported");

  const threeWrapperFile = fs.readFileSync(path.join(rootDir, "components/three/ThreeCanvasWrapper.tsx"), "utf-8");
  assert(threeWrapperFile.includes("IntersectionObserver"), "ThreeCanvasWrapper monitors visibility via IntersectionObserver");
  assert(threeWrapperFile.includes("hasWebGL === false"), "ThreeCanvasWrapper falls back when WebGL is unavailable");
  assert(threeWrapperFile.includes("!shouldAnimate"), "ThreeCanvasWrapper falls back when motion is paused");

  const hero3dFile = fs.readFileSync(path.join(rootDir, "components/three/HeroArchitecturalScene.tsx"), "utf-8");
  assert(hero3dFile.includes("renderer.dispose()"), "HeroArchitecturalScene disposes WebGLRenderer on unmount");
  assert(hero3dFile.includes("outerGeo.dispose()"), "HeroArchitecturalScene disposes geometry on unmount");
  assert(hero3dFile.includes("outerMat.dispose()"), "HeroArchitecturalScene disposes materials on unmount");
  assert(hero3dFile.includes("cancelAnimationFrame"), "HeroArchitecturalScene cancels animation frame on unmount");
  assert(hero3dFile.includes("0x0284c7"), "HeroArchitecturalScene adheres to brand light-blue palette");
  assert(hero3dFile.includes("0xea580c"), "HeroArchitecturalScene adheres to brand warm-orange palette");
  assert(!hero3dFile.toLowerCase().includes("purple"), "HeroArchitecturalScene strictly prohibits purple gradients");

  const wow3dFile = fs.readFileSync(path.join(rootDir, "components/three/WowFactorsScene.tsx"), "utf-8");
  assert(wow3dFile.includes("renderer.dispose()"), "WowFactorsScene disposes WebGLRenderer on unmount");
  assert(wow3dFile.includes("pointsGeo.dispose()"), "WowFactorsScene disposes geometry on unmount");
  assert(wow3dFile.includes("cancelAnimationFrame"), "WowFactorsScene cancels animation frame on unmount");

  assert(heroFile.includes("blueprintFallback"), "HeroSection implements static blueprint SVG/CSS node diagram fallback");
  assert(heroFile.includes("activeView"), "HeroSection supports 3D and Nodes blueprint view switcher");

  // --- 5. Testing Global Pause & Reduced-Motion Wiring (Task 108, Spec Sheet 027) ---
  console.log("\n--- 5. Testing Global Pause & Reduced-Motion Wiring ---");
  const motionPrefFile = fs.readFileSync(path.join(rootDir, "lib/motion/useMotionPreference.ts"), "utf-8");
  assert(motionPrefFile.includes("prefers-reduced-motion: reduce"), "useMotionPreference listens to OS prefers-reduced-motion");
  assert(motionPrefFile.includes('getAttribute("data-motion")'), "useMotionPreference reads data-motion attribute from <html>");
  assert(motionPrefFile.includes("megascript-motion-change"), "useMotionPreference listens to megascript-motion-change events");

  const initMotionFile = fs.readFileSync(path.join(rootDir, "lib/motion/init.ts"), "utf-8");
  assert(initMotionFile.includes("cleanupScrollTriggers"), "cleanupScrollTriggers utility exists");
  assert(initMotionFile.includes("ScrollTrigger.getAll().forEach"), "cleanupScrollTriggers cleans up all triggers");

  const themeProviderFile = fs.readFileSync(path.join(rootDir, "components/providers/ThemeProvider.tsx"), "utf-8");
  assert(themeProviderFile.includes("megascript-motion-change"), "ThemeProvider dispatches megascript-motion-change event");

  const globalsCss = fs.readFileSync(path.join(rootDir, "app/globals.css"), "utf-8");
  assert(globalsCss.includes("prefers-reduced-motion: reduce"), "globals.css includes prefers-reduced-motion query");
  assert(globalsCss.includes('data-motion="paused"'), "globals.css includes data-motion=paused reset rules");

  console.log("\n======================================================");
  console.log(`Results: ${passCount}/${passCount + failCount} tests passed.`);
  if (failCount === 0) {
    console.log("STATUS: ALL TESTS PASSED SUCCESSFULLY! Stage 21 Verified.");
  } else {
    console.error(`STATUS: ${failCount} TESTS FAILED.`);
    process.exit(1);
  }
  console.log("======================================================");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
