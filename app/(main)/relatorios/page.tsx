"use client"

import { FileText, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const relatorios = [
  {
    id: 1,
    titulo: "Relatorio Geral de Treinamento",
    descricao: "Presenca, quiz e praticas de todos os participantes.",
    data: "Gerado em tempo real",
  },
]

export default function RelatoriosPage() {
  function handleGerarPDF() {
    // Placeholder - futura integracao com geracao de PDF
    window.open("/api/relatorio", "_blank")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Relatorios</h1>
        <p className="mt-1 text-muted-foreground leading-relaxed">
          Visualize e exporte relatorios do treinamento.
        </p>
      </div>

      {relatorios.map((r) => (
        <Card key={r.id}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>{r.titulo}</CardTitle>
            </div>
            <CardDescription>{r.descricao}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-xs text-muted-foreground">{r.data}</p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleGerarPDF}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Gerar Relatorio HTML
              </Button>
              <Button variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" />
                Baixar PDF (em breve)
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
