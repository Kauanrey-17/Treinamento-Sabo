export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.praticas.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Erro ao excluir." }, { status: 400 })
  }
}