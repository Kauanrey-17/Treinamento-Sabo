import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  try {
    const body = await request.json()
    const item = await db.praticaItem.update({
      where: { id: params.id },
      data: {
        ...(body.titulo !== undefined && { titulo: body.titulo }),
        ...(body.descricao !== undefined && { descricao: body.descricao }),
        ...(body.ordem !== undefined && { ordem: body.ordem }),
        ...(body.ativo !== undefined && { ativo: body.ativo }),
      },
    })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar item" }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  try {
    await db.praticaItem.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erro ao excluir item" }, { status: 400 })
  }
}