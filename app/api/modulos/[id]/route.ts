import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  try {
    const body = await request.json()
    const modulo = await db.modulo.update({
      where: { id: params.id },
      data: {
        ...(body.titulo !== undefined && { titulo: body.titulo }),
        ...(body.conteudo !== undefined && { conteudo: body.conteudo }),
        ...(body.ordem !== undefined && { ordem: body.ordem }),
        ...(body.ativo !== undefined && { ativo: body.ativo }),
      },
    })
    return NextResponse.json(modulo)
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar modulo" }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  try {
    await db.modulo.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erro ao excluir modulo" }, { status: 400 })
  }
}