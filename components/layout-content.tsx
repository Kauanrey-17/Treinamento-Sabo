"use client"

import { usePathname } from "next/navigation"
import { AppShell } from "@/components/app-shell"

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname.startsWith("/login")) {
    return <div className="min-h-screen">{children}</div>
  }

  return <AppShell>{children}</AppShell>
}