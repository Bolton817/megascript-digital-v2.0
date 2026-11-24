"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MORE_SERVICES_MENU,
  PRODUCTS_MENU,
  COMPANY_MENU,
} from "@/config/navigation";
import { DesktopMegaMenu } from "./DesktopMegaMenu";
import { MobileNavigation } from "./MobileNavigation";
import { Button } from "@/components/ui/Button";

export function PublicHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (menuId: string) => {
    setActiveMenu((prev) => (prev === menuId ? null : menuId));
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  return (
    <>
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Floating Island Navigation Container */}
      <header className="sticky top-3 sm:top-5 z-40 w-full px-3 sm:px-6 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <nav
            aria-label="Main Navigation"
            className="flex items-center justify-between rounded-full border border-surface-border bg-surface/95 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-md transition-colors"
          >
            {/* Extreme Left: Brand Identity & Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                onClick={closeMenu}
                aria-label="MegaScript Digital Home"
                className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg py-1"
              >
                {/* Brand Mark SVG Symbol */}
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-sm transition-transform group-hover:scale-105">
                  M
                </div>
                <span className="text-sm sm:text-base font-bold tracking-tight text-foreground">
                  MegaScript <span className="text-primary font-normal">Digital</span>
                </span>
              </Link>
            </div>

            {/* Center Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                onClick={closeMenu}
                className="px-3 py-1.5 text-sm font-semibold text-foreground/90 hover:text-primary hover:bg-surface-subtle rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Home
              </Link>

              <DesktopMegaMenu
                category={MORE_SERVICES_MENU}
                isOpen={activeMenu === MORE_SERVICES_MENU.id}
                onToggle={() => toggleMenu(MORE_SERVICES_MENU.id)}
                onClose={closeMenu}
              />

              <DesktopMegaMenu
                category={PRODUCTS_MENU}
                isOpen={activeMenu === PRODUCTS_MENU.id}
                onToggle={() => toggleMenu(PRODUCTS_MENU.id)}
                onClose={closeMenu}
              />

              <DesktopMegaMenu
                category={COMPANY_MENU}
                isOpen={activeMenu === COMPANY_MENU.id}
                onToggle={() => toggleMenu(COMPANY_MENU.id)}
                onClose={closeMenu}
              />
            </div>

            {/* Right Action: Contact Button & Mobile Trigger */}
            <div className="flex items-center gap-2">
              <Link href="/contact" onClick={closeMenu} className="hidden sm:inline-block">
                <Button variant="primary" size="sm" className="rounded-full shadow-sm">
                  Contact Us
                </Button>
              </Link>

              {/* Mobile Menu Drawer */}
              <MobileNavigation />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
