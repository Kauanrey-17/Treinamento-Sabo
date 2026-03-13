"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { AppSidebar } from "@/components/app-sidebar"
import { Footer } from "@/components/footer"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <AppSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex flex-1 flex-col lg:pl-64">
          <main className="flex-1 p-4 lg:p-6">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  )
}