"use client"

import Link from "next/link"
import { Menu, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  onToggleSidebar?: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-sidebar-border bg-sidebar px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
        onClick={onToggleSidebar}
        aria-label="Abrir menu lateral"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
            SABO
          </span>
          <span className="text-xs text-sidebar-foreground/70">
            Treinamentos
          </span>
        </div>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Link href="/login">
          <Button
            variant="ghost"
            size="sm"
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            Entrar
          </Button>
        </Link>
      </div>
    </header>
  )
}
