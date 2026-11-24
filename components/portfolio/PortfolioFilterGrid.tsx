"use client";

import React, { useState, useMemo } from "react";
import { PortfolioProjectData } from "@/config/portfolio-data";
import { PortfolioCard } from "./PortfolioCard";
import { Search, Filter, Layers } from "lucide-react";

interface PortfolioFilterGridProps {
  initialProjects: PortfolioProjectData[];
}

type CategoryFilter =
  | "all"
  | "tours-travel"
  | "finance-advisory"
  | "community-arts"
  | "hospitality-events"
  | "technology";

export function PortfolioFilterGrid({ initialProjects }: PortfolioFilterGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: "All Engagements" },
    { id: "tours-travel", label: "Tours & Travel" },
    { id: "finance-advisory", label: "Finance & Advisory" },
    { id: "community-arts", label: "Community & Arts" },
    { id: "hospitality-events", label: "Hospitality & Events" },
    { id: "technology", label: "Technology" },
  ];

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === "all" || project.industryCategory === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === "" ||
        project.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.deliveredWork.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [initialProjects, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="Filter portfolio by industry"
          className="flex flex-wrap items-center gap-1.5 sm:gap-2"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                  isSelected
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "bg-[var(--surface-muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-border)]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Keyword Search */}
        <div className="relative w-full lg:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--muted-foreground)]">
            <Search className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            type="search"
            placeholder="Search by client or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </div>

      {/* Results Header Counter */}
      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span className="font-medium">
          Showing {filteredProjects.length} of {initialProjects.length} client engagements
        </span>
        {selectedCategory !== "all" && (
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className="text-[var(--primary)] hover:underline font-semibold"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <PortfolioCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] space-y-3">
          <div className="mx-auto w-12 h-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)]">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--foreground)]">
            No engagements match your filter criteria
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
            Try adjusting your search keywords or switching to &quot;All Engagements&quot; to view our complete client roster.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="text-xs font-semibold text-[var(--primary)] hover:underline pt-2 inline-block"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
