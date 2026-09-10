'use client'

import { useMemo, useState } from 'react'
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

export function MatchQuestion({
  question,
  answered,
  onComplete,
}: {
  question: Question
  answered: boolean
  onComplete: () => void
}) {
  const pairs = question.pairs ?? []
  const lefts = useMemo(() => pairs.map((p) => p.left), [question.id]) // eslint-disable-line react-hooks/exhaustive-deps
  const rights = useMemo(() => shuffle(pairs.map((p) => p.right)), [question.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const [activeLeft, setActiveLeft] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({})
  const [wrong, setWrong] = useState<string | null>(null)

  function selectRight(right: string) {
    if (!activeLeft || answered) return
    const correctRight = pairs.find((p) => p.left === activeLeft)?.right
    if (right === correctRight) {
      const next = { ...matched, [activeLeft]: right }
      setMatched(next)
      setActiveLeft(null)
      if (Object.keys(next).length === pairs.length) {
        setTimeout(onComplete, 350)
      }
    } else {
      setWrong(right)
      setTimeout(() => setWrong(null), 500)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-balance text-center font-display text-2xl font-extrabold text-foreground">
        {question.prompt}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          {lefts.map((left) => {
            const isMatched = left in matched
            const isActive = activeLeft === left
            return (
              <button
                key={left}
                type="button"
                disabled={isMatched || answered}
                onClick={() => setActiveLeft(left)}
                className={cn(
                  'rounded-2xl border-2 px-4 py-3 text-lg font-bold transition-all',
                  isMatched && 'border-success bg-success/10 text-foreground opacity-70',
                  isActive && 'border-primary bg-primary/10 text-foreground',
                  !isMatched && !isActive && 'border-border bg-card text-card-foreground hover:border-primary/50',
                )}
              >
                {left}
              </button>
            )
          })}
        </div>
        <div className="flex flex-col gap-3">
          {rights.map((right) => {
            const isMatched = Object.values(matched).includes(right)
            const isWrong = wrong === right
            return (
              <button
                key={right}
                type="button"
                disabled={isMatched || answered}
                onClick={() => selectRight(right)}
                className={cn(
                  'rounded-2xl border-2 px-4 py-3 text-lg font-bold transition-all',
                  isMatched && 'border-success bg-success/10 text-foreground opacity-70',
                  isWrong && 'border-destructive bg-destructive/10 text-foreground',
                  !isMatched && !isWrong && 'border-border bg-card text-card-foreground hover:border-primary/50',
                )}
              >
                {right}
              </button>
            )
          })}
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Toca una palabra de la izquierda y luego su pareja de la derecha.
      </p>
    </div>
  )
}
