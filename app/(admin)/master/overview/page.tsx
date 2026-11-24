import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function MasterOverviewPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-lg shadow-sm">
              M
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                /master Operations Console
              </span>
              <h1 className="text-2xl font-bold text-foreground">
                Overview &amp; Dashboard
              </h1>
            </div>
          </div>

          <Link href="/master/login">
            <Button variant="outline" size="sm">
              Sign Out
            </Button>
          </Link>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-2">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            <span>Authenticated Administrative Session Verified</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Welcome to the MegaScript Digital operations console. The authentication
            flow, allowlist verification, and 6-digit OTP engine are verified and active.
          </p>
        </div>
      </div>
    </div>
  );
}
