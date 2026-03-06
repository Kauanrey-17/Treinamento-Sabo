import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hash } from "bcryptjs"

export async function GET() {
  const funcionarios = await db.funcionario.findMany({
    orderBy: { criadoEm: "desc" },
    select: { id: true, nome: true, email: true, setor: true, ativo: true, criadoEm: true },
  })
  return NextResponse.json(funcionarios)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const existing = await db.funcionario.findUnique({ where: { email: body.email } })
    if (existing) return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 400 })
    const senhaHash = await hash(body.senha, 10)
    const funcionario = await db.funcionario.create({
      data: { nome: body.nome, email: body.email, senha: senhaHash, setor: body.setor },
      select: { id: true, nome: true, email: true, setor: true, ativo: true, criadoEm: true },
    })
    return NextResponse.json(funcionario, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro ao cadastrar funcionário." }, { status: 400 })
  }
}