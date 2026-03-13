import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })

  try {
    const setores = await db.setor.findMany({
      orderBy: { nome: "asc" },
      include: { _count: { select: { funcionarios: true } } },
    })
    return NextResponse.json(setores)
  } catch {
    return NextResponse.json({ error: "Erro ao buscar setores" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  }

  try {
    const { nome } = await request.json()
    const setor = await db.setor.create({ data: { nome } })
    return NextResponse.json(setor, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Setor ja existe ou erro ao criar" }, { status: 400 })
  }
}
