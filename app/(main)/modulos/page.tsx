"use client"

import Link from "next/link"
import { BookOpen, ArrowRight, Monitor, Users, FolderOpen, LayoutDashboard, CheckCircle2 } from "lucide-react"
import { modulos } from "@/lib/modulos-data"

const iconMap: Record<string, React.ElementType> = { Monitor, Users, FolderOpen, LayoutDashboard }

const cores = [
  { bg: "bg-blue-500/10 border-blue-500/20", icon: "text-blue-500", accent: "bg-blue-500" },
  { bg: "bg-violet-500/10 border-violet-500/20", icon: "text-violet-500", accent: "bg-violet-500" },
  { bg: "bg-emerald-500/10 border-emerald-500/20", icon: "text-emerald-500", accent: "bg-emerald-500" },
  { bg: "bg-orange-500/10 border-orange-500/20", icon: "text-orange-500", accent: "bg-orange-500" },
]

export default function ModulosPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <BookOpen className="h-4 w-4" />
          <span>Conteúdo do treinamento</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Módulos</h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl">
          Aprenda no seu ritmo. Cada módulo cobre um tema essencial do Microsoft Teams.
          Complete todos para estar apto à certificação.
        </p>
      </div>

      {/* Progress strip */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Progresso do treinamento</span>
            <span>0 de {modulos.length} módulos</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-2 bg-primary rounded-full" style={{ width: "0%" }} />
          </div>
        </div>
      </div>

      {/* Módulos grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {modulos.map((mod, i) => {
          const Icon = iconMap[mod.icone] ?? Monitor
          const cor = cores[i % cores.length]
          return (
            <Link
              key={mod.id}
              href={`/modulos/${mod.id}`}
              className={`group relative flex flex-col gap-4 rounded-2xl border p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${cor.bg} bg-card`}
            >
              {/* Número */}
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${cor.bg}`}>
                  <Icon className={`h-5 w-5 ${cor.icon}`} />
                </div>
                <span className="text-xs font-mono font-bold text-muted-foreground/60">
                  #{String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex-1 space-y-1.5">
                <h2 className="font-bold text-foreground text-lg leading-tight">{mod.titulo}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{mod.descricao}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground">Ver conteúdo</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Como funciona:</span>{" "}
          Estude cada módulo, registre sua presença, faça o quiz de avaliação e complete as atividades práticas.
          Ao finalizar tudo, você estará certificado no uso do Microsoft Teams pela SABO.
        </div>
      </div>
    </div>
  )
}