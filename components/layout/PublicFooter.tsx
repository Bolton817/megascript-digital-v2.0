"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import {
  FOOTER_CORE_SERVICES,
  FOOTER_COMPLEMENTARY_SERVICES,
  FOOTER_PRODUCTS,
  FOOTER_COMPANY,
} from "@/config/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function PublicFooter() {
  const pathname = usePathname();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (pathname?.startsWith("/master")) {
    return null;
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newsletterEmail.trim(),
          consentSource: "footer",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to subscribe. Please try again.");
      } else {
        setIsSubscribed(true);
        setSuccessMessage(
          data.message ||
            "Thank you for subscribing. Please check your inbox to confirm your subscription."
        );
      }
    } catch {
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-border bg-surface text-foreground transition-colors">
      <Container className="pt-16 pb-12">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-surface-border">
          {/* Column 1: Brand & Action (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            >
              <Image
                src="/logos/logo.png"
                alt="MegaScript Digital"
                width={100}
                height={46}
                className="h-9 sm:h-10 w-auto object-contain"
              />
              <span className="text-base font-bold tracking-tight text-foreground">
                MegaScript <span className="text-primary font-normal">Digital</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              We design and build websites, web applications, mobile apps, and
              practical digital systems that help businesses work clearly and grow
              sustainably.
            </p>

            <div className="pt-2">
              <Link href="/contact">
                <Button variant="primary" size="md">
                  Start a Project
                </Button>
              </Link>
            </div>
          </div>

          {/* Column 2: Services (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Services
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {FOOTER_CORE_SERVICES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              {FOOTER_COMPLEMENTARY_SERVICES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Products & Company (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Products &amp; Company
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {FOOTER_PRODUCTS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              {FOOTER_COMPANY.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Get in Touch
            </h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <a
                href="mailto:info@megascriptdigital.co.ke"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>info@megascriptdigital.co.ke</span>
              </a>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                Stay Updated
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Receive practical digital guides, company updates, and product
                announcements. No spam, unsubscribe any time.
              </p>

              {isSubscribed ? (
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3 text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    {successMessage || "Thank you for subscribing. Please check your inbox to confirm your subscription."}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  {errorMessage && (
                    <div className="rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 p-2 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" aria-hidden="true" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Your email address"
                      required
                      className="w-full rounded-lg border border-surface-border bg-surface-subtle px-3 py-2 text-xs text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={isSubmitting}
                    >
                      Subscribe
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted leading-tight">
                    By subscribing, you agree to receive email updates from MegaScript
                    Digital. You can unsubscribe at any time. Read our{" "}
                    <Link
                      href="/privacy-policy"
                      className="underline hover:text-primary"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} MegaScript Digital. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/terms-and-conditions"
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Terms and Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Privacy Policy
            </Link>
            <button
              type="button"
              onClick={() => {
                // Dispatches open-cookie-preferences event or opens consent modal
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
                }
              }}
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Cookie Preferences
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
