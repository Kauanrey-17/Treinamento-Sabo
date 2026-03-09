"use client"

import Link from "next/link"
import { Menu, GraduationCap, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSession, signOut } from "next-auth/react"

interface HeaderProps {
  onToggleSidebar?: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { data: session, status } = useSession()

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

        {status === "authenticated" && session?.user ? (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-sidebar-foreground/80 text-sm">
              <User className="h-4 w-4" />
              <span>{session.user.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sair
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              Entrar
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}