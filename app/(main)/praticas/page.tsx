"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { CheckSquare, CheckCircle2, Loader2, Zap, Circle } from "lucide-react"
import { toast } from "sonner"

const atividades = [
  {
    key: "criouCanal" as const,
    titulo: "Criar um canal no Teams",
    descricao: "Acesse sua equipe, clique em '+ Adicionar canal' e crie um canal com o nome do seu setor.",
    dica: "Canais organizam as conversas por tema. Use nomes claros como 'Projetos' ou 'Avisos'.",
  },
  {
    key: "enviouMensagem" as const,
    titulo: "Enviar uma mensagem com @menção",
    descricao: "No canal criado, escreva uma mensagem e use @nome para mencionar um colega.",
    dica: "A @menção notifica a pessoa diretamente. Use para garantir que a mensagem seja vista.",
  },
  {
    key: "subiuArquivo" as const,
    titulo: "Subir um arquivo no canal",
    descricao: "Acesse a aba 'Arquivos' do canal e faça upload de qualquer documento de teste.",
    dica: "Arquivos enviados no canal ficam no SharePoint da equipe, acessíveis por todos os membros.",
  },
  {
    key: "criouBucket" as const,
    titulo: "Criar um bucket no Planner",
    descricao: "Acesse o Planner pelo canal, crie um plano e adicione um bucket como 'A Fazer'.",
    dica: "Buckets são colunas no Kanban. Use-os para separar tarefas por fase ou categoria.",
  },
  {
    key: "criouTarefa" as const,
    titulo: "Criar uma tarefa e atribuí-la",
    descricao: "Dentro do bucket, clique em '+' e crie uma tarefa com prazo e responsável.",
    dica: "Tarefas com prazo e dono claro são concluídas 3x mais rápido. Sempre atribua responsáveis!",
  },
]

type PraticasForm = {
  criouCanal: boolean
  enviouMensagem: boolean
  subiuArquivo: boolean
  criouBucket: boolean
  criouTarefa: boolean
}

export default function PraticasPage() {
  const { data: session } = useSession()
  const [form, setForm] = useState<PraticasForm>({
    criouCanal: false,
    enviouMensagem: false,
    subiuArquivo: false,
    criouBucket: false,
    criouTarefa: false,
  })
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  const feitas = Object.values(form).filter(Boolean).length
  const total = atividades.length
  const pct = Math.round((feitas / total) * 100)

  async function handleSubmit() {
    setLoading(true)
    try {
      const res = await fetch("/api/praticas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: session?.user?.name ?? "Colaborador",
          ...form,
        }),
      })
      if (!res.ok) throw new Error()
      setSucesso(true)
      toast.success("Práticas registradas com sucesso!")
    } catch {
      toast.error("Erro ao registrar práticas. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (sucesso) {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Práticas registradas!</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Você completou <strong>{feitas} de {total}</strong> atividades práticas.
            {feitas === total && " Parabéns, tudo concluído! 🎉"}
          </p>
        </div>
        <div className="w-full rounded-xl border border-border bg-card p-4 space-y-2">
          {atividades.map((at) => (
            <div key={at.key} className="flex items-center gap-3 text-sm">
              {form[at.key]
                ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />}
              <span className={form[at.key] ? "text-foreground" : "text-muted-foreground"}>{at.titulo}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setSucesso(false)} className="text-sm text-primary hover:underline">
          Atualizar registros
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <CheckSquare className="h-4 w-4" />
          <span>Atividades práticas</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Práticas</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Marque as atividades que você realizou durante o treinamento. Seja honesto — este é seu registro de aprendizado.
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Progresso</span>
          <span className="text-sm font-bold text-primary">{feitas}/{total} atividades</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              pct === 100 ? "bg-emerald-500" : "bg-primary"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{pct}% concluído</span>
          {pct === 100 && <span className="text-emerald-500 font-semibold">✔ Tudo completo!</span>}
        </div>
      </div>

      {/* Atividades */}
      <div className="space-y-3">
        {atividades.map((at, i) => (
          <div
            key={at.key}
            onClick={() => setForm({ ...form, [at.key]: !form[at.key] })}
            className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
              form[at.key]
                ? "border-primary/40 bg-primary/5 shadow-sm"
                : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox visual */}
              <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                form[at.key]
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/30 group-hover:border-primary/50"
              }`}>
                {form[at.key] && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">#{String(i + 1).padStart(2, "0")}</span>
                  <span className={`text-sm font-semibold ${form[at.key] ? "text-primary" : "text-foreground"}`}>
                    {at.titulo}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{at.descricao}</p>

                {/* Dica */}
                <div className="flex items-start gap-1.5 mt-2 text-xs text-muted-foreground/70">
                  <Zap className="h-3 w-3 shrink-0 mt-0.5 text-yellow-500" />
                  {at.dica}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || feitas === 0}
        className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        {loading
          ? <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
          : <><CheckSquare className="h-4 w-4" /> Registrar {feitas} atividade{feitas !== 1 ? "s" : ""}</>
        }
      </button>

      <p className="text-center text-xs text-muted-foreground pb-2">
        Você pode marcar e desmarcar atividades antes de enviar. Após enviar, o registro fica salvo no sistema.
      </p>
    </div>
  )
}