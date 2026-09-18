import { cn } from '@/lib/utils'
import { difficultyLabel } from '@/lib/adventure/gamification'

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    activo: 'bg-success/15 text-success',
    inactivo: 'bg-muted text-muted-foreground',
    activa: 'bg-success/15 text-success',
    borrador: 'bg-accent/20 text-accent-foreground',
    cerrada: 'bg-muted text-muted-foreground',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize',
        map[status] ?? 'bg-muted text-muted-foreground',
      )}
    >
      {status}
    </span>
  )
}

export function DifficultyPill({ difficulty }: { difficulty: 'facil' | 'medio' | 'dificil' }) {
  const map: Record<string, string> = {
    facil: 'bg-success/15 text-success',
    medio: 'bg-accent/20 text-accent-foreground',
    dificil: 'bg-destructive/10 text-destructive',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold',
        map[difficulty],
      )}
    >
      {difficultyLabel(difficulty)}
    </span>
  )
}
