import { auth } from "@/lib/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const role = (req.auth?.user as any)?.role

  // Permite apenas a página de login sem autenticação
  if (pathname.startsWith("/login")) return

  // Se não estiver logado, redireciona para login
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", req.url))
  }

  // Apenas admin pode acessar /admin e /relatorios
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