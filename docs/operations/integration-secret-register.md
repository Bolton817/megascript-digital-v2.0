# MegaScript Digital: Integration & Secret Register

**Audience:** Technical Leads, DevOps, and Super Administrators  
**Governing Standard:** Antigravity TDD Specification Sheet 119; Appendixes 08–09 & 30–31

---

## 1. Master Integration Inventory

| Integration Provider | Service Function | Netlify Env Key | Sensitivity | Rotation Period |
| :--- | :--- | :--- | :---: | :---: |
| **Supabase** | Managed PostgreSQL (Supavisor pooled runtime) | `DATABASE_URL` | Critical | 6 Months / Breach |
| **Supabase** | Direct PostgreSQL (Prisma migrations) | `DIRECT_URL` | Critical | 6 Months / Breach |
| **Better Auth** | Session cryptographic signing token | `BETTER_AUTH_SECRET` | Critical | Annual / Breach |
| **Brevo** | Transactional email & newsletter dispatch | `BREVO_API_KEY` | High | 6 Months / Breach |
| **Brevo** | Webhook HMAC cryptographic verification | `BREVO_WEBHOOK_SECRET` | High | 6 Months / Breach |
| **Google AI Studio** | Gemini 1.5 Pro / Flash for Tony Assistant | `GEMINI_API_KEY` | High | 6 Months / Breach |
| **DeepSeek** | DeepSeek Chat fallback provider | `DEEPSEEK_API_KEY` | High | 6 Months / Breach |
| **Application** | 256-bit AES-GCM master encryption key | `ENCRYPTION_MASTER_KEY` | Critical | Annual / Breach |
| **Google Analytics** | GA4 Measurement Stream (Disconnected-Safe) | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Public | As needed |
| **Meta Business** | Meta Pixel ID (Disconnected-Safe) | `NEXT_PUBLIC_META_PIXEL_ID` | Public | As needed |

---

## 2. Secrets Management & Access Control

1. **Zero Secret Leakage**: No secret tokens may ever be committed to Git or exposed via `NEXT_PUBLIC_` environment prefixes.
2. **Masked Administration UI**: Inside `/master/integrations` and `/master/tony/providers`, API keys are displayed masked (e.g. `sk-••••••••1234`).
3. **Database Encryption at Rest**: Provider keys stored in the database are encrypted using authenticated symmetric AES-256-GCM using the 256-bit `ENCRYPTION_MASTER_KEY`.

---

## 3. Scheduled Secret Rotation Runbook

Quarterly or semi-annual credential rotation is executed using the following procedure:
1. **Generate New Key**: Log in to the provider dashboard (e.g., Brevo, Google AI Studio, Supabase) and generate a new API key with minimum required privileges.
2. **Update Netlify Configuration**:
   - Access Netlify Dashboard &rarr; *Site configuration* &rarr; *Environment variables*.
   - Update the respective variable with the newly generated secret.
3. **Trigger Deployment**:
   - In Netlify, trigger *Clear cache and deploy site* to reload runtime serverless function environments.
4. **Execute Smoke Tests**:
   - Run `npx tsx scripts/test-production-smoke.ts --url https://megascriptdigital.co.ke` to confirm system health.
5. **Revoke Retired Key**:
   - Once operational health is confirmed, return to the upstream provider console and revoke the old key.
6. **Audit Recording**:
   - Record the rotation event in the administrative audit log.

---

## 4. Emergency Secret Revocation Protocol

If any secret or credential is suspected of being leaked or compromised:
1. **Immediate Revocation**: Instantly revoke the compromised key at the upstream provider portal to stop unauthorized calls.
2. **Fallback Engagement**: The platform's disconnected-safe architecture will immediately engage static fallbacks without crashing public routes.
3. **Generate Replacement**: Generate a replacement secret.
4. **Update Netlify & Redeploy**: Update the environment variable and trigger a Netlify deployment.
5. **Forensic Audit**: Inspect access logs for unexpected traffic patterns or unauthorized data access.
