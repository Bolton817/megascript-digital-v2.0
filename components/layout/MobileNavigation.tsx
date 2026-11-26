"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Mail, Sun, Moon } from "lucide-react";
import { MEGA_MENUS } from "@/config/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/components/providers/ThemeProvider";
import { SearchBarTrigger } from "@/components/search/SearchBarTrigger";

interface MobileNavigationProps {
  onOpenSearch?: () => void;
}

export function MobileNavigation({ onOpenSearch }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setOpenAccordion(null);
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        closeMenu();
        triggerRef.current?.focus();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  return (
    <div className="lg:hidden">
      {/* Mobile Hamburger Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        className="flex items-center justify-center p-2 rounded-xl text-foreground hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Full-Screen Accessible Navigation Drawer */}
      {isOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-50 flex flex-col bg-background/98 backdrop-blur-xl animate-in fade-in-0 duration-200"
        >
          {/* Top Bar with Brand, Theme Toggle & Close Button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-2.5 text-base font-bold text-foreground"
            >
              <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src="/logos/site-icon.png"
                  alt="MegaScript Digital Mark"
                  width={28}
                  height={28}
                  className="h-full w-full object-contain"
                />
              </div>
              <span>MegaScript <span className="text-primary font-normal">Digital</span></span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} appearance`}
                className="rounded-lg p-2 text-muted-foreground hover:bg-surface-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-400" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close navigation menu"
                className="rounded-lg p-2 text-muted-foreground hover:bg-surface-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Scrollable Navigation Tree */}
          <div
            ref={drawerRef}
            className="flex-1 overflow-y-auto px-6 py-6 space-y-4 text-left"
          >
            {/* Quick Mobile Search Trigger */}
            {onOpenSearch && (
              <div className="pb-2 border-b border-surface-border/50">
                <SearchBarTrigger
                  variant="mobile"
                  onOpen={() => {
                    closeMenu();
                    onOpenSearch();
                  }}
                />
              </div>
            )}

            {/* Direct Home Link */}
            <Link
              href="/"
              onClick={closeMenu}
              className="block py-2 text-lg font-bold text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>

            {/* Accordion Categories */}
            {MEGA_MENUS.map((category) => {
              const isExpanded = openAccordion === category.id;
              return (
                <div key={category.id} className="border-b border-surface-border/60 pb-3">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(category.id)}
                    aria-expanded={isExpanded}
                    className="flex w-full items-center justify-between py-2 text-lg font-bold text-foreground hover:text-primary transition-colors text-left"
                  >
                    <span>{category.label}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-muted transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-primary" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-3 pl-2">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {category.intro}
                      </p>
                      <div className="space-y-2 pt-1">
                        {category.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMenu}
                            className="block p-2.5 rounded-lg bg-surface-subtle border border-surface-border/50 hover:border-primary/40 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground">
                                {item.title}
                              </span>
                              {item.badge && (
                                <Badge variant="primary" size="sm">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Contact Page Link */}
            <Link
              href="/contact"
              onClick={closeMenu}
              className="block py-2 text-lg font-bold text-foreground hover:text-primary transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* Bottom Fixed Action Panel */}
          <div className="p-6 border-t border-surface-border bg-surface space-y-3">
            <Link href="/contact" onClick={closeMenu} className="block w-full">
              <Button variant="primary" size="lg" className="w-full">
                Start a Project
              </Button>
            </Link>
            <a
              href="mailto:info@megascriptdigital.co.ke"
              className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary pt-1"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              <span>info@megascriptdigital.co.ke</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
