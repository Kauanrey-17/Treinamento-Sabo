"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { CheckSquare, Hash, MessageSquare, Upload, LayoutGrid, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const praticaItems = [
  {
    key: "criouCanal" as const,
    label: "Criou um Canal",
    desc: "Voce criou um canal novo em uma equipe",
    icon: Hash,
  },
  {
    key: "enviouMensagem" as const,
    label: "Enviou uma Mensagem",
    desc: "Voce enviou uma mensagem com @mencao em um canal",
    icon: MessageSquare,
  },
  {
    key: "subiuArquivo" as const,
    label: "Subiu um Arquivo",
    desc: "Voce fez upload de um arquivo na aba Arquivos de um canal",
    icon: Upload,
  },
  {
    key: "criouBucket" as const,
    label: "Criou um Bucket",
    desc: "Voce criou um bucket no Planner para organizar tarefas",
    icon: LayoutGrid,
  },
  {
    key: "criouTarefa" as const,
    label: "Criou uma Tarefa",
    desc: "Voce criou uma tarefa no Planner com prazo e atribuicao",
    icon: ListTodo,
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

export default function PraticasPage() {
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

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch("/api/praticas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success("Praticas registradas com sucesso!")
      reset()
    } catch {
      toast.error("Erro ao registrar praticas. Tente novamente.")
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Registro de Praticas
        </h1>
        <p className="mt-1 text-muted-foreground leading-relaxed">
          Marque as atividades praticas que voce ja realizou no treinamento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            <CardTitle>Checklist de Praticas</CardTitle>
          </div>
          <CardDescription>
            Informe seu nome e marque cada atividade concluida.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                placeholder="Ex.: Carlos Oliveira"
                {...register("nome")}
                aria-invalid={!!errors.nome}
              />
              {errors.nome && (
                <p className="text-xs text-destructive">
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {praticaItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <Label
                        htmlFor={item.key}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {item.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={item.key}
                    checked={watch(item.key)}
                    onCheckedChange={(v) => setValue(item.key, v)}
                  />
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Praticas"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
