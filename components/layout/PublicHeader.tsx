"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MORE_SERVICES_MENU,
  PRODUCTS_MENU,
  COMPANY_MENU,
} from "@/config/navigation";
import { DesktopMegaMenu } from "./DesktopMegaMenu";
import { MobileNavigation } from "./MobileNavigation";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { SearchBarTrigger } from "@/components/search/SearchBarTrigger";
import { SearchDialog } from "@/components/search/SearchDialog";

export function PublicHeader() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  if (pathname?.startsWith("/master")) {
    return null;
  }

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
      <header className="sticky top-2 sm:top-5 z-40 w-full px-2.5 sm:px-6 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <nav
            aria-label="Main Navigation"
            className="flex items-center justify-between rounded-full border border-surface-border bg-surface/95 backdrop-blur-md px-3 sm:px-6 py-2 sm:py-2.5 shadow-subtle transition-colors"
          >
            {/* Extreme Left: Brand Identity & Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                onClick={closeMenu}
                aria-label="MegaScript Digital Home"
                className="group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg py-1"
              >
                {/* Brand Mark SVG Symbol */}
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-xs sm:text-sm shadow-xs transition-transform group-hover:scale-105">
                  M
                </div>
                <span className="text-xs sm:text-base font-bold tracking-tight text-foreground font-display">
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

            {/* Right Action: Search Trigger, Theme toggle, Contact Button & Mobile Trigger */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <SearchBarTrigger onOpen={() => setIsSearchOpen(true)} />

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} appearance`}
                title={`Switch to ${theme === "light" ? "dark" : "light"} appearance`}
                className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/75 hover:text-foreground hover:bg-surface-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
                )}
              </button>

              <Link href="/contact" onClick={closeMenu} className="hidden sm:inline-block">
                <Button variant="primary" size="sm" className="rounded-full shadow-sm">
                  Contact Us
                </Button>
              </Link>

              {/* Mobile Menu Drawer */}
              <MobileNavigation onOpenSearch={() => setIsSearchOpen(true)} />
            </div>
          </nav>
        </div>
      </header>

      {/* Global Accessible Search Command Palette */}
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
