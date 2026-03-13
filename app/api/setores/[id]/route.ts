import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  try {
    const body = await request.json()
    const setor = await db.setor.update({
      where: { id: params.id },
      data: {
        ...(body.nome !== undefined && { nome: body.nome }),
        ...(body.ativo !== undefined && { ativo: body.ativo }),
      },
    })
    return NextResponse.json(setor)
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar setor" }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  try {
    await db.setor.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erro ao excluir setor" }, { status: 400 })
  }
}