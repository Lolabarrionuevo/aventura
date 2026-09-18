'use client'

import { Trophy } from 'lucide-react'
import { Avatar } from '@/components/avatar'
import { cn } from '@/lib/utils'
import { getRanking, type Grade, type Division } from '@/lib/adventure/teacher-data'

export function RankingSection({ grade, division }: { grade: Grade; division: Division }) {
  const ranking = getRanking(grade, division)

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-accent/20 text-accent-foreground">
          <Trophy className="size-5 text-accent" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-xl font-extrabold text-foreground">
            Ranking {grade}° {division}
          </h2>
          <p className="text-sm text-muted-foreground">
            Ordenado por XP · solo alumnos de este curso
          </p>
        </div>
      </div>

      <ol className="flex flex-col gap-2">
        {ranking.map((s, i) => (
          <li
            key={s.id}
            className={cn(
              'flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3',
              i === 0 && 'border-accent/50 bg-accent/5',
            )}
          >
            <span
              className={cn(
                'grid size-9 shrink-0 place-items-center rounded-full font-display text-sm font-extrabold',
                i === 0 && 'bg-accent text-accent-foreground',
                i === 1 && 'bg-muted text-foreground',
                i === 2 && 'bg-secondary/20 text-secondary',
                i > 2 && 'bg-muted/60 text-muted-foreground',
              )}
            >
              {i + 1}
            </span>
            <Avatar name={s.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-card-foreground">{s.name}</p>
              <p className="text-xs text-muted-foreground">Nivel {s.level}</p>
            </div>
            <span className="shrink-0 font-display text-base font-extrabold text-foreground">
              {s.xp.toLocaleString('es-AR')} XP
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
