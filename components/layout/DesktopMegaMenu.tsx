"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { MegaMenuCategory } from "@/config/navigation";
import { Badge } from "@/components/ui/Badge";

export interface DesktopMegaMenuProps {
  category: MegaMenuCategory;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function DesktopMegaMenu({
  category,
  isOpen,
  onToggle,
  onClose,
}: DesktopMegaMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Escape key to close and return focus
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    },
    [onClose]
  );

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={`mega-menu-${category.id}`}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          isOpen
            ? "bg-primary-subtle text-primary font-bold"
            : "text-foreground/90 hover:text-primary hover:bg-surface-subtle"
        }`}
      >
        <span>{category.label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : "text-muted"
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={`mega-menu-${category.id}`}
          role="region"
          aria-label={category.heading}
          className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[640px] max-w-[90vw] rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {/* Header & Intro */}
          <div className="mb-4 pb-3 border-b border-surface-border">
            <h3 className="text-base font-bold text-foreground tracking-tight">
              {category.heading}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {category.intro}
            </p>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {category.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="group flex flex-col p-3 rounded-xl border border-transparent hover:border-surface-border hover:bg-surface-subtle transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </span>
                  {item.badge && (
                    <Badge variant="primary" size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>

          {/* Contextual Footer Link */}
          {category.footerLink && (
            <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {category.footerLink.text}
              </span>
              <Link
                href={category.footerLink.href}
                onClick={onClose}
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                <span>{category.footerLink.actionText}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
