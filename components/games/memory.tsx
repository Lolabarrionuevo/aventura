'use client'

import { useState, useCallback } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/adventure/types'

interface MemoryProps {
  question: Question
  onAnswer: (correct: boolean) => void
  showResult: boolean
}

interface Card {
  id: number
  text: string
  pairIndex: number
  side: 'left' | 'right'
  matched: boolean
}

export function Memory({ question, onAnswer, showResult }: MemoryProps) {
  const pairs = question.pairs ?? []

  const buildCards = useCallback((): Card[] => {
    const cards: Card[] = []
    pairs.forEach((pair, index) => {
      cards.push({ id: index * 2, text: pair.left, pairIndex: index, side: 'left', matched: false })
      cards.push({ id: index * 2 + 1, text: pair.right, pairIndex: index, side: 'right', matched: false })
    })
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[cards[i], cards[j]] = [cards[j], cards[i]]
    }
    return cards
  }, [])

  const [cards, setCards] = useState<Card[]>(buildCards)
  const [flipped, setFlipped] = useState<number[]>([])
  const [wrongFlash, setWrongFlash] = useState<number[]>([])

  function handleCardClick(cardId: number) {
    if (showResult) return
    if (flipped.includes(cardId)) return
    const card = cards.find((c) => c.id === cardId)
    if (!card || card.matched) return

    if (flipped.length === 0) {
      setFlipped([cardId])
      return
    }

    if (flipped.length === 1) {
      const firstCard = cards.find((c) => c.id === flipped[0])
      if (!firstCard) return

      if (firstCard.pairIndex === card.pairIndex && firstCard.side !== card.side) {
        const newCards = cards.map((c) =>
          c.id === firstCard.id || c.id === card.id ? { ...c, matched: true } : c,
        )
        setCards(newCards)
        setFlipped([])
        if (newCards.every((c) => c.matched)) {
          onAnswer(true)
        }
      } else {
        setWrongFlash([flipped[0], cardId])
        setTimeout(() => {
          setWrongFlash([])
          setFlipped([])
        }, 800)
      }
    }
  }

  const matchedCount = cards.filter((c) => c.matched).length

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-lg font-bold text-foreground">{question.prompt}</p>
      <p className="text-center text-sm text-muted-foreground">
        Matched: {matchedCount / 2} / {pairs.length}
      </p>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || card.matched || showResult
          const isWrong = wrongFlash.includes(card.id)
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={showResult || card.matched}
              className={cn(
                'flex aspect-square items-center justify-center rounded-2xl border-2 p-2 text-center text-sm font-bold transition-all',
                !isFlipped && 'border-border bg-primary/10 text-transparent hover:bg-primary/20',
                isFlipped && !isWrong && 'border-primary bg-card text-foreground',
                isFlipped && isWrong && 'border-destructive bg-destructive/10 text-destructive',
                card.matched && 'border-success bg-success/10 text-success',
              )}
            >
              {isFlipped ? (
                <span className="flex items-center gap-1">
                  {card.text}
                  {card.matched && <Check className="size-3 shrink-0" />}
                </span>
              ) : (
                <span className="text-primary/40">?</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}