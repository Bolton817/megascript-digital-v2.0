"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error.digest || error.message);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-orange-50 text-orange-600 border border-orange-200">
            System Notice
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Application Error
          </h1>
          <p className="mt-4 text-sm text-slate-600 leading-relaxed">
            A critical system issue occurred. Please try reloading or contact support at{" "}
            <a
              href="mailto:info@megascriptdigital.co.ke"
              className="text-sky-600 hover:underline"
            >
              info@megascriptdigital.co.ke
            </a>
            .
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => reset()}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 border border-slate-200 hover:bg-slate-50"
            >
              Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
