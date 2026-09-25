'use client'

import Link from 'next/link'
import { Zap, ChevronRight } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { ProgressBar } from '@/components/progress-bar'
import { useSession } from '@/components/session-provider'
import { subjects, subjectProgress, getActivitiesForSubject, getActivitiesForGrade } from '@/lib/adventure/data'
import {
  GAME_TYPE_META,
  difficultyLabel,
  levelFromXp,
} from '@/lib/adventure/gamification'
import { cn } from '@/lib/utils'

const DIFFICULTY_STYLE: Record<string, string> = {
  facil: 'bg-success/10 text-success',
  medio: 'bg-accent/15 text-accent-foreground',
  dificil: 'bg-destructive/10 text-destructive',
}

export default function MateriasPage() {
  const { student } = useSession()
  const english = subjects[0]
  const subjectActivities = getActivitiesForSubject(english.id)
  const gradeActivities = getActivitiesForGrade(student.grade)
  const teacherActivities = gradeActivities.filter(
    (a) => a.createdByTeacher && !subjectActivities.some((sa) => sa.id === a.id),
  )
  const activities = [...subjectActivities, ...teacherActivities]
  const progress = subjectProgress[student.id]?.[0]
  const progressPct = progress?.progressPct ?? 0

  return (
    <AppShell>
      {/* Encabezado de materia */}
      <section className="mb-6 flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-2xl bg-secondary/10 text-4xl">
            {english.emoji}
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-card-foreground">
              {english.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Nivel {progress?.level ?? levelFromXp(student.xp)} · {activities.length} actividades
            </p>
          </div>
        </div>
        <div className="w-full sm:w-56">
          <div className="mb-1 flex items-center justify-between text-sm font-bold">
            <span className="text-muted-foreground">Progreso</span>
            <span className="text-foreground">{progressPct}%</span>
          </div>
          <ProgressBar value={progressPct} label="Progreso de inglés" />
        </div>
      </section>

      {/* Lista de actividades */}
      <h2 className="mb-3 font-display text-xl font-extrabold text-foreground">Actividades</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {activities.map((activity) => {
          const meta = GAME_TYPE_META[activity.type]
          return (
            <Link
              key={activity.id}
              href={`/actividad/${activity.id}`}
              className="group flex items-center gap-4 rounded-3xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-muted text-3xl">
                {meta.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-display text-lg font-extrabold text-card-foreground">
                    {activity.title}
                  </p>
                </div>
                <p className="truncate text-sm text-muted-foreground">{meta.label}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-bold',
                      DIFFICULTY_STYLE[activity.difficulty],
                    )}
                  >
                    {difficultyLabel(activity.difficulty)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                    <Zap className="size-3" />+{activity.xpReward} XP
                  </span>
                </div>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          )
        })}
      </div>
    </AppShell>
  )
}
