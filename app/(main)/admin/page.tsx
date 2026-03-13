"use client"
 
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  ShieldCheck, UserPlus, Trash2, ArrowLeft, Users, BookOpen,
  ClipboardCheck, HelpCircle, CheckSquare, BarChart3, Pencil,
  X, Check, Search, RefreshCw, AlertTriangle, Eye, EyeOff,
  TrendingUp, Award, Activity
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
 
const setores = ["Produção", "Qualidade", "Manutenção", "Logística", "Adm"]
const turnos = ["Manhã", "Tarde", "Noite"]
 
type Tab = "dashboard" | "funcionarios" | "presenca" | "quiz" | "praticas"
 
function BoolBadge({ value }: { value: unknown }) {
  const v = value === true || value === "true"
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${v ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-zinc-500/10 text-zinc-500"}`}>
      {v ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {v ? "Sim" : "Não"}
    </span>
  )
}
 
function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-bold mt-1 text-foreground">{value}</p>
          </div>
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
 
export default function AdminPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
 
  // Data
  const [presenca, setPresenca] = useState<any[]>([])
  const [quiz, setQuiz] = useState<any[]>([])
  const [praticas, setPraticas] = useState<any[]>([])
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
 
  // Search
  const [search, setSearch] = useState("")
 
  // Funcionario form
  const [formKey, setFormKey] = useState(0)
  const [loadingFunc, setLoadingFunc] = useState(false)
  const [setor, setSetor] = useState("")
  const [showSenha, setShowSenha] = useState(false)
 
  // Edit funcionario
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNome, setEditNome] = useState("")
  const [editSetor, setEditSetor] = useState("")
  const [editAtivo, setEditAtivo] = useState(true)
 
  useEffect(() => {
    fetchAll()
  }, [])
 
  async function fetchAll() {
    setLoading(true)
    try {
      const [pRes, qRes, prRes, fRes] = await Promise.all([
        fetch("/api/presenca"),
        fetch("/api/quiz"),
        fetch("/api/praticas"),
        fetch("/api/funcionarios"),
      ])
      setPresenca(await pRes.json())
      setQuiz(await qRes.json())
      setPraticas(await prRes.json())
      setFuncionarios(await fRes.json())
    } catch {
      toast.error("Erro ao carregar dados.")
    } finally {
      setLoading(false)
    }
  }
 
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
      if (!res.ok) throw new Error((await res.json()).error || "Erro")
      const novo = await res.json()
      setFuncionarios(prev => [novo, ...prev])
      toast.success("Funcionário cadastrado!")
      setFormKey(k => k + 1)
      setSetor("")
    } catch (err: any) {
      toast.error(err.message || "Erro ao cadastrar.")
    } finally {
      setLoadingFunc(false)
    }
  }
 
  async function handleDelete(tipo: string, id: string) {
    if (!confirm("Confirmar exclusão?")) return
    try {
      const res = await fetch(`/api/${tipo}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      if (tipo === "presenca") setPresenca(p => p.filter(r => r.id !== id))
      if (tipo === "quiz") setQuiz(p => p.filter(r => r.id !== id))
      if (tipo === "praticas") setPraticas(p => p.filter(r => r.id !== id))
      if (tipo === "funcionarios") setFuncionarios(p => p.filter(r => r.id !== id))
      toast.success("Excluído com sucesso!")
    } catch {
      toast.error("Erro ao excluir.")
    }
  }
 
  async function handleEditFuncionario(id: string) {
    try {
      const res = await fetch(`/api/funcionarios/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: editNome, setor: editSetor, ativo: editAtivo }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setFuncionarios(prev => prev.map(f => f.id === id ? updated : f))
      setEditingId(null)
      toast.success("Funcionário atualizado!")
    } catch {
      toast.error("Erro ao atualizar.")
    }
  }
 
  function startEdit(f: any) {
    setEditingId(f.id)
    setEditNome(f.nome)
    setEditSetor(f.setor)
    setEditAtivo(f.ativo)
  }
 
  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-bold">Acesso Negado</h2>
        <p className="text-muted-foreground">Você não tem permissão para acessar esta área.</p>
        <Button onClick={() => router.push("/")}>Voltar ao Início</Button>
      </div>
    )
  }
 
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "funcionarios", label: "Funcionários", icon: Users },
    { id: "presenca", label: "Presença", icon: ClipboardCheck },
    { id: "quiz", label: "Quiz", icon: HelpCircle },
    { id: "praticas", label: "Práticas", icon: CheckSquare },
  ]
 
  const avgNota = quiz.length > 0 ? (quiz.reduce((a, q) => a + Number(q.nota), 0) / quiz.length).toFixed(1) : "—"
  const aprovados = quiz.filter(q => Number(q.nota) >= 7).length
 
  // Filtered data
  const filtered = (data: any[]) => {
    if (!search) return data
    return data.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
    )
  }
 
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
 
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="h-9 w-9 rounded-xl border border-border">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Painel Administrativo</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Gerencie usuários, registros e visualize relatórios</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>
 
      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border border-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as Tab); setSearch("") }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
              ? "bg-background text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>
 
      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard icon={Users} label="Funcionários" value={funcionarios.length} color="bg-blue-500/10 text-blue-600 dark:text-blue-400" />
            <StatCard icon={ClipboardCheck} label="Presenças" value={presenca.length} color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
            <StatCard icon={HelpCircle} label="Quiz" value={quiz.length} color="bg-violet-500/10 text-violet-600 dark:text-violet-400" />
            <StatCard icon={CheckSquare} label="Práticas" value={praticas.length} color="bg-orange-500/10 text-orange-600 dark:text-orange-400" />
          </div>
 
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Média do Quiz</span>
                </div>
                <p className="text-4xl font-bold text-foreground">{avgNota}</p>
                <p className="text-xs text-muted-foreground mt-1">de 10 pontos</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Aprovados</span>
                </div>
                <p className="text-4xl font-bold text-foreground">{aprovados}</p>
                <p className="text-xs text-muted-foreground mt-1">nota ≥ 7</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Presença Total</span>
                </div>
                <p className="text-4xl font-bold text-foreground">{presenca.filter(p => p.presente).length}</p>
                <p className="text-xs text-muted-foreground mt-1">de {presenca.length} registros</p>
              </CardContent>
            </Card>
          </div>
 
          {/* Últimos registros */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Últimas Atividades</CardTitle>
            </CardHeader>
            <CardContent>
              {[...presenca, ...quiz, ...praticas]
                .sort((a, b) => new Date(b.dataRegistro).getTime() - new Date(a.dataRegistro).getTime())
                .slice(0, 8)
                .map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {r.nome?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{r.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.nota !== undefined ? `Quiz — Nota ${r.nota}` : r.presente !== undefined ? `Presença — ${r.turno}` : "Práticas"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.dataRegistro).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                ))}
              {presenca.length + quiz.length + praticas.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma atividade registrada.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
 
      {/* FUNCIONÁRIOS */}
      {activeTab === "funcionarios" && (
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Cadastrar Funcionário</CardTitle>
              </div>
              <CardDescription>Adicione um novo colaborador ao sistema.</CardDescription>
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
                  <div className="relative">
                    <Input id="senha" name="senha" type={showSenha ? "text" : "password"} placeholder="Mínimo 6 caracteres" required minLength={6} />
                    <button type="button" onClick={() => setShowSenha(!showSenha)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Select value={setor} onValueChange={setSetor} required>
                    <SelectTrigger><SelectValue placeholder="Selecione o setor" /></SelectTrigger>
                    <SelectContent>
                      {setores.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
 
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="text-base">Funcionários Cadastrados ({funcionarios.length})</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="Buscar..." className="pl-8 h-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">E-mail</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Setor</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cadastro</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered(funcionarios).map(f => (
                      <tr key={f.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        {editingId === f.id ? (
                          <>
                            <td className="px-4 py-2"><Input value={editNome} onChange={e => setEditNome(e.target.value)} className="h-8 text-sm" /></td>
                            <td className="px-4 py-2 text-muted-foreground">{f.email}</td>
                            <td className="px-4 py-2">
                              <Select value={editSetor} onValueChange={setEditSetor}>
                                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>{setores.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                              </Select>
                            </td>
                            <td className="px-4 py-2">
                              <Select value={editAtivo ? "true" : "false"} onValueChange={v => setEditAtivo(v === "true")}>
                                <SelectTrigger className="h-8 text-sm w-24"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Ativo</SelectItem>
                                  <SelectItem value="false">Inativo</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-4 py-2 text-muted-foreground">{new Date(f.criadoEm).toLocaleDateString("pt-BR")}</td>
                            <td className="px-4 py-2">
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-emerald-600" onClick={() => handleEditFuncionario(f.id)}><Check className="h-3.5 w-3.5" /></Button>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground" onClick={() => setEditingId(null)}><X className="h-3.5 w-3.5" /></Button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 font-medium">{f.nome}</td>
                            <td className="px-4 py-3 text-muted-foreground">{f.email}</td>
                            <td className="px-4 py-3">{f.setor}</td>
                            <td className="px-4 py-3"><BoolBadge value={f.ativo} /></td>
                            <td className="px-4 py-3 text-muted-foreground">{new Date(f.criadoEm).toLocaleDateString("pt-BR")}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => startEdit(f)}><Pencil className="h-3.5 w-3.5" /></Button>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => handleDelete("funcionarios", f.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    {filtered(funcionarios).length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Nenhum funcionário encontrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
 
      {/* PRESENÇA */}
      {activeTab === "presenca" && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-base">Registros de Presença ({presenca.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-8 h-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Setor</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Turno</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">E-mail</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Presente</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Data</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered(presenca).map(r => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{r.nome}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.setor}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.turno}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                      <td className="px-4 py-3"><BoolBadge value={r.presente} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(r.dataRegistro).toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => handleDelete("presenca", r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </td>
                    </tr>
                  ))}
                  {filtered(presenca).length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Nenhum registro encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
 
      {/* QUIZ */}
      {activeTab === "quiz" && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-base">Resultados do Quiz ({quiz.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-8 h-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nota</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Data</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered(quiz).map(r => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{r.nome}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold text-base ${Number(r.nota) >= 7 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                          {Number(r.nota).toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${Number(r.nota) >= 7 ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-red-500/15 text-red-600 dark:text-red-400"}`}>
                          {Number(r.nota) >= 7 ? "Aprovado" : "Reprovado"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(r.dataRegistro).toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => handleDelete("quiz", r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </td>
                    </tr>
                  ))}
                  {filtered(quiz).length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Nenhum registro encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
 
      {/* PRÁTICAS */}
      {activeTab === "praticas" && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-base">Registros de Práticas ({praticas.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-8 h-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Canal</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Mensagem</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Arquivo</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Bucket</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tarefa</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Data</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered(praticas).map(r => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{r.nome}</td>
                      <td className="px-4 py-3"><BoolBadge value={r.criouCanal} /></td>
                      <td className="px-4 py-3"><BoolBadge value={r.enviouMensagem} /></td>
                      <td className="px-4 py-3"><BoolBadge value={r.subiuArquivo} /></td>
                      <td className="px-4 py-3"><BoolBadge value={r.criouBucket} /></td>
                      <td className="px-4 py-3"><BoolBadge value={r.criouTarefa} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(r.dataRegistro).toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => handleDelete("praticas", r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </td>
                    </tr>
                  ))}
                  {filtered(praticas).length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">Nenhum registro encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}