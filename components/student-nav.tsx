'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flame, Home, Medal, Trophy, BookOpen, Sparkles, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { Avatar } from '@/components/avatar'
import { useSession } from '@/components/session-provider'
import { levelFromXp } from '@/lib/adventure/gamification'

const LINKS = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/materias', label: 'Materias', icon: BookOpen },
  { href: '/ranking', label: 'Ranking', icon: Trophy },
  { href: '/logros', label: 'Logros', icon: Medal },
  { href: '/tutor', label: 'Tutor IA', icon: Sparkles },
]

export function StudentNav() {
  const pathname = usePathname()
  const { student } = useSession()
  const level = levelFromXp(student.xp)

  return (
    <>
      {/* Barra superior */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/dashboard" aria-label="Ir al inicio">
            <Logo />
          </Link>

          {/* Navegación de escritorio */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Stat icon={<Zap className="size-4 text-primary" />} value={student.xp} label="XP" />
            <Stat
              icon={<Flame className="size-4 text-accent" />}
              value={student.streakDays}
              label="racha"
            />
            <span className="hidden rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-bold text-secondary sm:inline">
              Nivel {level}
            </span>
            <Link href="/perfil" aria-label="Mi perfil">
              <Avatar name={student.name} size="sm" />
            </Link>
          </div>
        </div>
      </header>

      {/* Navegación móvil inferior */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background md:hidden"
        aria-label="Principal móvil"
      >
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-bold',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-sm font-extrabold text-foreground">
      {icon}
      {value}
      <span className="sr-only">{label}</span>
    </span>
  )
}
