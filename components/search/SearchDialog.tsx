"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Layers,
  Boxes,
  Briefcase,
  FileText,
  Compass,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { SearchResultItem, SearchContentType } from "@/server/services/search";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_SEARCH_CHIPS = [
  "Web Development",
  "Fortress AI",
  "Website Pricing",
  "LeaseFlow",
  "M-Pesa Integration",
  "SEO Architecture",
  "Mobile Apps",
];

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchContentType>("all");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered outside
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search query execution
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}&type=${type}&limit=12`
        );
        const data = await res.json();
        if (data.success) {
          setResults(data.results || []);
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error("Search fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, type]);

  // Keyboard navigation through search results (Arrow Up, Arrow Down, Enter)
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        handleNavigate(selected.route);
      }
    }
  };

  const handleNavigate = (route: string) => {
    onClose();
    router.push(route);
  };

  if (!isOpen) return null;

  const getTypeIcon = (itemType: string) => {
    switch (itemType) {
      case "service":
        return <Layers className="w-4 h-4 text-primary" />;
      case "product":
        return <Boxes className="w-4 h-4 text-cyan-400" />;
      case "portfolio":
        return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case "blog":
        return <FileText className="w-4 h-4 text-amber-400" />;
      default:
        return <Compass className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Global Content Search"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-2xl bg-surface border border-surface-border rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-surface-border flex items-center gap-3">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search published services, products, case studies, insights..."
            aria-label="Search query"
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm sm:text-base font-medium focus:outline-none"
          />
          {isLoading && <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />}
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground bg-surface-muted border border-surface-border"
          >
            ESC
          </button>
        </div>

        {/* Content Type Filter Pills */}
        <div className="px-3 sm:px-4 py-2 border-b border-surface-border/50 bg-surface-subtle flex items-center gap-1.5 overflow-x-auto text-xs font-semibold scrollbar-none">
          {(
            [
              { id: "all", label: "All Content" },
              { id: "service", label: "Services" },
              { id: "product", label: "Products" },
              { id: "portfolio", label: "Case Studies" },
              { id: "blog", label: "Articles" },
              { id: "page", label: "Pages" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                type === t.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Results / Empty Suggestions Body */}
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto p-2 sm:p-3 divide-y divide-surface-border/30"
        >
          {/* Quick Suggestions when Query is Empty */}
          {!query && (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Popular Discoveries</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_SEARCH_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setQuery(chip)}
                    className="px-3 py-1.5 rounded-xl bg-surface-muted border border-surface-border text-xs font-medium text-foreground hover:border-primary/50 hover:bg-surface transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Tip: Type any technical term, software product, or agency capability to locate verified public content.
              </p>
            </div>
          )}

          {/* Results List */}
          {query.trim().length >= 2 && results.length > 0 && (
            <div className="space-y-1">
              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleNavigate(item.route)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? "bg-primary/10 border border-primary/20 shadow-xs"
                        : "hover:bg-surface-subtle border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-surface border border-surface-border shrink-0 mt-0.5">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-foreground truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-surface border border-surface-border text-muted-foreground shrink-0">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected
                          ? "text-primary translate-x-0.5 opacity-100"
                          : "text-muted-foreground opacity-0"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Zero Results State */}
          {query.trim().length >= 2 && !isLoading && results.length === 0 && (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-muted border border-surface-border flex items-center justify-center mx-auto text-muted-foreground">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">No published content found</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  No public pages match &ldquo;{query}&rdquo;. Check spelling or explore our core services catalog.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleNavigate("/services")}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-muted border border-surface-border text-xs font-semibold text-foreground hover:bg-surface transition-colors"
                >
                  View Services
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("/contact")}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  Contact Agency
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-2.5 px-4 bg-surface-subtle border-t border-surface-border flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-surface border border-surface-border px-1.5 py-0.5 rounded mr-1">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="font-mono bg-surface border border-surface-border px-1.5 py-0.5 rounded mr-1">↵</kbd> Select
            </span>
          </div>
          <span>Drafts & private records strictly excluded</span>
        </div>
      </div>
    </div>
  );
}
