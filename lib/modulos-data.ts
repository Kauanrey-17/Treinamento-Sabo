import type { Modulo, QuizQuestion } from "./types"

export const modulos: Modulo[] = [
  {
    id: 1,
    titulo: "Introdução ao Teams",
    descricao:
      "Conheça a interface, navegação e recursos básicos do Microsoft Teams.",
    icone: "Monitor",
  },
  {
    id: 2,
    titulo: "Teams com Canais & Equipes",
    descricao:
      "Aprenda a criar equipes, organizar canais e colaborar de forma eficiente.",
    icone: "Users",
  },
  {
    id: 3,
    titulo: "Ferramentas & Importação de Arquivos",
    descricao:
      "Domine o compartilhamento de arquivos, integração com SharePoint e OneDrive.",
    icone: "FolderOpen",
  },
  {
    id: 4,
    titulo: "Planner & Kanban",
    descricao:
      "Organize tarefas com o Planner, crie buckets e acompanhe o progresso no Kanban.",
    icone: "LayoutDashboard",
  },
]

export const modulosConteudo: Record<
  number,
  {
    objetivos: string[]
    topicos: string[]
    atividades: string[]
    dica: string
  }
> = {
  1: {
    objetivos: [
      "Entender o que é o Microsoft Teams e para que serve",
      "Navegar pela interface principal com confiança",
      "Identificar os menus: Atividade, Chat, Equipes, Calendário e Arquivos",
    ],
    topicos: [
      "Visão geral da interface do Teams (desktop e mobile)",
      "Como fazer login com sua conta corporativa",
      "Barra lateral: Atividade, Chat, Equipes, Calendário, Chamadas, Arquivos",
      "Configurações básicas: notificações, status e perfil",
    ],
    atividades: [
      "Fazer login na sua conta Teams corporativa",
      "Alterar seu status para 'Disponível'",
      "Navegar por todos os menus da barra lateral",
    ],
    dica: "Fixe os canais que você usa com mais frequência clicando nos três pontinhos (...) ao lado do nome do canal e selecionando 'Fixar'.",
  },
  2: {
    objetivos: [
      "Criar e configurar uma equipe no Teams",
      "Organizar o trabalho em canais temáticos",
      "Enviar mensagens, marcar colegas e usar @menções",
    ],
    topicos: [
      "Diferença entre Equipes e Canais",
      "Como criar uma equipe e adicionar membros",
      "Canais padrão vs. canais privados",
      "Postagens, respostas em thread e @menções",
      "Uso de emojis, GIFs e formatação em mensagens",
    ],
    atividades: [
      "Criar uma equipe de teste com o nome do seu setor",
      "Adicionar pelo menos 2 canais (ex.: 'Geral' e 'Projetos')",
      "Enviar uma mensagem com @menção para um colega",
    ],
    dica: "Use threads (respostas) para manter as conversas organizadas. Isso evita que mensagens se percam no canal principal.",
  },
  3: {
    objetivos: [
      "Compartilhar arquivos dentro de canais e chats",
      "Entender a integração do Teams com SharePoint e OneDrive",
      "Editar documentos colaborativamente em tempo real",
    ],
    topicos: [
      "Aba 'Arquivos' dentro de cada canal",
      "Upload de arquivos via drag-and-drop",
      "Coedição em Word, Excel e PowerPoint diretamente no Teams",
      "Sincronização com SharePoint e OneDrive",
      "Permissões de acesso a arquivos",
    ],
    atividades: [
      "Fazer upload de um documento de teste no canal",
      "Abrir e editar o documento diretamente no Teams",
      "Verificar o arquivo no SharePoint pelo navegador",
    ],
    dica: "Ao arrastar um arquivo para a conversa ele vai para o chat. Para organizar melhor, use a aba 'Arquivos' do canal.",
  },
  4: {
    objetivos: [
      "Criar e organizar planos no Microsoft Planner",
      "Usar buckets para categorizar tarefas",
      "Acompanhar o progresso das tarefas no quadro Kanban",
    ],
    topicos: [
      "O que é o Planner e como acessá-lo pelo Teams",
      "Criando um plano e adicionando ao canal",
      "Buckets: agrupando tarefas por categoria ou fase",
      "Criando tarefas: título, atribuição, prazo e checklist",
      "Visualizações: Quadro (Kanban), Gráficos e Calendário",
    ],
    atividades: [
      "Criar um plano vinculado à sua equipe de teste",
      "Adicionar 3 buckets: 'A fazer', 'Em andamento' e 'Concluído'",
      "Criar pelo menos 2 tarefas com prazo e atribuí-las",
    ],
    dica: "Use etiquetas coloridas nas tarefas para priorizar visualmente. Vermelho = urgente, amarelo = importante, verde = rotina.",
  },
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    pergunta:
      "Qual menu do Teams permite visualizar todas as equipes das quais você faz parte?",
    opcoes: ["Atividade", "Chat", "Equipes", "Calendário"],
    respostaCorreta: 2,
  },
  {
    id: 2,
    pergunta:
      "Qual é a principal vantagem de usar canais no Teams?",
    opcoes: [
      "Enviar e-mails mais rápido",
      "Organizar conversas por tema ou projeto",
      "Agendar reuniões automaticamente",
      "Bloquear notificações",
    ],
    respostaCorreta: 1,
  },
  {
    id: 3,
    pergunta:
      "Onde os arquivos enviados em um canal ficam armazenados automaticamente?",
    opcoes: ["Google Drive", "OneDrive pessoal", "SharePoint da equipe", "Área de trabalho local"],
    respostaCorreta: 2,
  },
  {
    id: 4,
    pergunta:
      "No Planner, o que é um 'bucket'?",
    opcoes: [
      "Um tipo de reunião",
      "Uma categoria para agrupar tarefas",
      "Um arquivo compartilhado",
      "Um canal privado",
    ],
    respostaCorreta: 1,
  },
  {
    id: 5,
    pergunta:
      "Qual recurso do Teams permite editar um documento Word simultaneamente com colegas?",
    opcoes: [
      "Compartilhamento de tela",
      "Coedição em tempo real",
      "Chat privado",
      "Planner",
    ],
    respostaCorreta: 1,
  },
]
