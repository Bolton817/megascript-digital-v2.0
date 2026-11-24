# MegaScript Digital - Corporate Platform & Operations Dashboard

Welcome to the **MegaScript Digital** web platform. This application combines the public marketing website, product introductions, client portfolio, Tony AI assistant, and a private `/master` operations console for team administration.

Authoritative documentation:
* [Technical Design Document (TDD)](file:///docs/TDD.md)
* [System Architecture Specification](file:///docs/architecture.md)
* [Decision Register](file:///docs/decisions.md)
* [Open Items & Configurable Inputs](file:///docs/open-items.md)
* [Secrets Policy](file:///docs/operations/secrets.md)

---

## Tech Stack
* **Framework**: Next.js App Router (React Server Components)
* **Language**: TypeScript (Strict Mode)
* **Styling**: Tailwind CSS with CSS Variables
* **Persistence**: Supabase PostgreSQL managed via Prisma ORM
* **Authentication**: Better Auth Passwordless 6-digit Email OTP via Brevo
* **AI Engine**: Provider abstraction supporting Google Gemini & DeepSeek
* **Deployment Target**: Netlify (OpenNext Adapter via `@netlify/plugin-nextjs`)

---

## Local Development Setup

### 1. Prerequisites
* Node.js `>= 20.0.0` (Tested on `v24.22.3`)
* npm `>= 10.0.0`

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in local development values. Never commit `.env.local` or any production secrets.

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Verification & CI Commands
Before opening pull requests or advancing build stages, run the CI validation suite:
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Production build verification
npm run build
```

---

## Brand & Design Guidelines
* **Palette**: Light blue (`--primary`), gray neutral (`--surface`, `--muted`), and restrained orange (`--accent`).
* **Appearance**: Bright/light mode is the default. Dark mode is available as a user preference.
* **Prohibited**: Zero emojis and zero purple gradient backgrounds across all public and admin code.
