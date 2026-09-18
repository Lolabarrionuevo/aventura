'use client'

import { Plus, Users } from 'lucide-react'
import { ProgressBar } from '@/components/progress-bar'
import { DifficultyPill, StatusPill } from './pills'
import { getCourseActivities, subjectMeta, type Grade } from '@/lib/adventure/teacher-data'

export function ActivitiesSection({ grade }: { grade: Grade }) {
  const activities = getCourseActivities(grade)

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-extrabold text-foreground">Actividades</h2>
          <p className="text-sm text-muted-foreground">
            Actividades de {grade}° grado ({activities.length})
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-primary px-4 font-extrabold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" aria-hidden="true" />
          Nueva actividad
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {activities.map((a) => {
          const meta = subjectMeta(a.subjectId)
          return (
            <article
              key={a.id}
              className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-muted text-2xl">
                    {meta.emoji}
                  </span>
                  <div>
                    <p className="font-display text-base font-extrabold text-card-foreground">
                      {a.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {meta.name} · {a.topic}
                    </p>
                  </div>
                </div>
                <StatusPill status={a.status} />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-muted px-2.5 py-0.5 font-bold text-muted-foreground">
                  {a.grade}° grado
                </span>
                <DifficultyPill difficulty={a.difficulty} />
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 font-bold text-muted-foreground">
                  <Users className="size-3" aria-hidden="true" />
                  {a.studentsDone}/{a.studentsTotal}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-muted-foreground">Promedio</span>
                  <span className="font-extrabold text-card-foreground">{a.avgPct}%</span>
                </div>
                <ProgressBar value={a.avgPct} label={`Promedio de ${a.title}`} />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
