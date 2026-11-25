# MegaScript Digital - Third-Party Sub-Processor Register

**Document Version:** 1.0  
**Effective Date:** 24 November 2026  
**Governing Regulation:** Kenya Data Protection Act, 2019 (KDPA) Section 48 & 49  
**Data Controller:** MegaScript Digital, Nairobi, Kenya  

---

## 1. Statutory Sub-Processor Requirements

Under **Section 48 of the Kenya Data Protection Act 2019**, cross-border data transfers to third-party processors require:
1. Proof of appropriate safeguards (such as Standard Contractual Clauses, ISO certification, or binding corporate rules); or
2. The jurisdiction having an adequate level of data protection.

MegaScript Digital conducts vendor assessments prior to routing any personal data to third-party APIs.

---

## 2. Active Sub-Processors Register

| Sub-Processor | Primary Corporate Entity | Processing Service & Scope | Server / Hosting Locations | Cross-Border Safeguards (KDPA s.48) | Integration Status |
|---|---|---|---|---|---|
| **Brevo (Sendinblue)** | Brevo SAS, Paris, France | Transactional emails (confirmations, internal notifications) and double opt-in newsletters. | European Union (France / Germany) | **GDPR Adequacy & KDPA Compliance**, ISO 27001 Certified, DPA Executed. | **Active & Configured** |
| **Supabase Inc.** | Supabase Inc., San Francisco, CA, USA | Managed PostgreSQL database, connection pooling, and automated backups. | AWS Cloud (EU Central / US East) | **Standard Contractual Clauses (SCC)**, AES-256 encryption at rest, SOC 2 Type II. | **Active & Configured** |
| **Netlify Inc.** | Netlify Inc., San Francisco, CA, USA | Public web hosting, edge CDN caching, serverless execution runtime. | Global Edge Network | **Enterprise Data Processing Addendum (DPA)**, SOC 2 Type II Certified. | **Active & Configured** |
| **Google Cloud (Gemini)** | Google LLC, Mountain View, CA, USA | Natural language inference for Tony AI Assistant; Google Analytics 4 & Search Console. | United States & Global Cloud Regions | **ISO/IEC 27001**, Enterprise API Confidentiality (no training on customer API data). | **Connected** |
| **DeepSeek AI** | DeepSeek AI, Beijing / Cloud Infrastructure | Secondary conversational AI inference for technical engineering inquiries. | Global Cloud Regions | **Enterprise API Terms & Encryption in Transit**. | **Connected** |
| **Meta Platforms** | Meta Platforms Ireland Ltd. / Meta Platforms Inc. | Meta Pixel & Conversions API (CAPI) client-side attribution. | Global Cloud Regions | **Consent-Gated Tag Execution**, SHA-256 PII Hashing Prior to Transfer. | **Connected** |

---

## 3. Incident Notification & Sub-Processor Auditing

- Any security incident or unauthorized disclosure involving a sub-processor must be reported to the MegaScript Data Protection Office within **24 hours**.
- The Office of the Data Protection Commissioner (ODPC) of Kenya will be notified within **72 hours** in accordance with Section 43 of the KDPA.
