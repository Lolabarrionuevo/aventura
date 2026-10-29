'use client'

import { useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/adventure/types'

interface TimedQuizProps {
  question: Question
  onAnswer: (correct: boolean) => void
  showResult: boolean
  timeLimitSec: number
}

export function TimedQuiz({ question, onAnswer, showResult, timeLimitSec }: TimedQuizProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(timeLimitSec)

  const options = question.options ?? []
  const correctIndex = question.answerIndex ?? -1

  useEffect(() => {
    if (showResult || timeLeft <= 0) return
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, showResult])

  useEffect(() => {
    if (timeLeft === 0 && !showResult) {
      onAnswer(false)
    }
  }, [timeLeft, showResult, onAnswer])

  function handleSelect(index: number) {
    if (showResult || timeLeft <= 0) return
    setSelected(index)
    onAnswer(index === correctIndex)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full border-4 border-accent bg-accent/10 font-display text-2xl font-extrabold text-accent-foreground">
        {timeLeft}s
      </div>
      <p className="text-center text-lg font-bold text-foreground">{question.prompt}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map((option, index) => {
          const isSelected = selected === index
          const isCorrect = index === correctIndex
          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={cn(
                'flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3 font-bold transition-all',
                !showResult && !isSelected && 'border-border bg-card hover:border-primary hover:bg-primary/5',
                showResult && isCorrect && 'border-success bg-success/10 text-success',
                showResult && isSelected && !isCorrect && 'border-destructive bg-destructive/10 text-destructive',
                showResult && !isSelected && !isCorrect && 'border-border bg-card opacity-50',
              )}
            >
              {option}
              {showResult && isCorrect && <Check className="size-5" />}
              {showResult && isSelected && !isCorrect && <X className="size-5" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}