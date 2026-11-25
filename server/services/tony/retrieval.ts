import { db } from "@/server/db";
import { PublishStatus } from "@prisma/client";
import { syncPublishedKnowledgeBase } from "./knowledge";

export interface RetrievalQueryOptions {
  query: string;
  route?: string;
  language?: string;
  limit?: number;
}

export interface RetrievedSnippet {
  id: string;
  title: string;
  content: string;
  contentType: string;
  route: string | null;
  score: number;
  sourceLabel: string;
}

export interface GroundedContextPack {
  snippets: RetrievedSnippet[];
  formattedContext: string[];
  totalSnippets: number;
  estimatedTokens: number;
}

/**
 * Normalizes query string into search tokens, removing common stop words.
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "a", "an", "the", "in", "on", "at", "to", "for", "of", "with", "by", "from",
    "and", "or", "is", "are", "was", "were", "be", "been", "do", "does", "did",
    "i", "me", "my", "we", "us", "you", "your", "they", "them", "it", "this", "that",
    "kwa", "na", "ya", "wa", "za", "katika", "ni", "je", "huyu", "yule", "mimi", "wewe"
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

/**
 * Contextual Knowledge Retrieval Service (TDD Sheet 083)
 * Searches approved PUBLISHED knowledge items using:
 * 1. Route-aware priority (active page boost)
 * 2. Keyword relevance scoring across title & content
 * 3. Language filtering (en / sw)
 * 4. Strict token / character budgeting (max 1,200 tokens)
 */
export async function retrieveGroundedContext(
  options: RetrievalQueryOptions
): Promise<GroundedContextPack> {
  const { query, route, language = "en", limit = 4 } = options;
  const normalizedLang = language.toLowerCase() === "sw" ? "sw" : "en";

  // Check if knowledge items exist; if table is empty, auto-sync baseline
  const count = await db.knowledgeItem.count();
  if (count === 0) {
    await syncPublishedKnowledgeBase();
  }

  // Fetch only PUBLISHED knowledge items for the current language
  const candidates = await db.knowledgeItem.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      language: normalizedLang,
    },
  });

  const queryKeywords = extractKeywords(query);
  const normalizedRoute = (route || "").toLowerCase().replace(/\/$/, "");

  const scoredItems: Array<RetrievedSnippet> = candidates.map((item) => {
    let score = 0;
    const lowerTitle = item.title.toLowerCase();
    const lowerContent = item.content.toLowerCase();
    const lowerRoute = (item.route || "").toLowerCase().replace(/\/$/, "");

    // 1. Route match boost
    if (normalizedRoute && lowerRoute) {
      if (normalizedRoute === lowerRoute) {
        score += 35; // Exact route match
      } else if (normalizedRoute.startsWith(lowerRoute) || lowerRoute.startsWith(normalizedRoute)) {
        score += 20; // Partial section match
      }
    }

    // 2. Keyword matches in Title (High weight)
    for (const kw of queryKeywords) {
      if (lowerTitle.includes(kw)) {
        score += 15;
      }
      if (lowerContent.includes(kw)) {
        score += 5;
      }
    }

    // 3. Exact phrase match bonus
    if (query.trim().length > 3 && (lowerTitle.includes(query.toLowerCase()) || lowerContent.includes(query.toLowerCase()))) {
      score += 25;
    }

    const sourceLabel = `[Source: ${item.contentType} - ${item.title}${item.route ? ` (${item.route})` : ""}]`;

    return {
      id: item.id,
      title: item.title,
      content: item.content,
      contentType: item.contentType,
      route: item.route,
      score,
      sourceLabel,
    };
  });

  // Sort descending by relevance score
  scoredItems.sort((a, b) => b.score - a.score);

  // If top scores are 0 (e.g. very vague query), return route-related or general baseline
  let selected = scoredItems.filter((i) => i.score > 0).slice(0, limit);
  if (selected.length === 0 && scoredItems.length > 0) {
    selected = scoredItems.slice(0, Math.min(2, limit));
  }

  // Token budgeting: approx 4 characters = 1 token. Max 1,200 tokens = 4,800 characters
  const MAX_CHAR_BUDGET = 4200;
  let currentChars = 0;
  const budgetedSnippets: RetrievedSnippet[] = [];
  const formattedContext: string[] = [];

  for (const item of selected) {
    const formatted = `${item.sourceLabel}\n${item.content}`;
    if (currentChars + formatted.length <= MAX_CHAR_BUDGET) {
      budgetedSnippets.push(item);
      formattedContext.push(formatted);
      currentChars += formatted.length;
    } else {
      break;
    }
  }

  return {
    snippets: budgetedSnippets,
    formattedContext,
    totalSnippets: budgetedSnippets.length,
    estimatedTokens: Math.ceil(currentChars / 4),
  };
}
