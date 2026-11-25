"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface SearchBarTriggerProps {
  onOpen: () => void;
  className?: string;
  variant?: "header" | "mobile" | "inline";
}

export function SearchBarTrigger({ onOpen, className = "", variant = "header" }: SearchBarTriggerProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(typeof window !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  if (variant === "mobile") {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label="Search website content"
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-subtle border border-surface-border text-foreground/75 hover:text-foreground text-sm font-medium transition-colors ${className}`}
      >
        <span className="flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          <span>Search MegaScript...</span>
        </span>
        <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-surface-border text-muted-foreground">
          {isMac ? "⌘K" : "Ctrl+K"}
        </kbd>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Search published content (Command K)"
      title={`Search content (${isMac ? "⌘K" : "Ctrl+K"})`}
      className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-foreground/75 hover:text-foreground hover:bg-surface-subtle border border-transparent hover:border-surface-border text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
    >
      <Search className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
      <span className="hidden md:inline-block">Search</span>
      <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-surface-border text-muted-foreground shadow-xs">
        {isMac ? "⌘K" : "Ctrl+K"}
      </kbd>
    </button>
  );
}
