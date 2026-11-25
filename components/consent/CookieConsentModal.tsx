"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredConsent, saveStoredConsent, ConsentState } from "@/lib/consent";
import { Shield, X, Check, Lock, BarChart3, Target, ArrowRight } from "lucide-react";

interface CookieConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CookieConsentModal({ isOpen, onClose }: CookieConsentModalProps) {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getStoredConsent();
      setAnalytics(Boolean(current.analytics));
      setMarketing(Boolean(current.marketing));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSavePreferences = () => {
    saveStoredConsent({ analytics, marketing });
    onClose();
  };

  const handleAcceptAll = () => {
    saveStoredConsent({ analytics: true, marketing: true });
    setAnalytics(true);
    setMarketing(true);
    onClose();
  };

  const handleRejectOptional = () => {
    saveStoredConsent({ analytics: false, marketing: false });
    setAnalytics(false);
    setMarketing(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-surface text-foreground shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border p-5 sm:p-6 bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="cookie-modal-title" className="text-base font-bold text-foreground">
                Cookie & Privacy Preferences
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage your tracking technologies and data permissions (KDPA 2019)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cookie preferences"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body / Categories List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs scrollbar-thin">
          <p className="text-muted-foreground leading-relaxed">
            MegaScript Digital respects your privacy choices. Under the Kenya Data Protection Act 2019, you have the right to decide whether optional analytics and marketing technologies may be stored on your device.
          </p>

          {/* Category 1: Strictly Necessary */}
          <div className="rounded-xl border border-border p-4 bg-surface-subtle/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                <span className="font-bold text-foreground text-sm">Strictly Necessary Cookies</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                Always Active
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Required for core platform security, administrative authentication, session persistence, CSRF protection, and user appearance preferences (light/dark theme, reduced motion). These cookies cannot be turned off.
            </p>
          </div>

          {/* Category 2: Performance & Analytics */}
          <div className="rounded-xl border border-border p-4 bg-surface-subtle/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span className="font-bold text-foreground text-sm">Analytics & Performance</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-surface-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Enables Google Analytics 4 (GA4) measurement. Collects aggregated, non-personally identifiable traffic metrics, pageviews, and bounce rates to help us understand how visitors discover and interact with our services.
            </p>
          </div>

          {/* Category 3: Marketing & Conversion Tracking */}
          <div className="rounded-xl border border-border p-4 bg-surface-subtle/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Target className="h-4 w-4 text-purple-500 shrink-0" aria-hidden="true" />
                <span className="font-bold text-foreground text-sm">Marketing & Attribution</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-surface-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Enables Meta Pixel and Conversions API (CAPI) client-side attribution. Used to assess marketing campaign efficacy and relevant service recommendations. Sensitive personal data is hashed using SHA-256 before transmission.
            </p>
          </div>

          <div className="pt-2 text-xs text-muted-foreground">
            Learn more about our data handling policies in our{" "}
            <Link
              href="/privacy-policy"
              onClick={onClose}
              className="text-primary underline hover:text-primary-hover font-semibold"
            >
              Privacy Policy
            </Link>
            .
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border p-4 sm:p-5 bg-surface-subtle">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleRejectOptional}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-border bg-surface text-foreground font-semibold hover:bg-surface-muted transition-colors text-xs"
            >
              Reject Optional
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-border bg-surface text-foreground font-semibold hover:bg-surface-muted transition-colors text-xs"
            >
              Accept All
            </button>
          </div>

          <button
            type="button"
            onClick={handleSavePreferences}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-sm transition-all text-xs"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
