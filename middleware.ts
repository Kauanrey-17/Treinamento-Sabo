import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config" // ← só o config, sem Prisma

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const role = (req.auth?.user as any)?.role

  if (pathname.startsWith("/login")) return

  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", req.url))
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/relatorios")) {
    if (role !== "admin") {
      return Response.redirect(new URL("/", req.url))
    }
  }
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}