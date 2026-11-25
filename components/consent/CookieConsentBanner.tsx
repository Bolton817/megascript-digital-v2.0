"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredConsent, saveStoredConsent, ConsentState } from "@/lib/consent";
import { CookieConsentModal } from "./CookieConsentModal";
import { Shield, Settings2, Check, X, ArrowRight } from "lucide-react";

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 1. Check if user has already made a decision
    const current = getStoredConsent();
    if (!current.updatedAt) {
      // First visit: Show banner after brief delay
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // 2. Listen for footer trigger or manual reopening
    const handleOpenPreferences = () => {
      setIsModalOpen(true);
    };

    window.addEventListener("open-cookie-preferences", handleOpenPreferences);
    return () => {
      window.removeEventListener("open-cookie-preferences", handleOpenPreferences);
    };
  }, []);

  const handleAcceptAll = () => {
    saveStoredConsent({ analytics: true, marketing: true });
    setIsVisible(false);
  };

  const handleRejectOptional = () => {
    saveStoredConsent({ analytics: false, marketing: false });
    setIsVisible(false);
  };

  const handleOpenCustomize = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {isVisible && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 animate-in slide-in-from-bottom duration-300"
        >
          <div className="max-w-5xl mx-auto rounded-2xl border border-border bg-surface/95 backdrop-blur-md text-foreground shadow-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Banner Text Content */}
            <div className="flex items-start gap-3.5 max-w-2xl">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                <Shield className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-foreground">
                  Your Privacy & Cookie Choices
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We use cookies and telemetry to secure our website and understand how visitors explore our services in accordance with the Kenya Data Protection Act 2019. Optional analytics and marketing trackers remain disabled until you give consent.
                </p>
                <div className="pt-0.5">
                  <Link
                    href="/privacy-policy"
                    className="text-[11px] text-primary hover:underline font-semibold"
                  >
                    Read our full Privacy Policy
                  </Link>
                </div>
              </div>
            </div>

            {/* Banner Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 justify-end">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="px-3.5 py-2 rounded-xl border border-border bg-surface text-foreground font-semibold hover:bg-surface-muted transition-colors text-xs"
              >
                Reject Optional
              </button>

              <button
                type="button"
                onClick={handleOpenCustomize}
                className="px-3.5 py-2 rounded-xl border border-border bg-surface text-foreground font-semibold hover:bg-surface-muted transition-colors text-xs flex items-center gap-1.5"
              >
                <Settings2 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                <span>Customize</span>
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-sm transition-all text-xs"
              >
                Accept All
              </button>
            </div>

          </div>
        </aside>
      )}

      {/* Customize Preferences Modal */}
      <CookieConsentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsVisible(false);
        }}
      />
    </>
  );
}
