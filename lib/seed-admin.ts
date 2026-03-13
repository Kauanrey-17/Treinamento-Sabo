import { config } from "dotenv"
config()
 
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"
 
const db = new PrismaClient()
 
async function main() {
  console.log("🌱 Iniciando seed...")
 
  // ── SETORES ──────────────────────────────────
  const setoresNomes = [
    "Produção", "Qualidade", "Manutenção", "Logística",
    "Adm", "TI", "Compras", "Comércio Exterior", "Portaria"
  ]
 
  const setores: Record<string, any> = {}
  for (const nome of setoresNomes) {
    const setor = await db.setor.upsert({
      where: { nome },
      update: {},
      create: { nome },
    })
    setores[nome] = setor
    console.log(`✅ Setor: ${nome}`)
  }
 
  // ── ADMIN ─────────────────────────────────────
  const senhaAdmin = await hash("admin123", 10)
  await db.admin.upsert({
    where: { email: "admin@sabo.com.br" },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@sabo.com.br",
      senha: senhaAdmin,
    },
  })
  console.log("✅ Admin: admin@sabo.com.br / admin123")
 
  // ── FUNCIONÁRIO DE TESTE ──────────────────────
  const senhaFunc = await hash("123456", 10)
  const funcTeste = await db.funcionario.upsert({
    where: { email: "teste@sabo.com.br" },
    update: {},
    create: {
      nome: "Funcionário Teste",
      email: "teste@sabo.com.br",
      senha: senhaFunc,
      setorId: setores["Produção"].id,
    },
  })
  console.log("✅ Funcionário: teste@sabo.com.br / 123456")
 
  // ── CURSO TEAMS (todos os setores) ────────────
  const cursoTeams = await db.curso.upsert({
    where: { id: "curso-teams-001" },
    update: {},
    create: {
      id: "curso-teams-001",
      titulo: "Microsoft Teams",
      descricao: "Aprenda a usar o Teams para comunicação e colaboração corporativa.",
      icone: "Monitor",
      cor: "blue",
      ordem: 1,
    },
  })
 
  // Vincula Teams a todos os setores
  for (const setor of Object.values(setores)) {
    await db.cursoSetor.upsert({
      where: { cursoId_setorId: { cursoId: cursoTeams.id, setorId: setor.id } },
      update: {},
      create: { cursoId: cursoTeams.id, setorId: setor.id },
    })
  }
  console.log("✅ Curso: Microsoft Teams (todos os setores)")
 
  // ── MÓDULOS DO TEAMS ──────────────────────────
  const modulosTeams = [
    {
      id: "mod-teams-01",
      titulo: "Introdução ao Teams",
      ordem: 1,
      conteudo: `# Introdução ao Microsoft Teams
 
## O que é o Microsoft Teams?
O Microsoft Teams é uma plataforma de comunicação e colaboração corporativa que integra chat, videoconferência, armazenamento de arquivos e integração de aplicativos.
 
## Interface Principal
A interface do Teams é dividida em:
- **Barra lateral** — Atividade, Chat, Equipes, Calendário, Chamadas, Arquivos
- **Painel central** — Conteúdo da seção selecionada
- **Painel direito** — Detalhes e informações adicionais
 
## Como fazer login
1. Abra o aplicativo Teams ou acesse teams.microsoft.com
2. Insira seu e-mail corporativo (@sabo.com.br)
3. Digite sua senha
4. Clique em "Entrar"
 
## Configurações básicas
- **Status**: Clique na sua foto de perfil para alterar entre Disponível, Ocupado, Não perturbe
- **Notificações**: Acesse Configurações > Notificações para personalizar alertas
- **Perfil**: Mantenha sua foto e informações atualizadas
 
## Dica profissional
Fixe os canais que você usa com mais frequência clicando nos três pontinhos (...) ao lado do nome e selecionando "Fixar".`,
    },
    {
      id: "mod-teams-02",
      titulo: "Canais & Equipes",
      ordem: 2,
      conteudo: `# Canais e Equipes no Teams
 
## Diferença entre Equipes e Canais
- **Equipe** — grupo de pessoas que trabalham juntas (ex.: Equipe de Qualidade)
- **Canal** — subcategoria dentro de uma equipe por tema (ex.: Projetos, Geral, Avisos)
 
## Criando uma Equipe
1. Clique em "Equipes" na barra lateral
2. Clique em "Ingressar ou criar uma equipe"
3. Selecione "Criar uma equipe"
4. Escolha o tipo: Privada ou Pública
5. Dê um nome e descrição
 
## Criando Canais
1. Dentro da equipe, clique nos três pontinhos (...)
2. Selecione "Adicionar canal"
3. Nomeie o canal e defina o tipo (Padrão ou Privado)
 
## Boas práticas de mensagens
- Use **@menções** para notificar pessoas específicas: @João
- Use **@canal** para notificar todos do canal
- Responda em **threads** para manter conversas organizadas
- Use formatação: **negrito**, *itálico*, listas
 
## Dica profissional
Canais privados são visíveis apenas para os membros convidados — ideal para projetos sensíveis.`,
    },
    {
      id: "mod-teams-03",
      titulo: "Arquivos & Ferramentas",
      ordem: 3,
      conteudo: `# Arquivos e Ferramentas no Teams
 
## Compartilhando Arquivos
- **Via canal**: Acesse a aba "Arquivos" dentro do canal e faça upload
- **Via chat**: Clique no ícone de anexo para enviar arquivos diretamente
- **Drag & drop**: Arraste arquivos diretamente para a conversa
 
## Integração com SharePoint e OneDrive
Todos os arquivos de canais ficam salvos automaticamente no **SharePoint** da equipe. Arquivos de chats privados ficam no **OneDrive** pessoal.
 
## Coedição em tempo real
1. Abra um documento Word, Excel ou PowerPoint pelo Teams
2. Clique em "Editar"
3. Múltiplas pessoas podem editar simultaneamente
4. As alterações são salvas automaticamente
 
## Organização de arquivos
- Crie pastas dentro dos canais para organizar por projeto ou data
- Use nomes descritivos: "Relatório_Qualidade_Março2026"
- Evite duplicar arquivos — use links compartilhados
 
## Dica profissional
Ao arrastar um arquivo para a conversa, ele vai para o chat. Para organizar melhor, use sempre a aba "Arquivos" do canal.`,
    },
    {
      id: "mod-teams-04",
      titulo: "Planner & Kanban",
      ordem: 4,
      conteudo: `# Planner e Kanban no Teams
 
## O que é o Planner?
O Microsoft Planner é uma ferramenta de gerenciamento de tarefas integrada ao Teams que usa o método Kanban para organizar o trabalho.
 
## Acessando o Planner
1. Dentro de um canal, clique em "+" para adicionar uma aba
2. Selecione "Planner"
3. Crie um novo plano ou conecte um existente
 
## Criando Buckets (colunas)
Buckets são colunas que representam etapas do trabalho:
- "A Fazer" → "Em Andamento" → "Concluído"
- Ou por categoria: "Urgente", "Esta Semana", "Backlog"
 
## Gerenciando Tarefas
Cada tarefa pode ter:
- **Título** e **Descrição** detalhada
- **Responsável** — quem vai executar
- **Prazo** — data limite
- **Checklist** — subtarefas
- **Etiquetas coloridas** — para priorização visual
 
## Visualizações
- **Quadro** — visão Kanban tradicional
- **Gráficos** — métricas de progresso
- **Calendário** — tarefas por data
 
## Dica profissional
Use etiquetas coloridas: Vermelho = urgente, Amarelo = importante, Verde = rotina. Isso facilita a priorização visual da equipe.`,
    },
  ]
 
  for (const mod of modulosTeams) {
    await db.modulo.upsert({
      where: { id: mod.id },
      update: { titulo: mod.titulo, conteudo: mod.conteudo, ordem: mod.ordem },
      create: { ...mod, cursoId: cursoTeams.id },
    })
  }
  console.log("✅ Módulos do Teams criados")
 
  // ── QUIZ DO TEAMS ─────────────────────────────
  const perguntasTeams = [
    {
      id: "quiz-teams-01",
      pergunta: "Qual menu do Teams permite visualizar todas as equipes das quais você faz parte?",
      opcoes: ["Atividade", "Chat", "Equipes", "Calendário"],
      respostaCorreta: 2,
      ordem: 1,
    },
    {
      id: "quiz-teams-02",
      pergunta: "Qual é a principal vantagem de usar canais no Teams?",
      opcoes: ["Enviar e-mails mais rápido", "Organizar conversas por tema ou projeto", "Agendar reuniões automaticamente", "Bloquear notificações"],
      respostaCorreta: 1,
      ordem: 2,
    },
    {
      id: "quiz-teams-03",
      pergunta: "Onde os arquivos enviados em um canal ficam armazenados automaticamente?",
      opcoes: ["Google Drive", "OneDrive pessoal", "SharePoint da equipe", "Área de trabalho local"],
      respostaCorreta: 2,
      ordem: 3,
    },
    {
      id: "quiz-teams-04",
      pergunta: "No Planner, o que é um 'bucket'?",
      opcoes: ["Um tipo de reunião", "Uma categoria para agrupar tarefas", "Um arquivo compartilhado", "Um canal privado"],
      respostaCorreta: 1,
      ordem: 4,
    },
    {
      id: "quiz-teams-05",
      pergunta: "Qual recurso do Teams permite editar um documento Word simultaneamente com colegas?",
      opcoes: ["Compartilhamento de tela", "Coedição em tempo real", "Chat privado", "Planner"],
      respostaCorreta: 1,
      ordem: 5,
    },
  ]
 
  for (const p of perguntasTeams) {
    await db.quizPergunta.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, cursoId: cursoTeams.id },
    })
  }
  console.log("✅ Quiz do Teams criado")
 
  // ── PRÁTICAS DO TEAMS ─────────────────────────
  const praticasTeams = [
    { id: "prat-teams-01", titulo: "Criar uma equipe de teste", descricao: "Crie uma equipe com o nome do seu setor no Teams", ordem: 1 },
    { id: "prat-teams-02", titulo: "Enviar mensagem com @menção", descricao: "Envie uma mensagem num canal usando @menção para um colega", ordem: 2 },
    { id: "prat-teams-03", titulo: "Fazer upload de arquivo", descricao: "Faça upload de um documento na aba Arquivos de um canal", ordem: 3 },
    { id: "prat-teams-04", titulo: "Criar tarefa no Planner", descricao: "Crie um plano com pelo menos 2 buckets e 2 tarefas", ordem: 4 },
    { id: "prat-teams-05", titulo: "Criar bucket no Planner", descricao: "Organize seu plano criando buckets: A Fazer, Em Andamento, Concluído", ordem: 5 },
  ]
 
  for (const p of praticasTeams) {
    await db.praticaItem.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, cursoId: cursoTeams.id },
    })
  }
  console.log("✅ Práticas do Teams criadas")
 
  // ── CURSO TI (apenas TI) ──────────────────────
  const cursoTI = await db.curso.upsert({
    where: { id: "curso-ti-001" },
    update: {},
    create: {
      id: "curso-ti-001",
      titulo: "Segurança e Antivírus",
      descricao: "Boas práticas de segurança digital e uso do antivírus corporativo.",
      icone: "Shield",
      cor: "red",
      ordem: 2,
    },
  })
 
  await db.cursoSetor.upsert({
    where: { cursoId_setorId: { cursoId: cursoTI.id, setorId: setores["TI"].id } },
    update: {},
    create: { cursoId: cursoTI.id, setorId: setores["TI"].id },
  })
  console.log("✅ Curso: Segurança e Antivírus (TI)")
 
  await db.modulo.upsert({
    where: { id: "mod-ti-01" },
    update: {},
    create: {
      id: "mod-ti-01",
      cursoId: cursoTI.id,
      titulo: "Boas Práticas de Segurança",
      ordem: 1,
      conteudo: `# Segurança Digital na SABO
 
## Por que segurança digital importa?
Ameaças cibernéticas custam bilhões às empresas. A primeira linha de defesa é o comportamento dos colaboradores.
 
## Boas práticas essenciais
- **Senhas fortes**: mínimo 12 caracteres, misture letras, números e símbolos
- **Nunca compartilhe** sua senha com ninguém, nem com a TI
- **Bloqueie o computador** sempre que se ausentar (Win+L)
- **Desconfie de e-mails suspeitos** — phishing é a principal ameaça
 
## Antivírus corporativo
O antivírus da SABO é gerenciado centralmente pela TI. Nunca desative-o.
- Atualizações automáticas são aplicadas toda noite
- Em caso de alerta, não feche — acione a TI imediatamente
- Não instale softwares sem aprovação da TI
 
## Incidentes de segurança
Ao identificar qualquer comportamento suspeito:
1. Desconecte o equipamento da rede (cabo ou Wi-Fi)
2. Acione a TI imediatamente pelo Teams ou ramal
3. Não tente resolver sozinho`,
    },
  })
 
  console.log("\n🎉 Seed concluído com sucesso!")
  console.log("─────────────────────────────────")
  console.log("📧 Admin:       admin@sabo.com.br / admin123")
  console.log("📧 Funcionário: teste@sabo.com.br / 123456")
  console.log("─────────────────────────────────")
}
 
main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())