"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  X,
  Mail,
  Phone,
  Send,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { SOCIAL_CHANNELS } from "@/config/navigation";
import { QuickEnquiryModal } from "@/components/contact/QuickEnquiryModal";

// Verified SVG icons for social channels
function SocialIcon({ platform }: { platform: string }) {
  switch (platform.toLowerCase()) {
    case "facebook":
      return (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "x":
      return (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "threads":
      return (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.186 24C5.467 24 0 18.533 0 11.814 0 5.094 5.467 0 12.186 0c6.643 0 11.967 5.253 12.181 11.892h-3.456c-.208-4.743-4.053-8.513-8.725-8.513-4.814 0-8.726 3.911-8.726 8.725 0 4.814 3.912 8.725 8.726 8.725 3.864 0 7.159-2.525 8.283-6.046h-8.283v-3.379h11.888C24.075 20.354 18.732 24 12.186 24z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.525.02c1.31 0 2.6.43 3.65 1.23 1.15.88 1.95 2.14 2.27 3.56.88-.08 1.77.06 2.59.42.82.35 1.54.91 2.08 1.62.06.08.09.18.09.28v3.42a.37.37 0 0 1-.37.37 6.94 6.94 0 0 1-3.69-.97v7.54c0 1.99-.79 3.9-2.2 5.3-1.41 1.41-3.32 2.2-5.31 2.2-1.99 0-3.9-.79-5.31-2.2-1.41-1.4-2.2-3.31-2.2-5.3 0-1.99.79-3.9 2.2-5.31 1.41-1.41 3.32-2.2 5.31-2.2.49 0 .97.05 1.44.15v3.66a3.67 3.67 0 0 0-1.44-.29c-.98 0-1.92.39-2.61 1.08-.69.69-1.08 1.63-1.08 2.61 0 .98.39 1.92 1.08 2.61.69.69 1.63 1.08 2.61 1.08.98 0 1.92-.39 2.61-1.08.69-.69 1.08-1.63 1.08-2.61V0h3.69z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    default:
      return <ExternalLink className="h-4 w-4" />;
  }
}

export function CommunicationHub() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Suppress on /master/* administrative paths
  if (pathname?.startsWith("/master")) {
    return null;
  }

  // Environment variables for direct telephone & WhatsApp
  const phone = process.env.NEXT_PUBLIC_COMPANY_PHONE || null;
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    (phone ? phone.replace(/[^0-9]/g, "") : null);

  // Filter only configured social channels (strictly hide unconfigured / null links)
  const configuredSocialChannels = SOCIAL_CHANNELS.filter(
    (ch) => ch.url && ch.url.trim().length > 0
  );

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOpenQuickModal = () => {
    setIsOpen(false);
    setIsQuickModalOpen(true);
  };

  const encodedWaText = encodeURIComponent(
    "Hello MegaScript Digital, I would like to enquire about your software and development services."
  );

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 print:hidden">
        {/* Floating Trigger Button */}
        <button
          ref={triggerRef}
          type="button"
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={
            isOpen ? "Close communication hub" : "Open communication hub"
          }
          className={`group flex items-center gap-2.5 rounded-full px-4 py-3 shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            isOpen
              ? "bg-foreground text-background scale-95"
              : "bg-primary text-primary-foreground hover:bg-primary-hover hover:scale-105 active:scale-95"
          }`}
        >
          {isOpen ? (
            <X className="h-5 w-5 transition-transform duration-200 rotate-90 group-hover:rotate-0" />
          ) : (
            <MessageSquare className="h-5 w-5" />
          )}
          <span className="text-xs font-bold tracking-wide hidden sm:inline-block">
            {isOpen ? "Close" : "Talk to Us"}
          </span>
        </button>

        {/* Popover Action Menu */}
        {isOpen && (
          <div
            ref={popoverRef}
            role="dialog"
            aria-label="Contact options"
            className="absolute bottom-16 right-0 w-[300px] sm:w-[340px] max-w-[calc(100vw-32px)] rounded-3xl border border-surface-border bg-surface p-5 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-3 duration-150"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                  Communication Hub
                </span>
                <h3 className="text-base font-bold text-foreground font-display">
                  Get in Touch
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Dismiss menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Action Items List */}
            <div className="space-y-2">
              {/* WhatsApp (only if configured) */}
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodedWaText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl border border-surface-border bg-surface-subtle hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Send className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-foreground block">
                        WhatsApp Chat
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Direct instant response
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                </a>
              )}

              {/* Direct Telephone (only if configured) */}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center justify-between p-3 rounded-2xl border border-surface-border bg-surface-subtle hover:border-primary/40 hover:bg-primary/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-foreground block">
                        Call Direct
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Mon&ndash;Fri 8am&ndash;5pm EAT
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              )}

              {/* Quick Enquiry Modal Trigger */}
              <button
                type="button"
                onClick={handleOpenQuickModal}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-surface-border bg-surface-subtle hover:border-primary/40 hover:bg-primary/5 transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      Quick Enquiry Form
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      24-hour response guarantee
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>

              {/* Direct Email Link */}
              <a
                href="mailto:info@megascriptdigital.co.ke"
                className="flex items-center justify-between p-3 rounded-2xl border border-surface-border bg-surface-subtle hover:border-primary/40 hover:bg-primary/5 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-foreground block">
                      Email Team
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      info@megascriptdigital.co.ke
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>

            {/* Social Channels (Strictly hide if none are configured) */}
            {configuredSocialChannels.length > 0 && (
              <div className="pt-3 mt-3 border-t border-surface-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Follow Our Work
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {configuredSocialChannels.map((ch) => (
                    <a
                      key={ch.platform}
                      href={ch.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-surface-border bg-surface-subtle text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                      title={ch.label}
                      aria-label={ch.label}
                    >
                      <SocialIcon platform={ch.platform} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Full Contact Page Link */}
            <div className="pt-3 mt-3 border-t border-surface-border text-center">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                <span>Visit full contact page &amp; FAQs</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Quick Enquiry Modal */}
      <QuickEnquiryModal
        isOpen={isQuickModalOpen}
        onClose={() => setIsQuickModalOpen(false)}
      />
    </>
  );
}
