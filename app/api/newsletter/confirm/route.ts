import { NextRequest, NextResponse } from "next/server";
import { confirmSubscription, getSiteUrl } from "@/server/services/newsletter/subscribers";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const siteUrl = getSiteUrl();

  if (!token) {
    return NextResponse.redirect(
      new URL("/newsletter/confirmed?error=Missing+confirmation+token", siteUrl)
    );
  }

  const result = await confirmSubscription(token);

  if (!result.success) {
    return NextResponse.redirect(
      new URL(
        `/newsletter/confirmed?error=${encodeURIComponent(
          result.error || "Invalid or expired confirmation link."
        )}`,
        siteUrl
      )
    );
  }

  if (result.alreadyConfirmed) {
    return NextResponse.redirect(
      new URL("/newsletter/confirmed?already=1", siteUrl)
    );
  }

  return NextResponse.redirect(
    new URL(
      `/newsletter/confirmed?status=success&email=${encodeURIComponent(
        result.email || ""
      )}`,
      siteUrl
    )
  );
}
