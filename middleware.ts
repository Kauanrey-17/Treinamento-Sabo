import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// ─────────────────────────────────────────────
// CONFIGURAÇÃO CENTRAL DE ROTAS
// ─────────────────────────────────────────────

const ROTAS = {
  // Rotas públicas — sem autenticação
  publicas: ["/login", "/cadastro", "/esqueci-senha"],

  // Rotas exclusivas para admin
  apenasAdmin: ["/admin", "/relatorios"],

  // Rotas exclusivas para funcionários (admin também pode acessar)
  apenasFuncionario: ["/presenca", "/quiz", "/praticas"],

  // Após login, redireciona para:
  posLogin: "/",

  // Se não autenticado, redireciona para:
  loginUrl: "/login",

  // Se sem permissão, redireciona para:
  semPermissao: "/",
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function getSessionToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value
  )
}

function getRoleFromToken(req: NextRequest): string | null {
  try {
    const token = getSessionToken(req)
    if (!token) return null
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")))
    return payload?.role ?? null
  } catch {
    return null
  }
}

function matchesRoute(pathname: string, rotas: string[]): boolean {
  return rotas.some((rota) => pathname === rota || pathname.startsWith(rota + "/"))
}

function isPublica(pathname: string): boolean {
  return matchesRoute(pathname, ROTAS.publicas)
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  )
  return response
}

// ─────────────────────────────────────────────
// MIDDLEWARE PRINCIPAL
// ─────────────────────────────────────────────

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionToken = getSessionToken(req)
  const isLoggedIn = !!sessionToken
  const role = getRoleFromToken(req)

  // ── 1. Rota pública ──────────────────────────
  if (isPublica(pathname)) {
    // Se já logado e tentar acessar /login → redireciona para home
    if (isLoggedIn && pathname.startsWith("/login")) {
      const res = NextResponse.redirect(new URL(ROTAS.posLogin, req.url))
      return addSecurityHeaders(res)
    }
    const res = NextResponse.next()
    return addSecurityHeaders(res)
  }

  // ── 2. Não autenticado ───────────────────────
  if (!isLoggedIn) {
    const loginUrl = new URL(ROTAS.loginUrl, req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    const res = NextResponse.redirect(loginUrl)
    return addSecurityHeaders(res)
  }

  // ── 3. Rotas exclusivas de admin ─────────────
  if (matchesRoute(pathname, ROTAS.apenasAdmin) && role !== "admin") {
    const res = NextResponse.redirect(new URL(ROTAS.semPermissao, req.url))
    return addSecurityHeaders(res)
  }

  // ── 5. Autorizado ────────────────────────────
  const res = NextResponse.next()
  if (role) res.headers.set("x-user-role", role)
  return addSecurityHeaders(res)
}

// ─────────────────────────────────────────────
// MATCHER
// ─────────────────────────────────────────────

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
}