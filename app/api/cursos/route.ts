import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })

  const role = (session.user as any).role
  const setorId = (session.user as any).setorId

  try {
    if (role === "admin") {
      const cursos = await db.curso.findMany({
        where: { ativo: true },
        include: {
          setores: { include: { setor: true } },
          _count: { select: { modulos: true, perguntas: true, praticas: true } },
        },
        orderBy: { ordem: "asc" },
      })
      return NextResponse.json(cursos)
    }

    if (!setorId) return NextResponse.json([])

    const cursos = await db.curso.findMany({
      where: { ativo: true, setores: { some: { setorId } } },
      include: {
        setores: { include: { setor: true } },
        _count: { select: { modulos: true, perguntas: true, praticas: true } },
      },
      orderBy: { ordem: "asc" },
    })

    return NextResponse.json(cursos)
  } catch {
    return NextResponse.json({ error: "Erro ao buscar cursos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { titulo, descricao, icone, cor, ordem, setorIds } = body

    const curso = await db.curso.create({
      data: {
        titulo,
        descricao,
        icone: icone ?? "BookOpen",
        cor: cor ?? "blue",
        ordem: ordem ?? 0,
        setores: {
          create: (setorIds ?? []).map((setorId: string) => ({ setorId })),
        },
      },
      include: { setores: { include: { setor: true } } },
    })

    return NextResponse.json(curso, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro ao criar curso" }, { status: 400 })
  }
}
