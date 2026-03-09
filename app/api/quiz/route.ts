import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const record = await db.praticas.create({
      data: {
        id: crypto.randomUUID(),
        nome: body.nome,
        criouCanal: body.criouCanal ?? false,
        enviouMensagem: body.enviouMensagem ?? false,
        subiuArquivo: body.subiuArquivo ?? false,
        criouBucket: body.criouBucket ?? false,
        criouTarefa: body.criouTarefa ?? false,
      },
    })
    return NextResponse.json(record, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro ao registrar práticas." }, { status: 400 })
  }
}

export async function GET() {
  const data = await db.praticas.findMany({ orderBy: { dataRegistro: "desc" } })
  return NextResponse.json(data)
}