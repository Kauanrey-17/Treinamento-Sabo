"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft, BookOpen, CheckCircle2, ChevronRight, ChevronLeft,
  HelpCircle, CheckSquare, Loader2, BookMarked, List
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CursoDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [curso, setCurso] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [moduloAtivo, setModuloAtivo] = useState(0)
  const [view, setView] = useState<"modulos" | "quiz" | "praticas">("modulos")

  useEffect(() => {
    if (!id) return
    fetch("/api/cursos/" + id)
      .then(r => r.json())
      .then(data => { setCurso(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  if (!curso || curso.error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-muted-foreground">Curso não encontrado.</p>
      <Button onClick={() => router.push("/modulos")}>Voltar</Button>
    </div>
  )

  const modulos = curso.modulos ?? []
  const moduloAtual = modulos[moduloAtivo]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/modulos")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs text-muted-foreground">Cursos / {curso.titulo}</p>
          <h1 className="text-2xl font-bold tracking-tight">{curso.titulo}</h1>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border border-border">
        {[
          { key: "modulos", label: "Módulos", icon: BookOpen, count: modulos.length },
          { key: "quiz", label: "Quiz", icon: HelpCircle, count: curso.perguntas?.length ?? 0 },
          { key: "praticas", label: "Práticas", icon: CheckSquare, count: curso.praticas?.length ?? 0 },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key as any)}
            className={"flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center " + (view === tab.key ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground")}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* MÓDULOS VIEW */}
      {view === "modulos" && (
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-1">
            {modulos.map((mod: any, i: number) => (
              <button
                key={mod.id}
                onClick={() => setModuloAtivo(i)}
                className={"w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors " + (moduloAtivo === i ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground")}
              >
                <span className="font-mono text-xs opacity-60">#{String(i + 1).padStart(2, "0")}</span>
                <span className="font-medium truncate">{mod.titulo}</span>
              </button>
            ))}
          </div>

          {/* Conteúdo */}
          {moduloAtual ? (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">{moduloAtual.titulo}</h2>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {moduloAtual.conteudo.split("\n").map((line: string, i: number) => {
                  if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold mt-6 mb-3">{line.slice(2)}</h1>
                  if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold mt-5 mb-2 text-primary">{line.slice(3)}</h2>
                  if (line.startsWith("### ")) return <h3 key={i} className="text-base font-semibold mt-4 mb-1">{line.slice(4)}</h3>
                  if (line.startsWith("- ")) return <li key={i} className="ml-4 text-muted-foreground">{line.slice(2)}</li>
                  if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold">{line.slice(2, -2)}</p>
                  if (line === "") return <br key={i} />
                  return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>
                })}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button variant="outline" size="sm" disabled={moduloAtivo === 0} onClick={() => setModuloAtivo(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                </Button>
                {moduloAtivo < modulos.length - 1 ? (
                  <Button size="sm" onClick={() => setModuloAtivo(p => p + 1)}>
                    Próximo <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setView("quiz")}>
                    Fazer Quiz <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-border p-12 text-muted-foreground">
              Nenhum módulo disponível.
            </div>
          )}
        </div>
      )}

      {/* QUIZ VIEW */}
      {view === "quiz" && (
        <QuizView cursoId={curso.id} perguntas={curso.perguntas ?? []} onVoltar={() => setView("modulos")} />
      )}

      {/* PRÁTICAS VIEW */}
      {view === "praticas" && (
        <PraticasView cursoId={curso.id} itens={curso.praticas ?? []} onVoltar={() => setView("modulos")} />
      )}
    </div>
  )
}

function QuizView({ cursoId, perguntas, onVoltar }: { cursoId: string, perguntas: any[], onVoltar: () => void }) {
  const [respostas, setRespostas] = useState<Record<number, number>>({})
  const [enviado, setEnviado] = useState(false)
  const [nota, setNota] = useState(0)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (Object.keys(respostas).length < perguntas.length) {
      alert("Responda todas as perguntas antes de enviar.")
      return
    }
    setLoading(true)
    const acertos = perguntas.filter((p: any, i: number) => respostas[i] === p.respostaCorreta).length
    const notaFinal = (acertos / perguntas.length) * 10

    try {
      await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cursoId, respostas: Object.values(respostas), nota: notaFinal }),
      })
    } catch {}

    setNota(notaFinal)
    setEnviado(true)
    setLoading(false)
  }

  if (perguntas.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
      <HelpCircle className="h-10 w-10" />
      <p>Nenhuma pergunta cadastrada para este curso.</p>
      <Button variant="outline" onClick={onVoltar}><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Button>
    </div>
  )

  if (enviado) return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className={"h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold " + (nota >= 7 ? "bg-emerald-500/20 text-emerald-600" : "bg-red-500/20 text-red-600")}>
        {nota.toFixed(1)}
      </div>
      <h2 className="text-xl font-bold">{nota >= 7 ? "Parabéns! Aprovado! 🎉" : "Não foi dessa vez 😔"}</h2>
      <p className="text-muted-foreground">{nota >= 7 ? "Você passou no quiz com sucesso." : "Revise os módulos e tente novamente."}</p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onVoltar}><ArrowLeft className="h-4 w-4 mr-2" /> Ver Módulos</Button>
        <Button onClick={() => { setEnviado(false); setRespostas({}) }}>Refazer Quiz</Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Quiz — {perguntas.length} perguntas</h2>
        <Button variant="outline" size="sm" onClick={onVoltar}><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Button>
      </div>
      {perguntas.map((p: any, i: number) => (
        <div key={p.id} className="rounded-xl border border-border bg-card p-5 space-y-3">
          <p className="font-semibold">{i + 1}. {p.pergunta}</p>
          <div className="grid gap-2">
            {(p.opcoes as string[]).map((opcao, j) => (
              <button
                key={j}
                onClick={() => setRespostas(prev => ({ ...prev, [i]: j }))}
                className={"w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors " + (respostas[i] === j ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:border-primary/40 hover:bg-muted/50")}
              >
                <span className="font-mono text-xs mr-2 opacity-60">{String.fromCharCode(65 + j)}.</span>
                {opcao}
              </button>
            ))}
          </div>
        </div>
      ))}
      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Enviar Respostas
      </Button>
    </div>
  )
}

function PraticasView({ cursoId, itens, onVoltar }: { cursoId: string, itens: any[], onVoltar: () => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  const total = itens.length
  const feitos = Object.values(checked).filter(Boolean).length

  async function handleSubmit() {
    setLoading(true)
    try {
      await fetch("/api/praticas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cursoId, itensFeitos: checked }),
      })
      setEnviado(true)
    } catch {}
    setLoading(false)
  }

  if (itens.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
      <CheckSquare className="h-10 w-10" />
      <p>Nenhuma atividade prática cadastrada.</p>
      <Button variant="outline" onClick={onVoltar}><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Button>
    </div>
  )

  if (enviado) return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <CheckCircle2 className="h-16 w-16 text-emerald-500" />
      <h2 className="text-xl font-bold">Práticas registradas! 🎉</h2>
      <p className="text-muted-foreground">{feitos} de {total} atividades concluídas.</p>
      <Button variant="outline" onClick={onVoltar}><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Atividades Práticas</h2>
          <p className="text-sm text-muted-foreground">{feitos} de {total} concluídas</p>
        </div>
        <Button variant="outline" size="sm" onClick={onVoltar}><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Button>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-2 bg-primary rounded-full transition-all" style={{ width: total > 0 ? (feitos / total * 100) + "%" : "0%" }} />
      </div>
      <div className="space-y-3">
        {itens.map((item: any) => (
          <button
            key={item.id}
            onClick={() => setChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
            className={"w-full text-left flex items-start gap-4 rounded-xl border p-4 transition-all " + (checked[item.id] ? "border-emerald-500/40 bg-emerald-500/5" : "border-border hover:border-primary/40 hover:bg-muted/30")}
          >
            <div className={"h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors " + (checked[item.id] ? "border-emerald-500 bg-emerald-500" : "border-muted-foreground")}>
              {checked[item.id] && <CheckCircle2 className="h-3 w-3 text-white" />}
            </div>
            <div>
              <p className={"font-medium " + (checked[item.id] ? "line-through text-muted-foreground" : "")}>{item.titulo}</p>
              {item.descricao && <p className="text-sm text-muted-foreground mt-0.5">{item.descricao}</p>}
            </div>
          </button>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={loading || feitos === 0} className="w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Registrar Práticas ({feitos}/{total})
      </Button>
    </div>
  )
}