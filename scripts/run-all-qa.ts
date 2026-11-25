import { execSync } from "child_process";
import path from "path";

interface SuiteResult {
  suite: string;
  command: string;
  durationMs: number;
  status: "PASSED" | "FAILED";
  error?: string;
}

const rootDir = path.resolve(__dirname, "..");

const suites = [
  { name: "TypeScript Strict Typecheck", cmd: "npm.cmd run typecheck" },
  { name: "ESLint Static Analysis", cmd: "npm.cmd run lint" },
  { name: "Stage 14: Tony Chat & Message Persistence", cmd: "npx.cmd tsx scripts/test-stage14-tony.ts" },
  { name: "Stage 15: Tony Knowledge & Qualification", cmd: "npx.cmd tsx scripts/test-stage15-tony-knowledge.ts" },
  { name: "Stage 16: Gemini & DeepSeek AI Providers", cmd: "npx.cmd tsx scripts/test-stage16-providers.ts" },
  { name: "Stage 17: First-Party Analytics & UTM", cmd: "npx.cmd tsx scripts/test-stage17-analytics.ts" },
  { name: "Stage 18: Disconnected-Safe Integrations", cmd: "npx.cmd tsx scripts/test-stage18-integrations.ts" },
  { name: "Stage 19: Operations & CRM Analytics", cmd: "npx.cmd tsx scripts/test-stage19-operations.ts" },
  { name: "Stage 20: SEO, Legal, Consent & Privacy", cmd: "npx.cmd tsx scripts/test-stage20-compliance.ts" },
  { name: "Stage 21: GSAP Motion & Selective Three.js", cmd: "npx.cmd tsx scripts/test-stage21-motion.ts" },
  { name: "Stage 21.1: Signature Motion & Adaptive 3D", cmd: "npx.cmd tsx scripts/test-stage21-1-signature-motion.ts" },
  { name: "Stage 22: Pre-Release QA & Security Verification", cmd: "npx.cmd tsx scripts/test-stage22-qa-security.ts" },
  { name: "Stage 22: Viewport Matrix & Zero-Overflow Audit", cmd: "node scripts/audit-viewport-matrix.js" },
];

async function runAll() {
  console.log("======================================================");
  console.log("  MegaScript Digital: Pre-Release QA Orchestrator     ");
  console.log("======================================================\n");

  const results: SuiteResult[] = [];
  let allPassed = true;

  for (const s of suites) {
    process.stdout.write(`Running: ${s.name}... `);
    const startTime = Date.now();
    try {
      execSync(s.cmd, { cwd: rootDir, stdio: "pipe" });
      const durationMs = Date.now() - startTime;
      console.log(`PASSED (${(durationMs / 1000).toFixed(1)}s)`);
      results.push({
        suite: s.name,
        command: s.cmd,
        durationMs,
        status: "PASSED",
      });
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      console.log(`FAILED (${(durationMs / 1000).toFixed(1)}s)`);
      const output = err.stdout ? err.stdout.toString() : err.message;
      results.push({
        suite: s.name,
        command: s.cmd,
        durationMs,
        status: "FAILED",
        error: output.slice(-300),
      });
      allPassed = false;
    }
  }

  console.log("\n======================================================");
  console.log("             PRE-RELEASE QA AUDIT SUMMARY             ");
  console.log("======================================================");
  console.table(
    results.map((r) => ({
      Suite: r.suite,
      Status: r.status,
      Time: `${(r.durationMs / 1000).toFixed(1)}s`,
    }))
  );

  const passedCount = results.filter((r) => r.status === "PASSED").length;
  console.log(`Total Suites: ${results.length} | Passed: ${passedCount} | Failed: ${results.length - passedCount}`);
  console.log(`Overall Quality Gate: ${allPassed ? "APPROVED FOR RELEASE (0 BLOCKERS)" : "REJECTED (FAILURES DETECTED)"}`);
  console.log("======================================================\n");

  process.exit(allPassed ? 0 : 1);
}

runAll();
