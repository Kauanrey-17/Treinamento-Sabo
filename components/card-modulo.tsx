"use client"

import Link from "next/link"
import {
  Monitor,
  Users,
  FolderOpen,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Modulo } from "@/lib/types"

const iconMap: Record<string, React.ElementType> = {
  Monitor,
  Users,
  FolderOpen,
  LayoutDashboard,
}

interface CardModuloProps {
  modulo: Modulo
  progresso?: number
}

export function CardModulo({ modulo, progresso = 0 }: CardModuloProps) {
  const Icon = iconMap[modulo.icone] ?? Monitor

  return (
    <Link href={`/modulos/${modulo.id}`} className="group block">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/40 group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {modulo.id}
            </span>
          </div>
          <CardTitle className="mt-3 text-lg">{modulo.titulo}</CardTitle>
          <CardDescription className="leading-relaxed">
            {modulo.descricao}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progresso</span>
              <span>{progresso}%</span>
            </div>
            <Progress value={progresso} className="h-1.5" />
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Acessar modulo
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
