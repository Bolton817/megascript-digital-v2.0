import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission, hasPermission } from "@/features/auth/rbac";
import { getLeadById } from "@/server/services/crm/leads";
import { db } from "@/server/db";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { LeadStatusSelector } from "@/components/admin/leads/LeadStatusSelector";
import { LeadAssigneeSelector } from "@/components/admin/leads/LeadAssigneeSelector";
import { LeadNoteForm } from "@/components/admin/leads/LeadNoteForm";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Globe,
  Tag,
  Clock,
  User,
  History,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface LeadDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MasterLeadDetailPage({
  params,
}: LeadDetailPageProps) {
  const { user } = await requirePermission("leads.read", {
    isQualifyingActivity: true,
  });

  const resolvedParams = await params;
  const leadId = resolvedParams.id;

  const [lead, canManage, allUsers] = await Promise.all([
    getLeadById(leadId),
    hasPermission(user.id, "leads.manage"),
    db.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!lead) {
    notFound();
  }

  const createdDate = new Intl.DateTimeFormat("en-KE", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date(lead.createdAt));

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-12">
      <SessionInactivityGuard />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Link
              href="/master/leads"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface border border-border transition-colors"
              title="Back to all leads"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  CRM Lead Detail
                </span>
                <span className="text-xs text-muted-foreground">&bull;</span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {lead.referenceCode}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {lead.name} &ndash; {lead.topic}
              </h1>
            </div>
          </div>

          {/* Quick Action Controls (Status & Assignee) */}
          <div className="flex flex-wrap items-center gap-4 bg-surface p-3 rounded-2xl border border-border shadow-sm">
            <LeadStatusSelector
              leadId={lead.id}
              currentStatus={lead.status}
              disabled={!canManage}
            />
            <div className="h-6 w-px bg-border hidden sm:block" />
            <LeadAssigneeSelector
              leadId={lead.id}
              assignedUserId={lead.assignedUserId}
              users={allUsers}
              disabled={!canManage}
            />
          </div>
        </header>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (lg:col-span-7): Client Info, Message & Attribution */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact Details Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Client Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <User className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground block">Full Name</span>
                    <span className="font-semibold text-foreground text-sm">
                      {lead.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground block">Work Email</span>
                    <a
                      href={`mailto:${lead.email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {lead.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground block">Telephone</span>
                    {lead.phone ? (
                      <a
                        href={`tel:${lead.phone}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {lead.phone}
                      </a>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Not provided
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground block">Received At</span>
                    <span className="text-foreground">{createdDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message & Scope Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Enquiry Message
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {lead.topic}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-subtle border border-border text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {lead.message}
              </div>
            </div>

            {/* Campaign & UTM Attribution Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Campaign &amp; Acquisition Attribution
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-surface-subtle border border-border">
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    UTM Source
                  </span>
                  <span className="font-semibold text-foreground">
                    {lead.utmAttribution?.utmSource || "Direct / Organic"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-subtle border border-border">
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    UTM Medium
                  </span>
                  <span className="font-semibold text-foreground">
                    {lead.utmAttribution?.utmMedium || "N/A"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-subtle border border-border">
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    UTM Campaign
                  </span>
                  <span className="font-semibold text-foreground">
                    {lead.utmAttribution?.utmCampaign || "N/A"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-subtle border border-border">
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Source Channel
                  </span>
                  <span className="font-semibold text-foreground">
                    {lead.sourceChannel}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-subtle border border-border col-span-2">
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Landing Page
                  </span>
                  <span className="font-mono text-[11px] text-foreground truncate block">
                    {lead.landingPage || "/contact"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (lg:col-span-5): Internal Notes & Audit Event Timeline */}
          <div className="lg:col-span-5 space-y-6">
            {/* Internal Notes Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span>Internal Team Notes</span>
                </h2>
                <span className="text-xs text-muted-foreground">
                  {lead.notes.length} notes
                </span>
              </div>

              {/* Add Note Form */}
              {canManage ? (
                <LeadNoteForm leadId={lead.id} />
              ) : (
                <div className="text-xs text-muted-foreground italic">
                  Read-only view. Manage permissions required to post notes.
                </div>
              )}

              {/* Notes List */}
              <div className="space-y-3 pt-2 border-t border-border">
                {lead.notes.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic text-center py-4">
                    No internal notes yet. Use the form above to log team remarks.
                  </p>
                ) : (
                  lead.notes.map((note) => {
                    const noteDate = new Intl.DateTimeFormat("en-KE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(note.createdAt));

                    return (
                      <div
                        key={note.id}
                        className="rounded-xl border border-border bg-surface-subtle p-3.5 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-foreground">
                            {note.author.name || note.author.email}
                          </span>
                          <span className="text-muted-foreground">
                            {noteDate}
                          </span>
                        </div>
                        <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                          {note.note}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Lifecycle Audit Event Timeline */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  <span>Lifecycle Event Trail</span>
                </h2>
                <span className="text-xs text-muted-foreground">
                  {lead.events.length} events
                </span>
              </div>

              <div className="space-y-3 pt-2 border-t border-border">
                {lead.events.map((evt, idx) => {
                  const evtDate = new Intl.DateTimeFormat("en-KE", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(evt.createdAt));

                  return (
                    <div key={evt.id} className="flex items-start gap-3 text-xs">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-foreground text-[11px]">
                            {evt.eventType}
                          </span>
                          <span className="text-muted-foreground text-[10px] shrink-0">
                            {evtDate}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11px] mt-0.5 leading-snug">
                          {evt.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
