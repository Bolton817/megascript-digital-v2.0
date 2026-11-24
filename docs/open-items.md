# MegaScript Digital - Open Items & Configurable Inputs Register

In accordance with TDD Specification Sheet 006, Appendix 22, and the Website Copy Specification, the items below are intentionally designed as configurable inputs or pending owner assets. Their absence does not block early build stages, and temporary placeholders or disconnected states must be used instead of fabricated values.

## 1. Brand & Media Assets
* [ ] **Official Logo**: To be uploaded to `public/images/logo/` after initial workspace setup. A clean SVG/text placeholder is used until supplied.
* [ ] **Licensed Custom Fonts**: Owner may provide licensed TTF/OTF fonts for display headings/subheadings. System-safe fallback stacks are configured in the meantime.
* [ ] **Client Logos**: SVG/vector marks for the 11 portfolio clients (Lucky House Safaris, Luminary Mtaji Partners, Skrach Art, ABWA World, Fexty Safaris, Tawi Talent Partners, Craydel Africa Travel, Janave Events, Ozone Lounge, Unified Option Service).

## 2. Public Contact & Business Details
* [ ] **Public Telephone Number (`[CONFIG: PHONE]`)**: For header, footer, contact page, communication hub, and Tony handoff.
* [ ] **WhatsApp Business Number (`[CONFIG: WHATSAPP]`)**: For direct chat action in communication hub, contact page, and Tony handoff.
* [ ] **Physical / Operating Location (`[CONFIG: LOCATION]`)**: Verified office address or operating territory for footer and contact page.
* [ ] **Operating Hours (`[CONFIG: HOURS]`)**: For contact page and footer.
* [ ] **Social Media Profiles (`[CONFIG: SOCIAL_URLS]`)**: URLs for Facebook, Instagram, X, Threads, YouTube, TikTok, and LinkedIn. (Unconfigured channels remain hidden).

## 3. Independent Product URLs
* [ ] **Fortress URL (`[CONFIG: FORTRESS_URL]`)**: External application domain for Fortress AI Website Builder.
* [ ] **LeaseFlow URL (`[CONFIG: LEASEFLOW_URL]`)**: External application domain for LeaseFlow Rental Management.
* [ ] **UzaDigital URL (`[CONFIG: UZADIGITAL_URL]`)**: External application domain for UzaDigital POS.
* [ ] **FM Scheduler URL (`[CONFIG: FMSCHEDULER_URL]`)**: External application domain for FM Scheduler.

## 4. Third-Party Accounts & Credentials
* [ ] **Supabase PostgreSQL**: Database project creation, Supavisor connection string, and direct migration URL.
* [ ] **Brevo (Sendinblue)**: Account API key, sender domain authentication (`info@megascriptdigital.co.ke`), and webhook secret.
* [ ] **Google Gemini API**: API key for Tony AI production inference.
* [ ] **DeepSeek API**: API key for Tony AI secondary provider adapter.
* [ ] **Google Workspace / Search Console / GA4**: Measurement IDs and property verification.
* [ ] **Meta**: Pixel ID and Graph API credentials.

## 5. Legal & Regulatory Review
* [ ] **Terms and Conditions**: Draft reviewed by a Kenyan legal professional before production launch.
* [ ] **Privacy Policy**: Alignment verification with the Office of the Data Protection Commissioner (ODPC) and the Kenya Data Protection Act, 2019.
* [ ] **Data Retention Schedule**: Confirmation of retention windows for enquiries, chat transcripts, and subscriber records.
