import { NextResponse } from "next/server"
import { addPresenca, listPresenca } from "@/lib/db"
import type { PresencaRecord } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const record: PresencaRecord = {
      id: crypto.randomUUID(),
      nome: body.nome,
      setor: body.setor,
      turno: body.turno,
      email: body.email,
      presente: body.presente ?? true,
      dataRegistro: new Date().toISOString(),
    }
    const saved = addPresenca(record)
    return NextResponse.json(saved, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Erro ao registrar presenca" },
      { status: 400 }
    )
  }
}

export async function GET() {
  return NextResponse.json(listPresenca())
}
