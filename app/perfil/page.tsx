'use client'

import Link from 'next/link'
import { Zap, Flame, Crown, Medal, LogOut, TrendingUp, TrendingDown } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Avatar } from '@/components/avatar'
import { ProgressBar } from '@/components/progress-bar'
import { useSession } from '@/components/session-provider'
import { courses, getBadge, subjectProgress } from '@/lib/adventure/data'
import { levelFromXp, levelProgressPct, xpToNextLevel } from '@/lib/adventure/gamification'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default function PerfilPage() {
  const { student } = useSession()
  const level = levelFromXp(student.xp)
  const course = courses.find((c) => c.id === student.courseId)
  const progress = subjectProgress[student.id]?.[0]

  return (
    <AppShell>
      {/* Cabecera de perfil */}
      <section className="mb-6 flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-8 text-center">
        <Avatar name={student.name} size="xl" />
        <div>
          <h1 className="font-display text-2xl font-extrabold text-card-foreground">
            {student.name}
          </h1>
          <p className="text-muted-foreground">
            @{student.username} · {course?.name}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 font-bold text-secondary">
          <Crown className="size-4" />
          Nivel {level}
        </span>
        <div className="w-full max-w-xs">
          <ProgressBar value={levelProgressPct(student.xp)} label="Progreso de nivel" />
          <p className="mt-1 text-sm text-muted-foreground">
            {xpToNextLevel(student.xp)} XP para el nivel {level + 1}
          </p>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="mb-6 grid grid-cols-3 gap-4">
        <StatCard icon={<Zap className="size-6 text-primary" />} value={student.xp} label="XP total" />
        <StatCard
          icon={<Flame className="size-6 text-accent" />}
          value={student.streakDays}
          label="Días de racha"
        />
        <StatCard
          icon={<Medal className="size-6 text-secondary" />}
          value={student.badgeIds.length}
          label="Medallas"
        />
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Materias fuertes / a mejorar */}
        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-extrabold text-card-foreground">
            Rendimiento en Inglés
          </h2>
          {progress ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 rounded-2xl bg-success/10 p-3">
                <TrendingUp className="size-5 text-success" />
                <div>
                  <p className="text-sm font-bold text-foreground">Fortaleza</p>
                  <p className="text-sm text-muted-foreground">Vocabulario y colores</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-accent/10 p-3">
                <TrendingDown className="size-5 text-accent-foreground" />
                <div>
                  <p className="text-sm font-bold text-foreground">A mejorar</p>
                  <p className="text-sm text-muted-foreground">Ordenar oraciones</p>
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm font-bold">
                  <span className="text-muted-foreground">Progreso general</span>
                  <span className="text-foreground">{progress.progressPct}%</span>
                </div>
                <ProgressBar value={progress.progressPct} label="Progreso general" />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aún no hay suficientes datos. ¡Completa actividades para ver tu rendimiento! ✨
            </p>
          )}
        </section>

        {/* Medallas */}
        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold text-card-foreground">Medallas</h2>
            <Link href="/logros" className="text-sm font-bold text-primary hover:underline">
              Ver todo
            </Link>
          </div>
          {student.badgeIds.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {student.badgeIds.map((id) => {
                const badge = getBadge(id)
                if (!badge) return null
                return (
                  <span
                    key={id}
                    title={`${badge.name}: ${badge.description}`}
                    className="grid aspect-square place-items-center rounded-2xl bg-muted text-3xl"
                  >
                    {badge.emoji}
                  </span>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aún no tienes medallas.</p>
          )}
        </section>
      </div>

      {/* Cerrar sesión */}
      <div className="mt-6 flex justify-center">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-11 rounded-xl px-6 font-bold',
          )}
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </Link>
      </div>
    </AppShell>
  )
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: number
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-3xl border border-border bg-card p-4 text-center">
      <span aria-hidden="true">{icon}</span>
      <span className="font-display text-2xl font-extrabold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
