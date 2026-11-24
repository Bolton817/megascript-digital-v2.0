import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * Disables Next.js App Router draft mode.
 */
export async function GET(request: NextRequest) {
  draftMode().disable();

  const searchParams = request.nextUrl.searchParams;
  const redirectPath = searchParams.get("path") || "/";

  // Validate redirect path to prevent open redirect
  const isSafePath =
    redirectPath.startsWith("/") &&
    !redirectPath.startsWith("//") &&
    !redirectPath.includes(":");

  const destination = isSafePath ? redirectPath : "/";

  redirect(destination);
}
