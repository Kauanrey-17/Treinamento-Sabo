import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const item = await db.praticaItem.create({
      data: {
        cursoId: body.cursoId,
        titulo: body.titulo,
        descricao: body.descricao,
        ordem: body.ordem ?? 0,
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro ao criar item de pratica" }, { status: 400 })
  }
}
