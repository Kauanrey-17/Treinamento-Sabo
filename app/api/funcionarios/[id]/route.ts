import { NextResponse } from "next/server"
import { db } from "@/lib/db"
 
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { nome, setor, ativo } = body
 
    const updated = await db.funcionario.update({
      where: { id: params.id },
      data: {
        ...(nome !== undefined && { nome }),
        ...(setor !== undefined && { setor }),
        ...(ativo !== undefined && { ativo }),
      },
    })
 
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar funcionário" }, { status: 400 })
  }
}
 
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.funcionario.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erro ao excluir funcionário" }, { status: 400 })
  }
}
 