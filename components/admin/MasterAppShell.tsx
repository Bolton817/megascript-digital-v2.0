"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  ShieldCheck,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";
import { MasterSidebarContent } from "./MasterSidebarContent";
import { SessionInactivityGuard } from "./SessionInactivityGuard";

interface MasterAppShellProps {
  children: React.ReactNode;
}

export function MasterAppShell({ children }: MasterAppShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer whenever route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // If on login page, render clean centered container without sidebar or header
  if (pathname === "/master/login") {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  // Derive page label for the top header breadcrumb
  const getPageTitle = (path: string) => {
    if (path.startsWith("/master/content/services")) return "Services Catalog";
    if (path.startsWith("/master/content/products")) return "Product Showcase";
    if (path.startsWith("/master/content/portfolio")) return "Client Portfolio";
    if (path.startsWith("/master/content/testimonials")) return "Client Testimonials";
    if (path.startsWith("/master/content")) return "Content Hub";
    if (path.startsWith("/master/leads")) return "CRM Leads & Inquiries";
    if (path.startsWith("/master/conversations")) return "Tony AI Conversations";
    if (path.startsWith("/master/tony/prompts")) return "Tony Prompts & Safety";
    if (path.startsWith("/master/newsletter")) return "Newsletter Campaigns";
    if (path.startsWith("/master/overview")) return "Operations Overview";
    return "Operations Console";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row antialiased">
      {/* 15-Minute Idle Session Guard enforced globally for all console pages */}
      <SessionInactivityGuard />

      {/* 1. Desktop Persistent Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 z-30 border-r border-border bg-surface">
        <MasterSidebarContent />
      </aside>

      {/* 2. Mobile Drawer (Slide-Over) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Surface */}
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-surface border-r border-border shadow-2xl z-50">
            {/* Close Button Header */}
            <div className="p-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">
                Navigation Menu
              </span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sidebar content inside drawer */}
            <div className="flex-1 overflow-y-auto">
              <MasterSidebarContent onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Content Wrapper */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Button (Mobile Only) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl border border-border text-foreground hover:bg-surface transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Brand Monogram & Breadcrumb */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-black text-sm">
                M
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/master/overview"
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  /master
                </Link>
                <span className="text-xs text-muted-foreground">/</span>
                <span className="text-xs font-bold text-foreground truncate max-w-[180px] sm:max-w-none">
                  {getPageTitle(pathname)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Status Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Security Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>RBAC Enforced</span>
            </div>

            {/* Public Site Link */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">View Site</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Route Body */}
        <main className="flex-1 bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  );
}
