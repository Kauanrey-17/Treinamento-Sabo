import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  try {
    const curso = await db.curso.findUnique({
      where: { id: params.id },
      include: {
        modulos: { where: { ativo: true }, orderBy: { ordem: "asc" } },
        perguntas: { where: { ativo: true }, orderBy: { ordem: "asc" } },
        praticas: { where: { ativo: true }, orderBy: { ordem: "asc" } },
        setores: { include: { setor: true } },
      },
    })
    if (!curso) return NextResponse.json({ error: "Nao encontrado" }, { status: 404 })
    return NextResponse.json(curso)
  } catch {
    return NextResponse.json({ error: "Erro ao buscar curso" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  try {
    const body = await request.json()
    const { titulo, descricao, icone, cor, ordem, ativo, setorIds } = body
    if (setorIds !== undefined) {
      await db.cursoSetor.deleteMany({ where: { cursoId: params.id } })
      await db.cursoSetor.createMany({ data: setorIds.map((setorId: string) => ({ cursoId: params.id, setorId })) })
    }
    const curso = await db.curso.update({
      where: { id: params.id },
      data: {
        ...(titulo !== undefined && { titulo }),
        ...(descricao !== undefined && { descricao }),
        ...(icone !== undefined && { icone }),
        ...(cor !== undefined && { cor }),
        ...(ordem !== undefined && { ordem }),
        ...(ativo !== undefined && { ativo }),
      },
      include: { setores: { include: { setor: true } }, modulos: { where: { ativo: true } }, perguntas: { where: { ativo: true } }, praticas: { where: { ativo: true } } },
    })
    return NextResponse.json(curso)
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar curso" }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  try {
    await db.curso.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erro ao excluir curso" }, { status: 400 })
  }
}