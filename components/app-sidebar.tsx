"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Home, BookOpen, ClipboardCheck, HelpCircle,
  CheckSquare, FileText, ShieldCheck, X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Inicio", icon: Home, adminOnly: false },
  { href: "/modulos", label: "Modulos", icon: BookOpen, adminOnly: false },
  { href: "/presenca", label: "Presenca", icon: ClipboardCheck, adminOnly: false },
  { href: "/quiz", label: "Quiz", icon: HelpCircle, adminOnly: false },
  { href: "/praticas", label: "Praticas", icon: CheckSquare, adminOnly: false },
  { href: "/relatorios", label: "Relatorios", icon: FileText, adminOnly: true },
  { href: "/admin", label: "Admin", icon: ShieldCheck, adminOnly: true },
]

interface AppSidebarProps {
  open: boolean
  onClose: () => void
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = (session?.user as any)?.role

  const visibleItems = navItems.filter((item) => {
    if (item.adminOnly) return role === "admin"
    return true
  })

  return (
    <>
      {/* Backdrop — mobile + desktop quando aberto */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar drawer */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-sidebar-border bg-sidebar shadow-2xl",
          "transition-transform duration-200 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header da sidebar com botão fechar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
          <span className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            Menu
          </span>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto" aria-label="Menu principal">
          {visibleItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-sidebar-foreground/50")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-sidebar-foreground/30 font-mono">
            SABO Treinamentos v1.0
          </p>
        </div>
      </aside>
    </>
  )
}