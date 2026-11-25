import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { searchPublishedContent, SearchContentType } from "@/server/services/search";
import { Search, Layers, Boxes, Briefcase, FileText, Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: SearchContentType;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const resolved = await searchParams;
  const query = resolved.q ? `"${resolved.q}"` : "Content";
  return {
    title: `Search ${query} | MegaScript Digital`,
    description: "Search published corporate services, software products, case studies, and engineering insights.",
    robots: {
      index: false, // Prevent query spam indexing
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = await searchParams;
  const query = resolved.q?.trim() || "";
  const type = resolved.type || "all";

  const { results, total } = await searchPublishedContent({
    query,
    type,
    limit: 30,
  });

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
    <div className="min-h-screen bg-background text-foreground py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header & Search Form */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-display">
              Content Search
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Discover published services, proprietary SaaS platforms, case studies, and engineering insights.
            </p>
          </div>

          {/* Search Input Box */}
          <form method="GET" action="/search" className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search web development, Fortress, SEO, pricing..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface border border-surface-border text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />
            </div>
            <Button type="submit" variant="primary" className="rounded-2xl px-6">
              Search
            </Button>
          </form>

          {/* Content Type Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
            {(
              [
                { id: "all", label: "All" },
                { id: "service", label: "Services" },
                { id: "product", label: "Products" },
                { id: "portfolio", label: "Case Studies" },
                { id: "blog", label: "Articles" },
                { id: "page", label: "Pages" },
              ] as const
            ).map((t) => (
              <Link
                key={t.id}
                href={`/search?q=${encodeURIComponent(query)}&type=${t.id}`}
                className={`px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                  type === t.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-surface border-surface-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Results Info */}
        {query && (
          <div className="text-xs text-muted-foreground border-b border-surface-border/40 pb-3 flex items-center justify-between">
            <span>
              Showing {results.length} of {total} result{total === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
            </span>
            <span>Drafts & private records strictly excluded</span>
          </div>
        )}

        {/* Results List */}
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((item) => (
              <Link
                key={item.id}
                href={item.route}
                className="p-4 sm:p-5 rounded-2xl bg-surface border border-surface-border hover:border-primary/50 transition-all block group shadow-xs hover:shadow-subtle"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-surface-muted border border-surface-border shrink-0 mt-0.5">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h2>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-muted border border-surface-border text-muted-foreground">
                          {item.badge}
                        </span>
                        {item.category && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            • {item.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.excerpt}
                      </p>
                      <span className="text-xs text-primary font-mono inline-block pt-1">
                        {item.route}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                </div>
              </Link>
            ))}
          </div>
        ) : query ? (
          /* Zero Results State */
          <div className="p-12 text-center rounded-2xl bg-surface border border-surface-border space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-muted border border-surface-border flex items-center justify-center mx-auto text-muted-foreground">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No matches found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                We couldn&apos;t find any published content matching &ldquo;{query}&rdquo;. Check your spelling or browse our main catalog.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/services">
                <Button variant="outline" size="sm">
                  Services Catalog
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="primary" size="sm">
                  Contact Team
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Empty Initial State */
          <div className="p-12 text-center rounded-2xl bg-surface border border-surface-border space-y-3">
            <Compass className="w-8 h-8 text-primary mx-auto" />
            <h3 className="text-base font-bold text-foreground">Search MegaScript Digital</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Enter any technical capability, product name, or service to find verified specifications and pricing guidance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
