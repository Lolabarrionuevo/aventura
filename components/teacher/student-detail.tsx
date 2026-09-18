'use client'

import { ArrowLeft, Zap, Flame, Award, Target } from 'lucide-react'
import { Avatar } from '@/components/avatar'
import { ProgressBar } from '@/components/progress-bar'
import { MetricCard } from './metric-card'
import {
  getStudentDetail,
  subjectMeta,
  type Grade,
  type Division,
} from '@/lib/adventure/teacher-data'

export function StudentDetail({
  grade,
  division,
  studentId,
  onBack,
}: {
  grade: Grade
  division: Division
  studentId: string
  onBack: () => void
}) {
  const student = getStudentDetail(grade, division, studentId)

  if (!student) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6">
        <p className="text-muted-foreground">No se encontró el alumno.</p>
        <button onClick={onBack} className="mt-3 font-bold text-primary hover:underline">
          Volver
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver a mis alumnos
      </button>

      {/* Encabezado del alumno */}
      <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center">
        <Avatar name={student.name} size="xl" />
        <div className="flex-1">
          <h1 className="font-display text-2xl font-extrabold text-card-foreground">
            {student.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            @{student.username} · {student.grade}° {student.division}
          </p>
          <div className="mt-3 max-w-md">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-bold text-card-foreground">Progreso general</span>
              <span className="font-extrabold text-muted-foreground">{student.progressPct}%</span>
            </div>
            <ProgressBar value={student.progressPct} label="Progreso general" />
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard icon={<Award className="size-5" />} value={student.level} label="Nivel" accent="secondary" />
        <MetricCard icon={<Zap className="size-5" />} value={student.xp} label="XP" accent="accent" />
        <MetricCard icon={<Flame className="size-5" />} value={student.streakDays} label="Racha (días)" accent="chart-4" />
        <MetricCard icon={<Target className="size-5" />} value={`${student.correctPct}%`} label="Aciertos" accent="primary" />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Materias */}
        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-extrabold text-card-foreground">
            Materias
          </h2>
          <div className="flex flex-col gap-4">
            {student.subjects.map((s) => {
              const meta = subjectMeta(s.subjectId)
              return (
                <div key={s.subjectId} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-bold text-card-foreground">
                      <span aria-hidden="true">{meta.emoji}</span>
                      {meta.name}
                    </span>
                    <span className="font-extrabold text-muted-foreground">
                      {s.correctPct}% aciertos
                    </span>
                  </div>
                  <ProgressBar value={s.progressPct} label={`Progreso de ${meta.name}`} />
                </div>
              )
            })}
          </div>
        </section>

        {/* Actividades y errores */}
        <div className="flex flex-col gap-6">
          <section className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-border bg-card p-5">
              <p className="font-display text-2xl font-extrabold text-card-foreground">
                {student.activitiesCompleted}
              </p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                Actividades realizadas
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5">
              <p className="font-display text-2xl font-extrabold text-card-foreground">
                {Math.max(0, student.activitiesTotal - student.activitiesCompleted)}
              </p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                Actividades pendientes
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="mb-3 font-display text-lg font-extrabold text-card-foreground">
              Temas con más errores
            </h2>
            {student.weakTopics.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {student.weakTopics.map((t, i) => {
                  const meta = subjectMeta(t.subjectId)
                  return (
                    <li key={`${t.topic}-${i}`} className="flex items-center gap-3">
                      <span aria-hidden="true">{meta.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-card-foreground">{t.topic}</p>
                        <p className="text-xs text-muted-foreground">{meta.name}</p>
                      </div>
                      <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-bold text-destructive">
                        {t.errorPct}% errores
                      </span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Sin datos de errores todavía.</p>
            )}
          </section>
        </div>
      </div>

      {student.pendingActivities.length > 0 && (
        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="mb-3 font-display text-lg font-extrabold text-card-foreground">
            Actividades pendientes
          </h2>
          <ul className="flex flex-wrap gap-2">
            {student.pendingActivities.map((a) => (
              <li
                key={a}
                className="rounded-full bg-muted px-3 py-1.5 text-sm font-semibold text-foreground"
              >
                {a}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
