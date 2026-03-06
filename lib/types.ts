export interface PresencaRecord {
  id: string
  nome: string
  setor: "Produção" | "Qualidade" | "Manutenção" | "Logística" | "Adm"
  turno: "Manhã" | "Tarde" | "Noite"
  email: string
  presente: boolean
  dataRegistro: string
}

export interface QuizRecord {
  id: string
  nome: string
  respostas: number[]
  nota: number
  dataRegistro: string
}

export interface PraticasRecord {
  id: string
  nome: string
  criouCanal: boolean
  enviouMensagem: boolean
  subiuArquivo: boolean
  criouBucket: boolean
  criouTarefa: boolean
  dataRegistro: string
}

export interface Modulo {
  id: number
  titulo: string
  descricao: string
  icone: string
}

export interface QuizQuestion {
  id: number
  pergunta: string
  opcoes: string[]
  respostaCorreta: number
}
