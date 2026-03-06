import { PrismaClient } from '@prisma/client'
import type { PresencaRecord, QuizRecord, PraticasRecord } from './types'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// PRESENÇA
export async function addPresenca(data: PresencaRecord) {
  return await db.presenca.create({
    data: {
      id: data.id,
      nome: data.nome,
      setor: data.setor,
      turno: data.turno,
      email: data.email,
      presente: data.presente,
      dataRegistro: new Date(data.dataRegistro),
    },
  })
}

export async function listPresenca() {
  return await db.presenca.findMany({
    orderBy: { dataRegistro: 'desc' },
  })
}

// QUIZ
export async function addQuiz(data: QuizRecord) {
  return await db.quiz.create({
    data: {
      id: data.id,
      nome: data.nome,
      respostas: data.respostas,
      nota: data.nota,
      dataRegistro: new Date(data.dataRegistro),
    },
  })
}

export async function listQuiz() {
  return await db.quiz.findMany({
    orderBy: { dataRegistro: 'desc' },
  })
}

// PRÁTICAS
export async function addPraticas(data: PraticasRecord) {
  return await db.praticas.create({
    data: {
      id: data.id,
      nome: data.nome,
      criouCanal: data.criouCanal,
      enviouMensagem: data.enviouMensagem,
      subiuArquivo: data.subiuArquivo,
      criouBucket: data.criouBucket,
      criouTarefa: data.criouTarefa,
      dataRegistro: new Date(data.dataRegistro),
    },
  })
}

export async function listPraticas() {
  return await db.praticas.findMany({
    orderBy: { dataRegistro: 'desc' },
  })
}