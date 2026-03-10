import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Permite login sem autenticação
  if (pathname.startsWith("/login")) return NextResponse.next()

  // Lê o JWT direto — sem importar Prisma
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })

  // Não logado → redireciona para login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Rotas admin/relatorios — só para role admin
  if (pathname.startsWith("/admin") || pathname.startsWith("/relatorios")) {
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}