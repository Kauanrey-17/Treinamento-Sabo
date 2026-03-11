import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center space-y-6">
      <div className="space-y-2">
        <div className="text-8xl font-black text-muted/40 leading-none select-none">404</div>
        <h1 className="text-2xl font-bold">Página não encontrada</h1>
        <p className="text-muted-foreground text-sm max-w-sm">
          A página que você está procurando não existe ou foi movida.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Home className="h-4 w-4" />
          Ir para o início
        </Link>
        <Link
          href="/modulos"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Ver módulos
        </Link>
      </div>
    </div>
  )
}