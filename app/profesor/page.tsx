'use client'

import { useState } from 'react'
import { Users, ArrowLeft, Zap, Flame, Crown, ChevronRight } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Avatar } from '@/components/avatar'
import { ProgressBar } from '@/components/progress-bar'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  students,
  courses,
  getCourseStudents,
  getStudentAnalysis,
} from '@/lib/adventure/data'
import { levelFromXp, levelProgressPct } from '@/lib/adventure/gamification'
import { StudentAnalysisView } from '@/components/profesor/student-analysis'

export default function ProfesorPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (selectedId) {
    const student = students.find((s) => s.id === selectedId)
    const analysis = getStudentAnalysis(selectedId)
    if (student && analysis) {
      const course = courses.find((c) => c.id === student.courseId)
      return (
        <div className="min-h-screen bg-background">
          <ProfesorHeader />
          <StudentAnalysisView
            analysis={analysis}
            studentName={student.name}
            courseName={course?.name ?? ''}
            onBack={() => setSelectedId(null)}
          />
        </div>
      )
    }
  }

  const courseStudents = getCourseStudents('c-4a')
  const course = courses[0]

  return (
    <div className="min-h-screen bg-background">
      <ProfesorHeader />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 md:pb-10">
        {/* Encabezado */}
        <section className="mb-6 flex flex-col gap-5 rounded-3xl bg-gradient-to-br from-secondary to-secondary/80 p-6 text-secondary-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-secondary-foreground/15">
              <Users className="size-7" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold opacity-90">Portal del profesor</p>
              <h1 className="font-display text-2xl font-extrabold md:text-3xl">Mi clase</h1>
              <p className="text-sm opacity-90">{course.name} · {course.grade}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <HeroStat value={courseStudents.length} label="alumnos" />
            <HeroStat
              value={Math.round(courseStudents.reduce((sum, s) => sum + s.xp, 0) / courseStudents.length)}
              label="XP promedio"
            />
            <HeroStat
              value={Math.round(courseStudents.reduce((sum, s) => sum + s.streakDays, 0) / courseStudents.length)}
              label="racha prom."
            />
          </div>
        </section>

        {/* Instrucción */}
        <p className="mb-4 text-sm text-muted-foreground">
          Seleccioná un alumno para ver su análisis detallado de rendimiento.
        </p>

        {/* Lista de alumnos */}
        <div className="flex flex-col gap-3">
          {courseStudents.map((s) => {
            const analysis = getStudentAnalysis(s.id)
            const level = levelFromXp(s.xp)
            const progressPct = analysis?.overallProgressPct ?? 0
            return (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className="group flex items-center gap-4 rounded-3xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Avatar name={s.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-display text-lg font-extrabold text-card-foreground">
                      {s.name}
                    </p>
                    <span className="hidden rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-bold text-secondary sm:inline">
                      Nivel {level}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-bold text-primary">
                      <Zap className="size-3.5" />
                      {s.xp} XP
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-accent">
                      <Flame className="size-3.5" />
                      {s.streakDays} días
                    </span>
                    {analysis && (
                      <span className="inline-flex items-center gap-1 font-bold text-foreground">
                        <Crown className="size-3.5 text-secondary" />
                        {analysis.correctPct}% acierto
                      </span>
                    )}
                  </div>
                  <div className="mt-3 max-w-xs">
                    <ProgressBar
                      value={progressPct}
                      label={`Progreso de ${s.name}`}
                      barClassName={
                        progressPct >= 80
                          ? 'bg-success'
                          : progressPct >= 60
                            ? 'bg-accent'
                            : 'bg-destructive'
                      }
                    />
                  </div>
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </button>
            )
          })}
        </div>

        {/* Volver al inicio */}
        <div className="mt-8 flex justify-center">
          <a
            href="/"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-11 rounded-xl px-6 font-bold',
            )}
          >
            <ArrowLeft className="size-4" />
            Volver al inicio
          </a>
        </div>
      </main>
    </div>
  )
}

function ProfesorHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Logo />
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5 text-sm font-bold text-secondary">
          <Users className="size-4" />
          Profesor
        </span>
      </div>
    </header>
  )
}

function HeroStat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-secondary-foreground/15 px-3 py-3 text-center">
      <span className="font-display text-base font-extrabold leading-none">{value}</span>
      <span className="text-xs opacity-90">{label}</span>
    </div>
  )
}
