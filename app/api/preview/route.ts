import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequestCookies } from "@/features/auth/session";
import { hasAnyPermission } from "@/features/auth/rbac";

/**
 * Secure Preview Endpoint (TDD Sheet 107 & 173).
 * Enables Next.js App Router draft mode for authorized editors or signed preview tokens.
 * Strictly prevents open redirect attacks.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") || "/";

  // Validate redirect path to prevent open redirect
  const isSafePath = path.startsWith("/") && !path.startsWith("//") && !path.includes(":");
  const destination = isSafePath ? path : "/";

  let authorized = false;

  // 1. Check secret token if provided
  const expectedSecret = process.env.PREVIEW_SECRET || "megascript-preview-secret-key";
  if (secret && secret === expectedSecret) {
    authorized = true;
  }

  // 2. Check active admin session if secret token wasn't supplied or didn't match
  if (!authorized) {
    try {
      const sessionResult = await getSessionFromRequestCookies({ isQualifyingActivity: false });
      if (sessionResult.valid && sessionResult.user) {
        const canViewDrafts = await hasAnyPermission(sessionResult.user.id, [
          "content.read",
          "content.write",
          "content.publish",
        ]);
        if (canViewDrafts) {
          authorized = true;
        }
      }
    } catch {
      authorized = false;
    }
  }

  if (!authorized) {
    return NextResponse.json(
      {
        error: "Unauthorized: An active editor session or valid preview token is required to view drafts.",
      },
      { status: 401 }
    );
  }

  // Enable Draft Mode
  draftMode().enable();

  // Redirect to preview target
  redirect(destination);
}
