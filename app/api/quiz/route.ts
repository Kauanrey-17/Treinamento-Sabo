import { NextResponse } from "next/server"
import { addQuiz, listQuiz } from "@/lib/db"
import type { QuizRecord } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const record: QuizRecord = {
      id: crypto.randomUUID(),
      nome: body.nome,
      respostas: body.respostas,
      nota: body.nota,
      dataRegistro: new Date().toISOString(),
    }
    const saved = addQuiz(record)
    return NextResponse.json(saved, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Erro ao registrar quiz" },
      { status: 400 }
    )
  }
}

export async function GET() {
  return NextResponse.json(listQuiz())
}
