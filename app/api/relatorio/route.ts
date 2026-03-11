export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { listPresenca, listQuiz, listPraticas } from "@/lib/db"
import generateReport from "@/lib/report-template"

export async function GET() {
  try {
    const [presencaRaw, quizRaw, praticasRaw] = await Promise.all([
      listPresenca(),
      listQuiz(),
      listPraticas(),
    ])

    const presenca = presencaRaw.map((p) => ({
      id: p.id,
      nome: p.nome,
      setor: p.setor,
      turno: p.turno,
      email: p.email,
      presente: p.presente,
      dataRegistro: p.dataRegistro,
    }))

    const quiz = quizRaw.map((q) => ({
      id: q.id,
      nome: q.nome,
      respostas: q.respostas,
      nota: q.nota,
      dataRegistro: q.dataRegistro,
    }))

    const praticas = praticasRaw.map((p) => ({
      id: p.id,
      nome: p.nome,
      criouCanal: p.criouCanal,
      enviouMensagem: p.enviouMensagem,
      subiuArquivo: p.subiuArquivo,
      criouBucket: p.criouBucket,
      criouTarefa: p.criouTarefa,
      dataRegistro: p.dataRegistro,
    }))

    const html = generateReport({
      presenca,
      quiz,
      praticas,
      geradoEm: new Date().toLocaleString("pt-BR"),
    })

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  } catch (err) {
    console.error("Erro ao gerar relatório:", err)
    return NextResponse.json({ error: "Erro ao gerar relatório." }, { status: 500 })
  }
}