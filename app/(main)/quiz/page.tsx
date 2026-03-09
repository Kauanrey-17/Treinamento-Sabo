"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { HelpCircle, CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { quizQuestions } from "@/lib/modulos-data"

const schema = z.object({
  nome: z.string().min(3, "Informe seu nome completo"),
  respostas: z
    .array(z.string())
    .length(quizQuestions.length, `Responda todas as ${quizQuestions.length} perguntas`),
})

type FormData = z.infer<typeof schema>

// ─── CRUD: CREATE ─────────────────────────────────────────────────────────────
// POST /api/quiz → cria registro na tabela Quiz
// Campos: nome, respostas (JSON), nota, dataRegistro (auto)
// ─────────────────────────────────────────────────────────────────────────────

export default function QuizPage() {
  const [resultado, setResultado] = useState<{
    nota: number
    total: number
    acertos: number
    respostasNum: number[]
  } | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      respostas: Array(quizQuestions.length).fill(""),
    },
  })

  const respostas = watch("respostas")

  // Progresso do quiz
  const respondidas = respostas.filter((r) => r !== "").length
  const progresso = Math.round((respondidas / quizQuestions.length) * 100)

  async function onSubmit(data: FormData) {
    const respostasNum = data.respostas.map(Number)
    let acertos = 0
    quizQuestions.forEach((q, i) => {
      if (respostasNum[i] === q.respostaCorreta) acertos++
    })
    const nota = (acertos / quizQuestions.length) * 10
    setResultado({ nota, total: quizQuestions.length, acertos, respostasNum })

    try {
      await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: data.nome, respostas: respostasNum, nota }),
      })
      toast.success("Respostas enviadas com sucesso!")
    } catch {
      toast.error("Erro ao enviar respostas.")
    }
  }

  function handleRefazer() {
    setResultado(null)
    reset({ nome: "", respostas: Array(quizQuestions.length).fill("") })
  }

  // ── Tela de resultado ────────────────────────────────────────────
  if (resultado) {
    const aprovado = resultado.nota >= 7
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Card principal do resultado */}
        <div className={`rounded-2xl border p-8 text-center ${
          aprovado
            ? "border-green-500/20 bg-green-500/5"
            : "border-red-500/20 bg-red-500/5"
        }`}>
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            aprovado ? "bg-green-500/10" : "bg-red-500/10"
          }`}>
            {aprovado
              ? <Trophy className="h-8 w-8 text-green-500" />
              : <XCircle className="h-8 w-8 text-red-500" />
            }
          </div>
          <h2 className="text-2xl font-black text-foreground">
            {aprovado ? "Parabéns! Aprovado!" : "Não foi dessa vez!"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            Você acertou {resultado.acertos} de {resultado.total} questões
          </p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div>
              <p className={`text-4xl font-black ${aprovado ? "text-green-500" : "text-red-500"}`}>
                {resultado.nota.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Nota</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <p className="text-4xl font-black text-foreground">{resultado.acertos}/{resultado.total}</p>
              <p className="text-xs text-muted-foreground">Acertos</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <p className="text-4xl font-black text-foreground">
                {Math.round((resultado.acertos / resultado.total) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground">Aproveitamento</p>
            </div>
          </div>
        </div>

        {/* Gabarito */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Gabarito</h3>
          {quizQuestions.map((q, i) => {
            const acertou = resultado.respostasNum[i] === q.respostaCorreta
            return (
              <div key={q.id} className={`rounded-xl border p-4 ${
                acertou ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    acertou ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{q.pergunta}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-green-600 dark:text-green-400">
                        ✅ Resposta correta: {q.opcoes[q.respostaCorreta]}
                      </p>
                      {!acertou && (
                        <p className="text-xs text-red-500">
                          ❌ Sua resposta: {q.opcoes[resultado.respostasNum[i]]}
                        </p>
                      )}
                    </div>
                  </div>
                  {acertou
                    ? <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    : <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                  }
                </div>
              </div>
            )
          })}
        </div>

        <Button variant="outline" onClick={handleRefazer} className="w-full gap-2">
          <RotateCcw className="h-4 w-4" />
          Refazer o Quiz
        </Button>
      </div>
    )
  }

  // ── Formulário ───────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Quiz Avaliativo</h1>
        </div>
        <p className="mt-1 text-muted-foreground leading-relaxed">
          Responda as {quizQuestions.length} perguntas abaixo. Nota mínima para aprovação: 7.0
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{respondidas} de {quizQuestions.length} respondidas</span>
          <span>{progresso}%</span>
        </div>
        <Progress value={progresso} className="h-2" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Nome */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Seu nome completo</Label>
              <Input
                id="nome"
                placeholder="Ex.: João Santos"
                {...register("nome")}
                aria-invalid={!!errors.nome}
              />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Questões */}
        {quizQuestions.map((q, qIndex) => {
          const respondida = respostas[qIndex] !== ""
          return (
            <Card key={q.id} className={`transition-all ${respondida ? "border-primary/30" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    respondida
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {qIndex + 1}
                  </span>
                  <CardTitle className="text-base font-medium leading-relaxed">
                    {q.pergunta}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <RadioGroup
                  value={respostas[qIndex] ?? ""}
                  onValueChange={(v) => {
                    const updated = [...respostas]
                    updated[qIndex] = v
                    setValue("respostas", updated)
                  }}
                  className="space-y-2"
                >
                  {q.opcoes.map((opcao, oIndex) => {
                    const selecionada = respostas[qIndex] === String(oIndex)
                    return (
                      <div
                        key={oIndex}
                        className={`flex items-center gap-3 rounded-lg border p-3 transition-all cursor-pointer ${
                          selecionada
                            ? "border-primary/40 bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                        onClick={() => {
                          const updated = [...respostas]
                          updated[qIndex] = String(oIndex)
                          setValue("respostas", updated)
                        }}
                      >
                        <RadioGroupItem value={String(oIndex)} id={`q${qIndex}-o${oIndex}`} />
                        <Label
                          htmlFor={`q${qIndex}-o${oIndex}`}
                          className="flex-1 cursor-pointer text-sm font-normal"
                        >
                          {opcao}
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              </CardContent>
            </Card>
          )
        })}

        {errors.respostas && (
          <p className="text-sm text-destructive">{errors.respostas.message}</p>
        )}

        <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Enviando...
            </>
          ) : (
            <>
              Enviar Respostas
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}