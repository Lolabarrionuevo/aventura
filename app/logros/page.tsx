'use client'

import { Lock } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { useSession } from '@/components/session-provider'
import { badges } from '@/lib/adventure/data'
import { cn } from '@/lib/utils'

export default function LogrosPage() {
  const { student } = useSession()
  const earned = new Set(student.badgeIds)
  const earnedCount = badges.filter((b) => earned.has(b.id)).length

  return (
    <AppShell>
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-extrabold text-foreground">Mis logros 🏅</h1>
        <p className="text-muted-foreground">
          Has desbloqueado {earnedCount} de {badges.length} medallas
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {badges.map((badge) => {
          const isEarned = earned.has(badge.id)
          return (
            <div
              key={badge.id}
              className={cn(
                'flex flex-col items-center gap-3 rounded-3xl border p-6 text-center transition-all',
                isEarned
                  ? 'border-border bg-card'
                  : 'border-dashed border-border bg-muted/40',
              )}
            >
              <span
                className={cn(
                  'grid size-16 place-items-center rounded-2xl text-4xl',
                  isEarned ? 'bg-primary/10' : 'bg-muted grayscale',
                )}
                aria-hidden="true"
              >
                {isEarned ? badge.emoji : <Lock className="size-7 text-muted-foreground" />}
              </span>
              <div>
                <p
                  className={cn(
                    'font-display font-extrabold',
                    isEarned ? 'text-card-foreground' : 'text-muted-foreground',
                  )}
                >
                  {badge.name}
                </p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}
