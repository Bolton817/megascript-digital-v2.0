# Stage 08: CMS Content Models and Admin Editing Foundation

## 1. Overview
Stage 08 establishes the administrative Content Management System (CMS) editing foundation within the private operations console (`/master/content`). It provides repository services, versioned revision tracking with instant rollback, secure preview routes, and strict RBAC permission enforcement (`content.write`, `content.publish`, `content.rollback`, `portfolio.manage`, `services.manage`).

## 2. Key Architecture & Deliverables

### A. CMS Service Repositories (`server/services/cms/`)
1. **`pages.ts`**: Static page management (CRUD, slug lookup, draft/publish lifecycle, Next.js cache revalidation).
2. **`services.ts`**: Core & Complementary services catalog (7 seeded records, category filters, display ordering, live updates).
3. **`products.ts`**: Independent SaaS product showcase (Fortress, LeaseFlow, UzaDigital, FM Scheduler).
4. **`portfolio.ts`**: 11 client portfolio case studies with homepage featured toggles.
   - *TDD Directive*: Strictly zero screenshots and zero technology stack labels. Presentation relies exclusively on client brand mark / monogram, sector, verified business challenge, delivered scope, and external URL.
5. **`testimonials.ts`**: Client feedback repository with approval evidence tracking. Public queries require both `status: PUBLISHED` AND `isApproved: true`.
6. **`revision.ts`**: Versioned snapshot engine (`ContentRevision`) recording actor, prior state, version number, and timestamp. Includes `rollbackContentRevision` for one-click restoration with audit trail.

### B. Secure Preview Engine (`app/api/preview/`)
- **`app/api/preview/route.ts`**: Draft mode endpoint using Next.js 14 App Router `draftMode().enable()`.
  - Authorizes via active administrator session possessing `content.read`/`content.write` OR a signed preview secret.
  - Hardened against open redirect vulnerabilities with strict path sanitization.
- **`app/api/preview/disable/route.ts`**: Disables draft mode and returns visitor to the requested route.

### C. Master Operations Console UI (`app/(admin)/master/content/`)
- **`/master/content`**: Central Content Hub displaying module cards, publication counters, and a live revision audit stream.
- **`/master/content/services`**: Services catalog interface with one-click publish/unpublish toggles and preview links.
- **`/master/content/portfolio`**: Portfolio manager with homepage featured toggles and compliance notice.

### D. Server Actions (`server/actions/cms.ts`)
- Server-authoritative mutations protected by session inactivity verification and RBAC permission checks:
  - `toggleServiceStatusAction` (`services.manage` / `content.publish`)
  - `togglePortfolioStatusAction` (`portfolio.manage`)
  - `togglePortfolioFeaturedAction` (`portfolio.manage`)
  - `rollbackRevisionAction` (`content.rollback`)

## 3. Automated Verification Results (`tests/stage-08-cms.test.ts`)
- **43 of 43 test assertions passed** across 4 test suites:
  1. *Zero Draft Leakage*: Verified drafts and archived items are strictly omitted from public query functions (`getPublishedServices`, `getPublishedPageBySlug`, `getPublishedProducts`, `getPublishedPortfolioProjects`, `getPublishedTestimonials`).
  2. *Revision Tracking*: Verified automatic creation of version 1 and version 2 `ContentRevision` snapshots on creation and update.
  3. *Rollback Engine*: Restored previous version state and verified creation of version 3 snapshot and `CONTENT_ROLLBACK` audit entry.
  4. *Role Boundaries*: Verified `EDITOR` role has content publishing permissions but is barred from `users.manage`, `security.manage`, and `integrations.manage`. Verified `ANALYST` role is restricted to read-only access.
- TypeScript (`tsc --noEmit`): 0 errors.
- ESLint (`next lint`): 0 warnings or errors.
- Production Build (`next build`): Successfully compiled all `/master/content` routes.
- Design Rules: 0 emojis, 0 purple gradients.
