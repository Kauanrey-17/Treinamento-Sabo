"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Home,
  BookOpen,
  ClipboardCheck,
  HelpCircle,
  CheckSquare,
  FileText,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Inicio", icon: Home, adminOnly: false, requireAuth: false },
  { href: "/modulos", label: "Modulos", icon: BookOpen, adminOnly: false, requireAuth: false },
  { href: "/presenca", label: "Presenca", icon: ClipboardCheck, adminOnly: false, requireAuth: false },
  { href: "/quiz", label: "Quiz", icon: HelpCircle, adminOnly: false, requireAuth: false },
  { href: "/praticas", label: "Praticas", icon: CheckSquare, adminOnly: false, requireAuth: false },
  { href: "/relatorios", label: "Relatorios", icon: FileText, adminOnly: true, requireAuth: true },
  { href: "/admin", label: "Admin", icon: ShieldCheck, adminOnly: true, requireAuth: true },
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
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:sticky lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex-1 space-y-1 p-3" aria-label="Menu principal">
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
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <p className="text-xs text-sidebar-foreground/50">
            SABO Treinamentos v1.0
          </p>
        </div>
      </aside>
    </>
  )
}