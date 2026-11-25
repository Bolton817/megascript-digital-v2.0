import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle /master and /master/*
  if (pathname === "/master" || pathname.startsWith("/master/")) {
    // 1. Never intercept or loop on the login page in edge middleware.
    // Database validity check is handled by the Server Component in app/(admin)/master/login/page.tsx.
    if (pathname === "/master/login") {
      return NextResponse.next();
    }

    const sessionToken =
      request.cookies.get("__Secure-better-auth.session_token")?.value ||
      request.cookies.get("better-auth.session_token")?.value;

    // 2. If no session cookie exists at all, redirect to /master/login
    if (!sessionToken) {
      const loginUrl = new URL("/master/login", request.url);
      if (pathname !== "/master" && pathname !== "/master/overview") {
        loginUrl.searchParams.set("redirect", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    // 3. If session cookie exists and visiting root /master, redirect to /master/overview
    if (pathname === "/master") {
      return NextResponse.redirect(new URL("/master/overview", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/master", "/master/:path*"],
};
