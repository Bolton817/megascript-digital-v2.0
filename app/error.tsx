"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error reference without leaking stack or PII
    console.error("Application error:", error.digest || error.message);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-surface-subtle">
      <div className="max-w-md w-full rounded-2xl border border-surface-border bg-surface p-8 shadow-sm">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-accent-subtle text-accent border border-accent/20">
          Temporary Issue
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Something went wrong on our end.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          We could not load this page right now. Please refresh and try again in a
          moment. If the issue continues, reach us directly at{" "}
          <a
            href="mailto:info@megascriptdigital.co.ke"
            className="text-primary hover:underline font-medium"
          >
            info@megascriptdigital.co.ke
          </a>
          .
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-lg bg-surface px-4 py-2 text-sm font-semibold text-foreground border border-surface-border hover:bg-surface-subtle transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
