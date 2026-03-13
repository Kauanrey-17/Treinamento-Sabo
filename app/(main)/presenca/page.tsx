"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ClipboardCheck, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"

const turnos = ["Manhã", "Tarde", "Noite"]

export default function PresencaPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [turno, setTurno] = useState("")
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const nome = session?.user?.name ?? ""
  const email = session?.user?.email ?? ""
  const setor = (session?.user as any)?.setor ?? ""

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!turno) return
    setLoading(true)
    try {
      const res = await fetch("/api/presenca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, setor, turno, presente: true }),
      })
      if (!res.ok) throw new Error()
      setEnviado(true)
      toast.success("Presença registrada!")
    } catch {
      toast.error("Erro ao registrar presença.")
    } finally {
      setLoading(false)
    }
  }

  if (enviado) return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <CheckCircle2 className="h-16 w-16 text-emerald-500" />
      <h2 className="text-xl font-bold">Presença registrada!</h2>
      <p className="text-muted-foreground text-center">Sua presença foi confirmada com sucesso.</p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.push("/")}>Início</Button>
        <Button onClick={() => { setEnviado(false); setTurno("") }}>Registrar Novamente</Button>
      </div>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registrar Presença</h1>
          <p className="text-sm text-muted-foreground">Confirme sua presença no treinamento</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <CardTitle>Confirmação de Presença</CardTitle>
          </div>
          <CardDescription>Seus dados são preenchidos automaticamente.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={nome} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input value={email} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Setor</Label>
              <Input value={setor || "Não definido"} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Turno</Label>
              <Select value={turno} onValueChange={setTurno} required>
                <SelectTrigger><SelectValue placeholder="Selecione o turno" /></SelectTrigger>
                <SelectContent>
                  {turnos.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading || !turno} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ClipboardCheck className="h-4 w-4 mr-2" />}
              Confirmar Presença
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}