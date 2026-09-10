'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/adventure/types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function OrderQuestion({
  question,
  chosen,
  answered,
  isCorrect,
  onChoose,
  onReset,
}: {
  question: Question
  chosen: number[]
  answered: boolean
  isCorrect: boolean
  onChoose: (index: number) => void
  onReset: () => void
}) {
  const sequence = question.sequence ?? []
  // Orden barajado estable durante la vida de la pregunta.
  const shuffledIndexes = useMemo(
    () => shuffle(sequence.map((_, i) => i)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question.id],
  )

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-balance text-center font-display text-2xl font-extrabold text-foreground">
        {question.prompt}
      </h2>

      {/* Zona de construcción */}
      <div
        className={cn(
          'flex min-h-16 flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4',
          answered && isCorrect && 'border-success bg-success/10',
          answered && !isCorrect && 'border-destructive bg-destructive/10',
          !answered && 'border-border bg-muted/40',
        )}
      >
        {chosen.length === 0 ? (
          <span className="text-sm text-muted-foreground">Toca las palabras en orden…</span>
        ) : (
          chosen.map((idx, position) => (
            <span
              key={`${idx}-${position}`}
              className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground"
            >
              {sequence[idx]}
            </span>
          ))
        )}
      </div>

      {/* Palabras disponibles */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {shuffledIndexes.map((idx) => {
          const used = chosen.includes(idx)
          return (
            <button
              key={idx}
              type="button"
              disabled={used || answered}
              onClick={() => onChoose(idx)}
              className={cn(
                'rounded-xl border-2 border-border bg-card px-4 py-2 text-lg font-bold text-card-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50',
                used && 'pointer-events-none opacity-30',
              )}
            >
              {sequence[idx]}
            </button>
          )
        })}
      </div>

      {!answered && chosen.length > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="mx-auto text-sm font-bold text-muted-foreground hover:text-foreground"
        >
          Reiniciar
        </button>
      )}

      {answered && !isCorrect && (
        <p className="text-center text-sm font-bold text-muted-foreground">
          Orden correcto:{' '}
          <span className="text-success">{sequence.join(' ')}</span>
        </p>
      )}
    </div>
  )
}
