import { NextRequest, NextResponse } from "next/server";
import { unsubscribe, getSiteUrl } from "@/server/services/newsletter/subscribers";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const siteUrl = getSiteUrl();

  if (!token) {
    return NextResponse.redirect(new URL("/unsubscribe", siteUrl));
  }

  const result = await unsubscribe(token);
  if (!result.success) {
    return NextResponse.redirect(
      new URL(
        `/unsubscribe?error=${encodeURIComponent(
          result.error || "Invalid unsubscribe request."
        )}`,
        siteUrl
      )
    );
  }

  return NextResponse.redirect(
    new URL(
      `/unsubscribe?status=success&email=${encodeURIComponent(
        result.email || ""
      )}`,
      siteUrl
    )
  );
}

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const { email, token } = body;
    const target = token || email;

    if (!target || typeof target !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide an email or unsubscribe token." },
        { status: 400 }
      );
    }

    const result = await unsubscribe(target);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Could not process unsubscribe request." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "You have been successfully unsubscribed.",
      email: result.email,
    });
  } catch (err: any) {
    console.error("Unsubscribe POST error:", err);
    return NextResponse.json(
      { success: false, error: "Server error processing unsubscribe request." },
      { status: 500 }
    );
  }
}
