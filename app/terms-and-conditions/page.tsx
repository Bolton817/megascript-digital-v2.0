import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Shield, FileText, ArrowRight, AlertTriangle, CheckCircle, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms of use and engagement principles for MegaScript Digital websites, custom web applications, and digital engineering services.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

export default function TermsAndConditionsPage() {
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
            <span className="text-foreground">Terms and Conditions</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Scale className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Public Website Terms & Engagement Policy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Terms and Conditions
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono pt-2">
            <span>Effective Date: <strong>{effectiveDate}</strong></span>
            <span>•</span>
            <span>Last Updated: <strong>{lastUpdated}</strong></span>
            <span>•</span>
            <span>Version: <strong>{version}</strong></span>
          </div>
        </div>

        {/* Legal Review Placeholder Alert (TDD Sheet 063) */}
        <div className="my-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 flex items-start gap-3.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-bold uppercase tracking-wider text-[11px]">
              Notice of Scheduled Legal Review
            </p>
            <p className="leading-relaxed opacity-90">
              This document establishes the initial technical and commercial terms of use for MegaScript Digital. It is scheduled for periodic formal review by a qualified Kenyan legal practitioner prior to final public commercial sign-off in accordance with Kenya Data Protection Act 2019 and local contract laws.
            </p>
          </div>
        </div>

        {/* Core Content Body */}
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-sm leading-relaxed text-muted-foreground pt-4">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">1</span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing the website located at <strong>megascriptdigital.co.ke</strong> (the &ldquo;Website&rdquo;), or by submitting inquiries to MegaScript Digital (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions. If you do not agree to these terms, please refrain from using this website.
            </p>
          </section>

          {/* Section 2 - CRITICAL INVARIANT: SOW Precedence */}
          <section className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-foreground">
            <h2 className="text-base font-bold text-primary tracking-tight flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>2. Project Proposals & Statements of Work (SOW) Precedence</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              These general website Terms and Conditions govern public access and preliminary interactions only. <strong>Nothing on this website constitutes a binding, project-specific development contract or guarantee of scope.</strong>
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              For any custom engineering, website design, mobile app development, or digital consultancy services provided by MegaScript Digital, <strong>an individual written proposal, quotation, signed agreement, or formal Statement of Work (SOW) shall govern all project-specific matters</strong>. This includes, without limitation:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground pl-2">
              <li>Detailed functional scope, deliverables, and architecture blueprints</li>
              <li>Professional service fees, payment schedules, and milestone acceptance criteria</li>
              <li>Intellectual property assignment, source code transfer, and licensing conditions</li>
              <li>Revision allowances, bug warranty periods, and ongoing maintenance SLA terms</li>
              <li>Project timeline, termination, and deposit refund terms</li>
            </ul>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              In the event of any direct conflict between these general website terms and an executed client agreement or SOW, the provisions of the executed agreement shall strictly prevail.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">3</span>
              Intellectual Property Rights
            </h2>
            <p>
              All content on this Website—including but not limited to text, graphics, user interface designs, custom illustrations, code samples, logos, trademarks, and documentation—is the exclusive intellectual property of MegaScript Digital and is protected by copyright and intellectual property laws of Kenya and international treaties.
            </p>
            <p>
              Product trademarks displayed on this site (including Fortress, LeaseFlow, and UzaDigital) are proprietary software solutions owned by MegaScript Digital. You may not copy, reproduce, distribute, reverse-engineer, or create derivative works from any part of this Website without our prior written consent.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">4</span>
              Permitted Use & Acceptable Conduct
            </h2>
            <p>
              You agree to use the Website solely for lawful purposes. Specifically, you agree not to:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Deploy automated bots, scrapers, or crawlers that bypass rate limits or compromise server availability.</li>
              <li>Attempt to gain unauthorized access to our administrative consoles, source databases, or integration tokens.</li>
              <li>Submit fraudulent, deceptive, or abusive inquiries through our contact forms or Tony AI chatbot.</li>
              <li>Transmit any malicious scripts, viruses, or disruptive network payloads.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">5</span>
              Availability & Disclaimer of Warranties
            </h2>
            <p>
              MegaScript Digital strives for continuous uptime and rigorous information accuracy. However, this Website and its content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied.
            </p>
            <p>
              We do not warrant that the Website will be uninterrupted, error-free, or free of viruses. We reserve the right to modify, suspend, or discontinue any feature, product preview, or service catalog item at any time without prior notice.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">6</span>
              Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by the laws of the Republic of Kenya, MegaScript Digital, its directors, developers, and partners shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your access to, use of, or inability to use this Website or reliance upon any content herein.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">7</span>
              Third-Party Links & External Platforms
            </h2>
            <p>
              Our Website may contain links to external third-party services (such as GitHub, LinkedIn, Brevo, or Google Maps). We do not control or endorse the content, terms, or privacy practices of these external sites and accept no responsibility for any loss or damage incurred through your interactions with them.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">8</span>
              Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms and Conditions shall be governed by, interpreted, and construed in accordance with the substantive laws of the <strong>Republic of Kenya</strong>. Any dispute, claim, or controversy arising out of or in connection with these terms shall be submitted to the exclusive jurisdiction of the competent courts of Kenya located in Nairobi.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">9</span>
              Modifications to These Terms
            </h2>
            <p>
              We reserve the right to revise or update these Terms and Conditions at our sole discretion. Any amendments will be reflected on this page alongside an updated &ldquo;Last Updated&rdquo; date. Continued use of the Website after such revisions constitutes binding acceptance of the updated terms.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">10</span>
              Contact Information
            </h2>
            <p>
              For legal questions, notices, or formal clarifications regarding these Terms and Conditions, please contact us at:
            </p>
            <div className="rounded-xl border border-border bg-surface p-4 text-xs font-mono space-y-1">
              <p className="font-bold text-foreground">MegaScript Digital</p>
              <p>Email: <a href="mailto:info@megascriptdigital.co.ke" className="text-primary hover:underline">info@megascriptdigital.co.ke</a></p>
              <p>Location: Nairobi, Kenya</p>
            </div>
          </section>

        </div>

        {/* Navigation Actions */}
        <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/privacy-policy"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
          >
            <span>Review Privacy Policy</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs font-semibold text-foreground hover:text-primary transition-colors"
          >
            <span>Have a project in mind? Contact Us</span>
          </Link>
        </div>
      </Container>
    </main>
  );
}
