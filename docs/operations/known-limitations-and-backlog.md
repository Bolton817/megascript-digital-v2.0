# MegaScript Digital: Known Limitations & Maintenance Backlog

**Audience:** Platform Maintainers, Technical Architects, and Business Owners  
**Governing Standard:** Antigravity TDD Specification Sheet 119; Appendix 17

---

## 1. Current System Limitations & Boundary Conditions

### 1.1 Browser & WebGL Capabilities
- **WebGL Hardware Requirement**: The full Three.js geometric wireframe scene (Mode A) requires WebGL support. On low-memory mobile devices (< 4GB RAM), battery saver mode, or touch-constrained browsers, the system gracefully engages Mode B (Lightweight Canvas/CSS) or Mode C (Instant SVG Blueprint). This is by design to guarantee sub-2.5s LCP.
- **Reduced Motion Preference**: When visitors have `prefers-reduced-motion: reduce` enabled in their operating system or toggle motion off in the customizer, all 3D rotations and continuous GSAP tickers are disabled, rendering accessible static blueprints.

### 1.2 External Provider Disconnected-Safe Modes
- If external API keys (Brevo, Gemini, DeepSeek) are missing or experience upstream vendor outages, public website visitors are not presented with error screens. Instead:
  - Form submissions are logged safely to the PostgreSQL queue.
  - Tony AI chat provides verified static contact fallback information.
  - Analytics tags remain uninitialized without affecting page functionality.

---

## 2. Post-Launch Maintenance Backlog

| Task ID | Maintenance Area | Description | Target Frequency |
| :--- | :--- | :--- | :---: |
| **MNT-01** | Lead Triage & CRM | Review uncontacted leads in `/master/leads`, update pipeline statuses, and review client requirements. | Daily / As Received |
| **MNT-02** | Tony Transcript Review | Audit conversational transcripts in `/master/conversations` to assess visitor questions and update knowledge base items. | Weekly |
| **MNT-03** | Deliverability & Bounce Triage | Check Brevo dashboard for hard bounces, spam complaints, and sender reputation scores. | Weekly |
| **MNT-04** | Security Allowlist Review | Audit `AdminAllowlist` in master settings; remove credentials for departed contractors or team members. | Monthly |
| **MNT-05** | NPM Dependency Updates | Run `npm audit` and test minor patch updates across Next.js, Three.js, GSAP, and Prisma. | Monthly |
| **MNT-06** | Database Backup Drill | Perform a restoration drill from an automated Supabase backup into a local test database. | Quarterly |
| **MNT-07** | Secret & API Key Rotation | Rotate Brevo API keys, Gemini keys, and administrative secrets according to security policy. | Quarterly |
