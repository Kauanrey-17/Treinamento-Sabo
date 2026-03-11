export const runtime = "nodejs"
import { NextResponse } from "next/server"
import { listPresenca, listQuiz, listPraticas } from "@/lib/db"
import generateReport from "@/lib/report-template"

export async function GET() {
  const html = generateReport({
    presenca: listPresenca(),
    quiz: listQuiz(),
    praticas: listPraticas(),
    geradoEm: new Date().toLocaleString("pt-BR"),
  })

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
