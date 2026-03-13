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
    const modulo = await db.modulo.create({
      data: {
        cursoId: body.cursoId,
        titulo: body.titulo,
        conteudo: body.conteudo,
        ordem: body.ordem ?? 0,
      },
    })
    return NextResponse.json(modulo, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro ao criar modulo" }, { status: 400 })
  }
}
