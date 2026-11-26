import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Shield, Lock, FileText, ArrowRight, AlertTriangle, CheckCircle, Database, Cpu, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Comprehensive privacy policy and personal data processing practices for MegaScript Digital in compliance with the Kenya Data Protection Act 2019 (KDPA).",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const effectiveDate = "24 November 2026";
  const lastUpdated = "25 November 2026";
  const version = "1.0";

  return (
    <main className="pt-20 pb-16 sm:pt-24 sm:pb-24 bg-background text-foreground">
      <Container size="md">
        {/* Header Breadcrumbs & Title */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Privacy Policy</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Shield className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Kenya Data Protection Act 2019 (KDPA) Aligned</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Privacy Policy
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono pt-2">
            <span>Effective Date: <strong>{effectiveDate}</strong></span>
            <span>•</span>
            <span>Last Updated: <strong>{lastUpdated}</strong></span>
            <span>•</span>
            <span>Version: <strong>{version}</strong></span>
          </div>
        </div>

        {/* Legal Review Placeholder Alert (TDD Sheet 064 & 140) */}
        <div className="my-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5 flex items-start gap-3.5 text-xs text-emerald-900 dark:text-emerald-300">
          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-bold uppercase tracking-wider text-[11px]">
              Statutory Alignment & Privacy Governance
            </p>
            <p className="leading-relaxed opacity-90">
              MegaScript Digital is committed to protecting personal data in strict alignment with the <strong>Kenya Data Protection Act, 2019 (KDPA)</strong> and guidelines from the Office of the Data Protection Commissioner (ODPC). This policy accurately discloses our actual implemented technical integrations and AI data flows.
            </p>
          </div>
        </div>

        {/* Core Content Body */}
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-sm leading-relaxed text-muted-foreground pt-4">

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">1</span>
              Data Controller Identity & Contact Details
            </h2>
            <p>
              MegaScript Digital (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates as the <strong>Data Controller</strong> in respect of personal data collected through this website and our communication channels.
            </p>
            <div className="rounded-xl border border-border bg-surface p-4 text-xs font-mono space-y-1">
              <p className="font-bold text-foreground">MegaScript Digital - Privacy & Data Governance Office</p>
              <p>Privacy Email: <a href="mailto:privacy@megascriptdigital.co.ke" className="text-primary hover:underline">privacy@megascriptdigital.co.ke</a></p>
              <p>General Email: <a href="mailto:info@megascriptdigital.co.ke" className="text-primary hover:underline">info@megascriptdigital.co.ke</a></p>
              <p>Jurisdiction: Nairobi, Republic of Kenya</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">2</span>
              Categories of Personal Data We Collect
            </h2>
            <p>
              We collect only the minimum personal data necessary to provide engineering services, respond to project inquiries, and ensure platform security:
            </p>
            <div className="space-y-3 pt-1">
              <div className="p-3.5 rounded-xl border border-border bg-surface">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-1">A. Direct Inquiries & Contact Forms</h4>
                <p className="text-xs">Full name, email address, optional phone/WhatsApp number, project topic, and message description submitted via our Contact page or service quote requests.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-surface">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-1">B. Tony AI Interactive Assistant</h4>
                <p className="text-xs">User chat messages and technical project requirements voluntarily shared during chat sessions. Contact details are requested only when a visitor explicitly requests a human follow-up or lead handoff.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-surface">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-1">C. Newsletter Subscriptions</h4>
                <p className="text-xs">Email address, subscription consent timestamp, and double opt-in confirmation records. Subscribers can unsubscribe at any time with single-click links.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-surface">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-1">D. Technical Telemetry & Cookies</h4>
                <p className="text-xs">Strictly necessary session identifiers, hashed visitor tokens, anonymized IP addresses, browser user-agent strings, and referral UTM campaign parameters.</p>
              </div>
            </div>
          </section>

          {/* Section 3 - CRITICAL INVARIANT: Third-Party AI Disclosures */}
          <section className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-foreground">
            <h2 className="text-base font-bold text-primary tracking-tight flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>3. Explicit Third-Party AI Processing Disclosure</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              In accordance with transparency principles under Section 29 of the KDPA and TDD Sheet 064:
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              When you interact with our digital engineering assistant, <strong>Tony AI</strong>, your messages are processed by our active third-party enterprise AI provider—<strong>Google Gemini (Google Cloud)</strong> or <strong>DeepSeek AI</strong>—via secure, encrypted API connections to generate contextual answers.
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground pl-2">
              <li>Chat conversations are strictly grounded in MegaScript Digital&rsquo;s public service facts, architecture blueprints, and published case studies.</li>
              <li>Tony AI never asks for passwords, payment card numbers, M-Pesa PINs, or national identity documents.</li>
              <li>Under our enterprise API service agreements, your conversation data is not used to train public foundation models without affirmative consent.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">4</span>
              Third-Party Sub-Processors & Cross-Border Transfers
            </h2>
            <p>
              MegaScript Digital utilizes reliable, audited cloud infrastructure providers to host and secure our platform. All cross-border data transfers are safeguarded under Section 48 of the Kenya Data Protection Act 2019:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-border rounded-xl overflow-hidden">
                <thead className="bg-surface border-b border-border text-foreground font-bold">
                  <tr>
                    <th className="p-3">Processor</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Transfer Safeguard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3 font-medium text-foreground">Brevo (Sendinblue)</td>
                    <td className="p-3">Transactional emails & double opt-in broadcast dispatch</td>
                    <td className="p-3">European Union (France)</td>
                    <td className="p-3">GDPR Adequacy & KDPA Compliance</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Supabase Inc.</td>
                    <td className="p-3">Encrypted relational PostgreSQL database storage</td>
                    <td className="p-3">EU / US Cloud Regions</td>
                    <td className="p-3">Standard Contractual Clauses (SCC)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Netlify Inc.</td>
                    <td className="p-3">Web application hosting, edge CDN & compute runtime</td>
                    <td className="p-3">Global Edge Network</td>
                    <td className="p-3">Enterprise Data Processing Addendum</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Google Cloud / Gemini</td>
                    <td className="p-3">Analytics, Search Console & AI Assistant inference</td>
                    <td className="p-3">Global / US Regions</td>
                    <td className="p-3">ISO 27001 Certified & API Confidentiality</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Meta Platforms</td>
                    <td className="p-3">Consent-gated Pixel & Conversions API (CAPI)</td>
                    <td className="p-3">Global Regions</td>
                    <td className="p-3">SHA-256 PII Hashing & User Consent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">5</span>
              Lawful Bases for Processing (KDPA Section 30)
            </h2>
            <p>
              We process personal data only when an authorized legal basis applies:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
              <li><strong>Consent (Section 32):</strong> Obtained affirmatively for newsletter subscriptions and optional analytics/marketing cookies.</li>
              <li><strong>Contract Performance:</strong> Processing required to prepare service proposals, quotations, and deliver agreed development milestones.</li>
              <li><strong>Legitimate Interests:</strong> Securing our infrastructure against DDoS attacks, brute-force attempts, and service abuse.</li>
              <li><strong>Legal Obligation:</strong> Retaining financial transaction records and audit logs as required by Kenyan statutory authorities.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">6</span>
              Data Retention Schedule
            </h2>
            <p>
              We do not store personal data indefinitely. In accordance with data minimization principles:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
              <li><strong>CRM Inquiries & Leads:</strong> Retained for up to 24 months from the last customer communication.</li>
              <li><strong>Newsletter Subscribers:</strong> Retained until the subscriber requests unsubscription or deletion.</li>
              <li><strong>Tony AI Transcripts:</strong> Retained for 12 months for quality monitoring and contextual reference.</li>
              <li><strong>System Audit Logs:</strong> Retained for 36 months to maintain tamper-evident security compliance records.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">7</span>
              Cookie Preferences & Consent Gating
            </h2>
            <p>
              We categorize cookies into Strictly Necessary, Analytics, and Marketing. <strong>Optional trackers are disabled by default</strong> until you click &ldquo;Accept All&rdquo; or customize your preferences. You may reopen and modify your consent at any time via the <strong>Cookie Preferences</strong> link in our website footer.
            </p>
          </section>

          {/* Section 8 - CRITICAL INVARIANT: KDPA Rights & Privacy Request Workflow */}
          <section className="space-y-4 rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>8. Your Statutory Rights Under the Kenya Data Protection Act 2019</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              As a data subject in Kenya, you possess actionable rights under Part IV of the Act:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-border bg-surface-subtle">
                <span className="font-bold text-foreground block">Right of Access</span>
                <span className="text-muted-foreground">Request confirmation and copies of personal data held about you.</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface-subtle">
                <span className="font-bold text-foreground block">Right to Rectification</span>
                <span className="text-muted-foreground">Request correction of false, misleading, or outdated records.</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface-subtle">
                <span className="font-bold text-foreground block">Right to Erasure (Deletion)</span>
                <span className="text-muted-foreground">Request deletion of records where no lawful retention basis exists.</span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-surface-subtle">
                <span className="font-bold text-foreground block">Right to Object</span>
                <span className="text-muted-foreground">Object to processing for marketing or profiling purposes.</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/privacy-request"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm transition-all"
              >
                <span>Submit a Formal Privacy Rights Request</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <p className="text-xs text-muted-foreground pt-1">
              You also have the statutory right to lodge a formal complaint with the <strong>Office of the Data Protection Commissioner (ODPC)</strong> of Kenya via email at <a href="mailto:complaints@odpc.go.ke" className="text-primary hover:underline">complaints@odpc.go.ke</a> or website at <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.odpc.go.ke</a>.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">9</span>
              Updates to This Policy
            </h2>
            <p>
              We review our data governance practices periodically to incorporate new regulatory guidance. Any modifications will be posted to this page with an updated &ldquo;Last Updated&rdquo; date.
            </p>
          </section>

        </div>

        {/* Footer Navigation Actions */}
        <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/terms-and-conditions"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
          >
            <span>Review Terms and Conditions</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>

          <Link
            href="/privacy-request"
            className="inline-flex items-center gap-2 text-xs font-semibold text-foreground hover:text-primary transition-colors"
          >
            <span>Exercise Data Subject Rights</span>
          </Link>
        </div>
      </Container>
    </main>
  );
}
