"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { submitPrivacyRequestAction } from "@/server/actions/privacy";
import { PrivacyRequestType } from "@prisma/client";
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  HelpCircle,
  Lock,
} from "lucide-react";

export default function PrivacyRequestPage() {
  const [formData, setFormData] = useState({
    requesterName: "",
    requesterEmail: "",
    requestType: "ACCESS" as PrivacyRequestType,
    requestDetails: "",
    declarationConfirmed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    referenceCode: string;
    dueAt: string;
    requestType: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.declarationConfirmed) {
      setErrorMessage("Please confirm that you are the data subject or authorized representative.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitPrivacyRequestAction({
        requesterName: formData.requesterName,
        requesterEmail: formData.requesterEmail,
        requestType: formData.requestType,
        requestDetails: formData.requestDetails,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to submit request.");
      } else {
        setSuccessResult({
          referenceCode: res.referenceCode!,
          dueAt: res.dueAt!,
          requestType: res.requestType!,
        });
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (successResult?.referenceCode) {
      navigator.clipboard.writeText(successResult.referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span>/</span>
            <span className="text-foreground">Privacy Rights Request</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Shield className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Kenya Data Protection Act 2019 (Part IV Statutory Rights)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Exercise Your Privacy Rights
          </h1>

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Under the Kenya Data Protection Act, 2019, you have the right to request access, correction, objection, or deletion of personal data processed by MegaScript Digital. Complete this form to submit a verified inquiry to our Data Protection Office.
          </p>
        </div>

        {/* Success Confirmation Screen */}
        {successResult ? (
          <div className="mt-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">
                  Privacy Request Registered Successfully
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Your formal request has been recorded in our compliance register. Our Data Protection Office has been notified.
                </p>
              </div>
            </div>

            {/* Reference Code Box */}
            <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Official Tracking Reference Code
                </span>
                <div className="font-mono text-xl sm:text-2xl font-black text-primary tracking-wide">
                  {successResult.referenceCode}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface-muted text-foreground text-xs font-semibold hover:bg-surface-subtle transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    <span>Copy Reference</span>
                  </>
                )}
              </button>
            </div>

            {/* Statutory Timeline & Verification Notice */}
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-4">
              <p>
                <strong>Statutory Due Date:</strong> In accordance with the Kenya Data Protection Regulations, our office will evaluate and respond to your request within <strong>21 days</strong> (by {new Date(successResult.dueAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}).
              </p>
              <p>
                <strong>Identity Verification:</strong> To protect personal privacy and prevent unauthorized data disclosure, a representative may contact your email to verify your identity before disclosing or modifying records.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSuccessResult(null);
                  setFormData({
                    requesterName: "",
                    requesterEmail: "",
                    requestType: "ACCESS",
                    requestDetails: "",
                    declarationConfirmed: false,
                  });
                }}
                className="px-4 py-2 rounded-xl border border-border bg-surface text-foreground font-semibold hover:bg-surface-muted transition-colors text-xs"
              >
                Submit Another Request
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-sm transition-all text-xs"
              >
                <span>Return to Homepage</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {errorMessage && (
              <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 p-3.5 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="requesterName" className="block text-xs font-bold text-foreground">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="requesterName"
                  type="text"
                  required
                  value={formData.requesterName}
                  onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="requesterEmail" className="block text-xs font-bold text-foreground">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="requesterEmail"
                  type="email"
                  required
                  value={formData.requesterEmail}
                  onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Request Type Selector */}
            <div className="space-y-1.5">
              <label htmlFor="requestType" className="block text-xs font-bold text-foreground">
                Statutory Request Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="requestType"
                value={formData.requestType}
                onChange={(e) => setFormData({ ...formData, requestType: e.target.value as PrivacyRequestType })}
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="ACCESS">Right of Access (Request copy of personal records)</option>
                <option value="CORRECTION">Right to Rectification (Correct inaccurate or outdated information)</option>
                <option value="OBJECTION">Right to Object (Object to processing or marketing communications)</option>
                <option value="DELETION">Right to Erasure (Request deletion of personal data / Right to be forgotten)</option>
                <option value="GENERAL_INQUIRY">General Inquiry (Question regarding data protection practices)</option>
              </select>
            </div>

            {/* Request Details */}
            <div className="space-y-1.5">
              <label htmlFor="requestDetails" className="block text-xs font-bold text-foreground">
                Request Details & Scope <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="requestDetails"
                required
                rows={4}
                value={formData.requestDetails}
                onChange={(e) => setFormData({ ...formData, requestDetails: e.target.value })}
                placeholder="Please describe the specific records or personal data your request pertains to (e.g., inquiry submitted on 15 Nov, newsletter subscription, chat interaction)..."
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed resize-none"
              />
              <span className="text-[11px] text-muted-foreground block text-right">
                {formData.requestDetails.length}/1000 characters
              </span>
            </div>

            {/* Legal Declaration Checkbox */}
            <div className="rounded-xl border border-border bg-surface-subtle p-4 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.declarationConfirmed}
                  onChange={(e) => setFormData({ ...formData, declarationConfirmed: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I declare under penalty of law that I am the data subject whose personal information is referenced, or an authorized legal representative acting with explicit power of attorney.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/privacy-policy"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Return to Privacy Policy
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-sm transition-all text-xs disabled:opacity-50"
              >
                {isSubmitting ? "Registering Request..." : "Submit Formal Request"}
              </button>
            </div>
          </form>
        )}
      </Container>
    </main>
  );
}
