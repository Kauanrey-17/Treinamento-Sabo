"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, BarChart3, Users, ClipboardCheck, HelpCircle, CheckSquare, TrendingUp, Award, Download, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function RelatoriosPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/presenca").then(r => r.json()),
      fetch("/api/quiz").then(r => r.json()),
      fetch("/api/praticas").then(r => r.json()),
      fetch("/api/funcionarios").then(r => r.json()),
    ]).then(([presenca, quiz, praticas, funcionarios]) => {
      setData({ presenca, quiz, praticas, funcionarios })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  const presenca = data?.presenca ?? []
  const quiz = data?.quiz ?? []
  const praticas = data?.praticas ?? []
  const funcionarios = data?.funcionarios ?? []

  const avgNota = quiz.length > 0 ? (quiz.reduce((a: number, q: any) => a + Number(q.nota), 0) / quiz.length).toFixed(1) : "—"
  const aprovados = quiz.filter((q: any) => Number(q.nota) >= 7).length
  const presentes = presenca.filter((p: any) => p.presente).length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-sm text-muted-foreground">Visão geral do treinamento</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Funcionários", value: funcionarios.length, icon: Users, color: "text-blue-500 bg-blue-500/10" },
          { label: "Presenças", value: presentes + "/" + presenca.length, icon: ClipboardCheck, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Quiz Realizados", value: quiz.length, icon: HelpCircle, color: "text-violet-500 bg-violet-500/10" },
          { label: "Práticas", value: praticas.length, icon: CheckSquare, color: "text-orange-500 bg-orange-500/10" },
        ].map(stat => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                <div className={"h-8 w-8 rounded-lg flex items-center justify-center " + stat.color}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quiz stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Média Geral</span>
            </div>
            <p className="text-4xl font-bold">{avgNota}</p>
            <p className="text-xs text-muted-foreground mt-1">pontos de 10</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Aprovados</span>
            </div>
            <p className="text-4xl font-bold">{aprovados}</p>
            <p className="text-xs text-muted-foreground mt-1">nota ≥ 7.0</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Taxa Aprovação</span>
            </div>
            <p className="text-4xl font-bold">{quiz.length > 0 ? Math.round(aprovados / quiz.length * 100) : 0}%</p>
            <p className="text-xs text-muted-foreground mt-1">dos realizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela quiz */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resultados do Quiz</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nota</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Data</th>
                </tr>
              </thead>
              <tbody>
                {quiz.slice(0, 20).map((r: any) => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{r.nome || r.funcionario?.nome || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={"font-bold " + (Number(r.nota) >= 7 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                        {Number(r.nota).toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={Number(r.nota) >= 7 ? "default" : "destructive"} className="text-xs">
                        {Number(r.nota) >= 7 ? "Aprovado" : "Reprovado"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(r.dataRegistro).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
                {quiz.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Nenhum resultado ainda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}