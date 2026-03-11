interface PresencaRow {
  id: string
  nome: string
  setor: string
  turno: string
  email: string
  presente: boolean
  dataRegistro: Date | string
}

interface QuizRow {
  id: string
  nome: string
  respostas: unknown
  nota: number
  dataRegistro: Date | string
}

interface PraticasRow {
  id: string
  nome: string
  criouCanal: boolean
  enviouMensagem: boolean
  subiuArquivo: boolean
  criouBucket: boolean
  criouTarefa: boolean
  dataRegistro: Date | string
}

interface ReportData {
  presenca: PresencaRow[]
  quiz: QuizRow[]
  praticas: PraticasRow[]
  geradoEm: string
}

function fmt(d: Date | string): string {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function bar(pct: number, color = "#c0392b"): string {
  return `<div style="background:#e2e8f0;border-radius:99px;height:8px;width:100%;min-width:80px">
    <div style="background:${color};width:${Math.min(pct,100)}%;height:8px;border-radius:99px;transition:width .3s"></div>
  </div>`
}

export default function generateReport(data: ReportData): string {
  // ── Estatísticas ─────────────────────────────────
  const totalPresenca = data.presenca.length
  const presentes = data.presenca.filter((p) => p.presente).length
  const ausentes = totalPresenca - presentes
  const pctPresenca = totalPresenca ? Math.round((presentes / totalPresenca) * 100) : 0

  const totalQuiz = data.quiz.length
  const somaNotas = data.quiz.reduce((a, q) => a + q.nota, 0)
  const mediaNota = totalQuiz ? (somaNotas / totalQuiz).toFixed(1) : "—"
  const aprovados = data.quiz.filter((q) => q.nota >= 7).length
  const reprovados = totalQuiz - aprovados
  const pctAprovacao = totalQuiz ? Math.round((aprovados / totalQuiz) * 100) : 0
  const maiorNota = totalQuiz ? Math.max(...data.quiz.map((q) => q.nota)).toFixed(1) : "—"
  const menorNota = totalQuiz ? Math.min(...data.quiz.map((q) => q.nota)).toFixed(1) : "—"

  const totalPraticas = data.praticas.length
  const praticasCompletas = data.praticas.filter(
    (p) => p.criouCanal && p.enviouMensagem && p.subiuArquivo && p.criouBucket && p.criouTarefa
  ).length
  const pctPraticas = totalPraticas ? Math.round((praticasCompletas / totalPraticas) * 100) : 0

  // Setor com mais participantes
  const setorMap: Record<string, number> = {}
  data.presenca.forEach((p) => { setorMap[p.setor] = (setorMap[p.setor] || 0) + 1 })
  const setorTop = Object.entries(setorMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"

  // ── Rows ─────────────────────────────────────────
  const presencaRows = data.presenca.map((p) => `
    <tr>
      <td><strong>${p.nome}</strong></td>
      <td><span class="badge badge-setor">${p.setor}</span></td>
      <td>${p.turno}</td>
      <td style="font-size:.8rem;color:#64748b">${p.email}</td>
      <td><span class="badge ${p.presente ? "badge-ok" : "badge-no"}">${p.presente ? "✔ Presente" : "✘ Ausente"}</span></td>
      <td style="color:#64748b;font-size:.8rem">${fmt(p.dataRegistro)}</td>
    </tr>`).join("")

  const quizRows = data.quiz
    .sort((a, b) => b.nota - a.nota)
    .map((q, i) => `
    <tr>
      <td style="color:#94a3b8;font-size:.8rem;width:32px">#${i + 1}</td>
      <td><strong>${q.nome}</strong></td>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:1.1rem;font-weight:800;color:${q.nota >= 7 ? "#16a34a" : "#dc2626"};min-width:32px">${q.nota.toFixed(1)}</span>
          ${bar((q.nota / 10) * 100, q.nota >= 7 ? "#16a34a" : "#dc2626")}
        </div>
      </td>
      <td><span class="badge ${q.nota >= 7 ? "badge-ok" : "badge-no"}">${q.nota >= 7 ? "✔ Aprovado" : "✘ Reprovado"}</span></td>
      <td style="color:#64748b;font-size:.8rem">${fmt(q.dataRegistro)}</td>
    </tr>`).join("")

  const praticasRows = data.praticas.map((p) => {
    const atividades = [p.criouCanal, p.enviouMensagem, p.subiuArquivo, p.criouBucket, p.criouTarefa]
    const feitas = atividades.filter(Boolean).length
    const pct = Math.round((feitas / 5) * 100)
    const check = (v: boolean) => `<td style="text-align:center"><span class="${v ? "check-ok" : "check-no"}">${v ? "✔" : "✘"}</span></td>`
    return `<tr>
      <td><strong>${p.nome}</strong></td>
      ${check(p.criouCanal)}
      ${check(p.enviouMensagem)}
      ${check(p.subiuArquivo)}
      ${check(p.criouBucket)}
      ${check(p.criouTarefa)}
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:.8rem;font-weight:700;min-width:28px;color:${pct===100?"#16a34a":pct>=60?"#d97706":"#dc2626"}">${pct}%</span>
          ${bar(pct, pct === 100 ? "#16a34a" : pct >= 60 ? "#d97706" : "#dc2626")}
        </div>
      </td>
      <td style="color:#64748b;font-size:.8rem">${fmt(p.dataRegistro)}</td>
    </tr>`
  }).join("")

  // ── Distribuição de notas ─────────────────────────
  const faixas = [
    { label: "0–4", min: 0, max: 4, color: "#dc2626" },
    { label: "5–6", min: 5, max: 6, color: "#d97706" },
    { label: "7–8", min: 7, max: 8, color: "#2563eb" },
    { label: "9–10", min: 9, max: 10, color: "#16a34a" },
  ]
  const distRows = faixas.map((f) => {
    const count = data.quiz.filter((q) => q.nota >= f.min && q.nota <= f.max).length
    const pct = totalQuiz ? Math.round((count / totalQuiz) * 100) : 0
    return `<tr>
      <td><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${f.color};margin-right:6px"></span>${f.label}</td>
      <td style="text-align:center">${count} aluno${count !== 1 ? "s" : ""}</td>
      <td style="width:200px">${bar(pct, f.color)}</td>
      <td style="text-align:right;color:#64748b">${pct}%</td>
    </tr>`
  }).join("")

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Relatório de Treinamentos – SABO</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',system-ui,sans-serif;background:#f1f5f9;color:#1e293b;padding:2rem;font-size:14px}
    a{color:inherit}

    /* Header */
    .header{background:linear-gradient(135deg,#c0392b 0%,#7b241c 100%);color:#fff;padding:2.5rem 3rem;border-radius:16px;margin-bottom:2rem;display:flex;justify-content:space-between;align-items:center;box-shadow:0 8px 32px rgba(192,57,43,.3)}
    .header-left h1{font-size:1.8rem;font-weight:800;letter-spacing:-1px}
    .header-left p{opacity:.75;margin-top:4px;font-size:.9rem}
    .header-meta{margin-top:1rem;display:flex;gap:1.5rem}
    .header-meta span{font-size:.78rem;opacity:.6;display:flex;align-items:center;gap:4px}
    .header-badge{background:rgba(255,255,255,.15);padding:.5rem 1rem;border-radius:99px;font-size:.8rem;font-weight:600;border:1px solid rgba(255,255,255,.2)}
    .logo-box{width:72px;height:72px;background:rgba(255,255,255,.15);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:2.4rem;border:1px solid rgba(255,255,255,.2)}

    /* KPI grid */
    .kpi{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem}
    .kpi-card{background:#fff;border-radius:12px;padding:1.25rem 1.5rem;border:1px solid #e2e8f0;box-shadow:0 1px 4px rgba(0,0,0,.06);position:relative;overflow:hidden}
    .kpi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--accent,#c0392b)}
    .kpi-num{font-size:2.2rem;font-weight:800;color:var(--accent,#c0392b);line-height:1;letter-spacing:-1px}
    .kpi-label{font-size:.72rem;color:#64748b;text-transform:uppercase;letter-spacing:.8px;margin-top:6px}
    .kpi-sub{font-size:.78rem;color:#94a3b8;margin-top:4px}

    /* Section */
    .section{background:#fff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;margin-bottom:1.5rem;box-shadow:0 1px 4px rgba(0,0,0,.06)}
    .section-header{padding:1rem 1.5rem;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between}
    .section-title{font-size:.95rem;font-weight:700;display:flex;align-items:center;gap:8px}
    .section-meta{font-size:.78rem;color:#94a3b8}

    /* Table */
    table{width:100%;border-collapse:collapse}
    th{background:#f8fafc;color:#475569;font-size:.72rem;text-transform:uppercase;letter-spacing:.6px;padding:.65rem 1.25rem;text-align:left;border-bottom:1px solid #e2e8f0;font-weight:600}
    td{padding:.65rem 1.25rem;border-bottom:1px solid #f8fafc;vertical-align:middle}
    tr:last-child td{border-bottom:none}
    tr:hover td{background:#fafafa}

    /* Badges */
    .badge{display:inline-flex;align-items:center;padding:.25rem .65rem;border-radius:99px;font-size:.75rem;font-weight:600;white-space:nowrap}
    .badge-ok{background:#dcfce7;color:#15803d}
    .badge-no{background:#fee2e2;color:#b91c1c}
    .badge-setor{background:#eff6ff;color:#1d4ed8}
    .check-ok{color:#16a34a;font-size:1rem;font-weight:700}
    .check-no{color:#dc2626;font-size:1rem}
    .empty{text-align:center;color:#94a3b8;padding:3rem;font-size:.85rem}

    /* Insight box */
    .insight{background:linear-gradient(135deg,#fef9ec,#fef3c7);border:1px solid #fde68a;border-radius:10px;padding:1rem 1.25rem;margin:1rem 1.5rem;font-size:.82rem;color:#92400e;display:flex;gap:10px;align-items:flex-start}

    /* Footer */
    .footer{text-align:center;color:#94a3b8;font-size:.78rem;margin-top:2rem;padding-top:1rem;border-top:1px solid #e2e8f0}
    .footer strong{color:#475569}

    @media print{
      body{background:#fff;padding:0}
      .kpi{grid-template-columns:repeat(4,1fr)}
      .section{break-inside:avoid}
    }
  </style>
</head>
<body>

<!-- HEADER -->
<div class="header">
  <div class="header-left">
    <h1>📊 Relatório de Treinamentos</h1>
    <p>SABO Indústria e Comércio de Autopeças S.A.</p>
    <div class="header-meta">
      <span>🗓 Gerado em: ${data.geradoEm}</span>
      <span>👥 ${totalPresenca} participantes</span>
      <span>📋 ${totalQuiz} avaliações</span>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;align-items:flex-end;gap:10px">
    <div class="logo-box">🎓</div>
    <span class="header-badge">Portal de Treinamentos v1.0</span>
  </div>
</div>

<!-- KPIs -->
<div class="kpi">
  <div class="kpi-card" style="--accent:#c0392b">
    <div class="kpi-num">${pctPresenca}%</div>
    <div class="kpi-label">Taxa de presença</div>
    <div class="kpi-sub">${presentes} presentes · ${ausentes} ausentes</div>
  </div>
  <div class="kpi-card" style="--accent:#2563eb">
    <div class="kpi-num">${mediaNota}</div>
    <div class="kpi-label">Média geral no quiz</div>
    <div class="kpi-sub">Maior: ${maiorNota} · Menor: ${menorNota}</div>
  </div>
  <div class="kpi-card" style="--accent:#16a34a">
    <div class="kpi-num">${pctAprovacao}%</div>
    <div class="kpi-label">Taxa de aprovação</div>
    <div class="kpi-sub">${aprovados} aprovados · ${reprovados} reprovados</div>
  </div>
  <div class="kpi-card" style="--accent:#d97706">
    <div class="kpi-num">${pctPraticas}%</div>
    <div class="kpi-label">Práticas completas</div>
    <div class="kpi-sub">${praticasCompletas} de ${totalPraticas} concluídas</div>
  </div>
</div>

<!-- PRESENÇA -->
<div class="section">
  <div class="section-header">
    <div class="section-title">📋 Registro de Presença</div>
    <div class="section-meta">${presentes} de ${totalPresenca} presentes · Setor mais presente: <strong>${setorTop}</strong></div>
  </div>
  ${totalPresenca === 0 ? "" : `<div class="insight">💡 <div><strong>Como interpretar:</strong> Todos os colaboradores que confirmaram presença no treinamento aparecem aqui. A presença é pré-requisito para a certificação.</div></div>`}
  <table>
    <thead><tr><th>Nome</th><th>Setor</th><th>Turno</th><th>E-mail</th><th>Status</th><th>Data/Hora</th></tr></thead>
    <tbody>${presencaRows || `<tr><td colspan="6" class="empty">Nenhum registro de presença encontrado</td></tr>`}</tbody>
  </table>
</div>

<!-- QUIZ -->
<div class="section">
  <div class="section-header">
    <div class="section-title">🧠 Resultados do Quiz</div>
    <div class="section-meta">Mínimo para aprovação: <strong>7,0</strong> · Média da turma: <strong>${mediaNota}</strong></div>
  </div>
  ${totalQuiz === 0 ? "" : `<div class="insight">💡 <div><strong>Critério de aprovação:</strong> Nota mínima 7,0. O quiz avalia conhecimentos sobre Microsoft Teams, canais, arquivos e Planner. Colaboradores abaixo da média devem revisar os módulos de conteúdo.</div></div>`}
  <table>
    <thead><tr><th>#</th><th>Nome</th><th>Nota e Desempenho</th><th>Status</th><th>Data/Hora</th></tr></thead>
    <tbody>${quizRows || `<tr><td colspan="5" class="empty">Nenhuma avaliação registrada</td></tr>`}</tbody>
  </table>
</div>

<!-- DISTRIBUIÇÃO DE NOTAS -->
${totalQuiz > 0 ? `
<div class="section">
  <div class="section-header">
    <div class="section-title">📈 Distribuição de Notas</div>
    <div class="section-meta">Visão geral do desempenho da turma</div>
  </div>
  <table>
    <thead><tr><th>Faixa</th><th>Quantidade</th><th>Distribuição</th><th>%</th></tr></thead>
    <tbody>${distRows}</tbody>
  </table>
</div>` : ""}

<!-- PRÁTICAS -->
<div class="section">
  <div class="section-header">
    <div class="section-title">⚡ Atividades Práticas</div>
    <div class="section-meta">${praticasCompletas} de ${totalPraticas} com 100% das atividades concluídas</div>
  </div>
  ${totalPraticas === 0 ? "" : `<div class="insight">💡 <div><strong>Atividades avaliadas:</strong> Canal (criar canal no Teams) · Mensagem (enviar mensagem) · Arquivo (subir arquivo) · Bucket (criar bucket no Planner) · Tarefa (criar tarefa). Completar todas é necessário para certificação.</div></div>`}
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th style="text-align:center">Canal</th>
        <th style="text-align:center">Mensagem</th>
        <th style="text-align:center">Arquivo</th>
        <th style="text-align:center">Bucket</th>
        <th style="text-align:center">Tarefa</th>
        <th>Progresso</th>
        <th>Data/Hora</th>
      </tr>
    </thead>
    <tbody>${praticasRows || `<tr><td colspan="8" class="empty">Nenhuma atividade prática registrada</td></tr>`}</tbody>
  </table>
</div>

<!-- FOOTER -->
<div class="footer">
  <p><strong>SABO Indústria e Comércio de Autopeças S.A.</strong> – Portal de Treinamentos Microsoft Teams</p>
  <p style="margin-top:4px">Documento gerado automaticamente em ${data.geradoEm} · Uso interno</p>
</div>

</body>
</html>`
}