# MegaScript Digital - Personal Data Inventory & Processing Register

**Document Version:** 1.0  
**Effective Date:** 24 November 2026  
**Governing Regulation:** Kenya Data Protection Act, 2019 (KDPA)  
**Data Controller:** MegaScript Digital, Nairobi, Kenya  
**Contact:** `privacy@megascriptdigital.co.ke`

---

## 1. Overview & Statutory Purpose

In compliance with **Section 27 & 28 of the Kenya Data Protection Act 2019** and **Technical Design Document Sheet 139**, this document records all personal data flows processed across the MegaScript Digital platform.

---

## 2. Record of Processing Activities (ROPA)

| ID | Data Flow Channel | Categories of Personal Data | Processing Purpose | KDPA Lawful Basis (s.30) | Retention Period | Access Roles | Deletion / Erasure Workflow |
|---|---|---|---|---|---|---|---|
| **DF-01** | **CRM Inquiries & Contact Form** | Full name, email address, telephone / WhatsApp number, project scope, inquiry topic. | Client lead evaluation, proposal preparation, commercial follow-up. | **Contract Preparation / Performance** | 24 months from last customer contact. | Super Admin, Administrator, Marketing Manager | Anonymized on demand via `/master/privacy` or purged after 24m. |
| **DF-02** | **Tony AI Interactive Assistant** | Chat messages, session ID, voluntary contact details for lead handoff. | Answering engineering questions, qualification, and routing inquiries. | **Consent / Legitimate Interests** | 12 months for QA and telemetry. | Super Admin, Administrator | Session unlinked; message text redacted on deletion request. |
| **DF-03** | **Newsletter Subscriptions** | Email address, double opt-in confirmation timestamp, consent source. | Dissemination of technical case studies, blueprints, and announcements. | **Explicit Consent (s.32)** | Retained until unsubscription. | Super Admin, Marketing Manager | Instant suppression on unsubscribe; hard delete on privacy request. |
| **DF-04** | **Admin Authentication & OTP** | Allowlisted email, hashed OTP codes, session tokens, IP address, user-agent. | Staff access control, role authorization, 15-minute idle session termination. | **Security / Legal Obligation** | Active sessions: 1h / Idle expiry: 15m. | System / Better Auth | Inactivated upon staff offboarding or revocation. |
| **DF-05** | **First-Party Telemetry & Analytics** | Anonymized pageviews, session IDs, referrers, UTM parameters (PII stripped). | Technical performance monitoring and traffic source attribution. | **Legitimate Interests** | Aggregated telemetry retained indefinitely. | Super Admin, Analyst | Stripped of PII at collection; no raw personal data stored. |
| **DF-06** | **Privacy Rights Requests** | Requester name, email address, request type, details, verification notes. | Statutory fulfillment of Part IV data subject rights and auditability. | **Statutory Duty (Part IV)** | 36 months in immutable audit trail. | Super Admin, Administrator | Retained for regulatory proof of compliance with ODPC. |

---

## 3. Data Protection Principles Enforced

1. **Lawfulness, Fairness & Transparency:** Plain-language disclosures provided at every collection point (forms, footer, Tony chat header).
2. **Purpose Limitation:** Contact details collected for project inquiries are never sold, rented, or repurposed for unrelated marketing without affirmative consent.
3. **Data Minimization:** Optional fields are minimized; telephone numbers are optional on public forms.
4. **Accuracy & Storage Limitation:** Data subjects have a direct self-service route via `/privacy-request` to rectify or delete records.
5. **Integrity & Confidentiality:** AES-256-GCM encryption applied to integration tokens; RBAC permissions enforced on all admin endpoints.
