import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Target,
  List,
  Lightbulb,
  ClipboardCheck,
  HelpCircle,
  CheckSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { modulos, modulosConteudo } from "@/lib/modulos-data"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ModuloPage({ params }: Props) {
  const { id } = await params
  const moduloId = parseInt(id, 10)
  const modulo = modulos.find((m) => m.id === moduloId)
  const conteudo = modulosConteudo[moduloId]

  if (!modulo || !conteudo) {
    notFound()
  }

  const prevModulo = modulos.find((m) => m.id === moduloId - 1)
  const nextModulo = modulos.find((m) => m.id === moduloId + 1)

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/modulos"
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Modulos
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">
          Modulo {modulo.id}
        </span>
      </div>

      {/* Title */}
      <div>
        <span className="text-sm font-medium text-primary">
          Modulo {modulo.id} de 4
        </span>
        <h1 className="mt-1 text-2xl font-bold text-foreground lg:text-3xl text-balance">
          {modulo.titulo}
        </h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          {modulo.descricao}
        </p>
      </div>

      {/* Objetivos */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">
              Objetivos
            </h2>
          </div>
          <ul className="space-y-2">
            {conteudo.objetivos.map((obj, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm leading-relaxed text-card-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {obj}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Topicos */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <List className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">
              Topicos Abordados
            </h2>
          </div>
          <ol className="space-y-2">
            {conteudo.topicos.map((topico, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm leading-relaxed text-card-foreground"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
                  {i + 1}
                </span>
                {topico}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Dica */}
      <Alert className="border-primary/30 bg-primary/5">
        <Lightbulb className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm leading-relaxed text-foreground">
          <span className="font-semibold">Dica pratica:</span>{" "}
          {conteudo.dica}
        </AlertDescription>
      </Alert>

      {/* Atividades */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">
              O que o aluno fara
            </h2>
          </div>
          <ul className="space-y-2">
            {conteudo.atividades.map((at, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm leading-relaxed text-card-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {at}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        <Link href="/quiz">
          <Button variant="outline">
            <HelpCircle className="mr-2 h-4 w-4" />
            Fazer o Quiz
          </Button>
        </Link>
        <Link href="/praticas">
          <Button variant="outline">
            <CheckSquare className="mr-2 h-4 w-4" />
            Registrar Praticas
          </Button>
        </Link>
      </div>

      {/* Navegação */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        {prevModulo ? (
          <Link href={`/modulos/${prevModulo.id}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {prevModulo.titulo}
            </Button>
          </Link>
        ) : (
          <div />
        )}
        {nextModulo ? (
          <Link href={`/modulos/${nextModulo.id}`}>
            <Button variant="ghost" className="gap-2">
              {nextModulo.titulo}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Link href="/quiz">
            <Button className="gap-2">
              Ir para o Quiz
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
