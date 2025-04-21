import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/data") || 
                     request.nextUrl.pathname.startsWith("/api/recharge");

  // Handle API routes with API key authentication
  if (isApiRoute) {
    // Skip API key check for the recharge endpoint
    if (request.nextUrl.pathname.startsWith("/api/recharge")) {
      return NextResponse.next();
    }

    const apiKey = request.headers.get("x-api-key");
    const apiUrl = request.headers.get("x-api-url");

    // If no API credentials provided, return 401
    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        { error: "API credentials are required" },
        { status: 401 }
      );
    }

    // For API routes, we'll validate the credentials in the route handlers
    return NextResponse.next();
  }

  // Redirect to sign in if accessing auth pages while logged in
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect to sign in if accessing protected pages while not logged in
  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}; 