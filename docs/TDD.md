# MegaScript Digital - Technical Design Document Reference

## Canonical Source Documents
This project is governed strictly by two master documents placed in the project root:
1. `MegaScript_Digital_TDD.pdf` (Version 1.0, 24 November 2026): Authoritative technical architecture, database schemas, API contracts, security standards, operational runbooks, and 24-stage build sequence.
2. `Megascrpit Digital - Website Copy and specification.pdf` (Version 1.0, 24 November 2026): Authoritative verbatim website copy, section layouts, microcopy, email templates, bilingual Tony prompts, and legal texts.

## Project Scope Baseline
* **Official Domain**: `megascriptdigital.co.ke`
* **Hosting Platform**: Netlify (via Next.js OpenNext adapter)
* **Public Enquiry Inbox**: `info@megascriptdigital.co.ke`
* **Default Theme**: Bright/light mode default; optional user dark mode toggle.
* **Prohibited Patterns**: Zero emojis across all UI, body text, emails, and chatbot; zero purple gradient backgrounds.

## Staged Build Execution Model
Implementation follows a strict 24-stage progression (Stage 00 through Stage 23). Each stage must pass its designated verification checks and receive explicit owner approval at its STOP/GO gate before proceeding to subsequent stages:

| Stage | Name | Key Deliverables | Prerequisite |
| :--- | :--- | :--- | :--- |
| **00** | Repository reconnaissance & build guardrails | Git init, .gitignore, .env.example, docs tree, Stage 01 plan | None |
| **01** | Next.js foundation, TypeScript & Netlify | App Router, Tailwind, TypeScript, Netlify OpenNext, CI checks | Stage 00 |
| **02** | Design tokens, fonts & UI primitives | Color tokens, accessible components, theme context | Stage 01 |
| **03** | Public header, mega menus & footer | Island header, mega menus, mobile drawer, 4-column footer | Stages 01-02 |
| **04** | Supabase Postgres, Prisma & migrations | Prisma schema, Supavisor pooler, seed scripts | Stages 01-03 |
| **05** | Better Auth OTP & allowlist | 6-digit email OTP, allowlist check, Brevo transactional mail | Stage 04 |
| **06** | Session inactivity, RBAC & audit logs | 15-min idle auto-logout, permission matrix, audit repository | Stage 05 |
| **07** | Public layout & homepage shell | 11 homepage sections in sequence, content slots | Stages 02-03 |
| **08** | CMS content models & admin editing | Relational CMS models, draft/publish/rollback workflow | Stages 04, 06, 07 |
| **09** | Core & complementary service pages | 7 service routes, technical detail modals, FAQs | Stages 03, 08 |
| **10** | Product marketing pages & outbound links | Fortress, LeaseFlow, UzaDigital, FM Scheduler pages | Stages 08-09 |
| **11** | About, portfolio, blog & Wow Factors | 11 client portfolio records, Wow Factors showcase, blog engine | Stages 08-10 |
| **12** | Contact page, floating hub & CRM capture | Contact form, floating contact hub, lead lifecycle | Stages 04, 06, 08 |
| **13** | Brevo email, newsletter & onboarding | Double opt-in, newsletter campaigns, webhook handler | Stages 05, 12 |
| **14** | Tony widget & conversation persistence | Bottom-left chat widget, conversation database | Stages 04, 06, 08 |
| **15** | Tony prompt, retrieval & qualification | Canonical prompt v1.0, knowledge retrieval, lead intent rules | Stage 14, Published content |
| **16** | Gemini & DeepSeek adapters & switching | Dual provider abstraction, masked admin secrets, live switching | Stage 15 |
| **17** | Global search, UTM & first-party analytics | Postgres full-text search, UTM capture, internal event metrics | Stages 08, 12 |
| **18** | Google & Meta analytics integrations | GA4, Search Console, Meta Pixel in disconnected-safe mode | Stage 17, Accounts |
| **19** | CRM analytics & operational overview | Ops dashboard, campaign outcome reporting, alerts | Stages 12-18 |
| **20** | SEO, legal pages, cookie consent & privacy | Sitemap.xml, robots.txt, Terms, Privacy Policy, DPA 2019 requests | Stages 08-19 |
| **21** | GSAP ScrollTrigger & selective Three.js | Scroll choreography, selective 3D scenes, reduced motion | Stages 02-20 |
| **22** | Pre-release QA & security verification | End-to-end tests, WCAG AA audit, Core Web Vitals, penetration QA | Stages 00-21 |
| **23** | Production launch & operational handover | Netlify production deploy, DNS/TLS verification, runbook handover | Stage 22, Domain/Secrets |

## Quality & Acceptance Targets
* **Responsiveness**: Zero horizontal overflow at 320, 375, 430, 768, 1024, and 1440px+.
* **Accessibility**: WCAG 2.2 AA target, semantic HTML, keyboard operability, visible focus, aria attributes, skip link.
* **Performance**: Target LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 at 75th percentile.
* **Security**: Server-enforced RBAC, parameterized database queries, strict CSP and security headers, protected credentials.
