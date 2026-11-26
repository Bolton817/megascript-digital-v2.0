"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface TonyLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export function TonyLauncher({ isOpen, onToggle }: TonyLauncherProps) {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // When near the top, expand the launcher
      if (currentScrollY <= 20) {
        setIsScrollingDown(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Scrolling down threshold
      if (currentScrollY > lastScrollY.current + 8) {
        setIsScrollingDown(true);
      } else if (currentScrollY < lastScrollY.current - 8) {
        // Scrolling up threshold
        setIsScrollingDown(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isCollapsed = isScrollingDown && !isOpen;

  return (
    <div className="fixed bottom-4 left-4 z-40 print:hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={
          isOpen
            ? "Close Tony AI assistant"
            : "Open chat with Tony, MegaScript AI assistant"
        }
        className={`group relative flex items-center shadow-xl transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full ${
          isCollapsed
            ? "p-1.5 sm:px-4 sm:py-2.5 gap-0 sm:gap-2.5"
            : "px-3.5 py-2 sm:px-4 sm:py-2.5 gap-2 sm:gap-2.5"
        } ${
          isOpen
            ? "bg-foreground text-background scale-95"
            : "bg-surface border border-surface-border text-foreground hover:border-primary/50 hover:shadow-2xl hover:scale-105 active:scale-95"
        }`}
      >
        {/* Pulsing online indicator - hidden in mobile view per design spec, visible on desktop */}
        <span className="hidden sm:inline-flex relative h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>

        {/* Tony Avatar Icon */}
        {isOpen ? (
          <div className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center shrink-0">
            <X className="h-5 w-5 transition-transform duration-200 rotate-90 group-hover:rotate-0" />
          </div>
        ) : (
          <Image
            src="/images/avatar/tony-avatar.jpg"
            alt="Tony AI Assistant"
            width={32}
            height={32}
            className="h-8 w-8 sm:h-7 sm:w-7 rounded-full object-cover shrink-0 ring-1 ring-surface-border shadow-sm group-hover:scale-105 transition-transform"
          />
        )}

        {/* Responsive Text Label */}
        <span
          className={`overflow-hidden whitespace-nowrap text-xs font-bold tracking-wide transition-all duration-300 ease-in-out ${
            isCollapsed
              ? "max-w-0 opacity-0 sm:max-w-xs sm:opacity-100"
              : "max-w-xs opacity-100"
          }`}
        >
          {isOpen ? "Close Tony" : "Chat with Tony"}
        </span>
      </button>
    </div>
  );
}
