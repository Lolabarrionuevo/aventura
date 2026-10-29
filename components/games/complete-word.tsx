'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/adventure/types'

interface CompleteWordProps {
  question: Question
  onAnswer: (correct: boolean) => void
  showResult: boolean
}

export function CompleteWord({ question, onAnswer, showResult }: CompleteWordProps) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const answer = (question.answer ?? '').toLowerCase().trim()

  function handleSubmit() {
    if (showResult) return
    const correct = value.toLowerCase().trim() === answer
    setSubmitted(true)
    onAnswer(correct)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-lg font-bold text-foreground">{question.prompt}</p>
      {question.hint && !showResult && (
        <p className="text-center text-sm text-muted-foreground">Hint: {question.hint}</p>
      )}
      <div className="flex flex-col items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={showResult}
          placeholder="Type your answer..."
          className={cn(
            'w-full max-w-sm rounded-2xl border-2 px-4 py-3 text-center text-lg font-bold outline-none transition-colors',
            submitted
              ? answer === value.toLowerCase().trim()
                ? 'border-success bg-success/10 text-success'
                : 'border-destructive bg-destructive/10 text-destructive'
              : 'border-border bg-card focus:border-primary',
          )}
        />
        {!showResult && (
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="rounded-xl bg-primary px-6 py-2 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            Check
          </button>
        )}
        {showResult && (
          <div className="flex items-center gap-2">
            {answer === value.toLowerCase().trim() ? (
              <span className="flex items-center gap-1 font-bold text-success">
                <Check className="size-5" /> Correct!
              </span>
            ) : (
              <span className="flex items-center gap-1 font-bold text-destructive">
                <X className="size-5" /> Answer: {question.answer}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}