'use client'

import { useState } from 'react'
import { Check, X, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/adventure/types'

interface MatchConceptsProps {
  question: Question
  onAnswer: (correct: boolean) => void
  showResult: boolean
}

export function MatchConcepts({ question, onAnswer, showResult }: MatchConceptsProps) {
  const pairs = question.pairs ?? []
  const leftItems = pairs.map((p) => p.left)
  const rightItems = pairs.map((p) => p.right)

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [matches, setMatches] = useState<Record<number, number>>({})
  const [wrongPair, setWrongPair] = useState<{ left: number; right: number } | null>(null)

  function shuffleArray<T>(arr: T[]): T[] {
    const copy = [...arr]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  }

  const [shuffledRight] = useState(() => shuffleArray(rightItems))

  function handleLeftClick(index: number) {
    if (showResult || matches[index] !== undefined) return
    setSelectedLeft(index)
    setWrongPair(null)
  }

  function handleRightClick(rightIndex: number) {
    if (showResult || selectedLeft === null) return
    const rightValue = shuffledRight[rightIndex]
    const correctRightIndex = rightItems.indexOf(rightValue)
    const expectedLeftIndex = pairs.findIndex((p) => p.right === rightValue)

    if (expectedLeftIndex === selectedLeft) {
      setMatches({ ...matches, [selectedLeft]: correctRightIndex })
      setSelectedLeft(null)
      const newMatchCount = Object.keys({ ...matches, [selectedLeft]: correctRightIndex }).length
      if (newMatchCount === pairs.length) {
        onAnswer(true)
      }
    } else {
      setWrongPair({ left: selectedLeft, right: rightIndex })
      setTimeout(() => setWrongPair(null), 600)
    }
  }

  const allMatched = Object.keys(matches).length === pairs.length

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-lg font-bold text-foreground">{question.prompt}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          {leftItems.map((item, index) => {
            const isMatched = matches[index] !== undefined
            const isSelected = selectedLeft === index
            return (
              <button
                key={index}
                onClick={() => handleLeftClick(index)}
                disabled={showResult || isMatched}
                className={cn(
                  'flex items-center justify-between rounded-2xl border-2 px-4 py-3 font-bold transition-all',
                  isMatched && 'border-success bg-success/10 text-success',
                  !isMatched && isSelected && 'border-primary bg-primary/10',
                  !isMatched && !isSelected && 'border-border bg-card hover:border-primary/50',
                  wrongPair?.left === index && 'animate-pulse border-destructive bg-destructive/10',
                )}
              >
                {item}
                {isMatched && <Link2 className="size-4" />}
              </button>
            )
          })}
        </div>
        <div className="flex flex-col gap-2">
          {shuffledRight.map((item, index) => {
            const isUsed = Object.values(matches).includes(rightItems.indexOf(item))
            return (
              <button
                key={index}
                onClick={() => handleRightClick(index)}
                disabled={showResult || isUsed || selectedLeft === null}
                className={cn(
                  'flex items-center justify-between rounded-2xl border-2 px-4 py-3 font-bold transition-all',
                  isUsed && 'border-success bg-success/10 text-success',
                  !isUsed && selectedLeft !== null && 'border-primary/50 bg-card hover:border-primary',
                  !isUsed && selectedLeft === null && 'border-border bg-card',
                  wrongPair?.right === index && 'animate-pulse border-destructive bg-destructive/10',
                )}
              >
                {item}
                {isUsed && <Check className="size-4" />}
              </button>
            )
          })}
        </div>
      </div>
      {showResult && allMatched && (
        <p className="text-center font-bold text-success">All correct!</p>
      )}
    </div>
  )
}