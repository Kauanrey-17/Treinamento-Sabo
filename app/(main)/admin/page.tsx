"use client"

import { useEffect, useState } from "react"
import { ShieldCheck, UserPlus, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/data-table"
import { toast } from "sonner"
import type { PresencaRecord, QuizRecord, PraticasRecord } from "@/lib/types"

const mockPresenca: (PresencaRecord & Record<string, unknown>)[] = [
  { id: "1", nome: "Maria Silva", setor: "Produção", turno: "Manhã", email: "maria.silva@sabo.com.br", presente: true, dataRegistro: "2026-03-01T09:00:00.000Z" },
  { id: "2", nome: "Joao Santos", setor: "Qualidade", turno: "Tarde", email: "joao.santos@sabo.com.br", presente: true, dataRegistro: "2026-03-01T14:00:00.000Z" },
  { id: "3", nome: "Ana Oliveira", setor: "Logística", turno: "Noite", email: "ana.oliveira@sabo.com.br", presente: false, dataRegistro: "2026-03-01T22:00:00.000Z" },
]

const mockQuiz: (QuizRecord & Record<string, unknown>)[] = [
  { id: "1", nome: "Maria Silva", respostas: [2, 1, 2, 1, 1], nota: 10, dataRegistro: "2026-03-01T10:00:00.000Z" },
  { id: "2", nome: "Joao Santos", respostas: [2, 1, 0, 1, 0], nota: 6, dataRegistro: "2026-03-01T15:00:00.000Z" },
]

const mockPraticas: (PraticasRecord & Record<string, unknown>)[] = [
  { id: "1", nome: "Maria Silva", criouCanal: true, enviouMensagem: true, subiuArquivo: true, criouBucket: true, criouTarefa: false, dataRegistro: "2026-03-01T11:00:00.000Z" },
  { id: "2", nome: "Joao Santos", criouCanal: true, enviouMensagem: false, subiuArquivo: false, criouBucket: false, criouTarefa: false, dataRegistro: "2026-03-01T16:00:00.000Z" },
]

const setores = ["Produção", "Qualidade", "Manutenção", "Logística", "Adm"]

function BoolBadge({ value }: { value: unknown }) {
  const boolVal = value === true || value === "true"
  return (
    <Badge variant={boolVal ? "default" : "secondary"} className="text-xs">
      {boolVal ? "Sim" : "Nao"}
    </Badge>
  )
}

export default function AdminPage() {
  const [presenca, setPresenca] = useState(mockPresenca)
  const [quiz, setQuiz] = useState(mockQuiz)
  const [praticas, setPraticas] = useState(mockPraticas)
  const [funcionarios, setFuncionarios] = useState<Record<string, unknown>[]>([])
  const [loadingFunc, setLoadingFunc] = useState(false)
  const [setor, setSetor] = useState("")
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        const [pRes, qRes, prRes, fRes] = await Promise.all([
          fetch("/api/presenca"),
          fetch("/api/quiz"),
          fetch("/api/praticas"),
          fetch("/api/funcionarios"),
        ])
        const pData = await pRes.json()
        const qData = await qRes.json()
        const prData = await prRes.json()
        const fData = await fRes.json()

        if (pData.length > 0) setPresenca(pData)
        if (qData.length > 0) setQuiz(qData)
        if (prData.length > 0) setPraticas(prData)
        if (fData.length >= 0) setFuncionarios(fData)
      } catch {
        // Fallback to mock data
      }
    }
    fetchData()
  }, [])

  async function handleCadastrarFuncionario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoadingFunc(true)
    const form = e.currentTarget
    const nome = (form.elements.namedItem("nome") as HTMLInputElement).value
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const senha = (form.elements.namedItem("senha") as HTMLInputElement).value

    try {
      const res = await fetch("/api/funcionarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, setor }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erro")
      }
      const novo = await res.json()
      setFuncionarios((prev) => [novo, ...prev])
      toast.success("Funcionário cadastrado com sucesso!")
      setFormKey((k) => k + 1)
      setSetor("")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao cadastrar funcionário."
      toast.error(msg)
    } finally {
      setLoadingFunc(false)
    }
  }

  async function handleDelete(tipo: "presenca" | "quiz" | "praticas" | "funcionarios", id: string) {
    try {
      const res = await fetch(`/api/${tipo}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      if (tipo === "presenca") setPresenca((prev) => prev.filter((r) => r.id !== id))
      if (tipo === "quiz") setQuiz((prev) => prev.filter((r) => r.id !== id))
      if (tipo === "praticas") setPraticas((prev) => prev.filter((r) => r.id !== id))
      if (tipo === "funcionarios") setFuncionarios((prev) => prev.filter((r) => r.id !== id))
      toast.success("Registro excluído com sucesso!")
    } catch {
      toast.error("Erro ao excluir registro.")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Area Administrativa</h1>
        </div>
        <p className="mt-1 text-muted-foreground leading-relaxed">
          Gerencie registros de presenca, quiz, praticas e funcionarios.
        </p>
      </div>

      <Tabs defaultValue="presenca" className="w-full">
        <TabsList className="w-full justify-start flex-wrap">
          <TabsTrigger value="presenca">Presenca ({presenca.length})</TabsTrigger>
          <TabsTrigger value="quiz">Quiz ({quiz.length})</TabsTrigger>
          <TabsTrigger value="praticas">Praticas ({praticas.length})</TabsTrigger>
          <TabsTrigger value="funcionarios">Funcionarios ({funcionarios.length})</TabsTrigger>
        </TabsList>

        {/* PRESENÇA */}
        <TabsContent value="presenca" className="mt-4">
          <DataTable
            title="Registros de Presenca"
            data={presenca}
            filterKey="nome"
            filterPlaceholder="Buscar por nome..."
            columns={[
              { key: "nome", header: "Nome" },
              { key: "setor", header: "Setor" },
              { key: "turno", header: "Turno" },
              { key: "email", header: "E-mail" },
              { key: "presente", header: "Presente", render: (v) => <BoolBadge value={v} /> },
              { key: "dataRegistro", header: "Data", render: (v) => new Date(String(v)).toLocaleDateString("pt-BR") },
              {
                key: "id", header: "", render: (v) => (
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete("presenca", String(v))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )
              },
            ]}
          />
        </TabsContent>

        {/* QUIZ */}
        <TabsContent value="quiz" className="mt-4">
          <DataTable
            title="Resultados do Quiz"
            data={quiz}
            filterKey="nome"
            filterPlaceholder="Buscar por nome..."
            columns={[
              { key: "nome", header: "Nome" },
              {
                key: "nota", header: "Nota", render: (v) => {
                  const nota = Number(v)
                  return <Badge variant={nota >= 7 ? "default" : "destructive"} className="text-xs">{nota.toFixed(1)}</Badge>
                }
              },
              { key: "dataRegistro", header: "Data", render: (v) => new Date(String(v)).toLocaleDateString("pt-BR") },
              {
                key: "id", header: "", render: (v) => (
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete("quiz", String(v))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )
              },
            ]}
          />
        </TabsContent>

        {/* PRÁTICAS */}
        <TabsContent value="praticas" className="mt-4">
          <DataTable
            title="Registros de Praticas"
            data={praticas}
            filterKey="nome"
            filterPlaceholder="Buscar por nome..."
            columns={[
              { key: "nome", header: "Nome" },
              { key: "criouCanal", header: "Canal", render: (v) => <BoolBadge value={v} /> },
              { key: "enviouMensagem", header: "Mensagem", render: (v) => <BoolBadge value={v} /> },
              { key: "subiuArquivo", header: "Arquivo", render: (v) => <BoolBadge value={v} /> },
              { key: "criouBucket", header: "Bucket", render: (v) => <BoolBadge value={v} /> },
              { key: "criouTarefa", header: "Tarefa", render: (v) => <BoolBadge value={v} /> },
              { key: "dataRegistro", header: "Data", render: (v) => new Date(String(v)).toLocaleDateString("pt-BR") },
              {
                key: "id", header: "", render: (v) => (
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete("praticas", String(v))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )
              },
            ]}
          />
        </TabsContent>

        {/* FUNCIONÁRIOS */}
        <TabsContent value="funcionarios" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <CardTitle>Cadastrar Funcionário</CardTitle>
              </div>
              <CardDescription>Adicione um novo funcionário ao sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <form key={formKey} onSubmit={handleCadastrarFuncionario} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" name="nome" placeholder="Ex.: Carlos Oliveira" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail corporativo</Label>
                  <Input id="email" name="email" type="email" placeholder="carlos@sabo.com.br" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha inicial</Label>
                  <Input id="senha" name="senha" type="password" placeholder="Senha de acesso" required minLength={6} />
                </div>
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Select value={setor} onValueChange={setSetor} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {setores.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={loadingFunc || !setor} className="w-full sm:w-auto">
                    {loadingFunc ? "Cadastrando..." : "Cadastrar Funcionário"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <DataTable
            title="Funcionários Cadastrados"
            data={funcionarios}
            filterKey="nome"
            filterPlaceholder="Buscar por nome..."
            columns={[
              { key: "nome", header: "Nome" },
              { key: "email", header: "E-mail" },
              { key: "setor", header: "Setor" },
              { key: "ativo", header: "Ativo", render: (v) => <BoolBadge value={v} /> },
              { key: "criadoEm", header: "Cadastrado em", render: (v) => new Date(String(v)).toLocaleDateString("pt-BR") },
              {
                key: "id", header: "", render: (v) => (
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete("funcionarios", String(v))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )
              },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}