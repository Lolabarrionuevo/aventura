'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Check, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/adventure/types'

interface MatchImagesProps {
  question: Question
  onAnswer: (correct: boolean) => void
  showResult: boolean
}

interface ImagePair {
  image: string
  word: string
}

export function MatchImages({ question, onAnswer, showResult }: MatchImagesProps) {
  const pairs: ImagePair[] = (question.pairs ?? []).map((p) => ({
    image: p.left,
    word: p.right,
  }))

  const shuffleArray = useCallback(<T,>(arr: T[]): T[] => {
    const copy = [...arr]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  }, [])

  const [shuffledWords] = useState(() => shuffleArray(pairs.map((p) => p.word)))
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [matches, setMatches] = useState<Record<number, number>>({})
  const [wrongFlash, setWrongFlash] = useState<{ image: number; word: number } | null>(null)

  function handleImageClick(index: number) {
    if (showResult || matches[index] !== undefined) return
    setSelectedImage(index)
    setWrongFlash(null)
  }

  function handleWordClick(wordIndex: number) {
    if (showResult || selectedImage === null) return
    const word = shuffledWords[wordIndex]
    const correctWord = pairs[selectedImage].word

    if (word === correctWord) {
      setMatches({ ...matches, [selectedImage]: wordIndex })
      setSelectedImage(null)
      const newCount = Object.keys({ ...matches, [selectedImage]: wordIndex }).length
      if (newCount === pairs.length) {
        onAnswer(true)
      }
    } else {
      setWrongFlash({ image: selectedImage, word: wordIndex })
      setTimeout(() => setWrongFlash(null), 700)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-lg font-bold text-foreground">{question.prompt}</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {pairs.map((pair, index) => {
          const isMatched = matches[index] !== undefined
          const isSelected = selectedImage === index
          return (
            <button
              key={index}
              onClick={() => handleImageClick(index)}
              disabled={showResult || isMatched}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 transition-all',
                isMatched && 'border-success bg-success/10',
                !isMatched && isSelected && 'border-primary bg-primary/10 ring-2 ring-primary/30',
                !isMatched && !isSelected && 'border-border bg-card hover:border-primary/50',
                wrongFlash?.image === index && 'animate-pulse border-destructive bg-destructive/10',
              )}
            >
              <div className="relative h-full w-full">
                <Image src={pair.image} alt="" fill className="object-cover" unoptimized />
              </div>
              {isMatched && (
                <span className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-success text-success-foreground">
                  <Check className="size-4" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-2 border-t border-border pt-4">
        {shuffledWords.map((word, index) => {
          const used = Object.values(matches).includes(index)
          return (
            <button
              key={index}
              onClick={() => handleWordClick(index)}
              disabled={showResult || used || selectedImage === null}
              className={cn(
                'flex items-center gap-1 rounded-xl border-2 px-4 py-2 font-bold transition-all',
                used && 'border-success bg-success/10 text-success',
                !used && selectedImage !== null && 'border-primary/50 bg-card hover:border-primary',
                !used && selectedImage === null && 'border-border bg-card',
                wrongFlash?.word === index && 'animate-pulse border-destructive bg-destructive/10',
              )}
            >
              {word}
              {used && <Link2 className="size-3" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}