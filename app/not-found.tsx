import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-surface-subtle">
      <div className="max-w-md w-full rounded-2xl border border-surface-border bg-surface p-8 shadow-sm">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-surface-subtle text-muted-foreground border border-surface-border">
          Error 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          We could not find that page.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          The link may be outdated, or the page may have moved or been unpublished.
          Use the options below to get back on track.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            Go to Homepage
          </Link>
          <Link
            href="/portfolio"
            className="rounded-lg bg-surface px-4 py-2 text-sm font-semibold text-foreground border border-surface-border hover:bg-surface-subtle transition-colors"
          >
            View Portfolio
          </Link>
          <Link
            href="/contact"
            className="rounded-lg bg-surface px-4 py-2 text-sm font-semibold text-foreground border border-surface-border hover:bg-surface-subtle transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
