'use client'

import { TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react'
import { ProgressBar } from '@/components/progress-bar'
import {
  getCourseResults,
  subjectMeta,
  type Grade,
  type Division,
} from '@/lib/adventure/teacher-data'

export function ResultsSection({ grade, division }: { grade: Grade; division: Division }) {
  const results = getCourseResults(grade, division)

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-extrabold text-card-foreground">
            Resultados de {grade}° {division}
          </h2>
          <p className="text-sm text-muted-foreground">Estadísticas generales del curso</p>
        </div>
        <div className="rounded-2xl bg-primary/10 px-6 py-4 text-center">
          <p className="font-display text-3xl font-extrabold leading-none text-primary">
            {results.overallPct}%
          </p>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">Promedio general</p>
        </div>
      </section>

      {/* Unidades de inglés */}
      <section className="rounded-3xl border border-border bg-card p-6">
        <h3 className="mb-4 font-display text-lg font-extrabold text-card-foreground">
          Promedio por unidad
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {results.subjectAverages.map((s) => (
            <div key={s.subjectId} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-bold text-card-foreground">
                  <span aria-hidden="true">{s.emoji}</span>
                  {s.name}
                </span>
                <span className="font-extrabold text-muted-foreground">{s.averagePct}%</span>
              </div>
              <ProgressBar value={s.averagePct} label={`Promedio de ${s.name}`} />
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Más completadas */}
        <section className="rounded-3xl border border-border bg-card p-6">
          <h3 className="mb-3 flex items-center gap-2 font-display text-base font-extrabold text-card-foreground">
            <TrendingUp className="size-4 text-success" />
            Más completadas
          </h3>
          <ul className="flex flex-col gap-2.5">
            {results.mostCompleted.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-semibold text-card-foreground">{a.title}</span>
                <span className="shrink-0 font-bold text-muted-foreground">
                  {a.studentsDone}/{a.studentsTotal}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Más errores */}
        <section className="rounded-3xl border border-border bg-card p-6">
          <h3 className="mb-3 flex items-center gap-2 font-display text-base font-extrabold text-card-foreground">
            <AlertTriangle className="size-4 text-destructive" />
            Con más errores
          </h3>
          <ul className="flex flex-col gap-2.5">
            {results.mostErrors.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-semibold text-card-foreground">{a.title}</span>
                <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">
                  {100 - a.avgPct}%
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Refuerzo */}
        <section className="rounded-3xl border border-border bg-card p-6">
          <h3 className="mb-3 flex items-center gap-2 font-display text-base font-extrabold text-card-foreground">
            <RefreshCw className="size-4 text-secondary" />
            Necesitan refuerzo
          </h3>
          <ul className="flex flex-col gap-2.5">
            {results.reinforceTopics.map((t, i) => {
              const meta = subjectMeta(t.subjectId)
              return (
                <li key={`${t.topic}-${i}`} className="flex items-center gap-2 text-sm">
                  <span aria-hidden="true">{meta.emoji}</span>
                  <span className="flex-1 truncate font-semibold text-card-foreground">
                    {t.topic}
                  </span>
                  <span className="shrink-0 text-xs font-bold text-muted-foreground">
                    {meta.name}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </div>
  )
}
