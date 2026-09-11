'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { X, ArrowRight, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProgressBar } from '@/components/progress-bar'
import { useSession } from '@/components/session-provider'
import { persistStudent } from '@/lib/adventure/data'
import { ChoiceQuestion } from './choice-question'
import { CompleteWordQuestion } from './complete-word-question'
import { OrderQuestion } from './order-question'
import { MatchQuestion } from './match-question'
import { MemoryQuestion } from './memory-question'
import { ActivityResultScreen } from './activity-result'
import { scoreActivity } from '@/lib/adventure/gamification'
import type { Activity } from '@/lib/adventure/types'

export function GamePlayer({ activity }: { activity: Activity }) {
  const router = useRouter()
  const { student, setStudent } = useSession()

  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)
  const [result, setResult] = useState<{ score: number; xpEarned: number; timeSec: number } | null>(
    null,
  )

  // Estado de la pregunta actual
  const [selected, setSelected] = useState<number | null>(null)
  const [textValue, setTextValue] = useState('')
  const [orderChosen, setOrderChosen] = useState<number[]>([])
  const [answered, setAnswered] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(false)

  const startRef = useRef(Date.now())
  const total = activity.questions.length
  const question = activity.questions[index]

  // Temporizador para quiz contra reloj
  const [timeLeft, setTimeLeft] = useState(activity.timeLimitSec ?? 0)
  const isTimed = activity.type === 'timed-quiz'

  useEffect(() => {
    if (!isTimed || done) return
    if (timeLeft <= 0) {
      finish(correctCount)
      return
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isTimed, done])

  function finish(finalCorrect: number) {
    const timeSec = Math.round((Date.now() - startRef.current) / 1000)
    const { score, xpEarned } = scoreActivity({
      correctCount: finalCorrect,
      totalCount: total,
      timeSec,
      timeLimitSec: activity.timeLimitSec,
      baseXpReward: activity.xpReward,
    })
    // Otorga XP al alumno y lo guarda (array en memoria + localStorage) para que
    // los puntos aparezcan en el ranking y no se pierdan al recargar.
    const updated = { ...student, xp: student.xp + xpEarned }
    persistStudent(updated)
    setStudent(updated)
    setResult({ score, xpEarned, timeSec })
    setDone(true)
  }

  function commitChoice(i: number) {
    if (answered) return
    setSelected(i)
    const correct = i === question.answerIndex
    setLastCorrect(correct)
    setAnswered(true)
    if (correct) setCorrectCount((c) => c + 1)
  }

  function commitText() {
    if (answered || !textValue.trim()) return
    const correct =
      textValue.trim().toLowerCase() === (question.answer ?? '').trim().toLowerCase()
    setLastCorrect(correct)
    setAnswered(true)
    if (correct) setCorrectCount((c) => c + 1)
  }

  function chooseOrder(i: number) {
    if (answered) return
    const next = [...orderChosen, i]
    setOrderChosen(next)
    if (next.length === (question.sequence?.length ?? 0)) {
      const correct = next.every((v, pos) => v === pos)
      setLastCorrect(correct)
      setAnswered(true)
      if (correct) setCorrectCount((c) => c + 1)
    }
  }

  function completeInteractive() {
    // match-concepts y memory: completarlos cuenta como acierto.
    setLastCorrect(true)
    setAnswered(true)
    setCorrectCount((c) => c + 1)
  }

  function next() {
    const nextCorrect = correctCount
    if (index + 1 >= total) {
      finish(nextCorrect)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setTextValue('')
    setOrderChosen([])
    setAnswered(false)
    setLastCorrect(false)
  }

  if (done && result) {
    return (
      <ActivityResultScreen
        activity={activity}
        correctCount={correctCount}
        total={total}
        score={result.score}
        xpEarned={result.xpEarned}
        timeSec={result.timeSec}
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Barra superior con progreso */}
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4">
          <Link
            href="/materias"
            aria-label="Salir de la actividad"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </Link>
          <ProgressBar value={((index + (answered ? 1 : 0)) / total) * 100} className="h-4" />
          {isTimed ? (
            <span
              className={cn(
                'inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-sm font-extrabold',
                timeLeft <= 10 ? 'bg-destructive/10 text-destructive' : 'bg-muted text-foreground',
              )}
            >
              <Timer className="size-4" />
              {timeLeft}s
            </span>
          ) : (
            <span className="shrink-0 text-sm font-bold text-muted-foreground">
              {index + 1}/{total}
            </span>
          )}
        </div>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col px-4 py-8">
        {/* Render de la pregunta según el tipo */}
        {(activity.type === 'multiple-choice' ||
          activity.type === 'true-false' ||
          activity.type === 'image-question' ||
          activity.type === 'timed-quiz') && (
          <ChoiceQuestion
            question={question}
            selected={selected}
            answered={answered}
            onSelect={commitChoice}
          />
        )}

        {activity.type === 'complete-word' && (
          <CompleteWordQuestion
            question={question}
            value={textValue}
            answered={answered}
            isCorrect={lastCorrect}
            onChange={setTextValue}
          />
        )}

        {activity.type === 'order-elements' && (
          <OrderQuestion
            question={question}
            chosen={orderChosen}
            answered={answered}
            isCorrect={lastCorrect}
            onChoose={chooseOrder}
            onReset={() => setOrderChosen([])}
          />
        )}

        {activity.type === 'match-concepts' && (
          <MatchQuestion question={question} answered={answered} onComplete={completeInteractive} />
        )}

        {activity.type === 'memory' && (
          <MemoryQuestion question={question} answered={answered} onComplete={completeInteractive} />
        )}
      </div>

      {/* Barra inferior de acción */}
      <footer
        className={cn(
          'fixed inset-x-0 bottom-0 border-t transition-colors',
          answered && lastCorrect && 'border-success/30 bg-success/10',
          answered && !lastCorrect && 'border-destructive/30 bg-destructive/10',
          !answered && 'border-border bg-background',
        )}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-h-6">
            {answered && (
              <p
                className={cn(
                  'font-display text-lg font-extrabold',
                  lastCorrect ? 'text-success' : 'text-destructive',
                )}
              >
                {lastCorrect ? '¡Correcto! 🎉' : '¡Casi! Sigue intentando 💪'}
              </p>
            )}
          </div>

          {/* Botón de acción contextual */}
          {activity.type === 'complete-word' && !answered ? (
            <button
              type="button"
              onClick={commitText}
              disabled={!textValue.trim()}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 font-extrabold text-primary-foreground disabled:opacity-50"
            >
              Comprobar
            </button>
          ) : answered ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 font-extrabold text-primary-foreground"
            >
              {index + 1 >= total ? 'Finalizar' : 'Continuar'}
              <ArrowRight className="size-5" />
            </button>
          ) : (
            <span className="text-sm text-muted-foreground">
              {activity.type === 'match-concepts' || activity.type === 'memory'
                ? 'Completa el ejercicio'
                : 'Elige tu respuesta'}
            </span>
          )}
        </div>
      </footer>
    </main>
  )
}
