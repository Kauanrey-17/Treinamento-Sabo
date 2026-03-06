import { config } from "dotenv"
config()

import { db } from "./db"
import { hash } from "bcryptjs"

async function main() {
  const senhaHash = await hash("admin123", 10)

  await db.admin.upsert({
    where: { email: "admin@sabo.com.br" },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@sabo.com.br",
      senha: senhaHash,
    },
  })

  console.log("✅ Admin criado com sucesso!")
  console.log("📧 Email: admin@sabo.com.br")
  console.log("🔑 Senha: admin123")
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())