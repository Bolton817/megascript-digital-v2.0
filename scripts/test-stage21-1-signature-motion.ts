import fs from "fs";
import path from "path";
import {
  determineRenderingMode,
  isWebGLSupported,
  DeviceCapabilities,
} from "../lib/motion/adaptive";
import { motionPresets } from "../lib/motion/presets";

console.log("======================================================");
console.log("  Stage 21.1: Signature Motion & Adaptive 3D Test Suite");
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

  // --- 1. Testing Adaptive Rendering Decision Engine (lib/motion/adaptive.ts) ---
  console.log("\n--- 1. Testing Adaptive Rendering Decision Engine ---");
  const baselineCaps: DeviceCapabilities = {
    hasWebGL: true,
    isLowMemory: false,
    isLowConcurrency: false,
    isSlowConnection: false,
    isSaveData: false,
    hasFinePointer: true,
    prefersMoreContrast: false,
  };

  // Rule 1: Master pause or reduced motion always forces "static"
  assert(
    determineRenderingMode("paused", "auto", baselineCaps, false) === "static",
    "Rule 1a: Master motion pause sets mode to static"
  );
  assert(
    determineRenderingMode("active", "auto", baselineCaps, true) === "static",
    "Rule 1b: OS prefers-reduced-motion sets mode to static"
  );

  // Rule 2: Explicit lightweight preference forces "lightweight"
  assert(
    determineRenderingMode("active", "lightweight", baselineCaps, false) === "lightweight",
    "Rule 2: User preference lightweight sets mode to lightweight"
  );

  // Rule 3: Network constraints force "lightweight"
  const saveDataCaps = { ...baselineCaps, isSaveData: true };
  assert(
    determineRenderingMode("active", "auto", saveDataCaps, false) === "lightweight",
    "Rule 3a: navigator.connection.saveData sets mode to lightweight"
  );
  const slowConnCaps = { ...baselineCaps, isSlowConnection: true };
  assert(
    determineRenderingMode("active", "auto", slowConnCaps, false) === "lightweight",
    "Rule 3b: Slow 2G/3G connection sets mode to lightweight"
  );

  // Rule 4: Hardware constraints force "lightweight"
  const lowMemCaps = { ...baselineCaps, isLowMemory: true };
  assert(
    determineRenderingMode("active", "auto", lowMemCaps, false) === "lightweight",
    "Rule 4a: Low device memory (< 4GB) sets mode to lightweight"
  );
  const lowCoresCaps = { ...baselineCaps, isLowConcurrency: true };
  assert(
    determineRenderingMode("active", "auto", lowCoresCaps, false) === "lightweight",
    "Rule 4b: Low CPU concurrency (<= 4 cores) sets mode to lightweight"
  );

  // Rule 5: Lack of WebGL forces "lightweight"
  const noWebGLCaps = { ...baselineCaps, hasWebGL: false };
  assert(
    determineRenderingMode("active", "auto", noWebGLCaps, false) === "lightweight",
    "Rule 5: Missing WebGL support sets mode to lightweight"
  );

  // Default: Capable environment selects "full"
  assert(
    determineRenderingMode("active", "auto", baselineCaps, false) === "full",
    "Default: Capable hardware, active motion & auto quality selects mode full"
  );
  assert(typeof isWebGLSupported === "function", "isWebGLSupported helper is exported");

  // --- 2. Testing Motion Presets & Adaptive Hook Exports ---
  console.log("\n--- 2. Testing Motion Presets & Adaptive Hook Exports ---");
  const motionIndex = fs.readFileSync(path.join(rootDir, "lib/motion/index.ts"), "utf-8");
  assert(motionIndex.includes("./adaptive"), "lib/motion/index.ts re-exports adaptive.ts");
  assert(motionIndex.includes("./useAdaptiveRendering"), "lib/motion/index.ts re-exports useAdaptiveRendering.ts");

  assert(typeof motionPresets.svgPathDraw === "function", "Preset: svgPathDraw is implemented");
  assert(typeof motionPresets.magnetic === "function", "Preset: magnetic is implemented");
  assert(typeof motionPresets.reveal === "function", "Preset: reveal preserved");
  assert(typeof motionPresets.stagger === "function", "Preset: stagger preserved");
  assert(typeof motionPresets.pinStory === "function", "Preset: pinStory preserved");
  assert(typeof motionPresets.horizontalSequence === "function", "Preset: horizontalSequence preserved");

  // --- 3. Testing High-Contrast Architectural SVG System (components/visuals/) ---
  console.log("\n--- 3. Testing High-Contrast Architectural SVG System ---");
  const blueprintFile = fs.readFileSync(path.join(rootDir, "components/visuals/ArchitecturalSvgBlueprint.tsx"), "utf-8");
  assert(blueprintFile.includes("01_PRESENTATION_TIER"), "ArchitecturalSvgBlueprint includes Presentation Tier");
  assert(blueprintFile.includes("02_DATA_"), "ArchitecturalSvgBlueprint includes Data Tier");
  assert(blueprintFile.includes("03_OPERATIONS_"), "ArchitecturalSvgBlueprint includes AI Operations Tier");
  assert(blueprintFile.includes("#0284c7"), "ArchitecturalSvgBlueprint uses brand sky-blue");
  assert(blueprintFile.includes("#ea580c"), "ArchitecturalSvgBlueprint uses brand warm-orange");

  const connectorFile = fs.readFileSync(path.join(rootDir, "components/visuals/CapabilityFlowConnector.tsx"), "utf-8");
  assert(connectorFile.includes("01_WEB_TIER"), "CapabilityFlowConnector defines Web Tier node");
  assert(connectorFile.includes("02_APP_TIER"), "CapabilityFlowConnector defines App Tier node");
  assert(connectorFile.includes("03_MOBILE_TIER"), "CapabilityFlowConnector defines Mobile Tier node");

  const schematicFile = fs.readFileSync(path.join(rootDir, "components/visuals/DifferentiatorSchematicSvg.tsx"), "utf-8");
  assert(schematicFile.includes("activeStep"), "DifferentiatorSchematicSvg accepts activeStep prop");
  assert(schematicFile.includes("ACTIVE_SYSTEM_SCHEMATIC"), "DifferentiatorSchematicSvg renders active header");

  const roadmapFile = fs.readFileSync(path.join(rootDir, "components/visuals/RoadmapPathSvg.tsx"), "utf-8");
  assert(roadmapFile.includes("svgPathDraw"), "RoadmapPathSvg utilizes svgPathDraw preset");

  const convergenceFile = fs.readFileSync(path.join(rootDir, "components/visuals/ConvergenceLinesSvg.tsx"), "utf-8");
  assert(convergenceFile.includes("ConvergenceLinesSvg"), "ConvergenceLinesSvg is defined");
  assert(convergenceFile.includes("#0284c7") && convergenceFile.includes("#ea580c"), "ConvergenceLinesSvg uses brand colors");

  // --- 4. Testing Enhanced Procedural 3D Scene & GPU Lifecycle ---
  console.log("\n--- 4. Testing Enhanced Procedural 3D Scene & GPU Lifecycle ---");
  const hero3dFile = fs.readFileSync(path.join(rootDir, "components/three/HeroArchitecturalScene.tsx"), "utf-8");
  assert(hero3dFile.includes("useAdaptiveRendering"), "HeroArchitecturalScene checks useAdaptiveRendering");
  assert(hero3dFile.includes("IcosahedronGeometry(1.65, 1)"), "HeroArchitecturalScene creates dual-frequency icosahedron");
  assert(hero3dFile.includes("OctahedronGeometry(0.72, 0)"), "HeroArchitecturalScene creates primary core octahedron");
  assert(hero3dFile.includes("OctahedronGeometry(0.42, 0)"), "HeroArchitecturalScene creates nested secondary core octahedron");
  assert(hero3dFile.includes("ringGeo1") && hero3dFile.includes("ringGeo2"), "HeroArchitecturalScene creates dual gimbal rings");
  assert(hero3dFile.includes("particleGeo"), "HeroArchitecturalScene creates floating vertex particles");
  assert(hero3dFile.includes("outerGeo.dispose()"), "HeroArchitecturalScene disposes outer geometry");
  assert(hero3dFile.includes("coreGeo.dispose()"), "HeroArchitecturalScene disposes primary core geometry");
  assert(hero3dFile.includes("coreSubGeo.dispose()"), "HeroArchitecturalScene disposes secondary core geometry");
  assert(hero3dFile.includes("ringGeo1.dispose()"), "HeroArchitecturalScene disposes gimbal ring 1");
  assert(hero3dFile.includes("ringGeo2.dispose()"), "HeroArchitecturalScene disposes gimbal ring 2");
  assert(hero3dFile.includes("renderer.dispose()"), "HeroArchitecturalScene disposes WebGLRenderer");

  const threeWrapper = fs.readFileSync(path.join(rootDir, "components/three/ThreeCanvasWrapper.tsx"), "utf-8");
  assert(threeWrapper.includes("useAdaptiveRendering"), "ThreeCanvasWrapper integrates useAdaptiveRendering");
  assert(threeWrapper.includes("!isFull"), "ThreeCanvasWrapper immediately renders fallback when not full mode");

  // --- 5. Testing ThemeProvider & AppearanceCustomizer Quality Controls ---
  console.log("\n--- 5. Testing ThemeProvider & AppearanceCustomizer Quality Controls ---");
  const themeProviderFile = fs.readFileSync(path.join(rootDir, "components/providers/ThemeProvider.tsx"), "utf-8");
  assert(themeProviderFile.includes("visualQuality"), "ThemeProvider manages visualQuality state");
  assert(themeProviderFile.includes("data-visual-quality"), "ThemeProvider sets data-visual-quality on <html>");
  assert(themeProviderFile.includes("megascript-quality-change"), "ThemeProvider dispatches megascript-quality-change");
  assert(themeProviderFile.includes("megascript_visual_quality"), "ThemeProvider persists visualQuality in localStorage");

  const customizerFile = fs.readFileSync(path.join(rootDir, "components/layout/AppearanceCustomizer.tsx"), "utf-8");
  assert(customizerFile.includes("visualQuality"), "AppearanceCustomizer reads visualQuality");
  assert(customizerFile.includes("setVisualQuality"), "AppearanceCustomizer allows toggling visual quality");
  assert(customizerFile.includes("Lightweight"), "AppearanceCustomizer includes Lightweight option");
  assert(customizerFile.includes("Auto"), "AppearanceCustomizer includes Auto adaptive option");

  // --- 6. Testing Homepage Choreographed Enhancements ---
  console.log("\n--- 6. Testing Homepage Choreographed Enhancements ---");
  const heroFile = fs.readFileSync(path.join(rootDir, "components/home/HeroSection.tsx"), "utf-8");
  assert(heroFile.includes("ArchitecturalSvgBlueprint"), "HeroSection integrates ArchitecturalSvgBlueprint");
  assert(heroFile.includes("hero-cta-group"), "HeroSection coordinates entrance of primary CTAs");
  assert(heroFile.includes("what-we-do"), "HeroSection provides smooth directional bridge to What We Do");

  const whatWeDoFile = fs.readFileSync(path.join(rootDir, "components/home/WhatWeDoSection.tsx"), "utf-8");
  assert(whatWeDoFile.includes("CapabilityFlowConnector"), "WhatWeDoSection mounts CapabilityFlowConnector");
  assert(whatWeDoFile.includes("hoveredCard"), "WhatWeDoSection tracks 2.5D interactive card depth");

  const diffFile = fs.readFileSync(path.join(rootDir, "components/home/DifferentiatorsSection.tsx"), "utf-8");
  assert(diffFile.includes("DifferentiatorSchematicSvg"), "DifferentiatorsSection integrates DifferentiatorSchematicSvg");
  assert(diffFile.includes("activeCardIndex"), "DifferentiatorsSection updates activeCardIndex on scroll");

  const indFile = fs.readFileSync(path.join(rootDir, "components/home/IndustriesSection.tsx"), "utf-8");
  assert(indFile.includes("industry-card"), "IndustriesSection defines industry cards");

  const servFile = fs.readFileSync(path.join(rootDir, "components/home/ServicesPreviewSection.tsx"), "utf-8");
  assert(servFile.includes("handleMouseMove") && servFile.includes("perspective"), "ServicesPreviewSection implements 2.5D card tilt");

  const prodFile = fs.readFileSync(path.join(rootDir, "components/home/ProductsPreviewSection.tsx"), "utf-8");
  assert(prodFile.includes("Fortress") && prodFile.includes("LeaseFlow") && prodFile.includes("UzaDigital") && prodFile.includes("FM Scheduler"), "ProductsPreviewSection showcases all 4 proprietary products");

  const portFile = fs.readFileSync(path.join(rootDir, "components/home/FeaturedPortfolioSection.tsx"), "utf-8");
  assert(portFile.includes("scrollProgress"), "FeaturedPortfolioSection tracks horizontal scrub depth progress");

  const testFile = fs.readFileSync(path.join(rootDir, "components/home/TestimonialsSection.tsx"), "utf-8");
  assert(testFile.includes("Quote"), "TestimonialsSection preserves quote typography");

  const roadmapSecFile = fs.readFileSync(path.join(rootDir, "components/home/HowToGetStartedSection.tsx"), "utf-8");
  assert(roadmapSecFile.includes("RoadmapPathSvg"), "HowToGetStartedSection mounts RoadmapPathSvg");

  const pricingFile = fs.readFileSync(path.join(rootDir, "components/home/PricingExpectationsSection.tsx"), "utf-8");
  assert(pricingFile.includes("KSh 35,000 – 125,000"), "PricingExpectationsSection preserves transparent pricing");

  const ctaFile = fs.readFileSync(path.join(rootDir, "components/home/FinalCtaSection.tsx"), "utf-8");
  assert(ctaFile.includes("ConvergenceLinesSvg"), "FinalCtaSection mounts ConvergenceLinesSvg");
  assert(ctaFile.includes("motionPresets.magnetic"), "FinalCtaSection applies magnetic interaction to CTA button");

  // --- 7. Testing Strict Brand System & Zero Emoji Discipline ---
  console.log("\n--- 7. Testing Brand Palette & Zero Emoji Discipline ---");
  const allMotionFiles = [
    heroFile,
    whatWeDoFile,
    diffFile,
    indFile,
    servFile,
    prodFile,
    portFile,
    testFile,
    roadmapSecFile,
    pricingFile,
    ctaFile,
    blueprintFile,
    connectorFile,
    schematicFile,
    hero3dFile,
  ];

  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  allMotionFiles.forEach((fileContent, idx) => {
    assert(!emojiRegex.test(fileContent), `File ${idx + 1}: strictly zero emojis`);
    assert(!fileContent.toLowerCase().includes("from-purple-"), `File ${idx + 1}: strictly zero purple gradient starts`);
    assert(!fileContent.toLowerCase().includes("to-purple-"), `File ${idx + 1}: strictly zero purple gradient stops`);
  });

  console.log("\n======================================================");
  console.log(`Results: ${passCount}/${passCount + failCount} tests passed.`);
  if (failCount === 0) {
    console.log("STATUS: ALL TESTS PASSED! Stage 21.1 Signature Motion Verified.");
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
