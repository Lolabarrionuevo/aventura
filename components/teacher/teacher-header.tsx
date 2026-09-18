'use client'

import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Avatar } from '@/components/avatar'

export function TeacherHeader({ teacherName }: { teacherName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label="Ir al inicio">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary sm:inline">
            Panel docente
          </span>
          <span className="flex items-center gap-2">
            <Avatar name={teacherName} size="sm" />
            <span className="hidden text-sm font-bold text-foreground sm:inline">
              {teacherName}
            </span>
          </span>
          <Link
            href="/login"
            aria-label="Cerrar sesión"
            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  )
}
