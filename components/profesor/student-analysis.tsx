'use client'

import {
  Zap,
  Crown,
  Flame,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Lightbulb,
  ArrowLeft,
  BookOpen,
} from 'lucide-react'
import { Avatar } from '@/components/avatar'
import { ProgressBar } from '@/components/progress-bar'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { StudentAnalysis, SkillStatus, TopicResult } from '@/lib/adventure/types'

const STATUS_META: Record<SkillStatus, { label: string; emoji: string; color: string; bar: string }> = {
  dominado: { label: 'Dominado', emoji: '🟢', color: 'text-success', bar: 'bg-success' },
  'en-progreso': { label: 'En progreso', emoji: '🟡', color: 'text-accent-foreground', bar: 'bg-accent' },
  'necesita-refuerzo': { label: 'Necesita refuerzo', emoji: '🔴', color: 'text-destructive', bar: 'bg-destructive' },
}

function statusForPct(pct: number): SkillStatus {
  if (pct >= 80) return 'dominado'
  if (pct >= 60) return 'en-progreso'
  return 'necesita-refuerzo'
}

function formatTime(sec: number): string {
  if (sec < 60) return `${sec}s`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${s}s`
}

export function StudentAnalysisView({
  analysis,
  studentName,
  courseName,
  onBack,
}: {
  analysis: StudentAnalysis
  studentName: string
  courseName: string
  onBack: () => void
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6 md:pb-10">
      {/* Botón volver */}
      <button
        onClick={onBack}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'mb-4 h-10 rounded-xl px-3 font-bold text-muted-foreground hover:text-foreground',
        )}
      >
        <ArrowLeft className="size-4" />
        Volver a la lista
      </button>

      {/* Encabezado del alumno */}
      <section className="mb-6 flex flex-col gap-5 rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={studentName} size="xl" className="ring-4 ring-primary-foreground/30" />
          <div>
            <p className="text-sm font-semibold opacity-90">Análisis del alumno</p>
            <h1 className="font-display text-2xl font-extrabold md:text-3xl">{studentName}</h1>
            <p className="text-sm opacity-90">{courseName}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <HeroStat icon={<Crown className="size-5" />} value={`Nivel ${analysis.level}`} label="actual" />
          <HeroStat icon={<Zap className="size-5" />} value={analysis.xp} label="XP total" />
          <HeroStat icon={<Flame className="size-5" />} value={analysis.streakDays} label="días de racha" />
        </div>
      </section>

      {/* Métricas clave */}
      <section className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          icon={<CheckCircle2 className="size-5 text-success" />}
          value={`${analysis.correctPct}%`}
          label="Respuestas correctas"
        />
        <MetricCard
          icon={<XCircle className="size-5 text-destructive" />}
          value={`${analysis.incorrectPct}%`}
          label="Respuestas incorrectas"
        />
        <MetricCard
          icon={<RotateCcw className="size-5 text-secondary" />}
          value={analysis.totalAttempts}
          label="Intentos totales"
        />
        <MetricCard
          icon={<Clock className="size-5 text-accent" />}
          value={formatTime(analysis.avgTimeSec)}
          label="Tiempo promedio"
        />
      </section>

      {/* Progreso general + actividades */}
      <section className="mb-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-extrabold text-card-foreground">
            Progreso general
          </h2>
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between text-sm font-bold">
              <span className="text-muted-foreground">Progreso del curso</span>
              <span className="text-foreground">{analysis.overallProgressPct}%</span>
            </div>
            <ProgressBar value={analysis.overallProgressPct} label="Progreso general" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-success/10 px-3 py-3">
              <CheckCircle2 className="size-5 text-success" />
              <div>
                <p className="font-display text-lg font-extrabold text-foreground">{analysis.activitiesCompleted}</p>
                <p className="text-xs text-muted-foreground">Realizadas</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-accent/10 px-3 py-3">
              <Clock className="size-5 text-accent" />
              <div>
                <p className="font-display text-lg font-extrabold text-foreground">{analysis.activitiesPending}</p>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Evolución del rendimiento */}
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold text-card-foreground">
            <TrendingUp className="size-5 text-primary" />
            Evolución del rendimiento
          </h2>
          <PerformanceChart points={analysis.performance} />
        </div>
      </section>

      {/* Rendimiento por habilidad */}
      <section className="mb-6 rounded-3xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold text-card-foreground">
          <BookOpen className="size-5 text-secondary" />
          Rendimiento por habilidad
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {analysis.skills.map((s) => {
            const meta = STATUS_META[s.status]
            return (
              <div key={s.skill} className="rounded-2xl border border-border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-bold text-foreground">{s.skill}</span>
                  <span className={cn('text-sm font-bold', meta.color)}>
                    {meta.emoji} {meta.label}
                  </span>
                </div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dominio</span>
                  <span className="font-extrabold text-foreground">{s.pct}%</span>
                </div>
                <ProgressBar value={s.pct} label={`${s.skill} ${s.pct}%`} barClassName={meta.bar} />
              </div>
            )
          })}
        </div>
      </section>

      {/* Temas por habilidad */}
      <section className="mb-6 rounded-3xl border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-lg font-extrabold text-card-foreground">
          Desempeño por tema
        </h2>
        <TopicBreakdown topics={analysis.topics} />
      </section>

      {/* Temas para reforzar + recomendación */}
      <section className="mb-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border-2 border-destructive/30 bg-destructive/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold text-foreground">
            <Target className="size-5 text-destructive" />
            Temas para reforzar
          </h2>
          <ul className="flex flex-col gap-3">
            {analysis.weakTopics.map((t, i) => {
              const meta = STATUS_META[t.status]
              return (
                <li
                  key={t.topic}
                  className="flex items-center justify-between rounded-2xl bg-card px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-destructive/10 font-display text-sm font-extrabold text-destructive">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-foreground">{t.topic}</p>
                      <p className="text-xs text-muted-foreground">{t.skill}</p>
                    </div>
                  </div>
                  <span className={cn('font-display text-lg font-extrabold', meta.color)}>
                    {t.pct}% {meta.emoji}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="rounded-3xl border-2 border-primary/30 bg-primary/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold text-foreground">
            <Lightbulb className="size-5 text-primary" />
            Recomendación para el profesor
          </h2>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-success/10 p-4">
              <p className="mb-1 flex items-center gap-2 text-sm font-bold text-success">
                <TrendingUp className="size-4" /> Lo que hace bien
              </p>
              <p className="text-sm text-foreground">
                {getStrengths(analysis)}
              </p>
            </div>
            <div className="rounded-2xl bg-destructive/10 p-4">
              <p className="mb-1 flex items-center gap-2 text-sm font-bold text-destructive">
                <TrendingDown className="size-4" /> Lo que le cuesta
              </p>
              <p className="text-sm text-foreground">
                {getWeaknesses(analysis)}
              </p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-4">
              <p className="mb-1 flex items-center gap-2 text-sm font-bold text-primary">
                <Target className="size-4" /> Qué debería practicar
              </p>
              <p className="text-sm text-foreground">{analysis.recommendation}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Actividades recientes */}
      <section className="rounded-3xl border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-lg font-extrabold text-card-foreground">
          Actividades recientes
        </h2>
        <div className="flex flex-col gap-2">
          {analysis.recentActivities.map((a) => (
            <div
              key={a.activityId}
              className={cn(
                'flex items-center gap-4 rounded-2xl border border-border px-4 py-3',
                a.status === 'pendiente' ? 'bg-muted/40' : 'bg-card',
              )}
            >
              <span
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-xl text-sm font-extrabold',
                  a.status === 'pendiente'
                    ? 'bg-muted text-muted-foreground'
                    : a.score >= 80
                      ? 'bg-success/15 text-success'
                      : a.score >= 60
                        ? 'bg-accent/15 text-accent-foreground'
                        : 'bg-destructive/15 text-destructive',
                )}
              >
                {a.status === 'pendiente' ? '—' : `${a.score}%`}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground">
                  {a.status === 'pendiente'
                    ? 'Sin comenzar'
                    : `${a.correctCount}/${a.totalCount} correctas · ${formatTime(a.timeSec)} · ${a.date}`}
                </p>
              </div>
              {a.status === 'pendiente' ? (
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                  Pendiente
                </span>
              ) : (
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-bold',
                    a.score >= 80
                      ? 'bg-success/10 text-success'
                      : a.score >= 60
                        ? 'bg-accent/10 text-accent-foreground'
                        : 'bg-destructive/10 text-destructive',
                  )}
                >
                  {a.score >= 80 ? 'Excelente' : a.score >= 60 ? 'Aceptable' : 'Bajo'}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
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

function MetricCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string | number
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

function PerformanceChart({ points }: { points: { date: string; score: number }[] }) {
  const max = 100
  const min = 0
  const width = 100
  const height = 100
  const stepX = points.length > 1 ? width / (points.length - 1) : 0

  const coords = points.map((p, i) => ({
    x: i * stepX,
    y: height - ((p.score - min) / (max - min)) * height,
    score: p.score,
    date: p.date,
  }))

  const path = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ')

  const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-32 w-full"
          role="img"
          aria-label="Evolución del rendimiento semanal"
        >
          <defs>
            <linearGradient id="perfArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#perfArea)" />
          <path
            d={path}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {coords.map((c, i) => (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r="1.5"
              fill="var(--primary)"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
      <div className="flex justify-between text-xs font-bold text-muted-foreground">
        {points.map((p) => (
          <span key={p.date}>{p.date}</span>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        {points.map((p) => (
          <span key={p.date} className="font-extrabold text-foreground">
            {p.score}%
          </span>
        ))}
      </div>
    </div>
  )
}

function TopicBreakdown({ topics }: { topics: TopicResult[] }) {
  const skills = ['Vocabulary', 'Grammar', 'Reading', 'Listening', 'Writing'] as const
  return (
    <div className="flex flex-col gap-5">
      {skills.map((skill) => {
        const skillTopics = topics.filter((t) => t.skill === skill)
        if (skillTopics.length === 0) return null
        return (
          <div key={skill}>
            <p className="mb-2 font-bold text-foreground">{skill}</p>
            <div className="flex flex-col gap-2">
              {skillTopics.map((t) => {
                const meta = STATUS_META[t.status]
                return (
                  <div
                    key={t.topic}
                    className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2"
                  >
                    <span className="text-sm font-bold text-foreground">{t.topic}</span>
                    <span className={cn('font-display text-sm font-extrabold', meta.color)}>
                      {t.pct}% {meta.emoji}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getStrengths(a: StudentAnalysis): string {
  const strong = a.skills.filter((s) => s.status === 'dominado')
  if (strong.length === 0) {
    const best = [...a.skills].sort((x, y) => y.pct - x.pct)[0]
    return `Su habilidad más fuerte es ${best.skill} (${best.pct}%).`
  }
  return strong.map((s) => `${s.skill} (${s.pct}%)`).join(' · ')
}

function getWeaknesses(a: StudentAnalysis): string {
  const weak = a.skills.filter((s) => s.status === 'necesita-refuerzo')
  if (weak.length === 0) {
    const worst = [...a.skills].sort((x, y) => x.pct - y.pct)[0]
    return `Su área menos desarrollada es ${worst.skill} (${worst.pct}%).`
  }
  return weak.map((s) => `${s.skill} (${s.pct}%)`).join(' · ')
}
