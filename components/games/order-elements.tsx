'use client'

import { useState, useCallback } from 'react'
import { ArrowLeft, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/adventure/types'

interface OrderElementsProps {
  question: Question
  onAnswer: (correct: boolean) => void
  showResult: boolean
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function OrderElements({ question, onAnswer, showResult }: OrderElementsProps) {
  const correctSequence = question.sequence ?? []

  const buildShuffled = useCallback(() => {
    return shuffleArray(
      correctSequence.map((word, index) => ({ word, originalIndex: index })),
    )
  }, [correctSequence])

  const [shuffled] = useState(buildShuffled)
  const [selectedWords, setSelectedWords] = useState<number[]>([])
  const [wrongFlash, setWrongFlash] = useState(false)

  function handleWordClick(shuffleIndex: number) {
    if (showResult) return
    if (selectedWords.includes(shuffleIndex)) return
    setSelectedWords([...selectedWords, shuffleIndex])
    setWrongFlash(false)
  }

  function handleRemove(position: number) {
    if (showResult) return
    setSelectedWords(selectedWords.filter((_, i) => i !== position))
  }

  function handleCheck() {
    if (showResult || selectedWords.length !== correctSequence.length) return
    const built = selectedWords.map((si) => shuffled[si].word)
    const correct = built.every((word, i) => word === correctSequence[i])

    if (correct) {
      onAnswer(true)
    } else {
      setWrongFlash(true)
      setTimeout(() => {
        setWrongFlash(false)
        setSelectedWords([])
      }, 1000)
    }
  }

  const allPlaced = selectedWords.length === correctSequence.length

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-lg font-bold text-foreground">{question.prompt}</p>

      <div
        className={cn(
          'flex min-h-[64px] flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed p-4 transition-colors',
          wrongFlash ? 'border-destructive bg-destructive/5' : 'border-border bg-card',
          allPlaced && !wrongFlash && 'border-primary',
        )}
      >
        {selectedWords.length === 0 && (
          <span className="text-sm text-muted-foreground">Tap the words below to put them in order...</span>
        )}
        {selectedWords.map((shuffleIndex, position) => (
          <button
            key={position}
            onClick={() => handleRemove(position)}
            disabled={showResult}
            className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 font-bold text-primary-foreground transition-colors hover:bg-primary/80"
          >
            {shuffled[shuffleIndex].word}
            {!showResult && <X className="size-3" />}
          </button>
        ))}
      </div>

      <ArrowLeft className="mx-auto size-5 text-muted-foreground" />

      <div className="flex flex-wrap justify-center gap-2">
        {shuffled.map((item, shuffleIndex) => {
          const used = selectedWords.includes(shuffleIndex)
          return (
            <button
              key={shuffleIndex}
              onClick={() => handleWordClick(shuffleIndex)}
              disabled={showResult || used}
              className={cn(
                'rounded-xl border-2 px-3 py-2 font-bold transition-all',
                used && 'border-border bg-muted opacity-30',
                !used && !wrongFlash && 'border-primary/40 bg-card hover:border-primary hover:bg-primary/5',
                wrongFlash && !used && 'border-destructive/40 bg-card',
              )}
            >
              {item.word}
            </button>
          )
        })}
      </div>

      {!showResult && allPlaced && !wrongFlash && (
        <button
          onClick={handleCheck}
          className="mx-auto rounded-xl bg-primary px-8 py-2 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Check
        </button>
      )}
      {wrongFlash && (
        <p className="text-center font-bold text-destructive">Try again!</p>
      )}
      {showResult && (
        <p className="text-center font-bold text-success">
          {correctSequence.join(' ')}
        </p>
      )}
    </div>
  )
}