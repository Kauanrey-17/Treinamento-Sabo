"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { HelpCircle, CheckCircle2, XCircle, Loader2, ChevronRight, Trophy, RotateCcw } from "lucide-react"
import { quizQuestions } from "@/lib/modulos-data"
import { toast } from "sonner"

export default function QuizPage() {
  const { data: session } = useSession()
  const [atual, setAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [selecionada, setSelecionada] = useState<number | null>(null)
  const [confirmada, setConfirmada] = useState(false)
  const [finalizado, setFinalizado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nota, setNota] = useState(0)

  const pergunta = quizQuestions[atual]
  const total = quizQuestions.length
  const progresso = Math.round((atual / total) * 100)

  function handleSelecionar(idx: number) {
    if (confirmada) return
    setSelecionada(idx)
  }

  function handleConfirmar() {
    if (selecionada === null) return
    setConfirmada(true)
  }

  async function handleProximo() {
    const novasRespostas = [...respostas, selecionada!]
    setRespostas(novasRespostas)

    if (atual + 1 >= total) {
      // Calcular nota
      let acertos = 0
      novasRespostas.forEach((resp, i) => {
        if (resp === quizQuestions[i].respostaCorreta) acertos++
      })
      const notaFinal = Math.round((acertos / total) * 10 * 10) / 10
      setNota(notaFinal)
      setFinalizado(true)

      // Salvar no banco
      setLoading(true)
      try {
        await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: session?.user?.name ?? "Colaborador",
            respostas: novasRespostas,
            nota: notaFinal,
          }),
        })
        toast.success("Resultado salvo com sucesso!")
      } catch {
        toast.error("Erro ao salvar resultado.")
      } finally {
        setLoading(false)
      }
    } else {
      setAtual(atual + 1)
      setSelecionada(null)
      setConfirmada(false)
    }
  }

  function handleReiniciar() {
    setAtual(0)
    setRespostas([])
    setSelecionada(null)
    setConfirmada(false)
    setFinalizado(false)
    setNota(0)
  }

  // Tela de resultado
  if (finalizado) {
    const acertos = respostas.filter((r, i) => r === quizQuestions[i].respostaCorreta).length
    const aprovado = nota >= 7
    return (
      <div className="max-w-lg mx-auto space-y-6">
        {/* Resultado hero */}
        <div className={`rounded-2xl p-8 text-center space-y-4 ${aprovado ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
          <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${aprovado ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
            {aprovado
              ? <Trophy className="h-10 w-10 text-emerald-500" />
              : <XCircle className="h-10 w-10 text-red-500" />}
          </div>
          <div>
            <div className={`text-5xl font-black ${aprovado ? "text-emerald-500" : "text-red-500"}`}>
              {nota.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">de 10,0 pontos</div>
          </div>
          <div>
            <div className={`text-xl font-bold ${aprovado ? "text-emerald-600" : "text-red-600"}`}>
              {aprovado ? "🎉 Aprovado!" : "😔 Reprovado"}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {aprovado
                ? "Excelente! Você demonstrou domínio do conteúdo."
                : "Não desanime. Revise os módulos e tente novamente."}
            </p>
          </div>
        </div>

        {/* Resumo por pergunta */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h3 className="font-semibold text-sm">Revisão das respostas</h3>
          {quizQuestions.map((q, i) => {
            const correto = respostas[i] === q.respostaCorreta
            return (
              <div key={i} className={`rounded-lg p-3 text-sm ${correto ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-red-500/5 border border-red-500/20"}`}>
                <div className="flex items-start gap-2">
                  {correto
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    : <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />}
                  <div>
                    <p className="font-medium text-foreground">{q.pergunta}</p>
                    {!correto && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Resposta correta: <span className="font-semibold text-emerald-600">{q.opcoes[q.respostaCorreta]}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-2xl font-black text-emerald-500">{acertos}</div>
            <div className="text-xs text-muted-foreground mt-1">Acertos</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-2xl font-black text-red-500">{total - acertos}</div>
            <div className="text-xs text-muted-foreground mt-1">Erros</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-2xl font-black text-primary">{Math.round((acertos / total) * 100)}%</div>
            <div className="text-xs text-muted-foreground mt-1">Aproveitamento</div>
          </div>
        </div>

        <button
          onClick={handleReiniciar}
          className="w-full h-11 rounded-xl border border-border bg-card text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Tentar novamente
        </button>
      </div>
    )
  }

  // Quiz em andamento
  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <HelpCircle className="h-4 w-4" />
          <span>Avaliação de conhecimentos</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Quiz</h1>
        <p className="text-muted-foreground text-sm">
          {total} perguntas · Mínimo 7,0 para aprovação
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Pergunta {atual + 1} de {total}</span>
          <span>{progresso}% concluído</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progresso}%` }}
          />
        </div>
        {/* Dots */}
        <div className="flex gap-1.5 justify-center pt-1">
          {quizQuestions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < atual ? "bg-primary w-4" : i === atual ? "bg-primary w-6" : "bg-muted w-1.5"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Pergunta */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {atual + 1}
          </span>
          <h2 className="text-base font-semibold leading-snug text-foreground pt-0.5">
            {pergunta.pergunta}
          </h2>
        </div>

        {/* Opções */}
        <div className="space-y-2">
          {pergunta.opcoes.map((opcao, i) => {
            let estado = "default"
            if (confirmada) {
              if (i === pergunta.respostaCorreta) estado = "correta"
              else if (i === selecionada) estado = "errada"
            } else if (i === selecionada) {
              estado = "selecionada"
            }

            return (
              <button
                key={i}
                onClick={() => handleSelecionar(i)}
                className={`w-full flex items-center gap-3 rounded-xl border p-4 text-sm text-left transition-all ${
                  estado === "correta"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : estado === "errada"
                    ? "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400"
                    : estado === "selecionada"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40 hover:bg-muted/50"
                }`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                  estado === "correta" ? "border-emerald-500 bg-emerald-500 text-white"
                  : estado === "errada" ? "border-red-500 bg-red-500 text-white"
                  : estado === "selecionada" ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted"
                }`}>
                  {confirmada && i === pergunta.respostaCorreta
                    ? <CheckCircle2 className="h-3.5 w-3.5" />
                    : confirmada && i === selecionada
                    ? <XCircle className="h-3.5 w-3.5" />
                    : String.fromCharCode(65 + i)}
                </span>
                {opcao}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {confirmada && (
          <div className={`rounded-lg p-3 text-sm ${
            selecionada === pergunta.respostaCorreta
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-red-500/10 text-red-700 dark:text-red-400"
          }`}>
            {selecionada === pergunta.respostaCorreta
              ? "✔ Correto! Muito bem."
              : `✘ Incorreto. A resposta certa é: "${pergunta.opcoes[pergunta.respostaCorreta]}"`}
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-between pt-2">
          {!confirmada ? (
            <button
              onClick={handleConfirmar}
              disabled={selecionada === null}
              className="ml-auto h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirmar
            </button>
          ) : (
            <button
              onClick={handleProximo}
              disabled={loading}
              className="ml-auto h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {atual + 1 >= total ? "Ver resultado" : "Próxima"}
              {!loading && <ChevronRight className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}