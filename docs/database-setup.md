# MegaScript Digital - Database Setup & Persistence Guide

## Connection Architecture (Supabase PostgreSQL)
MegaScript Digital uses Supabase PostgreSQL with a dual-connection configuration to prevent connection pool exhaustion in serverless deployments while allowing smooth DDL operations:

* **Runtime Connection (`DATABASE_URL`)**:
  - Connects through the **Supavisor transaction pooler** on port `6543` with `?pgbouncer=true`.
  - Used for application queries inside Next.js Server Components, Server Actions, and Route Handlers.
* **Direct / Session Connection (`DIRECT_URL`)**:
  - Connects through the **Supabase session pooler** on port `5432`.
  - Used by Prisma CLI for schema synchronization (`prisma db push`), migrations (`prisma migrate`), and the batch seed script (`prisma db seed`).

## Database Commands
```bash
# Generate Prisma Client types
npm run db:generate

# Synchronize schema changes to Supabase
npm run db:push

# Run idempotent database seed
npm run db:seed
```

## Seeded Baseline Entities
Running `npm run db:seed` provisions:
1. **30 Administrative Permissions**: Baseline keys defined in TDD Sheet 191 (e.g. `dashboard.read`, `content.publish`, `leads.manage`, `ai.configure`, `audit.read`).
2. **5 RBAC Roles**:
   - `SUPER_ADMIN` (all permissions)
   - `ADMIN` (operational administrator)
   - `EDITOR` (content creation and publishing)
   - `MARKETING_MANAGER` (campaigns and newsletter subscribers)
   - `ANALYST` (read-only reporting)
3. **2 Initial Administrator Accounts**:
   - `megascriptdigital@gmail.com`: **Protected Super Administrator** (`isProtected: true`, immutable).
   - `boltonmoseti78@gmail.com`: **Manageable Administrator** (`isProtected: false`).
4. **Site Settings**: Singleton record holding default public contact details and pricing guidance (KSh 35,000 to KSh 125,000).
5. **7 Services**: 3 Core Development services + 4 Complementary services.
6. **4 Products**: Fortress, LeaseFlow, UzaDigital, and FM Scheduler.
7. **11 Portfolio Projects**: 4 featured homepage clients (Lucky House Safaris, Luminary Mtaji Partners, Skrach Art, ABWA World) + 7 additional client records. Strictly zero screenshots and zero tech stack labels.
8. **Tony AI Canonical System Prompt v1.0**: Seeded as current prompt version (`1.0.0`).
9. **AI Provider Configurations**: Google Gemini (`gemini-1.5-flash`, default) and DeepSeek (`deepseek-chat`).

## Health & Diagnostics
The API route `/api/health` queries `db.siteSettings` and returns:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "ISO-8601",
  "environment": "development|production"
}
```
