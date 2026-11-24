"use client";

import React, { useState, useMemo } from "react";
import { BlogPostData } from "@/config/blog-data";
import { BlogCard } from "./BlogCard";
import { Search, Layers, BookOpen } from "lucide-react";

interface BlogFilterGridProps {
  initialPosts: BlogPostData[];
}

type BlogCategoryFilter =
  | "all"
  | "web-development"
  | "software-architecture"
  | "digital-visibility";

export function BlogFilterGrid({ initialPosts }: BlogFilterGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: { id: BlogCategoryFilter; label: string }[] = [
    { id: "all", label: "All Articles" },
    { id: "web-development", label: "Web Development" },
    { id: "software-architecture", label: "Software Architecture" },
    { id: "digital-visibility", label: "Digital Visibility" },
  ];

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.categorySlug === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border">
        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="Filter articles by category"
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-surface-muted text-muted-foreground hover:text-foreground hover:bg-surface-muted/80 border border-border"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            id="blog-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, architecture, topics..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-border bg-surface text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          <span>
            Showing <strong>{filteredPosts.length}</strong> of {initialPosts.length} published articles
          </span>
        </span>
        {(selectedCategory !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="font-medium text-primary hover:underline focus-visible:outline-none"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Article Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-surface-muted/50 space-y-3">
          <Layers className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-sm font-semibold text-foreground">No articles found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No published articles match your current category and search criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-full bg-surface border border-border hover:bg-surface-muted text-foreground transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
