'use client'

import { Users, Target, CheckCircle2, Zap, Activity } from 'lucide-react'
import { MetricCard } from './metric-card'
import { ProgressBar } from '@/components/progress-bar'
import {
  getCourseMetrics,
  getCourseResults,
  subjectMeta,
  type Grade,
  type Division,
} from '@/lib/adventure/teacher-data'

export function OverviewSection({
  teacherName,
  grade,
  division,
}: {
  teacherName: string
  grade: Grade
  division: Division
}) {
  const metrics = getCourseMetrics(grade, division)
  const results = getCourseResults(grade, division)

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado del curso */}
      <section className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-secondary to-secondary/80 p-6 text-secondary-foreground md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold opacity-90">Panel docente · {teacherName}</p>
          <h1 className="font-display text-3xl font-extrabold">
            {grade}° {division}
          </h1>
          <p className="text-sm opacity-90">Inglés · Educación primaria</p>
        </div>
        <div className="rounded-2xl bg-secondary-foreground/15 px-5 py-4 text-center">
          <p className="font-display text-3xl font-extrabold leading-none">{metrics.averagePct}%</p>
          <p className="mt-1 text-sm opacity-90">Promedio del curso</p>
        </div>
      </section>

      {/* Tarjetas de métricas */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard
          icon={<Users className="size-5" />}
          value={metrics.studentCount}
          label="Alumnos"
          accent="primary"
        />
        <MetricCard
          icon={<Target className="size-5" />}
          value={`${metrics.averagePct}%`}
          label="Promedio"
          accent="secondary"
        />
        <MetricCard
          icon={<CheckCircle2 className="size-5" />}
          value={metrics.activitiesCompleted}
          label="Actividades completadas"
          accent="chart-4"
        />
        <MetricCard
          icon={<Zap className="size-5" />}
          value={metrics.averageXp}
          label="XP promedio"
          accent="accent"
        />
        <MetricCard
          icon={<Activity className="size-5" />}
          value={`${metrics.activeStudents}/${metrics.studentCount}`}
          label="Alumnos activos"
          accent="primary"
        />
      </section>

      {/* Promedio por unidad de inglés */}
      <section className="rounded-3xl border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-lg font-extrabold text-card-foreground">
          Promedio por unidad
        </h2>
        <div className="flex flex-col gap-4">
          {results.subjectAverages.map((s) => {
            const meta = subjectMeta(s.subjectId)
            return (
              <div key={s.subjectId} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-bold text-card-foreground">
                    <span aria-hidden="true">{meta.emoji}</span>
                    {s.name}
                  </span>
                  <span className="font-extrabold text-muted-foreground">{s.averagePct}%</span>
                </div>
                <ProgressBar value={s.averagePct} label={`Promedio de ${s.name}`} />
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
