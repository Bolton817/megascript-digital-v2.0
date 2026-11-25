"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CONTACT_TOPICS, ContactTopic } from "@/lib/validations/contact";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  RefreshCw,
} from "lucide-react";
import { getStoredAttribution } from "@/lib/analytics/utm";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  topic: ContactTopic;
  message: string;
  consent: boolean;
  honeypot: string;
}

function ContactFormInner({ className = "" }: { className?: string }) {
  const searchParams = useSearchParams();

  // Extract initial topic from query param (e.g. /contact?topic=Mobile+Application+Development)
  const initialTopic = searchParams?.get("topic") as ContactTopic | null;
  const validInitialTopic: ContactTopic =
    initialTopic && CONTACT_TOPICS.includes(initialTopic)
      ? initialTopic
      : CONTACT_TOPICS[0];

  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
    topic: validInitialTopic,
    message: "",
    consent: false,
    honeypot: "",
  });

  const [timestamp, setTimestamp] = useState<number>(() => Date.now());
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");
  const [utmData, setUtmData] = useState<{
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    referrer?: string;
    landingPage?: string;
  }>({});

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{
    referenceCode: string;
    message: string;
  } | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Initialize idempotency key and capture UTM attribution on client mount
  useEffect(() => {
    setTimestamp(Date.now());
    const uuid =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `msd-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setIdempotencyKey(uuid);

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setUtmData({
        utmSource: urlParams.get("utm_source") || undefined,
        utmMedium: urlParams.get("utm_medium") || undefined,
        utmCampaign: urlParams.get("utm_campaign") || undefined,
        utmTerm: urlParams.get("utm_term") || undefined,
        utmContent: urlParams.get("utm_content") || undefined,
        referrer: document.referrer || undefined,
        landingPage: window.location.pathname,
      });
    }
  }, []);

  // Update topic if search param changes dynamically
  useEffect(() => {
    const qTopic = searchParams?.get("topic") as ContactTopic | null;
    if (qTopic && CONTACT_TOPICS.includes(qTopic)) {
      setValues((prev) => ({ ...prev, topic: qTopic }));
    }
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setValues((prev) => ({ ...prev, [name]: checked }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }

    // Clear field-specific error upon typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (generalError) setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setGeneralError(null);

    // Client-side quick checks
    if (!values.consent) {
      setFieldErrors({
        consent: [
          "You must confirm that you consent to our privacy policy to proceed",
        ],
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { firstTouch, lastTouch } = getStoredAttribution();

      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        topic: values.topic,
        message: values.message,
        consent: values.consent,
        honeypot: values.honeypot,
        timestamp,
        idempotencyKey,

        // Primary UTMs (fallback to stored if not currently in URL)
        utmSource: utmData.utmSource || lastTouch?.source || firstTouch?.source,
        utmMedium: utmData.utmMedium || lastTouch?.medium || firstTouch?.medium,
        utmCampaign: utmData.utmCampaign || lastTouch?.campaign || firstTouch?.campaign,
        utmTerm: utmData.utmTerm || lastTouch?.term || firstTouch?.term,
        utmContent: utmData.utmContent || lastTouch?.content || firstTouch?.content,
        referrer: utmData.referrer || lastTouch?.referrer || firstTouch?.referrer,
        landingPage: firstTouch?.landingPath || utmData.landingPage || (typeof window !== "undefined" ? window.location.pathname : undefined),

        // First-touch attribution (Sheet 073)
        firstTouchSource: firstTouch?.source || utmData.utmSource,
        firstTouchMedium: firstTouch?.medium || utmData.utmMedium,
        firstTouchCampaign: firstTouch?.campaign || utmData.utmCampaign,
        firstTouchTerm: firstTouch?.term || utmData.utmTerm,
        firstTouchContent: firstTouch?.content || utmData.utmContent,
        firstTouchReferrer: firstTouch?.referrer || utmData.referrer,
        firstTouchLanding: firstTouch?.landingPath || utmData.landingPage,
        firstTouchTimestamp: firstTouch?.timestamp,

        // Last-touch attribution (Sheet 073)
        lastTouchSource: lastTouch?.source || utmData.utmSource,
        lastTouchMedium: lastTouch?.medium || utmData.utmMedium,
        lastTouchCampaign: lastTouch?.campaign || utmData.utmCampaign,
        lastTouchTerm: lastTouch?.term || utmData.utmTerm,
        lastTouchContent: lastTouch?.content || utmData.utmContent,
        lastTouchReferrer: lastTouch?.referrer || utmData.referrer,
        lastTouchLanding: lastTouch?.landingPath || utmData.landingPage,
        lastTouchTimestamp: lastTouch?.timestamp,
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setGeneralError(
          data.error ||
            "Unable to submit enquiry. Please check your information and try again."
        );
        setIsSubmitting(false);
        return;
      }

      // Success
      setSuccessResult({
        referenceCode: data.referenceCode,
        message: data.message,
      });
      setIsSubmitting(false);
    } catch (err: any) {
      console.error("Contact submission error:", err);
      setGeneralError(
        "A network connection error occurred. Please check your connection or contact us directly at info@megascriptdigital.co.ke."
      );
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (!successResult) return;
    navigator.clipboard.writeText(successResult.referenceCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handleReset = () => {
    setValues({
      name: "",
      email: "",
      phone: "",
      topic: CONTACT_TOPICS[0],
      message: "",
      consent: false,
      honeypot: "",
    });
    setTimestamp(Date.now());
    const uuid =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `msd-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setIdempotencyKey(uuid);
    setSuccessResult(null);
    setFieldErrors({});
    setGeneralError(null);
  };

  // ---------------------------------------------------------------------------
  // SUCCESS STATE
  // ---------------------------------------------------------------------------
  if (successResult) {
    return (
      <div
        className={`rounded-3xl border border-surface-border bg-surface p-8 sm:p-10 shadow-card ${className}`}
        role="region"
        aria-live="polite"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-foreground font-display mb-2">
          Enquiry Received Successfully
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {successResult.message}
        </p>

        {/* Reference Code Card */}
        <div className="rounded-2xl border border-primary/20 bg-primary-subtle p-5 mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-1">
            Enquiry Reference Code
          </span>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xl sm:text-2xl font-mono font-black tracking-wider text-foreground">
              {successResult.referenceCode}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyReference}
              className="gap-1.5"
            >
              {copiedRef ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
          <span className="text-[11px] text-muted-foreground block mt-2">
            Quote this reference code in any follow-up communications. A copy
            has also been sent to your email.
          </span>
        </div>

        {/* Next Steps List */}
        <div className="space-y-3 mb-8 border-t border-surface-border pt-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            What happens next
          </h3>
          <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                1
              </span>
              <span>
                <strong className="text-foreground">Technical Review:</strong> A
                senior engineer reviews your scope, feasibility, and technical
                requirements.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                2
              </span>
              <span>
                <strong className="text-foreground">
                  Direct Email Response:
                </strong>{" "}
                You will receive a tailored reply within 24 business hours
                (Mon–Fri, 8:00 AM – 5:00 PM EAT).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                3
              </span>
              <span>
                <strong className="text-foreground">Discovery Call:</strong> If
                mutually agreeable, we schedule a 20-minute discovery call to
                finalize scope and quotation.
              </span>
            </li>
          </ul>
        </div>

        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleReset}
          className="w-full sm:w-auto gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Submit Another Enquiry</span>
        </Button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE FORM
  // ---------------------------------------------------------------------------
  return (
    <div
      className={`rounded-3xl border border-surface-border bg-surface p-6 sm:p-10 shadow-card ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
          Project &amp; Enquiry Details
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us about what you want to build. All fields marked with * are
          required.
        </p>
      </div>

      {generalError && (
        <div
          className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/50 p-4 mb-6 text-sm text-rose-800 dark:text-rose-200 flex items-start gap-3"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <span>{generalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Honeypot field (hidden from screen readers & sighted visitors) */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="company_website_url">Leave this field blank</label>
          <input
            type="text"
            id="company_website_url"
            name="honeypot"
            value={values.honeypot}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="contact-name"
              className="text-xs font-bold uppercase tracking-wider text-foreground"
            >
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="contact-name"
              name="name"
              value={values.name}
              onChange={handleChange}
              required
              aria-required="true"
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              placeholder="e.g. Alex Kamau"
              disabled={isSubmitting}
              className={`w-full rounded-xl border bg-surface-subtle px-4 py-2.5 text-sm text-foreground placeholder:text-muted transition-colors focus:outline-none focus:ring-2 ${
                fieldErrors.name
                  ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-surface-border focus:border-primary focus:ring-primary/20"
              }`}
            />
            {fieldErrors.name && (
              <p id="name-error" className="text-xs text-rose-500 mt-1" role="alert">
                {fieldErrors.name[0]}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="contact-email"
              className="text-xs font-bold uppercase tracking-wider text-foreground"
            >
              Work Email <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
              aria-required="true"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              placeholder="alex@company.com"
              disabled={isSubmitting}
              className={`w-full rounded-xl border bg-surface-subtle px-4 py-2.5 text-sm text-foreground placeholder:text-muted transition-colors focus:outline-none focus:ring-2 ${
                fieldErrors.email
                  ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-surface-border focus:border-primary focus:ring-primary/20"
              }`}
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-xs text-rose-500 mt-1" role="alert">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Phone & Topic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Phone Field (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="contact-phone"
                className="text-xs font-bold uppercase tracking-wider text-foreground"
              >
                Phone Number
              </label>
              <span className="text-[11px] text-muted-foreground">Optional</span>
            </div>
            <input
              type="tel"
              id="contact-phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              aria-invalid={!!fieldErrors.phone}
              aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
              placeholder="+254 712 345 678"
              disabled={isSubmitting}
              className={`w-full rounded-xl border bg-surface-subtle px-4 py-2.5 text-sm text-foreground placeholder:text-muted transition-colors focus:outline-none focus:ring-2 ${
                fieldErrors.phone
                  ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                  : "border-surface-border focus:border-primary focus:ring-primary/20"
              }`}
            />
            {fieldErrors.phone && (
              <p id="phone-error" className="text-xs text-rose-500 mt-1" role="alert">
                {fieldErrors.phone[0]}
              </p>
            )}
          </div>

          {/* Topic Dropdown */}
          <div className="space-y-1.5">
            <label
              htmlFor="contact-topic"
              className="text-xs font-bold uppercase tracking-wider text-foreground"
            >
              Primary Interest <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                id="contact-topic"
                name="topic"
                value={values.topic}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full appearance-none rounded-xl border border-surface-border bg-surface-subtle px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {CONTACT_TOPICS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              <div
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-muted-foreground"
                aria-hidden="true"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {fieldErrors.topic && (
              <p className="text-xs text-rose-500 mt-1" role="alert">
                {fieldErrors.topic[0]}
              </p>
            )}
          </div>
        </div>

        {/* Message Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="contact-message"
              className="text-xs font-bold uppercase tracking-wider text-foreground"
            >
              Project Overview or Question{" "}
              <span className="text-primary">*</span>
            </label>
            <span
              className={`text-[11px] ${
                values.message.length > 1900
                  ? "text-rose-500 font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {values.message.length} / 2,000
            </span>
          </div>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={values.message}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={!!fieldErrors.message}
            aria-describedby={
              fieldErrors.message ? "message-error" : undefined
            }
            maxLength={2000}
            placeholder="Tell us about your project goals, expected timeline, key deliverables, or questions. The more details you share, the better guidance we can provide."
            disabled={isSubmitting}
            className={`w-full rounded-xl border bg-surface-subtle p-4 text-sm text-foreground placeholder:text-muted transition-colors focus:outline-none focus:ring-2 resize-y ${
              fieldErrors.message
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-surface-border focus:border-primary focus:ring-primary/20"
            }`}
          />
          {fieldErrors.message && (
            <p id="message-error" className="text-xs text-rose-500 mt-1" role="alert">
              {fieldErrors.message[0]}
            </p>
          )}
        </div>

        {/* Kenya DPA 2019 Consent Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              id="contact-consent"
              name="consent"
              checked={values.consent}
              onChange={handleChange}
              disabled={isSubmitting}
              className="mt-1 h-4 w-4 rounded border-surface-border text-primary focus:ring-primary/30"
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              I consent to MegaScript Digital processing my contact details to
              evaluate and respond to this enquiry in accordance with the{" "}
              <strong className="text-foreground">
                Kenya Data Protection Act 2019
              </strong>{" "}
              and the{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="text-primary underline hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                Privacy Policy
              </Link>
              . We never sell or share your information.
            </span>
          </label>
          {fieldErrors.consent && (
            <p className="text-xs text-rose-500 mt-1 pl-7" role="alert">
              {fieldErrors.consent[0]}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full sm:w-auto min-w-[200px] gap-2"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span>Send Enquiry</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export function ContactForm(props: { className?: string }) {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl border border-surface-border bg-surface p-10 text-center text-sm text-muted-foreground">
          Loading contact form...
        </div>
      }
    >
      <ContactFormInner {...props} />
    </Suspense>
  );
}
