"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { ClipboardCheck, CheckCircle2, User, Building2, Clock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const setores = ["Produção", "Qualidade", "Manutenção", "Logística", "Adm"] as const
const turnos = ["Manhã", "Tarde", "Noite"] as const

const schema = z.object({
  nome: z.string().min(3, "Informe seu nome completo"),
  setor: z.enum(setores, { required_error: "Selecione seu setor" }),
  turno: z.enum(turnos, { required_error: "Selecione seu turno" }),
  email: z.string().email("Informe um e-mail válido"),
  presente: z.boolean(),
})

type FormData = z.infer<typeof schema>

// ─── CRUD: CREATE ─────────────────────────────────────────────────────────────
// POST /api/presenca → cria registro na tabela Presenca
// Campos: nome, setor, turno, email, presente, dataRegistro (auto)
// ─────────────────────────────────────────────────────────────────────────────

export default function PresencaPage() {
  const { data: session } = useSession()
  const [registrado, setRegistrado] = useState(false)
  const [dadosSalvos, setDadosSalvos] = useState<FormData | null>(null)

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
      presente: true,
      email: session?.user?.email ?? "",
      nome: session?.user?.name ?? "",
    },
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
      setDadosSalvos(data)
      setRegistrado(true)
      toast.success("Presença registrada com sucesso!")
    } catch {
      toast.error("Erro ao registrar presença. Tente novamente.")
    }
  }

  function handleNovo() {
    setRegistrado(false)
    setDadosSalvos(null)
    reset({ presente: true, email: "", nome: "" })
  }

  // ── Tela de sucesso ──────────────────────────────────────────────
  if (registrado && dadosSalvos) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-green-500/20 bg-green-500/5 p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Presença Confirmada!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Seu registro foi salvo com sucesso.
            </p>
          </div>

          <div className="w-full space-y-2 rounded-xl border border-border bg-card p-4 text-left">
            {[
              { icon: User, label: "Nome", valor: dadosSalvos.nome },
              { icon: Building2, label: "Setor", valor: dadosSalvos.setor },
              { icon: Clock, label: "Turno", valor: dadosSalvos.turno },
              { icon: Mail, label: "E-mail", valor: dadosSalvos.email },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground w-12">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.valor}</span>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={handleNovo} className="w-full">
            Registrar outro participante
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
          <ClipboardCheck className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Registro de Presença</h1>
        </div>
        <p className="mt-1 text-muted-foreground leading-relaxed">
          Preencha seus dados para confirmar sua participação no treinamento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Participante</CardTitle>
          <CardDescription>Todos os campos são obrigatórios.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nome"
                  placeholder="Ex.: Maria da Silva"
                  className="pl-9"
                  {...register("nome")}
                  aria-invalid={!!errors.nome}
                />
              </div>
              {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
            </div>

            {/* Setor + Turno lado a lado */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="setor">Setor</Label>
                <Select onValueChange={(v) => setValue("setor", v as FormData["setor"])}>
                  <SelectTrigger id="setor" aria-invalid={!!errors.setor}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {setores.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.setor && <p className="text-xs text-destructive">{errors.setor.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="turno">Turno</Label>
                <Select onValueChange={(v) => setValue("turno", v as FormData["turno"])}>
                  <SelectTrigger id="turno" aria-invalid={!!errors.turno}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {turnos.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.turno && <p className="text-xs text-destructive">{errors.turno.message}</p>}
              </div>
            </div>

            {/* E-mail */}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail corporativo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.nome@sabo.com.br"
                  className="pl-9"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* Presente toggle */}
            <div className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
              presente ? "border-green-500/30 bg-green-500/5" : "border-border"
            }`}>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {presente ? "✅ Presente" : "❌ Ausente"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Confirmo minha presença no treinamento
                </p>
              </div>
              <Switch
                id="presente"
                checked={presente}
                onCheckedChange={(v) => setValue("presente", v)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Registrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Registrar Presença
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}