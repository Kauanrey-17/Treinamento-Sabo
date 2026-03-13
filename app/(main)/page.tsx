"use client"
 
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  BookOpen, ClipboardCheck, HelpCircle, CheckSquare,
  ArrowRight, Monitor, Users, FolderOpen, LayoutDashboard,
  GraduationCap, Clock, ShieldCheck, BookMarked
} from "lucide-react"
import { Button } from "@/components/ui/button"
 
const modulos = [
  { id: 1, titulo: "Introdução ao Teams", descricao: "Interface, navegação e recursos básicos.", icone: Monitor, cor: "from-blue-500/20 to-blue-600/10 border-blue-500/20" },
  { id: 2, titulo: "Canais & Equipes", descricao: "Crie equipes, organize canais e colabore.", icone: Users, cor: "from-purple-500/20 to-purple-600/10 border-purple-500/20" },
  { id: 3, titulo: "Arquivos & Ferramentas", descricao: "Compartilhamento, SharePoint e OneDrive.", icone: FolderOpen, cor: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20" },
  { id: 4, titulo: "Planner & Kanban", descricao: "Organize tarefas e acompanhe o progresso.", icone: LayoutDashboard, cor: "from-orange-500/20 to-orange-600/10 border-orange-500/20" },
]
 
const atalhos = [
  { href: "/presenca", label: "Registrar Presença", icon: ClipboardCheck, desc: "Confirme sua presença no treinamento" },
  { href: "/quiz", label: "Fazer Quiz", icon: HelpCircle, desc: "Teste seus conhecimentos" },
  { href: "/praticas", label: "Registrar Práticas", icon: CheckSquare, desc: "Registre as atividades realizadas" },
  { href: "/modulos", label: "Ver Módulos", icon: BookOpen, desc: "Acesse o conteúdo completo" },
]
 
export default function HomePage() {
  const { data: session } = useSession()
  const [saudacao, setSaudacao] = useState("Bom dia")
  const [mounted, setMounted] = useState(false)
 
  useEffect(() => {
    const hora = new Date().getHours()
    setSaudacao(hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite")
    setMounted(true)
  }, [])
 
  const primeiroNome = session?.user?.name?.split(" ")[0] ?? "Colaborador"
  const isAdmin = (session?.user as any)?.role === "admin"
 
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
 
      {/* HERO WELCOME */}
      <div className="relative overflow-hidden rounded-2xl bg-sidebar px-8 py-10 text-sidebar-foreground">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 right-32 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
 
        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sidebar-foreground/50 text-sm font-medium">
              <Clock className="h-3.5 w-3.5" />
              {saudacao}, {primeiroNome}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Portal de Treinamentos
            </h1>
            <p className="text-sidebar-foreground/60 max-w-md text-sm leading-relaxed">
              Plataforma de capacitação corporativa da SABO. Complete os módulos, faça o quiz e registre suas práticas.
            </p>
 
            {/* Só renderiza após hydration para evitar erro #418 */}
            {mounted && (
              <div className="pt-1">
                {isAdmin ? (
                  <Link href="/admin">
                    <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30">
                      <ShieldCheck className="h-4 w-4" />
                      Painel Administrativo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link
                    href="/modulos"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sidebar-accent/60 border border-sidebar-border text-sidebar-foreground/80 text-sm font-medium hover:bg-sidebar-accent transition-colors"
                  >
                    <BookMarked className="h-4 w-4 text-primary" />
                    Acessar meus módulos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
 
          <div className="hidden sm:flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
        </div>
      </div>
 
      {/* ATALHOS RÁPIDOS */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Acesso rápido</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {atalhos.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground leading-tight">{item.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
 
      {/* MÓDULOS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Módulos do treinamento</h2>
          <Link href="/modulos" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            Ver todos <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {modulos.map((mod, i) => (
            <Link
              key={mod.id}
              href="/modulos"
              className={`group flex items-start gap-4 rounded-xl border bg-gradient-to-br p-5 transition-all hover:shadow-md ${mod.cor}`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background/50 border border-white/10">
                <mod.icone className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono text-muted-foreground">#{String(i + 1).padStart(2, "0")}</span>
                <div className="font-semibold text-sm text-foreground mt-0.5">{mod.titulo}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{mod.descricao}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}