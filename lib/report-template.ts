import type { PresencaRecord, QuizRecord, PraticasRecord } from "./types"

interface ReportData {
  presenca: PresencaRecord[]
  quiz: QuizRecord[]
  praticas: PraticasRecord[]
  geradoEm: string
}

export default function generateReport(data: ReportData): string {
  const presencaRows = data.presenca
    .map(
      (p) =>
        `<tr>
          <td>${p.nome}</td>
          <td>${p.setor}</td>
          <td>${p.turno}</td>
          <td>${p.email}</td>
          <td>${p.presente ? "Sim" : "Não"}</td>
          <td>${p.dataRegistro}</td>
        </tr>`
    )
    .join("")

  const quizRows = data.quiz
    .map(
      (q) =>
        `<tr>
          <td>${q.nome}</td>
          <td>${q.nota.toFixed(1)}</td>
          <td>${q.dataRegistro}</td>
        </tr>`
    )
    .join("")

  const praticasRows = data.praticas
    .map(
      (p) =>
        `<tr>
          <td>${p.nome}</td>
          <td>${p.criouCanal ? "Sim" : "Não"}</td>
          <td>${p.enviouMensagem ? "Sim" : "Não"}</td>
          <td>${p.subiuArquivo ? "Sim" : "Não"}</td>
          <td>${p.criouBucket ? "Sim" : "Não"}</td>
          <td>${p.criouTarefa ? "Sim" : "Não"}</td>
          <td>${p.dataRegistro}</td>
        </tr>`
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Relatório de Treinamentos SABO</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; padding: 2rem; color: #1e293b; }
    h1 { color: #c0392b; border-bottom: 2px solid #c0392b; padding-bottom: .5rem; }
    h2 { color: #334155; margin-top: 2rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { border: 1px solid #cbd5e1; padding: .5rem .75rem; text-align: left; }
    th { background: #c0392b; color: #fff; }
    tr:nth-child(even) { background: #f1f5f9; }
    .footer { margin-top: 2rem; font-size: .85rem; color: #64748b; }
  </style>
</head>
<body>
  <h1>Relatório de Treinamentos SABO</h1>
  <p>Gerado em: ${data.geradoEm}</p>

  <h2>Presença</h2>
  <table>
    <thead><tr><th>Nome</th><th>Setor</th><th>Turno</th><th>Email</th><th>Presente</th><th>Data</th></tr></thead>
    <tbody>${presencaRows || "<tr><td colspan='6'>Nenhum registro</td></tr>"}</tbody>
  </table>

  <h2>Quiz</h2>
  <table>
    <thead><tr><th>Nome</th><th>Nota</th><th>Data</th></tr></thead>
    <tbody>${quizRows || "<tr><td colspan='3'>Nenhum registro</td></tr>"}</tbody>
  </table>

  <h2>Práticas</h2>
  <table>
    <thead><tr><th>Nome</th><th>Canal</th><th>Mensagem</th><th>Arquivo</th><th>Bucket</th><th>Tarefa</th><th>Data</th></tr></thead>
    <tbody>${praticasRows || "<tr><td colspan='7'>Nenhum registro</td></tr>"}</tbody>
  </table>

  <div class="footer">
    <p>SABÓ Indústria e Comércio de Autopeças S.A. – Portal de Treinamento</p>
  </div>
</body>
</html>`
}
