"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, ArrowRight, BookOpen, Target, List,
  Lightbulb, CheckSquare, Monitor, Users, FolderOpen, LayoutDashboard
} from "lucide-react"
import { modulos, modulosConteudo } from "@/lib/modulos-data"

const iconMap: Record<string, React.ElementType> = { Monitor, Users, FolderOpen, LayoutDashboard }

const cores = [
  { light: "bg-blue-500/10", icon: "text-blue-500", border: "border-blue-500/30", header: "from-blue-600 to-blue-800" },
  { light: "bg-violet-500/10", icon: "text-violet-500", border: "border-violet-500/30", header: "from-violet-600 to-violet-800" },
  { light: "bg-emerald-500/10", icon: "text-emerald-500", border: "border-emerald-500/30", header: "from-emerald-600 to-emerald-800" },
  { light: "bg-orange-500/10", icon: "text-orange-500", border: "border-orange-500/30", header: "from-orange-600 to-orange-800" },
]

export default function ModuloPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const modulo = modulos.find((m) => m.id === id)
  if (!modulo) notFound()

  const conteudo = modulosConteudo[id]
  const cor = cores[(id - 1) % cores.length]
  const Icon = iconMap[modulo.icone] ?? Monitor
  const anterior = modulos.find((m) => m.id === id - 1)
  const proximo = modulos.find((m) => m.id === id + 1)

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Breadcrumb */}
      <Link href="/modulos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar aos módulos
      </Link>

      {/* Hero */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cor.header} p-8 text-white`}>
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-4 right-16 h-24 w-24 rounded-full bg-white/5" />
        <div className="relative flex items-start gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 border border-white/20">
            <Icon className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
              <BookOpen className="h-3.5 w-3.5" />
              Módulo {String(id).padStart(2, "0")} de {modulos.length}
            </div>
            <h1 className="text-2xl font-bold leading-tight">{modulo.titulo}</h1>
            <p className="mt-2 text-white/70 text-sm leading-relaxed max-w-lg">{modulo.descricao}</p>
          </div>
        </div>
      </div>

      {/* Objetivos */}
      <div className={`rounded-2xl border ${cor.border} ${cor.light} p-6 space-y-3`}>
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Target className={`h-5 w-5 ${cor.icon}`} />
          Objetivos de aprendizagem
        </div>
        <ul className="space-y-2">
          {conteudo.objetivos.map((obj, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${cor.icon.replace("text-", "bg-")}`} />
              {obj}
            </li>
          ))}
        </ul>
      </div>

      {/* Tópicos */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <List className="h-5 w-5 text-muted-foreground" />
          Tópicos abordados
        </div>
        <ol className="space-y-2">
          {conteudo.topicos.map((topico, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {i + 1}
              </span>
              <span className="text-muted-foreground pt-0.5">{topico}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Atividades */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <CheckSquare className="h-5 w-5 text-muted-foreground" />
          Atividades práticas
        </div>
        <ul className="space-y-2">
          {conteudo.atividades.map((at, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-muted">
                <CheckSquare className="h-3 w-3 text-muted-foreground" />
              </span>
              <span className="text-muted-foreground">{at}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Dica */}
      <div className="flex items-start gap-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
        <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
        <div className="text-sm leading-relaxed">
          <span className="font-semibold text-foreground">Dica pro:</span>{" "}
          <span className="text-muted-foreground">{conteudo.dica}</span>
        </div>
      </div>

      {/* Navegação entre módulos */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {anterior ? (
          <Link href={`/modulos/${anterior.id}`} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/50 transition-colors group">
            <ArrowLeft className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Anterior</div>
              <div className="text-sm font-medium truncate">{anterior.titulo}</div>
            </div>
          </Link>
        ) : <div />}

        {proximo ? (
          <Link href={`/modulos/${proximo.id}`} className="flex items-center justify-end gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/50 transition-colors group text-right ml-auto w-full">
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Próximo</div>
              <div className="text-sm font-medium truncate">{proximo.titulo}</div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </Link>
        ) : (
          <Link href="/quiz" className="flex items-center justify-end gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10 transition-colors text-right w-full">
            <div className="min-w-0">
              <div className="text-xs text-primary/70">Você concluiu todos!</div>
              <div className="text-sm font-medium text-primary">Fazer o Quiz →</div>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}