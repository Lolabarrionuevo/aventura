'use client'

import { GRADES, DIVISIONS, type Grade, type Division } from '@/lib/adventure/teacher-data'
import { cn } from '@/lib/utils'

export function CourseSelector({
  grade,
  division,
  onGradeChange,
  onDivisionChange,
}: {
  grade: Grade
  division: Division
  onGradeChange: (g: Grade) => void
  onDivisionChange: (d: Division) => void
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-2 text-sm font-bold text-foreground">Grado</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Seleccionar grado">
            {GRADES.map((g) => {
              const active = g === grade
              return (
                <button
                  key={g}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onGradeChange(g)}
                  className={cn(
                    'h-11 min-w-16 rounded-xl px-4 text-sm font-extrabold transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  {g}°
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-foreground">División</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Seleccionar división">
            {DIVISIONS.map((d) => {
              const active = d === division
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onDivisionChange(d)}
                  className={cn(
                    'h-11 min-w-16 rounded-xl px-4 text-sm font-extrabold transition-colors',
                    active
                      ? 'bg-secondary text-secondary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
