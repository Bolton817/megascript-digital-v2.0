# Antigravity Stage 01 of 23: Implementation Plan

**Stage Name**: Next.js foundation, TypeScript and Netlify compatibility  
**Prerequisite**: Stage 00 Approved  
**Authoritative Scope**: MegaScript Digital TDD (Sheet 166)  

## Stage Goal
Create the minimal Next.js App Router application foundation with TypeScript and Tailwind CSS, configure the Netlify OpenNext deployment pipeline, establish CI commands (`lint`, `typecheck`, `build`), and verify build stability without premature addition of Prisma, auth, or animations.

## Planned Tasks

### 1. Application Initialization
* Scaffold minimal Next.js App Router project using `npm.cmd` with:
  * TypeScript (strict configuration)
  * Tailwind CSS (PostCSS & Autoprefixer)
  * ESLint configured
  * `@/*` path aliases configured in `tsconfig.json`
* Pin Node engine (`>=20.0.0`) in `package.json`.

### 2. Netlify & OpenNext Configuration
* Add `netlify.toml` configuring:
  * Build command: `npm run build`
  * Publish directory: `.next`
  * Integration: `@netlify/plugin-nextjs` (OpenNext adapter support)
* Verify that serverless functions and dynamic routing are enabled (avoiding `output: 'export'`).

### 3. Route Foundations
* `app/layout.tsx`: Root HTML shell with language, responsive viewport metadata, and font declarations.
* `app/page.tsx`: Minimal foundation landing route displaying brand placeholder.
* `app/not-found.tsx`: Accessible 404 boundary.
* `app/error.tsx`: Root error boundary for catching server/client exceptions safely.
* `app/api/health/route.ts`: Non-sensitive system diagnostic route reporting uptime, environment mode, and timestamp without disclosing internal details.

### 4. CI / Verification Command Set
* `npm run lint`: Next.js ESLint validation.
* `npm run typecheck`: `tsc --noEmit` check.
* `npm run build`: Production Next.js build verification.

### 5. Documentation & Setup
* Create `README.md` with local development setup, build scripts, and Netlify deployment instructions.

## Verification Checklist for Stage 01 Gate
* [ ] Local development server boots cleanly (`npm run dev`).
* [ ] `npm run lint` passes with 0 errors.
* [ ] `npm run typecheck` passes with 0 errors.
* [ ] `npm run build` produces a valid `.next` production bundle with server routes.
* [ ] Health route `/api/health` returns non-sensitive status.
* [ ] Netlify configuration verified.
* [ ] STOP/GO GATE: Owner approval obtained before proceeding to Stage 02 (Design tokens & UI primitives).
