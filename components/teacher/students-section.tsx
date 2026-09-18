'use client'

import { ChevronRight } from 'lucide-react'
import { Avatar } from '@/components/avatar'
import { ProgressBar } from '@/components/progress-bar'
import { StatusPill } from './pills'
import { getCourseStudents, type Grade, type Division } from '@/lib/adventure/teacher-data'

export function StudentsSection({
  grade,
  division,
  onSelectStudent,
}: {
  grade: Grade
  division: Division
  onSelectStudent: (id: string) => void
}) {
  const students = getCourseStudents(grade, division)

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-xl font-extrabold text-foreground">Mis alumnos</h2>
        <p className="text-sm text-muted-foreground">
          {students.length} alumnos en {grade}° {division}. Selecciona uno para ver su perfil.
        </p>
      </div>

      {/* Tabla en escritorio */}
      <div className="hidden overflow-x-auto rounded-3xl border border-border bg-card lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-bold">Alumno</th>
              <th className="px-4 py-3 font-bold">Usuario</th>
              <th className="px-4 py-3 font-bold">Curso</th>
              <th className="px-4 py-3 font-bold">XP</th>
              <th className="px-4 py-3 font-bold">Nivel</th>
              <th className="px-4 py-3 font-bold">Progreso</th>
              <th className="px-4 py-3 font-bold">Activ.</th>
              <th className="px-4 py-3 font-bold">Aciertos</th>
              <th className="px-4 py-3 font-bold">Racha</th>
              <th className="px-4 py-3 font-bold">Medallas</th>
              <th className="px-4 py-3 font-bold">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr
                key={s.id}
                onClick={() => onSelectStudent(s.id)}
                className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-muted/50"
              >
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2.5">
                    <Avatar name={s.name} size="sm" />
                    <span className="font-bold text-card-foreground">{s.name}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">@{s.username}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {s.grade}° {s.division}
                </td>
                <td className="px-4 py-3 font-extrabold text-foreground">{s.xp}</td>
                <td className="px-4 py-3 font-bold text-foreground">{s.level}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <ProgressBar value={s.progressPct} className="h-2 w-24" />
                    <span className="text-xs font-bold text-muted-foreground">{s.progressPct}%</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {s.activitiesCompleted}/{s.activitiesTotal}
                </td>
                <td className="px-4 py-3 font-bold text-foreground">{s.correctPct}%</td>
                <td className="px-4 py-3 text-muted-foreground">{s.streakDays} 🔥</td>
                <td className="px-4 py-3 text-muted-foreground">{s.badges} 🏅</td>
                <td className="px-4 py-3">
                  <StatusPill status={s.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <ChevronRight className="size-4" aria-hidden="true" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas en móvil/tablet */}
      <div className="flex flex-col gap-3 lg:hidden">
        {students.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelectStudent(s.id)}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <Avatar name={s.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-card-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  @{s.username} · {s.grade}° {s.division}
                </p>
              </div>
              <StatusPill status={s.status} />
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <MiniCell value={s.xp} label="XP" />
              <MiniCell value={s.level} label="Nivel" />
              <MiniCell value={`${s.correctPct}%`} label="Aciertos" />
              <MiniCell value={`${s.streakDays}🔥`} label="Racha" />
            </div>
            <ProgressBar value={s.progressPct} label={`Progreso de ${s.name}`} />
          </button>
        ))}
      </div>
    </section>
  )
}

function MiniCell({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl bg-muted px-1 py-2">
      <p className="font-display text-sm font-extrabold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  )
}
