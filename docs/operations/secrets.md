# MegaScript Digital - Secrets Policy & Rotation Runbook

## Policy Baseline
In accordance with TDD Specification Sheets 129, 136, and 137:
1. **Zero Secret Leakage**: No API keys, database connection strings, JWT secrets, or administrative credentials may ever be committed to Git or exposed via `NEXT_PUBLIC_` environment prefixes.
2. **Server-Only Access**: All third-party provider calls (Brevo, Gemini, DeepSeek, Google, Meta) and database queries execute exclusively in server components, route handlers, or server actions.
3. **Encryption at Rest**: Sensitive integration secrets stored in the database are encrypted using authenticated AES-256-GCM via the server-side `ENCRYPTION_MASTER_KEY`.
4. **Log Sanitization**: Request headers, authorization tokens, OTP codes, session cookies, and free-text personal data must be redacted from operational logs.

## Environment Variable Classification
| Variable | Environment | Sensitivity | Purpose |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Netlify / Local | Critical | Supavisor pooled connection for serverless runtime queries |
| `DIRECT_URL` | Netlify / Local | Critical | Direct PostgreSQL connection for Prisma migrations |
| `BETTER_AUTH_SECRET` | Netlify / Local | Critical | Session signing and verification token generation |
| `BREVO_API_KEY` | Netlify / Local | High | Dispatches transactional emails (OTP, notifications) |
| `GEMINI_API_KEY` | Netlify / Local | High | Tony AI assistant inference |
| `DEEPSEEK_API_KEY` | Netlify / Local | High | Tony AI assistant alternative model adapter |
| `ENCRYPTION_MASTER_KEY` | Netlify / Local | Critical | Master key for encrypting provider credentials stored in DB |
| `NEXT_PUBLIC_SITE_URL` | Netlify / Local | Low (Public) | Base URL for metadata, canonical URLs, and OAuth redirects |

## Emergency Secret Rotation Procedure
If any credential or key is suspected of being compromised:
1. **Revoke Immediately**: Access the upstream provider console (Supabase, Brevo, Google AI Studio, DeepSeek, Netlify) and revoke the affected key.
2. **Generate Replacement**: Create a new secret with least-privilege permissions.
3. **Update Hosting Environment**: Update the environment variable in the Netlify Dashboard (under *Site configuration > Environment variables*).
4. **Re-deploy Application**: Trigger a production deployment or restart functions to load the new environment secrets.
5. **Verify Operation**: Run smoke tests against the affected service (e.g., test sign-in OTP for Brevo, test chat for Gemini).
6. **Log Event**: Record the rotation action, date, and operator identity in `AuditLog` without logging the secret value itself.
