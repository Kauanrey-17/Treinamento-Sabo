"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { CheckSquare, Hash, MessageSquare, Upload, LayoutGrid, ListTodo, CheckCircle2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"

const praticaItems = [
  {
    key: "criouCanal" as const,
    label: "Criou um Canal",
    desc: "Você criou um canal novo em uma equipe",
    icon: Hash,
    cor: "text-blue-500 bg-blue-500/10",
  },
  {
    key: "enviouMensagem" as const,
    label: "Enviou uma Mensagem",
    desc: "Você enviou uma mensagem com @menção em um canal",
    icon: MessageSquare,
    cor: "text-green-500 bg-green-500/10",
  },
  {
    key: "subiuArquivo" as const,
    label: "Subiu um Arquivo",
    desc: "Você fez upload de um arquivo na aba Arquivos de um canal",
    icon: Upload,
    cor: "text-yellow-500 bg-yellow-500/10",
  },
  {
    key: "criouBucket" as const,
    label: "Criou um Bucket",
    desc: "Você criou um bucket no Planner para organizar tarefas",
    icon: LayoutGrid,
    cor: "text-purple-500 bg-purple-500/10",
  },
  {
    key: "criouTarefa" as const,
    label: "Criou uma Tarefa",
    desc: "Você criou uma tarefa no Planner com prazo e atribuição",
    icon: ListTodo,
    cor: "text-orange-500 bg-orange-500/10",
  },
]

const schema = z.object({
  nome: z.string().min(3, "Informe seu nome completo"),
  criouCanal: z.boolean(),
  enviouMensagem: z.boolean(),
  subiuArquivo: z.boolean(),
  criouBucket: z.boolean(),
  criouTarefa: z.boolean(),
})

type FormData = z.infer<typeof schema>

// ─── CRUD: CREATE ─────────────────────────────────────────────────────────────
// POST /api/praticas → cria registro na tabela Praticas
// Campos: nome, criouCanal, enviouMensagem, subiuArquivo, criouBucket, criouTarefa
// dataRegistro é gerado automaticamente pelo banco
// ─────────────────────────────────────────────────────────────────────────────

export default function PraticasPage() {
  const [registrado, setRegistrado] = useState(false)

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
      criouCanal: false,
      enviouMensagem: false,
      subiuArquivo: false,
      criouBucket: false,
      criouTarefa: false,
    },
  })

  const valores = watch()
  const concluidas = praticaItems.filter((item) => valores[item.key]).length
  const progresso = Math.round((concluidas / praticaItems.length) * 100)

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch("/api/praticas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setRegistrado(true)
      toast.success("Práticas registradas com sucesso!")
    } catch {
      toast.error("Erro ao registrar práticas. Tente novamente.")
    }
  }

  function handleNovo() {
    setRegistrado(false)
    reset()
  }

  // ── Tela de sucesso ──────────────────────────────────────────────
  if (registrado) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-green-500/20 bg-green-500/5 p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Práticas Registradas!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Você completou {concluidas} de {praticaItems.length} atividades.
            </p>
          </div>
          <div className="w-full space-y-1.5">
            <Progress value={progresso} className="h-3" />
            <p className="text-xs text-muted-foreground">{progresso}% concluído</p>
          </div>
          <div className="w-full space-y-2">
            {praticaItems.map((item) => {
              const feito = valores[item.key]
              return (
                <div key={item.key} className={`flex items-center gap-3 rounded-lg border p-3 ${
                  feito ? "border-green-500/20 bg-green-500/5" : "border-border opacity-50"
                }`}>
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${item.cor}`}>
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm text-foreground flex-1 text-left">{item.label}</span>
                  {feito
                    ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                    : <span className="text-xs text-muted-foreground">Pendente</span>
                  }
                </div>
              )
            })}
          </div>
          <Button variant="outline" onClick={handleNovo} className="w-full gap-2">
            <RotateCcw className="h-4 w-4" />
            Novo registro
          </Button>
        </div>
      </div>
    )
  }

  // ── Formulário ───────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Registro de Práticas</h1>
        </div>
        <p className="mt-1 text-muted-foreground leading-relaxed">
          Marque as atividades práticas que você já realizou no treinamento.
        </p>
      </div>

      {/* Progresso */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{concluidas} de {praticaItems.length} atividades concluídas</span>
          <span>{progresso}%</span>
        </div>
        <Progress value={progresso} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Checklist de Práticas</CardTitle>
          <CardDescription>Informe seu nome e marque cada atividade concluída.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                placeholder="Ex.: Carlos Oliveira"
                {...register("nome")}
                aria-invalid={!!errors.nome}
              />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
            </div>

            {/* Itens */}
            <div className="space-y-2">
              {praticaItems.map((item) => {
                const ativo = valores[item.key]
                return (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between rounded-xl border p-3.5 transition-all ${
                      ativo ? "border-primary/30 bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.cor}`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <Label htmlFor={item.key} className="text-sm font-medium cursor-pointer">
                          {item.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch
                      id={item.key}
                      checked={ativo}
                      onCheckedChange={(v) => setValue(item.key, v)}
                    />
                  </div>
                )
              })}
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4" />
                  Salvar Práticas
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}