"use client";

import React from "react";
import { Bot, X } from "lucide-react";

interface TonyLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export function TonyLauncher({ isOpen, onToggle }: TonyLauncherProps) {
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
        className={`group relative flex items-center gap-2.5 rounded-full px-4 py-3 shadow-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          isOpen
            ? "bg-foreground text-background scale-95"
            : "bg-surface border border-surface-border text-foreground hover:border-primary/50 hover:shadow-2xl hover:scale-105 active:scale-95"
        }`}
      >
        {/* Pulsing online indicator */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>

        {isOpen ? (
          <X className="h-5 w-5 transition-transform duration-200 rotate-90 group-hover:rotate-0" />
        ) : (
          <Bot className="h-5 w-5 text-primary transition-transform duration-200 group-hover:scale-110" />
        )}

        <span className="text-xs font-bold tracking-wide">
          {isOpen ? "Close Tony" : "Chat with Tony"}
        </span>
      </button>
    </div>
  );
}
