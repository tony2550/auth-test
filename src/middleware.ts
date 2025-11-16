import { auth } from "@/lib/auth-js/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Protected routes for Auth.js demo
  const isAuthJsProtected = nextUrl.pathname.startsWith("/auth-js/dashboard")

  if (isAuthJsProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth-js/signin", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
