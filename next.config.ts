import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Garante que o Prisma nunca seja bundled no Edge Runtime
  serverExternalPackages: ["@prisma/client", "prisma", "bcryptjs"],

  experimental: {
    // Força o middleware a rodar sem dependências Node.js
    instrumentationHook: false,
  },
}

export default nextConfig