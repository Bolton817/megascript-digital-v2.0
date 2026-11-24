"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

export interface PopoverProps {
  trigger: (props: {
    isOpen: boolean;
    toggle: () => void;
    ref: React.RefObject<HTMLButtonElement>;
  }) => React.ReactNode;
  children: (props: { close: () => void }) => React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

export function Popover({
  trigger,
  children,
  align = "right",
  className = "",
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Escape key listener
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const alignmentStyles = {
    left: "left-0 origin-top-left",
    right: "right-0 origin-top-right",
    center: "left-1/2 -translate-x-1/2 origin-top",
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {trigger({ isOpen, toggle, ref: triggerRef })}

      {isOpen && (
        <div
          className={`absolute z-40 mt-2 rounded-xl border border-surface-border bg-surface p-4 shadow-xl focus:outline-none ${alignmentStyles[align]} ${className}`}
          role="region"
        >
          {children({ close })}
        </div>
      )}
    </div>
  );
}
