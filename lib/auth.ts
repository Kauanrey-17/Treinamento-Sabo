import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "./db"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
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
          return {
            id: admin.id,
            name: admin.nome,
            email: admin.email,
            role: "admin",
          }
        }
 
        if (tipo === "funcionario") {
          if (!email.endsWith("@sabo.com.br")) return null
          const func = await db.funcionario.findUnique({
            where: { email },
            include: { setor: true },
          })
          if (!func || !func.ativo) return null
          const senhaOk = await compare(senha, func.senha)
          if (!senhaOk) return null
          return {
            id: func.id,
            name: func.nome,
            email: func.email,
            role: "funcionario",
            setorId: func.setorId,
            setor: func.setor?.nome,
          }
        }
 
        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.setorId = (user as any).setorId
        token.setor = (user as any).setor
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
        ;(session.user as any).setorId = token.setorId
        ;(session.user as any).setor = token.setor
      }
      return session
    },
  },
})