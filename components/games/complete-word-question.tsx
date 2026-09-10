'use client'

import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/adventure/types'

export function CompleteWordQuestion({
  question,
  value,
  answered,
  isCorrect,
  onChange,
}: {
  question: Question
  value: string
  answered: boolean
  isCorrect: boolean
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-balance text-center font-display text-2xl font-extrabold text-foreground">
        {question.prompt}
      </h2>
      <div className="relative mx-auto w-full max-w-sm">
        <input
          type="text"
          value={value}
          disabled={answered}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe aquí..."
          autoComplete="off"
          className={cn(
            'h-14 w-full rounded-2xl border-2 bg-card px-5 text-center text-xl font-bold outline-none transition-colors',
            !answered && 'border-border focus:border-ring focus:ring-3 focus:ring-ring/40',
            answered && isCorrect && 'border-success bg-success/10',
            answered && !isCorrect && 'border-destructive bg-destructive/10',
          )}
        />
        {answered && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2">
            {isCorrect ? (
              <Check className="size-6 text-success" />
            ) : (
              <X className="size-6 text-destructive" />
            )}
          </span>
        )}
      </div>
      {answered && !isCorrect && (
        <p className="text-center text-sm font-bold text-muted-foreground">
          Respuesta correcta: <span className="text-success">{question.answer}</span>
        </p>
      )}
    </div>
  )
}
