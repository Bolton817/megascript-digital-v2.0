import React from "react";
import Link from "next/link";
import { BlogPostData } from "@/config/blog-data";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Clock, Calendar } from "lucide-react";

interface BlogCardProps {
  post: BlogPostData;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        {/* Category & Reading Time */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" size="sm" className="font-semibold text-xs">
            {post.category}
          </Badge>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readingTime}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{post.publishedAt}</span>
            </span>
          </div>
        </div>

        {/* Title & Excerpt */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight hover:text-primary transition-colors">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-surface-muted text-[10px] font-medium text-muted-foreground border border-border"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Author & Read Action */}
      <div className="pt-6 mt-6 border-t border-border flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">
          By {post.author}
        </span>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center font-semibold text-primary hover:text-primary-hover gap-1.5 transition-colors focus-visible:outline-none focus-visible:underline"
        >
          <span>Read Full Article</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
