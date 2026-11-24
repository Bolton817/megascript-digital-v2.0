import React from "react";
import Link from "next/link";
import { BlogPostData } from "@/config/blog-data";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Clock, Calendar, ArrowLeft, ArrowRight, UserCheck } from "lucide-react";

interface ArticleContentProps {
  post: BlogPostData;
  relatedPosts: BlogPostData[];
}

export function ArticleContent({ post, relatedPosts }: ArticleContentProps) {
  return (
    <article className="min-h-screen">
      {/* Article Header */}
      <header className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 border-b border-border bg-gradient-to-b from-surface-muted/50 to-background">
        <Container size="md">
          <div className="space-y-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Link href="/blog" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Articles</span>
              </Link>
              <span>/</span>
              <span className="text-primary">{post.category}</span>
            </div>

            {/* Title & Metadata */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span>{post.author}</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Published {post.publishedAt}</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{post.readingTime}</span>
                </span>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Reading Flow */}
      <Section spacing="lg" variant="default">
        <Container size="md">
          <div className="space-y-10">
            {/* Excerpt Lead Paragraph */}
            <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed border-l-4 border-primary pl-4">
              {post.excerpt}
            </p>

            {/* Key Takeaways Box */}
            <div className="p-6 rounded-2xl bg-surface-muted border border-border space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                Key Takeaways:
              </span>
              <ul className="space-y-2">
                {post.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Sections */}
            <div className="space-y-8 pt-4">
              {post.sections.map((sec, idx) => (
                <section key={idx} className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {sec.heading}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {sec.content}
                  </p>
                </section>
              ))}
            </div>

            {/* Tags Footer */}
            <div className="pt-6 border-t border-border flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground mr-1">
                Topics:
              </span>
              {post.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline" size="sm" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Author Attribution Box */}
            <div className="p-6 rounded-2xl border border-border bg-surface flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                MD
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  Written by {post.author}
                </h3>
                <p className="text-xs text-primary font-medium">
                  {post.authorRole}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  MegaScript Digital engineers enterprise websites, custom web applications, and automated software platforms across Kenya and East Africa.
                </p>
              </div>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="pt-8 border-t border-border space-y-4">
                <h3 className="text-lg font-bold text-foreground">
                  Related Guides &amp; Perspectives
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedPosts.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/blog/${rel.slug}`}
                      className="p-5 rounded-xl border border-border bg-surface-muted hover:border-primary transition-colors space-y-2 group block"
                    >
                      <Badge variant="outline" size="sm" className="text-[10px]">
                        {rel.category}
                      </Badge>
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {rel.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </article>
  );
}
