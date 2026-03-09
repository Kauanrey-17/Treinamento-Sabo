import { NextResponse } from "next/server"
import { addPraticas, listPraticas } from "@/lib/db"
import type { PraticasRecord } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const record: PraticasRecord = {
      id: crypto.randomUUID(),
      nome: body.nome,
      criouCanal: body.criouCanal ?? false,
      enviouMensagem: body.enviouMensagem ?? false,
      subiuArquivo: body.subiuArquivo ?? false,
      criouBucket: body.criouBucket ?? false,
      criouTarefa: body.criouTarefa ?? false,
      dataRegistro: new Date().toISOString(),
    }
    const saved = await addPraticas(record) // ✅ await adicionado
    return NextResponse.json(saved, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Erro ao registrar praticas" },
      { status: 400 }
    )
  }
}

export async function GET() {
  return NextResponse.json(await listPraticas()) // ✅ await adicionado
}