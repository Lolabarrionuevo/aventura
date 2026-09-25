'use client'

import { useState } from 'react'
import { Users, ArrowLeft, Zap, Flame, Crown, ChevronRight, Plus, List, ClipboardList } from 'lucide-react'
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
  getActivitiesForGrade,
  GRADE_LABELS,
} from '@/lib/adventure/data'
import { levelFromXp } from '@/lib/adventure/gamification'
import { StudentAnalysisView } from '@/components/profesor/student-analysis'
import { CreateActivityPanel } from '@/components/profesor/create-activity'
import { useSession } from '@/components/session-provider'
import { GAME_TYPE_META, difficultyLabel } from '@/lib/adventure/gamification'

type View = 'lista' | 'crear' | 'detalle'

export default function ProfesorPage() {
  const { teacher } = useSession()
  const [view, setView] = useState<View>('lista')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const teacherGrade = teacher?.grade ?? '4'

  if (view === 'detalle' && selectedId) {
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
            onBack={() => {
              setSelectedId(null)
              setView('lista')
            }}
          />
        </div>
      )
    }
  }

  const courseStudents = getCourseStudents('c-4a')
  const course = courses[0]
  const teacherActivities = getActivitiesForGrade(teacherGrade).filter((a) => a.createdByTeacher)

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
              <p className="text-sm opacity-90">{course.name} · {course.grade} · {GRADE_LABELS[teacherGrade]}</p>
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

        {/* Navegación interna */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1.5">
          <NavTab active={view === 'lista'} onClick={() => setView('lista')} icon={<List className="size-4" />}>
            Mis alumnos
          </NavTab>
          <NavTab active={view === 'crear'} onClick={() => setView('crear')} icon={<Plus className="size-4" />}>
            Crear contenido
          </NavTab>
        </div>

        {view === 'lista' && (
          <>
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
                    onClick={() => {
                      setSelectedId(s.id)
                      setView('detalle')
                    }}
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

            {/* Contenido creado por el profesor */}
            {teacherActivities.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-extrabold text-foreground">
                  <ClipboardList className="size-5 text-secondary" />
                  Contenido creado por vos
                </h2>
                <div className="flex flex-col gap-2">
                  {teacherActivities.map((a) => {
                    const meta = GAME_TYPE_META[a.type]
                    return (
                      <div
                        key={a.id}
                        className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3"
                      >
                        <span className="text-2xl">{meta.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-foreground">{a.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {meta.label} · {difficultyLabel(a.difficulty)} · {a.questions.length} preguntas
                          </p>
                        </div>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                          +{a.xpReward} XP
                        </span>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </>
        )}

        {view === 'crear' && (
          <CreateActivityPanel
            teacherGrade={teacherGrade}
            onCreated={() => setRefreshKey((k) => k + 1)}
          />
        )}

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

function NavTab({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-colors',
        active
          ? 'bg-card text-primary shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      {children}
    </button>
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
