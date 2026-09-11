'use client'

import { Crown, Flame, Zap } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Avatar } from '@/components/avatar'
import { useSession } from '@/components/session-provider'
import { getGradeStudents } from '@/lib/adventure/data'
import { levelFromXp } from '@/lib/adventure/gamification'
import { cn } from '@/lib/utils'

export default function RankingPage() {
  const { student } = useSession()
  const ranking = getGradeStudents(student.grade, student.division)
  const myPlace = ranking.findIndex((r) => r.id === student.id) + 1
  const podium = ranking.slice(0, 3)
  const rest = ranking.slice(3)
  // Orden visual del podio: 2° - 1° - 3°
  const podiumOrder = [podium[1], podium[0], podium[2]].filter(Boolean)

  return (
    <AppShell>
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-extrabold text-foreground">
          Ranking de la clase 🏆
        </h1>
        <p className="text-muted-foreground">
          {student.grade}° {student.division} · Esta semana
        </p>
        {myPlace > 0 && (
          <p className="mt-1 text-sm font-bold text-primary">
            Tu posición: #{myPlace} de {ranking.length}
          </p>
        )}
      </div>

      {/* Podio */}
      <section className="mb-8 grid grid-cols-3 items-end gap-3">
        {podiumOrder.map((s) => {
          const place = ranking.findIndex((r) => r.id === s.id) + 1
          const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-20' } as const
          const isMe = s.id === student.id
          return (
            <div key={s.id} className="flex flex-col items-center gap-2">
              {place === 1 && <Crown className="size-7 text-accent" aria-hidden="true" />}
              <Avatar name={s.name} size={place === 1 ? 'lg' : 'md'} />
              <p className="text-center text-sm font-bold text-foreground">
                {s.name.split(' ')[0]}
                {isMe && ' (tú)'}
              </p>
              <div
                className={cn(
                  'flex w-full flex-col items-center justify-center rounded-t-2xl',
                  heights[place as 1 | 2 | 3],
                  place === 1 && 'bg-accent text-accent-foreground',
                  place === 2 && 'bg-secondary/20 text-secondary',
                  place === 3 && 'bg-muted text-foreground',
                )}
              >
                <span className="font-display text-2xl font-extrabold">{place}</span>
                <span className="text-xs font-bold">{s.xp} XP</span>
              </div>
            </div>
          )
        })}
      </section>

      {/* Resto de la tabla */}
      <section className="flex flex-col gap-2">
        {rest.map((s) => {
          const place = ranking.findIndex((r) => r.id === s.id) + 1
          const isMe = s.id === student.id
          return (
            <div
              key={s.id}
              className={cn(
                'flex items-center gap-4 rounded-2xl border border-border p-4',
                isMe ? 'bg-primary/10' : 'bg-card',
              )}
            >
              <span className="w-6 text-center font-display text-lg font-extrabold text-muted-foreground">
                {place}
              </span>
              <Avatar name={s.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-foreground">
                  {s.name}
                  {isMe && ' (tú)'}
                </p>
                <p className="text-sm text-muted-foreground">Nivel {levelFromXp(s.xp)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-sm font-bold text-accent">
                  <Flame className="size-4" />
                  {s.streakDays}
                </span>
                <span className="inline-flex items-center gap-1 font-display font-extrabold text-foreground">
                  <Zap className="size-4 text-primary" />
                  {s.xp}
                </span>
              </div>
            </div>
          )
        })}
      </section>
    </AppShell>
  )
}
