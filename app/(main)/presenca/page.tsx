"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { ClipboardCheck, CheckCircle2, Loader2, User, Building2, Clock, Mail } from "lucide-react"
import { toast } from "sonner"

const setores = ["Produção", "Qualidade", "Manutenção", "Logística", "Adm"] as const
const turnos = ["Manhã", "Tarde", "Noite"] as const

type Setor = typeof setores[number]
type Turno = typeof turnos[number]

export default function PresencaPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  const [form, setForm] = useState({
    nome: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    setor: "" as Setor | "",
    turno: "" as Turno | "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.setor || !form.turno) {
      toast.error("Selecione o setor e o turno.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/presenca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, presente: true }),
      })
      if (!res.ok) throw new Error()
      setSucesso(true)
      toast.success("Presença registrada com sucesso!")
    } catch {
      toast.error("Erro ao registrar presença. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (sucesso) {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Presença confirmada!</h2>
          <p className="text-muted-foreground mt-1">
            Sua presença no treinamento foi registrada com sucesso, <strong>{form.nome.split(" ")[0]}</strong>.
          </p>
        </div>
        <div className="w-full rounded-xl border border-border bg-card p-4 text-sm text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nome</span>
            <span className="font-medium">{form.nome}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Setor</span>
            <span className="font-medium">{form.setor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Turno</span>
            <span className="font-medium">{form.turno}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data</span>
            <span className="font-medium">{new Date().toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
        <button
          onClick={() => setSucesso(false)}
          className="text-sm text-primary hover:underline"
        >
          Registrar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <ClipboardCheck className="h-4 w-4" />
          <span>Registro de participação</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Presença</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Confirme sua presença no treinamento Microsoft Teams. Este registro é obrigatório para certificação.
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Nome completo
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              placeholder="Seu nome completo"
              className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> E-mail corporativo
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="seu.nome@sabo.com.br"
              className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>

          {/* Setor */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Setor
            </label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {setores.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, setor: s })}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                    form.setor === s
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Turno */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Turno
            </label>
            <div className="grid grid-cols-3 gap-2">
              {turnos.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, turno: t })}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                    form.turno === t
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !form.setor || !form.turno}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Registrando...</>
            ) : (
              <><ClipboardCheck className="h-4 w-4" /> Confirmar presença</>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Sua presença será vinculada ao seu cadastro no sistema SABO.
      </p>
    </div>
  )
}