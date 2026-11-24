"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { ContactForm } from "./ContactForm";

interface QuickEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickEnquiryModal({ isOpen, onClose }: QuickEnquiryModalProps) {
  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-enquiry-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-surface-border bg-surface p-6 sm:p-8 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          aria-label="Close enquiry modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-2 pr-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Quick Enquiry
          </span>
          <h2
            id="quick-enquiry-title"
            className="text-2xl font-bold text-foreground font-display mt-0.5"
          >
            Start a Conversation
          </h2>
        </div>

        <ContactForm className="!border-0 !p-0 !shadow-none !bg-transparent mt-4" />
      </div>
    </div>
  );
}
