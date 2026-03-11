export const runtime = "nodejs"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const record = await db.presenca.create({
      data: {
        id: crypto.randomUUID(),
        nome: body.nome,
        setor: body.setor,
        turno: body.turno,
        email: body.email,
        presente: body.presente ?? true,
      },
    })
    return NextResponse.json(record, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro ao registrar presença." }, { status: 400 })
  }
}

export async function GET() {
  const data = await db.presenca.findMany({ orderBy: { dataRegistro: "desc" } })
  return NextResponse.json(data)
}