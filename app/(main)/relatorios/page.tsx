"use client"

import { useState } from "react"
import { FileText, Download, ExternalLink, RefreshCw, BarChart3, Users, Brain, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export default function RelatoriosPage() {
  const [loading, setLoading] = useState(false)

  async function handleGerar(modo: "visualizar" | "imprimir") {
    setLoading(true)
    try {
      const res = await fetch("/api/relatorio")
      if (!res.ok) throw new Error()
      const html = await res.text()

      const blob = new Blob([html], { type: "text/html;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const win = window.open(url, "_blank")

      if (modo === "imprimir" && win) {
        win.onload = () => {
          win.print()
        }
      }

      toast.success("Relatório gerado com sucesso!")
    } catch {
      toast.error("Erro ao gerar relatório.")
    } finally {
      setLoading(false)
    }
  }

  async function handleBaixarHTML() {
    setLoading(true)
    try {
      const res = await fetch("/api/relatorio")
      if (!res.ok) throw new Error()
      const html = await res.text()

      const blob = new Blob([html], { type: "text/html;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `relatorio-sabo-${new Date().toISOString().split("T")[0]}.html`
      a.click()
      URL.revokeObjectURL(url)

      toast.success("Arquivo baixado!")
    } catch {
      toast.error("Erro ao baixar relatório.")
    } finally {
      setLoading(false)
    }
  }

  const recursos = [
    { icon: Users, label: "Presença", desc: "Lista completa de presenças com percentual de comparecimento" },
    { icon: Brain, label: "Quiz", desc: "Notas individuais, média geral e taxa de aprovação" },
    { icon: Zap, label: "Práticas", desc: "Atividades concluídas por participante com progresso visual" },
    { icon: BarChart3, label: "Estatísticas", desc: "Cards de resumo com totais e indicadores de desempenho" },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
        </div>
        <p className="mt-1 text-muted-foreground leading-relaxed">
          Gere relatórios completos do treinamento em tempo real com todos os dados do sistema.
        </p>
      </div>

      {/* Card principal */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Relatório Geral de Treinamento</CardTitle>
              <CardDescription>Presença, quiz e práticas de todos os participantes — gerado em tempo real</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Recursos incluídos */}
          <div className="grid grid-cols-2 gap-3">
            {recursos.map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <item.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground leading-snug mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <Button
              onClick={() => handleGerar("visualizar")}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Visualizar Relatório
            </Button>

            <Button
              variant="outline"
              onClick={handleBaixarHTML}
              disabled={loading}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar HTML
            </Button>

            <Button
              variant="outline"
              onClick={() => handleGerar("imprimir")}
              disabled={loading}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Imprimir / Salvar PDF
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            💡 Para salvar como PDF: clique em "Imprimir / Salvar PDF" e selecione "Salvar como PDF" na janela de impressão do navegador.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}