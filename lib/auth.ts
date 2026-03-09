import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "./db"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        senha: {},
        tipo: {},
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const senha = credentials?.senha as string
        const tipo = credentials?.tipo as string

        if (!email || !senha) return null

        if (tipo === "admin") {
          const admin = await db.admin.findUnique({ where: { email } })
          if (!admin) return null
          const senhaOk = await compare(senha, admin.senha)
          if (!senhaOk) return null
          return { id: admin.id, name: admin.nome, email: admin.email, role: "admin" }
        }

        if (tipo === "funcionario") {
          if (!email.endsWith("@sabo.com.br")) return null
          const func = await db.funcionario.findUnique({ where: { email } })
          if (!func || !func.ativo) return null
          const senhaOk = await compare(senha, (func as any).senha)
          if (!senhaOk) return null
          return { id: func.id, name: func.nome, email: func.email, role: "funcionario" }
        }

        return null
      },
    }),
  ],
})