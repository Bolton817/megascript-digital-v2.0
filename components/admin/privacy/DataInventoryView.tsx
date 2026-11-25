"use client";

import React from "react";
import { Shield, Database, Lock, Globe, Server, CheckCircle2 } from "lucide-react";

export function DataInventoryView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Overview Banner */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Database className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Personal Data Processing Register (TDD Sheet 139)
            </h3>
            <p className="text-xs text-muted-foreground">
              Official data inventory, lawful bases under the Kenya Data Protection Act 2019, and third-party sub-processors.
            </p>
          </div>
        </div>
      </div>

      {/* Part 1: Processing Activities Register */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
          1. Record of Processing Activities (ROPA)
        </h4>

        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-subtle border-b border-border text-foreground font-bold">
              <tr>
                <th className="p-3.5">Data Flow / Channel</th>
                <th className="p-3.5">Collected Data Categories</th>
                <th className="p-3.5">Processing Purpose</th>
                <th className="p-3.5">KDPA Lawful Basis</th>
                <th className="p-3.5">Retention Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr>
                <td className="p-3.5 font-bold text-foreground">CRM Inquiries & Contact Forms</td>
                <td className="p-3.5">Name, email, phone number, project scope</td>
                <td className="p-3.5">Responding to client leads and proposals</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px]">Contract Preparation</span></td>
                <td className="p-3.5">24 months from last touch</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-foreground">Tony AI Conversational Assistant</td>
                <td className="p-3.5">Chat messages, voluntary contact details</td>
                <td className="p-3.5">Automated architecture Q&A and handoff</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">Consent / Legitimate Int.</span></td>
                <td className="p-3.5">12 months for QA</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-foreground">Newsletter Subscriptions</td>
                <td className="p-3.5">Email address, double opt-in timestamps</td>
                <td className="p-3.5">Engineering updates & technical dispatches</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">Explicit Consent (s.32)</span></td>
                <td className="p-3.5">Until unsubscription</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-foreground">Admin OTP & Authentication</td>
                <td className="p-3.5">Allowlisted email, session tokens, IP address</td>
                <td className="p-3.5">Access control and 15-minute idle protection</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[10px]">Security / Legal Obligation</span></td>
                <td className="p-3.5">Session: 1h / Idle: 15m</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-foreground">First-Party Telemetry & Analytics</td>
                <td className="p-3.5">Anonymized pageviews, session IDs, UTM tags</td>
                <td className="p-3.5">Platform optimization & traffic reporting</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px]">Legitimate Interest</span></td>
                <td className="p-3.5">Aggregated indefinitely</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-foreground">Privacy Rights Requests</td>
                <td className="p-3.5">Requester name, email, request scope, outcome</td>
                <td className="p-3.5">Statutory rights fulfillment & auditability</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[10px]">Statutory Duty (Part IV)</span></td>
                <td className="p-3.5">36 months audit trail</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 2: Sub-Processors Register */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
          2. Third-Party Sub-Processors & Infrastructure Register
        </h4>

        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-subtle border-b border-border text-foreground font-bold">
              <tr>
                <th className="p-3.5">Processor</th>
                <th className="p-3.5">Role / Service</th>
                <th className="p-3.5">Data Location</th>
                <th className="p-3.5">Section 48 Transfer Safeguard</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr>
                <td className="p-3.5 font-bold text-foreground">Brevo SAS</td>
                <td className="p-3.5">Transactional and broadcast email relay</td>
                <td className="p-3.5">European Union (France)</td>
                <td className="p-3.5">GDPR Adequacy & KDPA Compliance</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">Active</span></td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-foreground">Supabase Inc.</td>
                <td className="p-3.5">Managed cloud PostgreSQL database</td>
                <td className="p-3.5">EU / US Regions</td>
                <td className="p-3.5">Standard Contractual Clauses (SCC)</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">Active</span></td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-foreground">Netlify Inc.</td>
                <td className="p-3.5">Web application hosting and serverless edge</td>
                <td className="p-3.5">Global Edge CDN</td>
                <td className="p-3.5">Enterprise DPA & SOC 2 Type II</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">Active</span></td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-foreground">Google Cloud (Gemini)</td>
                <td className="p-3.5">Conversational AI inference (Tony AI)</td>
                <td className="p-3.5">US / Global Regions</td>
                <td className="p-3.5">Enterprise API Confidentiality Agreement</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">Active</span></td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-foreground">DeepSeek AI</td>
                <td className="p-3.5">Secondary conversational AI provider</td>
                <td className="p-3.5">Global Cloud Regions</td>
                <td className="p-3.5">API Data Processing Terms</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600">Connected</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
