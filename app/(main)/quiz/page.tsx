"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { HelpCircle, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { quizQuestions } from "@/lib/modulos-data"

const schema = z.object({
  nome: z.string().min(3, "Informe seu nome completo"),
  respostas: z
    .array(z.string())
    .length(quizQuestions.length, `Responda todas as ${quizQuestions.length} perguntas`),
})

type FormData = z.infer<typeof schema>

export default function QuizPage() {
  const [resultado, setResultado] = useState<{
    nota: number
    total: number
    acertos: number
  } | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      respostas: Array(quizQuestions.length).fill(""),
    },
  })

  const respostas = watch("respostas")

  async function onSubmit(data: FormData) {
    const respostasNum = data.respostas.map(Number)
    let acertos = 0
    quizQuestions.forEach((q, i) => {
      if (respostasNum[i] === q.respostaCorreta) acertos++
    })
    const nota = (acertos / quizQuestions.length) * 10

    setResultado({ nota, total: quizQuestions.length, acertos })

    try {
      await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          respostas: respostasNum,
          nota,
        }),
      })
      toast.success("Respostas enviadas com sucesso!")
    } catch {
      toast.error("Erro ao enviar respostas.")
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Quiz Avaliativo
        </h1>
        <p className="mt-1 text-muted-foreground leading-relaxed">
          Responda as perguntas abaixo para testar seus conhecimentos sobre o
          treinamento.
        </p>
      </div>

      {resultado && (
        <Alert
          className={
            resultado.nota >= 7
              ? "border-green-500/30 bg-green-50 dark:bg-green-950/20"
              : "border-destructive/30 bg-red-50 dark:bg-red-950/20"
          }
        >
          {resultado.nota >= 7 ? (
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="h-4 w-4 text-destructive" />
          )}
          <AlertDescription
            className={
              resultado.nota >= 7
                ? "text-green-800 dark:text-green-300"
                : "text-destructive"
            }
          >
            Voce acertou {resultado.acertos} de {resultado.total} perguntas.
            Nota: <strong>{resultado.nota.toFixed(1)}</strong>/10.
            {resultado.nota >= 7
              ? " Parabens, voce foi aprovado!"
              : " Revise os modulos e tente novamente."}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Seu nome completo</Label>
              <Input
                id="nome"
                placeholder="Ex.: Joao Santos"
                {...register("nome")}
                aria-invalid={!!errors.nome}
              />
              {errors.nome && (
                <p className="text-xs text-destructive">
                  {errors.nome.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {quizQuestions.map((q, qIndex) => (
          <Card key={q.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
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
                {q.opcoes.map((opcao, oIndex) => (
                  <div
                    key={oIndex}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <RadioGroupItem
                      value={String(oIndex)}
                      id={`q${qIndex}-o${oIndex}`}
                    />
                    <Label
                      htmlFor={`q${qIndex}-o${oIndex}`}
                      className="flex-1 cursor-pointer text-sm font-normal"
                    >
                      {opcao}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}

        {errors.respostas && (
          <p className="text-sm text-destructive">{errors.respostas.message}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <HelpCircle className="mr-2 h-4 w-4" />
          {isSubmitting ? "Enviando..." : "Enviar Respostas"}
        </Button>
      </form>
    </div>
  )
}
