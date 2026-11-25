import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle /master and /master/*
  if (pathname === "/master" || pathname.startsWith("/master/")) {
    const sessionToken =
      request.cookies.get("__Secure-better-auth.session_token")?.value ||
      request.cookies.get("better-auth.session_token")?.value;

    // If visiting /master/login:
    if (pathname === "/master/login") {
      // If already authenticated with a session cookie, redirect to /master/overview
      if (sessionToken) {
        return NextResponse.redirect(new URL("/master/overview", request.url));
      }
      return NextResponse.next();
    }

    // If not authenticated, redirect to /master/login
    if (!sessionToken) {
      const loginUrl = new URL("/master/login", request.url);
      if (pathname !== "/master" && pathname !== "/master/overview") {
        loginUrl.searchParams.set("redirect", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    // If authenticated and visiting root /master, redirect to /master/overview
    if (pathname === "/master") {
      return NextResponse.redirect(new URL("/master/overview", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/master", "/master/:path*"],
};
