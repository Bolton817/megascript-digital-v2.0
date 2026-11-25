"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertTriangle, Info, ArrowRight, ShieldCheck, Mail } from "lucide-react";

function ConfirmedContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const email = searchParams.get("email");
  const already = searchParams.get("already");
  const error = searchParams.get("error");

  const isSuccess = status === "success";
  const isAlready = Boolean(already);
  const isError = Boolean(error);

  return (
    <div className="py-20 md:py-28">
      <Container className="max-w-2xl">
        <div className="rounded-2xl border border-surface-border bg-surface p-8 md:p-12 shadow-sm text-center">
          {isSuccess && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <span className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-4">
                Subscription Confirmed
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-4">
                Welcome to MegaScript Digital
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Thank you for verifying your email address. You are now subscribed to receive our quarterly engineering insights, production postmortems, and software architecture guides.
              </p>

              {email && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface-subtle px-4 py-2 text-sm text-foreground font-mono mb-8">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <span>{email}</span>
                </div>
              )}

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-left text-xs text-muted-foreground mb-8">
                <p className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  What happens next?
                </p>
                <p>
                  We have dispatched your onboarding welcome pack to your inbox. You can manage your preferences or unsubscribe at any time using the link in every email.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/services">
                  <Button variant="primary" size="md" className="w-full sm:w-auto">
                    Explore Our Services <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline" size="md" className="w-full sm:w-auto">
                    Read Our Tech Articles
                  </Button>
                </Link>
              </div>
            </>
          )}

          {isAlready && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Info className="h-9 w-9" />
              </div>
              <span className="inline-block rounded-full bg-sky-100 dark:bg-sky-950/60 px-3 py-1 text-xs font-semibold text-sky-800 dark:text-sky-300 mb-4">
                Already Active
              </span>
              <h1 className="text-3xl font-black tracking-tight text-foreground mb-4">
                You Are Already Subscribed
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                Your subscription was already confirmed earlier. Your email address is actively enrolled to receive our upcoming technology publications.
              </p>
              <div className="flex justify-center gap-3">
                <Link href="/">
                  <Button variant="primary" size="md">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </>
          )}

          {isError && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="h-9 w-9" />
              </div>
              <span className="inline-block rounded-full bg-rose-100 dark:bg-rose-950/60 px-3 py-1 text-xs font-semibold text-rose-800 dark:text-rose-300 mb-4">
                Verification Failed
              </span>
              <h1 className="text-3xl font-black tracking-tight text-foreground mb-4">
                Invalid or Expired Link
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                {error || "The confirmation token has expired or is invalid. Confirmation tokens are valid for 72 hours."}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/#footer">
                  <Button variant="primary" size="md">
                    Subscribe Again
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="md">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </>
          )}

          {!isSuccess && !isAlready && !isError && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-subtle text-muted">
                <Mail className="h-9 w-9" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Newsletter Confirmation
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                Please check your inbox and click the verification link sent from MegaScript Digital.
              </p>
              <Link href="/">
                <Button variant="primary" size="md">
                  Return Home
                </Button>
              </Link>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="mt-4 text-sm text-muted">Verifying your subscription...</p>
        </div>
      }
    >
      <ConfirmedContent />
    </Suspense>
  );
}
