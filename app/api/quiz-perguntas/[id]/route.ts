import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  try {
    const body = await request.json()
    const pergunta = await db.quizPergunta.update({
      where: { id: params.id },
      data: {
        ...(body.pergunta !== undefined && { pergunta: body.pergunta }),
        ...(body.opcoes !== undefined && { opcoes: body.opcoes }),
        ...(body.respostaCorreta !== undefined && { respostaCorreta: body.respostaCorreta }),
        ...(body.ordem !== undefined && { ordem: body.ordem }),
        ...(body.ativo !== undefined && { ativo: body.ativo }),
      },
    })
    return NextResponse.json(pergunta)
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar pergunta" }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  try {
    await db.quizPergunta.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erro ao excluir pergunta" }, { status: 400 })
  }
}