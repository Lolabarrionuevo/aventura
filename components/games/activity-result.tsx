'use client'

import Link from 'next/link'
import { Zap, Target, Clock, RotateCcw, Home, PartyPopper } from 'lucide-react'
import { Logo } from '@/components/logo'
import type { Activity } from '@/lib/adventure/types'

export function ActivityResultScreen({
  activity,
  correctCount,
  total,
  score,
  xpEarned,
  timeSec,
  onRetry,
}: {
  activity: Activity
  correctCount: number
  total: number
  score: number
  xpEarned: number
  timeSec: number
  onRetry: () => void
}) {
  const perfect = score === 100
  const passed = score >= 60

  const headline = perfect
    ? '¡Perfecto! 🌟'
    : passed
      ? '¡Buen trabajo! 🎉'
      : '¡Sigue practicando! 💪'

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-card p-8 text-center">
          <span className="grid size-20 place-items-center rounded-full bg-primary/10 text-primary">
            <PartyPopper className="size-10" aria-hidden="true" />
          </span>

          <div>
            <h1 className="font-display text-3xl font-extrabold text-card-foreground">{headline}</h1>
            <p className="mt-1 text-muted-foreground">{activity.title}</p>
          </div>

          {/* Puntuación grande */}
          <div className="w-full rounded-2xl bg-primary p-6 text-primary-foreground">
            <p className="text-sm font-semibold opacity-90">Puntuación</p>
            <p className="font-display text-5xl font-extrabold">{score}%</p>
            <p className="text-sm opacity-90">
              {correctCount} de {total} respuestas correctas
            </p>
          </div>

          {/* Detalle */}
          <div className="grid w-full grid-cols-3 gap-3">
            <ResultStat icon={<Zap className="size-5 text-primary" />} value={`+${xpEarned}`} label="XP" />
            <ResultStat
              icon={<Target className="size-5 text-secondary" />}
              value={`${correctCount}/${total}`}
              label="Aciertos"
            />
            <ResultStat
              icon={<Clock className="size-5 text-accent" />}
              value={`${timeSec}s`}
              label="Tiempo"
            />
          </div>

          {/* Acciones */}
          <div className="flex w-full flex-col gap-2">
            <Link
              href="/materias"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-extrabold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Home className="size-5" />
              Seguir aprendiendo
            </Link>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background font-bold text-foreground transition-colors hover:bg-muted"
            >
              <RotateCcw className="size-4" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function ResultStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-muted px-2 py-3">
      <span aria-hidden="true">{icon}</span>
      <span className="font-display text-lg font-extrabold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
