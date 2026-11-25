import { NextRequest, NextResponse } from "next/server";
import { searchPublishedContent, SearchContentType } from "@/server/services/search";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Rate limiting: 60 search requests per minute per IP
    const rateCheck = checkRateLimit(`search:${clientIp}`, 60, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: "Search rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const type = (searchParams.get("type") as SearchContentType) || "all";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const searchResult = await searchPublishedContent({
      query,
      type,
      limit,
    });

    return NextResponse.json(
      {
        success: true,
        ...searchResult,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while executing search." },
      { status: 500 }
    );
  }
}
