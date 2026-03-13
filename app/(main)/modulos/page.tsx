"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen, ArrowRight, ArrowLeft, CheckCircle2, Lock,
  Monitor, Users, FolderOpen, LayoutDashboard, Shield,
  Package, ShoppingCart, Globe, DoorOpen, Loader2
} from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  Monitor, Users, FolderOpen, LayoutDashboard, Shield,
  Package, ShoppingCart, Globe, DoorOpen, BookOpen
}

const corMap: Record<string, { bg: string; icon: string }> = {
  blue:   { bg: "from-blue-500/10 to-blue-600/5 border-blue-500/20",   icon: "text-blue-500" },
  red:    { bg: "from-red-500/10 to-red-600/5 border-red-500/20",       icon: "text-red-500" },
  green:  { bg: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20", icon: "text-emerald-500" },
  purple: { bg: "from-violet-500/10 to-violet-600/5 border-violet-500/20", icon: "text-violet-500" },
  orange: { bg: "from-orange-500/10 to-orange-600/5 border-orange-500/20", icon: "text-orange-500" },
  yellow: { bg: "from-yellow-500/10 to-yellow-600/5 border-yellow-500/20", icon: "text-yellow-500" },
}

export default function ModulosPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [cursos, setCursos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/cursos")
      .then(r => r.json())
      .then(data => { setCursos(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => router.push("/")} className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <BookOpen className="h-4 w-4" />
            <span>Conteúdo do treinamento</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            Seus cursos disponíveis. Complete os módulos, faça o quiz e registre as práticas.
          </p>
        </div>
      </div>

      {/* Cursos */}
      {cursos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Lock className="h-10 w-10" />
          <p className="font-medium">Nenhum curso disponível para o seu setor.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {cursos.map((curso, i) => {
            const Icon = iconMap[curso.icone] ?? BookOpen
            const cor = corMap[curso.cor] ?? corMap.blue
            return (
              <Link
                key={curso.id}
                href={"/modulos/" + curso.id}
                className={"group relative flex flex-col gap-4 rounded-2xl border bg-gradient-to-br p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 " + cor.bg}
              >
                <div className="flex items-start justify-between">
                  <div className={"flex h-11 w-11 items-center justify-center rounded-xl bg-background/60 border border-white/10"}>
                    <Icon className={"h-5 w-5 " + cor.icon} />
                  </div>
                  <span className="text-xs font-mono font-bold text-muted-foreground/60">
                    #{String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex-1 space-y-1.5">
                  <h2 className="font-bold text-foreground text-lg leading-tight">{curso.titulo}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{curso.descricao}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>{curso._count?.modulos ?? 0} módulos</span>
                    <span>{curso._count?.perguntas ?? 0} questões</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Como funciona: </span>
          Estude cada módulo, registre sua presença, faça o quiz e complete as atividades práticas.
        </p>
      </div>
    </div>
  )
}