"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { ClipboardCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const setores = ["Produção", "Qualidade", "Manutenção", "Logística", "Adm"] as const
const turnos = ["Manhã", "Tarde", "Noite"] as const

const schema = z.object({
  nome: z.string().min(3, "Informe seu nome completo"),
  setor: z.enum(setores, { required_error: "Selecione seu setor" }),
  turno: z.enum(turnos, { required_error: "Selecione seu turno" }),
  email: z.string().email("Informe um e-mail valido"),
  presente: z.boolean(),
})

type FormData = z.infer<typeof schema>

export default function PresencaPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { presente: true },
  })

  const presente = watch("presente")

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch("/api/presenca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success("Presenca registrada com sucesso!")
      reset()
    } catch {
      toast.error("Erro ao registrar presenca. Tente novamente.")
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Registro de Presenca
        </h1>
        <p className="mt-1 text-muted-foreground leading-relaxed">
          Preencha seus dados para confirmar sua participacao no treinamento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <CardTitle>Dados do Participante</CardTitle>
          </div>
          <CardDescription>
            Todos os campos sao obrigatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                placeholder="Ex.: Maria da Silva"
                {...register("nome")}
                aria-invalid={!!errors.nome}
              />
              {errors.nome && (
                <p className="text-xs text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="setor">Setor</Label>
              <Select
                onValueChange={(v) => setValue("setor", v as FormData["setor"])}
              >
                <SelectTrigger id="setor" aria-invalid={!!errors.setor}>
                  <SelectValue placeholder="Selecione seu setor" />
                </SelectTrigger>
                <SelectContent>
                  {setores.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.setor && (
                <p className="text-xs text-destructive">
                  {errors.setor.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="turno">Turno</Label>
              <Select
                onValueChange={(v) => setValue("turno", v as FormData["turno"])}
              >
                <SelectTrigger id="turno" aria-invalid={!!errors.turno}>
                  <SelectValue placeholder="Selecione seu turno" />
                </SelectTrigger>
                <SelectContent>
                  {turnos.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.turno && (
                <p className="text-xs text-destructive">
                  {errors.turno.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.nome@sabo.com.br"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="presente" className="text-sm font-medium">
                  Presente
                </Label>
                <p className="text-xs text-muted-foreground">
                  Confirmo minha presenca no treinamento
                </p>
              </div>
              <Switch
                id="presente"
                checked={presente}
                onCheckedChange={(v) => setValue("presente", v)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar Presenca"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
