# MegaScript Digital: Master Administration Manual

**Audience:** System Administrators, Marketing Managers, Content Editors, and Analysts  
**Platform URL:** `https://megascriptdigital.co.ke/master`  
**Governing Standard:** Antigravity TDD Specification Sheet 119; Appendixes 01–03 & 15

---

## 1. Accessing the Administration Console

### 1.1 Passwordless Email OTP Login
MegaScript Digital implements an enterprise-grade, passwordless authentication workflow using 6-digit Time-Based One-Time Passwords (OTP):
1. Navigate to `https://megascriptdigital.co.ke/master/login`.
2. Enter your authorized corporate email address.
3. If your email is on the **Admin Allowlist**, an automated 6-digit verification code will be dispatched to your inbox from `info@megascriptdigital.co.ke` via Brevo.
4. Enter the 6-digit code. Verification tokens are valid for 10 minutes.
5. Upon successful entry, you will be redirected to the Master Overview dashboard.

### 1.2 15-Minute Idle Session Timeout
To protect sensitive commercial and client data:
- Administrative sessions automatically expire after **15 minutes (900 seconds)** of user inactivity.
- Moving your cursor, typing, or navigating tabs issues an automated background heartbeat (`/api/auth/session/heartbeat`) every 4 minutes to refresh the active session.
- If you step away from your workstation for longer than 15 minutes, you will be securely logged out and returned to the sign-in screen.

---

## 2. Role-Based Access Control (RBAC) Matrix

MegaScript Digital enforces strict, server-side least-privilege access across 5 distinct operational roles:

| Role Name | Description & Primary Responsibilities | Scope & Permissions |
| :--- | :--- | :--- |
| **SUPER_ADMIN** | System Owner (Chief Architect). Full access across all system modules, user invitations, role assignments, provider secrets, and security policies. | Protected account (`megascriptdigital@gmail.com`). Cannot be removed or demoted. |
| **ADMIN** | Senior Operational Administrator. Manages day-to-day operations, lead workflows, client CRM, content publication, and integration monitoring. | Broad operational authority; cannot alter Super Admin role or raw encrypted root keys. |
| **EDITOR** | Content Specialist. Creates, edits, previews, and updates published articles, portfolio case studies, service descriptions, and testimonials. | Restricted to CMS content routes (`/master/content/*`); zero access to leads or API secrets. |
| **MARKETING_MANAGER** | Growth & Outreach Specialist. Manages newsletter subscriber lists, campaign drafting, scheduling email blasts, and attribution analytics. | Access to `/master/newsletter/*` and marketing metrics; no user management or raw AI secrets. |
| **ANALYST** | Business Intelligence Specialist. Reviews operational metrics, conversion trends, and website performance reports. | Read-only access to analytics dashboards; zero edit or contact export capabilities. |

---

## 3. Lead Triage & CRM Operations

Incoming business opportunities arrive from public enquiry forms and Tony AI chat handoffs:
1. **Navigating Leads**: Open `/master/leads` to view the central pipeline.
2. **Lead Lifecycle Progression**:
   - `NEW`: Freshly submitted lead awaiting initial evaluation.
   - `CONTACTED`: Preliminary email or phone outreach initiated.
   - `QUALIFIED`: Client scope, budget, and timeline match agency capability.
   - `PROPOSAL_SENT`: Formal quotation or proposal delivered.
   - `WON`: Client contract signed, project scheduled for kickoff.
   - `LOST`: Opportunity closed without agreement.
3. **Internal Operational Notes**: Team members can attach internal notes and timestamps to track client communications.
4. **First-Party Attribution**: Each lead record details the originating `utm_source`, `utm_medium`, `utm_campaign`, and landing page for campaign attribution without third-party privacy tracking.

---

## 4. Tony AI Assistant Oversight

The Tony AI assistant acts as an autonomous digital representative:
1. **Conversation Transcripts**: View visitor interactions at `/master/conversations` to audit tone, accuracy, and customer interests.
2. **Prompt Versioning**: The Super Administrator can inspect and version the canonical system prompt at `/master/tony/prompts`. Version 1.0.0 represents the immutable baseline.
3. **Provider Failover**: Under `/master/tony/providers`, administrators can toggle between Google Gemini (Default) and DeepSeek (Alternative) adapters.

---

## 5. Newsletter Campaigns & Double Opt-In

1. **Subscriber Segmentation**: View verified double opt-in subscribers under `/master/newsletter/subscribers`.
2. **Drafting Campaigns**: Create email campaigns with plain, high-end technical typography.
3. **Suppression Management**: Unsubscribes and hard bounces are automatically marked as `SUPPRESSED` via Brevo webhooks to safeguard sending domain reputation.
