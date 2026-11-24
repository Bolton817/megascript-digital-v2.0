# MegaScript Digital - Architectural & Technical Decision Register

This register documents key architectural, security, and design decisions agreed in the Technical Design Document (TDD).

| Decision ID | Date | Area | Decision / Direction | Rationale | Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DEC-001** | 2026-11-24 | Architecture | Next.js App Router with Server Components | Dynamic server routes, admin auth, CMS, form mutations, and server-side API integrations require a dynamic server runtime; static export is unsuitable. | Architecture | Confirmed |
| **DEC-002** | 2026-11-24 | Hosting | Netlify with Next.js OpenNext adapter | Aligned with client deployment target; supports server components, route handlers, and environment secrets. | Infrastructure | Confirmed |
| **DEC-003** | 2026-11-24 | Persistence | Supabase PostgreSQL with Prisma ORM | Enterprise relational capabilities; dual-connection strategy using Supavisor pooler (port 6543) for runtime and direct connection (port 5432) for migrations avoids pool exhaustion. | Data | Confirmed |
| **DEC-004** | 2026-11-24 | Authentication | Better Auth Passwordless 6-Digit Email OTP | Eliminates credential management risks. Strict allowlist pre-check prevents OTP issuance to unauthorized users. Dispatched via Brevo. | Security | Confirmed |
| **DEC-005** | 2026-11-24 | Security | 15-Minute Server-Enforced Inactivity Timeout | Protects administrative sessions from abandonment on shared workstations; validated server-side on every protected request via `lastActivityAt`. | Security | Confirmed |
| **DEC-006** | 2026-11-24 | AI | Provider Abstraction for Gemini & DeepSeek | Eliminates vendor lock-in. Super Administrator can hot-swap models/providers in `/master` without source code changes or redeployments. | AI / Backend | Confirmed |
| **DEC-007** | 2026-11-24 | UI / UX | Light Blue, Gray, Restrained Orange; Bright Mode Default | Professional, modern aesthetic. Dark mode provided as a user preference. Strictly prohibited: zero emojis and zero purple gradient backgrounds. | Design | Confirmed |
| **DEC-008** | 2026-11-24 | Content | Portfolio and Product Isolation | Portfolio presents 11 verified clients without screenshots or technology stack labels. Products (Fortress, LeaseFlow, UzaDigital, FM Scheduler) link out to separate platforms. | Product | Confirmed |
| **DEC-009** | 2026-11-24 | Commercial | Indicative Pricing & Scope Disclaimer | KSh 35,000 to KSh 125,000 applies strictly as an indicative guide for standard websites. Web apps and mobile apps require custom discovery. Timelines estimated at 2 to 6 weeks. | Business | Confirmed |
| **DEC-010** | 2026-11-24 | Compliance | Kenyan Data Protection Act 2019 Alignment | Privacy policy, cookie consent gating, data inventory, and dedicated privacy rights request workflows designed around Kenyan legal framework. | Legal / Trust | Confirmed |
