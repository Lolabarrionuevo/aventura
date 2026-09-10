'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/adventure/types'

interface Card {
  id: string
  pairKey: string
  label: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function MemoryQuestion({
  question,
  answered,
  onComplete,
}: {
  question: Question
  answered: boolean
  onComplete: () => void
}) {
  const cards = useMemo<Card[]>(() => {
    const pairs = question.pairs ?? []
    const deck: Card[] = []
    pairs.forEach((p, i) => {
      deck.push({ id: `l-${i}`, pairKey: `p-${i}`, label: p.left })
      deck.push({ id: `r-${i}`, pairKey: `p-${i}`, label: p.right })
    })
    return shuffle(deck)
  }, [question.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [busy, setBusy] = useState(false)

  function flip(card: Card) {
    if (busy || answered) return
    if (flipped.includes(card.id) || matched.includes(card.pairKey)) return

    const next = [...flipped, card.id]
    setFlipped(next)

    if (next.length === 2) {
      setBusy(true)
      const [a, b] = next.map((id) => cards.find((c) => c.id === id)!)
      if (a.pairKey === b.pairKey) {
        setTimeout(() => {
          const nextMatched = [...matched, a.pairKey]
          setMatched(nextMatched)
          setFlipped([])
          setBusy(false)
          if (nextMatched.length === (question.pairs?.length ?? 0)) {
            setTimeout(onComplete, 350)
          }
        }, 500)
      } else {
        setTimeout(() => {
          setFlipped([])
          setBusy(false)
        }, 800)
      }
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-balance text-center font-display text-2xl font-extrabold text-foreground">
        {question.prompt}
      </h2>
      <div className="mx-auto grid w-full max-w-md grid-cols-4 gap-3">
        {cards.map((card) => {
          const isUp = flipped.includes(card.id) || matched.includes(card.pairKey)
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(card)}
              disabled={isUp || answered}
              className={cn(
                'grid aspect-square place-items-center rounded-2xl border-2 p-1 text-center text-sm font-bold transition-all',
                isUp
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-primary text-primary-foreground hover:-translate-y-0.5',
                matched.includes(card.pairKey) && 'border-success bg-success/10 opacity-70',
              )}
              aria-label={isUp ? card.label : 'Carta oculta'}
            >
              {isUp ? card.label : '?'}
            </button>
          )
        })}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Encuentra las parejas palabra–traducción 🧠
      </p>
    </div>
  )
}
