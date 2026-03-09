import type { NextAuthConfig } from "next-auth"

// Este arquivo NÃO importa Prisma — é seguro para o Edge Runtime (middleware)
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [], // providers com Prisma ficam em auth.ts
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    session({ session, token }) {
      if (session.user) (session.user as any).role = token.role
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const role = (auth?.user as any)?.role
      const pathname = nextUrl.pathname

      if (pathname.startsWith("/login")) return true

      if (!isLoggedIn) return false

      if (pathname.startsWith("/admin") || pathname.startsWith("/relatorios")) {
        return role === "admin"
      }

      return true
    },
  },
}