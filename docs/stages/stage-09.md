# Stage 09: Core & Complementary Service Pages and Service Menu Wiring

## 1. Overview
Stage 09 implements the three primary engineering service pages and four complementary growth service pages, complete with dynamic CMS data integration, accessible technical explanation dialogs, structured FAQs, independent SEO metadata, and strict commercial disclaimer boundaries in accordance with TDD Specification Sheet 174 (and Sheets 046–052).

## 2. Key Architecture & Deliverables

### A. Canonical Service Data & Specifications (`config/services-data.ts`)
Comprehensive configuration and copy dictionary for all 7 service offerings:
1. **Website Development & SEO** (`/services/website-development-seo`):
   - Category: Core Engineering.
   - Complete website offer, Core Web Vitals targets, and technical SEO foundations.
   - Transparent website pricing: **KSh 35,000 to KSh 125,000** and **2 to 6 week** timeline with clear scope disclaimers.
2. **Web Application Development** (`/services/web-app-development`):
   - Category: Core Engineering.
   - Custom browser-based software, staff portals, role-based workflows, and database architecture.
   - *Strict Boundary*: Custom-scoped pricing; standard website pricing is strictly omitted.
3. **Mobile Application Development** (`/services/mobile-app-development`):
   - Category: Core Engineering.
   - iOS and Android mobile apps, offline resilience, and push notifications.
   - *Strict Boundary*: Client maintains direct developer account ownership (Apple & Google); store approval policies qualified.
4. **Graphic Design** (`/services/graphic-design`):
   - Category: Complementary Growth.
   - Brand systems, digital marketing graphics, print collateral (300 DPI, CMYK), and agreed revision rounds.
5. **Video Editing** (`/services/video-editing`):
   - Category: Complementary Growth.
   - Corporate videos, social reels, audio cleanup, subtitles, and click-to-play mobile standards.
   - *Strict Boundary*: Zero virality or guaranteed engagement claims.
6. **Google Maps Visibility** (`/services/google-maps-visibility`):
   - Category: Complementary Growth.
   - Google Business Profile setup, local signals, and review response workflows.
   - *Strict Boundary*: Client retains direct profile ownership; MegaScript uses delegated manager access without collecting passwords. Strictly no ranking or map-pack guarantees.
7. **Business Coaching** (`/services/business-coaching`):
   - Category: Complementary Growth.
   - Digital readiness, systems evaluation, service packaging, and operational roadmaps.
   - *Strict Boundary*: Non-financial advice disclosure; zero guaranteed income or profit outcome claims.

### B. UI Components (`components/services/`)
- **`ServiceHero.tsx`**: Mobile-first hero with category badge, value proposition, and isolated standard website pricing/timeline callout.
- **`TechnicalDetailsModal.tsx`**: Accessible dialog (`Dialog` primitive) presenting technical architecture, schema markup, and governance without cluttering the main reading flow.
- **`ServiceDeliverables.tsx`**: Clear two-column comparison: Standard Inclusions vs. Custom Scoped Additions.
- **`ServiceProcess.tsx`**: 4-to-5 step structured delivery roadmap.
- **`ServiceFaq.tsx`**: Accessible accordion FAQ with semantic keyboard navigation and ARIA attributes.
- **`ServiceCta.tsx`**: Contextual conversion card with primary project enquiry button and secondary WhatsApp action.

### C. Public Routes (`app/services/`)
- **`/services` ([`app/services/page.tsx`](file:///c:/Users/admin/Desktop/antigravity%20projects/Megascript%20NEW%20Website/app/services/page.tsx))**: Comprehensive Services Catalog index route categorizing Core Engineering vs. Complementary Growth services.
- **`/services/[slug]` ([`app/services/[slug]/page.tsx`](file:///c:/Users/admin/Desktop/antigravity%20projects/Megascript%20NEW%20Website/app/services/[slug]/page.tsx))**: Dynamic SSG route with `generateStaticParams()` for all 7 published slugs, independent `generateMetadata()`, draft mode preview integration, and canonical OpenGraph tags.

### D. Navigation & Preview Alignment
- Harmonized [components/home/ServicesPreviewSection.tsx](file:///c:/Users/admin/Desktop/antigravity%20projects/Megascript%20NEW%20Website/components/home/ServicesPreviewSection.tsx) links with canonical database slugs (`/services/website-development-seo`, `/services/web-app-development`, `/services/mobile-app-development`).

## 3. Automated Verification Results (`tests/stage-09-services.test.ts`)
- **85 of 85 test assertions passed** across 5 test suites:
  1. *Canonical Service Records*: 7 services configured in `SERVICES_DATA` and matching Prisma database seed.
  2. *Strict Pricing Isolation*: KSh 35,000–125,000 pricing guide present only on `website-development-seo`; strictly absent from all other 6 services.
  3. *Zero Outcome Guarantees*: 0 claims of guaranteed rankings, guaranteed viral reach, or guaranteed profits. Explicit disclaimers verified on Google Maps Visibility and Business Coaching.
  4. *Technical Modals & Structure*: Each service possesses >= 4 process steps, >= 2 technical modal sections, >= 3 FAQs, and complete SEO metadata.
  5. *Navigation Alignment*: All 7 footer links and 4 mega menu links resolve cleanly to canonical slugs.
- TypeScript (`tsc --noEmit`): 0 errors.
- ESLint (`next lint`): 0 warnings or errors.
- Production Build (`next build`): 21/21 static pages compiled successfully.
- Brand Compliance: 0 emojis, 0 purple gradients.
