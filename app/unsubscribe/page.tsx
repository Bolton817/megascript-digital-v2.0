"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckCircle2, AlertCircle, Mail, ArrowLeft, Shield } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status");
  const initialEmail = searchParams.get("email");
  const token = searchParams.get("token");

  const [email, setEmail] = useState(initialEmail || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(initialStatus === "success");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !token) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), token }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to process unsubscribe request.");
      } else {
        setIsUnsubscribed(true);
      }
    } catch {
      setErrorMessage("Network error. Please try again or email info@megascriptdigital.co.ke");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 md:py-28">
      <Container className="max-w-xl">
        <div className="rounded-2xl border border-surface-border bg-surface p-8 md:p-12 shadow-sm">
          {isUnsubscribed ? (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-3">
                You Have Been Unsubscribed
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Your email address has been suppressed from all future marketing and newsletter broadcasts. You will no longer receive broadcast communications from MegaScript Digital.
              </p>

              <div className="rounded-xl border border-surface-border bg-surface-subtle p-4 text-xs text-muted-foreground mb-8 text-left space-y-2">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Privacy Notice</span>
                </div>
                <p>
                  In compliance with the Kenya Data Protection Act 2019, your email remains safely suppressed in our database to ensure automated campaigns will never re-contact you without explicit fresh consent.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/">
                  <Button variant="primary" size="md" className="w-full sm:w-auto">
                    Return to Homepage
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="md" className="w-full sm:w-auto">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-subtle text-muted">
                  <Mail className="h-7 w-7" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                  Unsubscribe from Newsletter
                </h1>
                <p className="text-xs text-muted-foreground">
                  We are sorry to see you go. Enter your email address to opt out of future broadcasts.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/50 p-3.5 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleUnsubscribe} className="space-y-4">
                <div>
                  <label htmlFor="unsub-email" className="block text-xs font-semibold text-foreground mb-1.5">
                    Email Address
                  </label>
                  <Input
                    id="unsub-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  Confirm Unsubscribe
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-surface-border text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Return to MegaScript Digital
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="mt-4 text-sm text-muted">Loading...</p>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
