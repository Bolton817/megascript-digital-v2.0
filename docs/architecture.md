# MegaScript Digital - System Architecture Document

## Overview
MegaScript Digital is architected as a unified, modern web application comprising a high-performance public marketing website and a private `/master` operational dashboard. The system is built on Next.js App Router and deployed to Netlify via the OpenNext adapter, connecting to a PostgreSQL database hosted on Supabase.

## Repository Structure
```
├── app/
│   ├── (public)/              # Public website route group
│   │   ├── layout.tsx         # Public layout with Island Header, Footer, Tony, Floating Hub
│   │   ├── page.tsx           # Homepage (11 sections)
│   │   ├── about/             # About Us page
│   │   ├── contact/           # Contact Us page & Quick Enquiry form
│   │   ├── portfolio/         # Portfolio index & [slug] project detail pages
│   │   ├── wow-factors/       # Capabilities & interactive demonstrations showcase
│   │   ├── blog/              # Blog index & [slug] article pages
│   │   ├── services/          # Core & complementary service pages
│   │   ├── products/          # Independent product showcase pages
│   │   ├── terms-and-conditions/ # Terms and Conditions
│   │   └── privacy-policy/    # Privacy Policy & DPA 2019 request form
│   ├── (admin)/master/        # Private operations console route group
│   │   ├── layout.tsx         # Isolated admin shell with sidebar and top bar
│   │   ├── login/             # Passwordless 6-digit email OTP sign-in
│   │   ├── overview/          # Operations summary dashboard
│   │   ├── content/           # CMS for pages, services, products, blog, portfolio
│   │   ├── leads/             # Unified CRM list, detail, notes, and lifecycle
│   │   ├── tony/              # Tony transcripts, prompts, and provider configuration
│   │   ├── newsletters/       # Subscriber management and Brevo campaigns
│   │   ├── analytics/         # First-party metrics and connector reports
│   │   ├── integrations/      # Connection centre (Brevo, Google, Meta, AI)
│   │   ├── settings/          # Site-wide settings and contact details
│   │   ├── users/             # Admin user management and allowlist
│   │   └── audit/             # Immutable administrative audit log
│   ├── api/                   # Server route handlers (webhooks, public APIs, auth)
│   └── not-found.tsx          # Branded 404 page
├── components/
│   ├── ui/                    # Reusable primitive components (buttons, dialogs, inputs, cards)
│   ├── layout/                # PublicHeader, PublicFooter, AdminSidebar, Drawer
│   ├── motion/                # GSAP motion wrappers and reduced-motion hooks
│   └── three/                 # Selective Three.js canvas components with fallbacks
├── features/                  # Domain-specific feature modules
│   ├── auth/                  # Better Auth configuration, allowlist, session guard
│   ├── tony/                  # Tony chat widget, provider adapters, context builder
│   ├── leads/                 # Lead capture, qualification, spam mitigation, CRM
│   ├── content/               # CMS repository, block renderers, versioning
│   ├── newsletter/            # Brevo newsletter sync, double opt-in, campaigns
│   ├── analytics/             # UTM parser, event tracker, consent-gated tag loader
│   └── integrations/          # Provider adapters, webhook validators, secrets encryption
├── lib/                       # Utility libraries, client hooks, type definitions
├── server/                    # Server-only code, database client, service orchestration
│   ├── db.ts                  # Prisma client singleton with connection pooling
│   └── services/              # Domain business services (leads, auth, content, etc.)
├── prisma/                    # Prisma schema, migrations, and seed scripts
├── public/                    # Static assets
│   ├── images/logo/           # Official logo assets
│   └── fonts/                 # Licensed custom web fonts
└── docs/                      # Technical specifications, decision logs, and runbooks
```

## Database Connection & Persistence Strategy
* **Host**: Supabase PostgreSQL.
* **Runtime Access (`DATABASE_URL`)**: Routed through the Supavisor transaction pooler (`aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`) to avoid connection exhaustion in serverless environments.
* **Migration Access (`DIRECT_URL`)**: Direct connection to PostgreSQL (`:5432`) used exclusively by `prisma migrate` during build/deployment steps.
* **Data Integrity**: Enforced via relational foreign keys, unique constraints, and database indexes on high-frequency lookup fields (`createdAt`, `status`, `slug`, `normalizedEmail`).

## Authentication & Authorization Model
* **Mechanism**: Better Auth passwordless email OTP (6-digit code, 5-minute validity, max 3 attempts).
* **Delivery**: Transactional email dispatched via Brevo.
* **Allowlist Enforcement**: Server-side allowlist verification before OTP generation. Unlisted emails receive a generic response with no code dispatched.
* **Session Lifecycle**: Secure, HttpOnly, SameSite cookies. Server-enforced 15-minute inactivity auto-logout tracked via `lastActivityAt`.
* **RBAC**: Defined permissions (`content.read`, `content.write`, `content.publish`, `leads.read`, `leads.manage`, `ai.configure`, `settings.manage`, `users.manage`, etc.) assigned across 5 roles:
  1. Super Administrator (immutable protected account: `megascriptdigital@gmail.com`)
  2. Administrator (`boltonmoseti78@gmail.com`)
  3. Editor
  4. Marketing Manager
  5. Analyst

## Tony AI Provider Abstraction
* **Design Pattern**: Provider interface (`generate`, `stream`, `healthCheck`) abstracting Google Gemini and DeepSeek.
* **Admin Switching**: Active provider and model configurable in `/master/tony/settings` without code redeployment.
* **Security & Prompt Guardrails**:
  * API keys encrypted at rest using `ENCRYPTION_MASTER_KEY` (AES-256-GCM); never exposed to client bundles or logged.
  * Canonical System Instruction v1.0 enforced with immutable safety guardrails.
  * Grounded exclusively in verified, published CMS knowledge; unknown queries politely redirected.
  * Non-pushy commercial intent qualification: contact details requested at most once and only when the user expresses clear commercial intent (quotes, proposals, callbacks).

## Deployment & Hosting Baseline
* **Platform**: Netlify via the supported Next.js OpenNext adapter.
* **Serverless Execution**: API route handlers, server actions, and server components execute within Netlify Functions.
* **Domain & Security**: Custom domain `megascriptdigital.co.ke` with managed TLS, HSTS, secure headers, Content Security Policy, and rate limiting.
