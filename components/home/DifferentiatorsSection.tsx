import React from "react";
import {
  Sparkles,
  Database,
  Workflow,
  MailCheck,
  Compass,
  FileCheck2,
  Lock,
  Bot,
  Layers,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

export function DifferentiatorsSection() {
  return (
    <Section spacing="lg" variant="subtle" id="differentiators">
      <Container size="lg">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
            Engineering Principles
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
            What Makes Us Different
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            We provide absolute clarity between standard website foundations and specialized, custom-scoped engineering capabilities.
          </p>
        </div>

        {/* Bento Grid Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {/* Card 1: Multi-Page Digital Solutions (Standard) */}
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-subtle text-primary border border-primary/20">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Standard on All Sites
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground tracking-tight font-display">
                  Carefully Designed Multi-Page Solutions
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  We reject one-page template shortcuts. Every engagement receives deliberate information architecture, semantic HTML5 landmarks, responsive layouts, and native technical SEO.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border font-mono text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center justify-between text-foreground">
                  <span>Architecture:</span>
                  <span className="text-primary font-bold">Multi-Route</span>
                </div>
                <p className="font-sans text-[11px] leading-tight text-muted-foreground">
                  Hierarchical sitemaps &bull; Accessible navigation &bull; Structured metadata
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: 100% Client Ownership (Standard) */}
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-primary/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-subtle text-primary border border-primary/20">
                  <Lock className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Standard on All Sites
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground tracking-tight font-display">
                  100% Client Ownership from Day 1
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  You maintain direct administrative custody of your domain names, DNS, Git repositories, and hosting accounts. We never hold assets hostage or lock you into proprietary platforms.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border font-mono text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center justify-between text-foreground">
                  <span>Vendor Lock-in:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">0% (Zero)</span>
                </div>
                <p className="font-sans text-[11px] leading-tight text-muted-foreground">
                  Full code handover &bull; Independent accounts &bull; Operational walkthroughs
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: AI-Powered Assistance (Custom Scope) */}
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-accent/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-subtle text-accent border border-accent/20">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/25">
                  Available Custom Scope
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground tracking-tight font-display">
                  AI-Powered Assistance (Tony AI)
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Grounded bilingual conversational assistants tailored strictly to your verified business facts. Supports visitors in English and Kiswahili without fabricating details or hallucinating.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border font-mono text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center justify-between text-foreground">
                  <span>Scope Guard:</span>
                  <span className="text-accent font-bold">Strictly Grounded</span>
                </div>
                <p className="font-sans text-[11px] leading-tight text-muted-foreground">
                  English &amp; Kiswahili &bull; Context boundaries &bull; Lead qualification handoffs
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Operations CRM & Databases (Custom Scope) */}
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-accent/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-subtle text-accent border border-accent/20">
                  <Database className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/25">
                  Available Custom Scope
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground tracking-tight font-display">
                  Operations CRM &amp; Relational Databases
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Role-based internal consoles for managing customer leads, reviewing immutable audit logs, scheduling appointments, and managing relational PostgreSQL data models.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border font-mono text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center justify-between text-foreground">
                  <span>Access Control:</span>
                  <span className="text-accent font-bold">Role-Based RBAC</span>
                </div>
                <p className="font-sans text-[11px] leading-tight text-muted-foreground">
                  PostgreSQL database &bull; Inactivity timeouts &bull; Internal note logs
                </p>
              </div>
            </div>
          </div>

          {/* Card 5: Software Integrations & Automation (Custom Scope) */}
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-accent/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-subtle text-accent border border-accent/20">
                  <Workflow className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/25">
                  Available Custom Scope
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground tracking-tight font-display">
                  Software Integrations &amp; Automation
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Eliminate duplicate manual work by integrating external payment gateways like M-Pesa Daraja, inventory synchronizations, transactional SMS, and secure third-party webhooks.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border font-mono text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center justify-between text-foreground">
                  <span>Gateways:</span>
                  <span className="text-accent font-bold">M-Pesa, Webhooks</span>
                </div>
                <p className="font-sans text-[11px] leading-tight text-muted-foreground">
                  Idempotent payloads &bull; Signature verification &bull; Real-time notifications
                </p>
              </div>
            </div>
          </div>

          {/* Card 6: Newsletter & Email Marketing (Custom Scope) */}
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-surface border border-surface-border shadow-xs hover:border-accent/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-subtle text-accent border border-accent/20">
                  <MailCheck className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/25">
                  Available Custom Scope
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground tracking-tight font-display">
                  Newsletter &amp; Email Marketing Systems
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Verified subscriber consent collection, Brevo transactional automation, audience segmentation, and broadcast campaigns managed directly from your own domain.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border font-mono text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center justify-between text-foreground">
                  <span>Compliance:</span>
                  <span className="text-accent font-bold">Double Opt-in</span>
                </div>
                <p className="font-sans text-[11px] leading-tight text-muted-foreground">
                  DKIM/SPF setup &bull; Segment management &bull; Zero external list renting
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
