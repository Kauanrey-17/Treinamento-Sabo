import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
 
// ─────────────────────────────────────────────────────────────
// ROTAS
// ─────────────────────────────────────────────────────────────
 
const ROTAS_PUBLICAS = ["/login"]
const ROTAS_ADMIN = ["/admin", "/relatorios"]
const ROTA_POS_LOGIN = "/"
const ROTA_LOGIN = "/login"
const ROTA_SEM_PERMISSAO = "/"
 
// ─────────────────────────────────────────────────────────────
// SECURITY HEADERS — padrão enterprise
// ─────────────────────────────────────────────────────────────
 
function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("X-XSS-Protection", "1; mode=block")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
  res.headers.set("Content-Security-Policy", [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https:",
  ].join("; "))
  return res
}
 
// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
 
function matchRoute(pathname: string, routes: string[]): boolean {
  return routes.some((r) => pathname === r || pathname.startsWith(r + "/"))
}
 
function isPublic(pathname: string): boolean {
  return matchRoute(pathname, ROTAS_PUBLICAS)
}
 
function isAdminRoute(pathname: string): boolean {
  return matchRoute(pathname, ROTAS_ADMIN)
}
 
// ─────────────────────────────────────────────────────────────
// MIDDLEWARE PRINCIPAL
// ─────────────────────────────────────────────────────────────
 
export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const role = (req.auth?.user as any)?.role as string | undefined
 
  // ── 1. Rota pública (/login) ──────────────────
  if (isPublic(pathname)) {
    // Já logado tentando acessar /login → redireciona para home
    if (isLoggedIn) {
      const res = NextResponse.redirect(new URL(ROTA_POS_LOGIN, req.url))
      return applySecurityHeaders(res)
    }
    const res = NextResponse.next()
    return applySecurityHeaders(res)
  }
 
  // ── 2. Não autenticado → redireciona para login ──
  if (!isLoggedIn) {
    const loginUrl = new URL(ROTA_LOGIN, req.url)
    loginUrl.searchParams.set("callbackUrl", encodeURIComponent(pathname))
    const res = NextResponse.redirect(loginUrl)
    return applySecurityHeaders(res)
  }
 
  // ── 3. Rota de admin sem permissão ───────────────
  if (isAdminRoute(pathname) && role !== "admin") {
    const res = NextResponse.redirect(new URL(ROTA_SEM_PERMISSAO, req.url))
    return applySecurityHeaders(res)
  }
 
  // ── 4. Autorizado → passa com headers ────────────
  const res = NextResponse.next()
  if (role) res.headers.set("x-user-role", role)
  if (req.auth?.user?.email) res.headers.set("x-user-email", req.auth.user.email)
  return applySecurityHeaders(res)
})
 
// ─────────────────────────────────────────────────────────────
// MATCHER — exclui assets estáticos e rotas de API
// ─────────────────────────────────────────────────────────────
 
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf|map)$).*)",
  ],
}