'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/adventure/types'

interface ImageQuestionProps {
  question: Question
  onAnswer: (correct: boolean) => void
  showResult: boolean
}

export function ImageQuestion({ question, onAnswer, showResult }: ImageQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const options = question.options ?? []
  const correctIndex = question.answerIndex ?? -1

  function handleSelect(index: number) {
    if (showResult) return
    setSelected(index)
    onAnswer(index === correctIndex)
  }

  return (
    <div className="flex flex-col gap-4">
      {question.image && (
        <div className="relative mx-auto aspect-video w-full max-w-md overflow-hidden rounded-2xl border border-border">
          <Image src={question.image} alt="" fill className="object-cover" unoptimized />
        </div>
      )}
      <p className="text-center text-lg font-bold text-foreground">{question.prompt}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option, index) => {
          const isSelected = selected === index
          const isCorrect = index === correctIndex
          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={cn(
                'flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left font-bold transition-all',
                !showResult && !isSelected && 'border-border bg-card hover:border-primary hover:bg-primary/5',
                showResult && isCorrect && 'border-success bg-success/10 text-success',
                showResult && isSelected && !isCorrect && 'border-destructive bg-destructive/10 text-destructive',
                showResult && !isSelected && !isCorrect && 'border-border bg-card opacity-50',
              )}
            >
              <span>{option}</span>
              {showResult && isCorrect && <Check className="size-5 text-success" />}
              {showResult && isSelected && !isCorrect && <X className="size-5 text-destructive" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}