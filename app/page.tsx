import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-between p-6 sm:p-12 md:p-20 bg-surface-subtle">
      <div className="my-12 sm:my-16 flex flex-col items-center text-center max-w-3xl">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-surface text-primary border border-surface-border">
          Web, Software &amp; Digital Systems
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground sm:leading-tight">
          Digital solutions built to help your business work better and grow.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          We design and build websites, web applications, and mobile apps that look
          sharp on the surface and run reliably underneath. Whether you need a credible
          online presence or custom software for daily operations, we keep the process
          straightforward from day one.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
          >
            Start a Project
          </Link>
          <Link
            href="/portfolio"
            className="rounded-lg bg-surface px-6 py-3 text-sm font-semibold text-foreground border border-surface-border hover:bg-surface-subtle transition-colors"
          >
            Explore Our Work
          </Link>
        </div>
      </div>

      <div className="grid text-center sm:text-left sm:grid-cols-3 max-w-5xl w-full gap-4 sm:gap-6">
        <div className="rounded-xl border border-surface-border bg-surface p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Websites &amp; SEO</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Fast, mobile-first websites designed to explain what you do clearly and build trust.
          </p>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Web Applications</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Custom browser-based business systems, staff dashboards, and workflow tools.
          </p>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Mobile Applications</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Practical Android and iOS applications that bring your services directly to users.
          </p>
        </div>
      </div>
    </main>
  );
}
