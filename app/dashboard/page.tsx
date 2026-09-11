'use client'

import Link from 'next/link'
import {
  Flame,
  Zap,
  Trophy,
  Target,
  ChevronRight,
  Sparkles,
  Crown,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Avatar } from '@/components/avatar'
import { ProgressBar } from '@/components/progress-bar'
import { useSession } from '@/components/session-provider'
import {
  subjects,
  subjectProgress,
  getActivitiesForSubject,
  getGradeStudents,
  getBadge,
} from '@/lib/adventure/data'
import {
  levelFromXp,
  levelProgressPct,
  xpToNextLevel,
  GAME_TYPE_META,
} from '@/lib/adventure/gamification'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { student } = useSession()
  const level = levelFromXp(student.xp)
  const english = subjects[0]

  const progress = subjectProgress[student.id]?.[0] ?? {
    subjectId: english.id,
    progressPct: 0,
    level,
    activitiesTotal: getActivitiesForSubject(english.id).length,
    activitiesCompleted: 0,
    xpEarned: student.xp,
  }

  const classRanking = getGradeStudents(student.grade, student.division)
  const myRank = classRanking.findIndex((s) => s.id === student.id) + 1
  const dailyChallenge = getActivitiesForSubject(english.id)[3]

  return (
    <AppShell>
      {/* Encabezado de bienvenida */}
      <section className="mb-6 flex flex-col gap-5 rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={student.name} size="xl" className="ring-4 ring-primary-foreground/30" />
          <div>
            <p className="text-sm font-semibold opacity-90">¡Hola de nuevo! 👋</p>
            <h1 className="font-display text-2xl font-extrabold md:text-3xl">{student.name}</h1>
            <p className="text-sm opacity-90">
              {student.grade}° {student.division} · Primaria
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <HeroStat icon={<Crown className="size-5" />} value={`Nivel ${level}`} label="actual" />
          <HeroStat icon={<Zap className="size-5" />} value={student.xp} label="XP total" />
          <HeroStat icon={<Flame className="size-5" />} value={student.streakDays} label="días" />
        </div>
      </section>

      {/* Progreso de nivel */}
      <section className="mb-6 rounded-3xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-extrabold text-card-foreground">
              Progreso al nivel {level + 1}
            </p>
            <p className="text-sm text-muted-foreground">
              Te faltan {xpToNextLevel(student.xp)} XP para subir de nivel
            </p>
          </div>
          <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 font-display text-lg font-extrabold text-primary">
            {level}
          </span>
        </div>
        <ProgressBar value={levelProgressPct(student.xp)} label="Progreso de nivel" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Materia: Inglés */}
          <section>
            <h2 className="mb-3 font-display text-xl font-extrabold text-foreground">
              Mis materias
            </h2>
            <Link
              href="/materias"
              className="group flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-14 place-items-center rounded-2xl bg-secondary/10 text-3xl">
                    {english.emoji}
                  </span>
                  <div>
                    <p className="font-display text-xl font-extrabold text-card-foreground">
                      {english.name}
                    </p>
                    <p className="text-sm text-muted-foreground">Nivel {progress.level}</p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <ProgressBar value={progress.progressPct} label="Progreso de inglés" />
              <div className="grid grid-cols-3 gap-3 text-center">
                <MiniStat
                  value={`${progress.activitiesCompleted}/${progress.activitiesTotal}`}
                  label="Actividades"
                />
                <MiniStat value={`${progress.progressPct}%`} label="Progreso" />
                <MiniStat value={progress.xpEarned} label="XP" />
              </div>
            </Link>
          </section>

          {/* Desafío diario */}
          {dailyChallenge && (
            <section className="rounded-3xl border-2 border-dashed border-accent/60 bg-accent/5 p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid size-10 place-items-center rounded-xl bg-accent/20 text-accent-foreground">
                  <Target className="size-5 text-accent" />
                </span>
                <div>
                  <p className="font-display text-lg font-extrabold text-foreground">
                    Desafío diario 🎯
                  </p>
                  <p className="text-sm text-muted-foreground">¡Completa y gana XP extra!</p>
                </div>
              </div>
              <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-card p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">
                    {GAME_TYPE_META[dailyChallenge.type].emoji}
                  </span>
                  <div>
                    <p className="font-bold text-card-foreground">{dailyChallenge.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {GAME_TYPE_META[dailyChallenge.type].label} · +{dailyChallenge.xpReward} XP
                    </p>
                  </div>
                </div>
                <Link
                  href={`/actividad/${dailyChallenge.id}`}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-accent px-4 font-extrabold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Jugar
                  <Sparkles className="size-4" />
                </Link>
              </div>
            </section>
          )}
        </div>

        {/* Columna lateral */}
        <div className="flex flex-col gap-6">
          {/* Ranking de la clase */}
          <section className="rounded-3xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-card-foreground">
                <Trophy className="size-5 text-accent" />
                Ranking
              </h2>
              <Link href="/ranking" className="text-sm font-bold text-primary hover:underline">
                Ver todo
              </Link>
            </div>
            <ul className="flex flex-col gap-2">
              {classRanking.slice(0, 5).map((s, i) => {
                const isMe = s.id === student.id
                return (
                  <li
                    key={s.id}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl px-3 py-2',
                      isMe ? 'bg-primary/10' : 'bg-transparent',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-7 shrink-0 place-items-center rounded-full text-sm font-extrabold',
                        i === 0 && 'bg-accent text-accent-foreground',
                        i === 1 && 'bg-muted text-foreground',
                        i === 2 && 'bg-secondary/20 text-secondary',
                        i > 2 && 'text-muted-foreground',
                      )}
                    >
                      {i + 1}
                    </span>
                    <Avatar name={s.name} size="sm" />
                    <span className="flex-1 truncate text-sm font-bold text-card-foreground">
                      {s.name.split(' ')[0]}
                      {isMe && ' (tú)'}
                    </span>
                    <span className="text-sm font-extrabold text-muted-foreground">{s.xp}</span>
                  </li>
                )
              })}
            </ul>
            {myRank > 0 && (
              <p className="mt-4 rounded-2xl bg-muted px-4 py-3 text-center text-sm font-bold text-foreground">
                Estás en el puesto #{myRank} de tu clase 💪
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
              <div className="flex flex-wrap gap-3">
                {student.badgeIds.map((id) => {
                  const badge = getBadge(id)
                  if (!badge) return null
                  return (
                    <span
                      key={id}
                      title={`${badge.name}: ${badge.description}`}
                      className="grid size-14 place-items-center rounded-2xl bg-muted text-2xl"
                    >
                      {badge.emoji}
                    </span>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aún no tienes medallas. ¡Completa actividades para ganarlas! ✨
              </p>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  )
}

function HeroStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-primary-foreground/15 px-3 py-3 text-center">
      <span aria-hidden="true">{icon}</span>
      <span className="font-display text-base font-extrabold leading-none">{value}</span>
      <span className="text-xs opacity-90">{label}</span>
    </div>
  )
}

function MiniStat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl bg-muted px-2 py-3">
      <p className="font-display text-lg font-extrabold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
