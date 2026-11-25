"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createCampaignAction } from "@/server/actions/newsletter";
import {
  FileText,
  ArrowLeft,
  Eye,
  Edit3,
  Calendar,
  AlertCircle,
  Save,
  Clock,
} from "lucide-react";

export default function NewCampaignPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [body, setBody] = useState(
    `<h2 style="color: #0f172a; margin-top: 0;">Quarterly Engineering Dispatch</h2>\n<p>Welcome to our latest deep-dive on scalable web application architecture and resilient systems in Eastern Africa.</p>\n<p>Here is what our team engineered this month:</p>\n<ul>\n  <li>High-throughput transactional email pipelines with double opt-in verification.</li>\n  <li>Sub-50ms Supabase PostgreSQL connection pooling for serverless environments.</li>\n</ul>\n<p>Have questions or feedback? Reply directly to this email.</p>`
  );
  const [scheduledAt, setScheduledAt] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !subject.trim() || !body.trim()) {
      setErrorMessage("Please complete all required fields (Title, Subject, Body).");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: any = {
        title: title.trim(),
        subject: subject.trim(),
        preheader: preheader.trim() || undefined,
        body: body.trim(),
      };

      if (scheduledAt) {
        payload.scheduledAt = new Date(scheduledAt).toISOString();
      }

      const res = await createCampaignAction(payload);
      if (!res.success || !res.campaign) {
        setErrorMessage(res.error || "Failed to create campaign draft");
      } else {
        router.push(`/master/newsletter/campaigns/${res.campaign.id}`);
      }
    } catch {
      setErrorMessage("Unexpected error saving campaign.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <SessionInactivityGuard />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border">
          <div className="space-y-1">
            <Link
              href="/master/newsletter/campaigns"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Campaigns
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Compose Newsletter Campaign
              </h1>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center rounded-lg border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeTab === "edit"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeTab === "preview"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Live Preview
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 p-4 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {activeTab === "edit" ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Internal Campaign Title *
                </label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q4 Engineering Architecture Highlights"
                  className="w-full"
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  Identifies the broadcast internally in the operations console.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Email Subject Line *
                </label>
                <Input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. MegaScript Digital: How We Designed Fault-Tolerant Systems"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Preheader / Snippet (Optional)
                </label>
                <Input
                  value={preheader}
                  onChange={(e) => setPreheader(e.target.value)}
                  placeholder="e.g. Inside our latest architecture patterns and engineering updates"
                  className="w-full"
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  Displayed next to the subject line in modern email inboxes.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Schedule Broadcast Date &amp; Time (Optional)
                </label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full"
                  />
                </div>
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  Leave blank to save as a draft and dispatch manually later.
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-2">
              <label className="block text-xs font-semibold text-foreground">
                Email HTML Body *
              </label>
              <textarea
                required
                rows={12}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full font-mono text-xs rounded-xl border border-border bg-surface-subtle p-4 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
                placeholder="Enter HTML or email paragraphs..."
              />
              <span className="text-[11px] text-muted-foreground block">
                MegaScript Digital template styling and mandatory unsubscribe links are injected automatically upon dispatch.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link href="/master/newsletter/campaigns">
                <Button type="button" variant="outline" size="md">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="gap-2"
              >
                {scheduledAt ? (
                  <>
                    <Clock className="h-4 w-4" />
                    Save &amp; Schedule
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Draft
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          /* Live Preview Mode */
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-3">
              <div className="text-xs text-muted-foreground space-y-1">
                <div>
                  <strong className="text-foreground">From:</strong> MegaScript Digital &lt;info@megascriptdigital.co.ke&gt;
                </div>
                <div>
                  <strong className="text-foreground">Subject:</strong> {subject || "(No subject provided)"}
                </div>
                {preheader && (
                  <div>
                    <strong className="text-foreground">Preheader:</strong> {preheader}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface-subtle p-6 shadow-sm">
              <div className="max-w-[560px] mx-auto bg-white text-slate-900 border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <span className="text-lg font-black tracking-tight text-slate-900">
                    MegaScript <span className="text-sky-600">Digital</span>
                  </span>
                </div>

                <div
                  className="prose prose-sm max-w-none text-slate-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: body }}
                />

                <hr className="my-6 border-slate-200" />
                <div className="text-center text-[11px] text-slate-400 space-y-1">
                  <p>&copy; {new Date().getFullYear()} MegaScript Digital &bull; Nairobi, Kenya</p>
                  <p>
                    <a href="#" className="text-sky-600 underline">
                      Unsubscribe from future campaigns
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setActiveTab("edit")}
              >
                Return to Editor
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
