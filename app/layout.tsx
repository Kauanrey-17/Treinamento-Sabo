import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AppShell } from "@/components/app-shell"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"
import { NextAuthProvider } from "@/components/session-provider"  // ← adicione

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "SABO – Portal de Treinamentos",
  description:
    "Plataforma de treinamentos corporativos da SABO.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#c0392b" },
    { media: "(prefers-color-scheme: dark)", color: "#1a0a08" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <NextAuthProvider>  {/* ← adicione */}
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AppShell>{children}</AppShell>
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </NextAuthProvider>  {/* ← adicione */}
        <Analytics />
      </body>
    </html>
  )
}
