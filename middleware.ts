import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value

  // Protect dashboard and rooms routes
  if (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/rooms")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if ((request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/rooms/:path*", "/login", "/register"],
}
