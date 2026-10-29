'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Trophy, Zap, Star, Home, RefreshCw } from 'lucide-react'
import { useSession } from '@/components/session-provider'
import { scoreActivity, levelFromXp, xpToNextLevel } from '@/lib/adventure/gamification'
import { recordCompletion, getTodayCompletion } from '@/lib/adventure/progress'
import type { Activity } from '@/lib/adventure/types'
import { MultipleChoice } from '@/components/games/multiple-choice'
import { TrueFalse } from '@/components/games/true-false'
import { CompleteWord } from '@/components/games/complete-word'
import { MatchConcepts } from '@/components/games/match-concepts'
import { OrderElements } from '@/components/games/order-elements'
import { ImageQuestion } from '@/components/games/image-question'
import { Memory } from '@/components/games/memory'
import { TimedQuiz } from '@/components/games/timed-quiz'
import { SentenceBuilding } from '@/components/games/sentence-building'
import { MatchImages } from '@/components/games/match-images'
import { cn } from '@/lib/utils'

interface GamePlayerProps {
  activity: Activity
}

export function GamePlayer({ activity }: GamePlayerProps) {
  const { student, setStudent } = useSession()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)
  const [startTime] = useState(() => Date.now())
  const [results, setResults] = useState<boolean[]>([])

  const questions = activity.questions
  const question = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1

  const existingCompletion = useMemo(
    () => getTodayCompletion(student.id, activity.id),
    [student.id, activity.id],
  )

  function handleAnswer(correct: boolean) {
    setShowResult(true)
    setResults([...results, correct])
    if (correct) setCorrectCount((c) => c + 1)
  }

  function handleNext() {
    if (isLast) {
      finishActivity()
    } else {
      setCurrentIndex((i) => i + 1)
      setShowResult(false)
    }
  }

  function finishActivity() {
    const timeSec = Math.round((Date.now() - startTime) / 1000)
    const { score, xpEarned } = scoreActivity({
      correctCount,
      totalCount: questions.length,
      timeSec,
      timeLimitSec: activity.timeLimitSec,
      baseXpReward: activity.xpReward,
    })

    let actualXp = xpEarned
    let firstCompletion = false

    if (!existingCompletion) {
      const result = recordCompletion({
        studentId: student.id,
        activityId: activity.id,
        correctCount,
        totalCount: questions.length,
        timeSec,
        score,
        xpEarned,
        date: new Date().toISOString(),
      })
      firstCompletion = result.firstCompletion
      if (result.alreadyCompletedToday) {
        actualXp = 0
      }
    } else {
      actualXp = 0
    }

    if (actualXp > 0) {
      setStudent({
        ...student,
        xp: student.xp + actualXp,
      })
    }

    setFinished(true)
  }

  if (finished) {
    const timeSec = Math.round((Date.now() - startTime) / 1000)
    const { score, xpEarned } = scoreActivity({
      correctCount,
      totalCount: questions.length,
      timeSec,
      timeLimitSec: activity.timeLimitSec,
      baseXpReward: activity.xpReward,
    })
    const earnedXp = existingCompletion ? 0 : xpEarned
    const newLevel = levelFromXp(student.xp)
    const isNewLevel = newLevel > levelFromXp(student.xp - earnedXp)

    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-6 px-4">
        <div className="grid size-24 place-items-center rounded-full bg-primary/10">
          <Trophy className="size-12 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-foreground">
          {score === 100 ? 'Perfect!' : score >= 60 ? 'Well done!' : 'Keep practicing!'}
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          You got {correctCount} out of {questions.length} correct
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3">
            <Star className="size-5 text-accent" />
            <span className="font-display text-2xl font-extrabold text-foreground">{score}%</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3">
            <Zap className="size-5 text-primary" />
            <span className="font-display text-2xl font-extrabold text-foreground">
              {earnedXp > 0 ? `+${earnedXp}` : '0'} XP
            </span>
          </div>
        </div>

        {existingCompletion && (
          <p className="rounded-2xl bg-warning/10 px-4 py-2 text-center text-sm font-bold text-warning-foreground">
            You already completed this challenge today. Come back tomorrow!
          </p>
        )}

        {isNewLevel && earnedXp > 0 && (
          <div className="animate-pulse rounded-2xl bg-primary px-6 py-3 text-center font-display text-lg font-extrabold text-primary-foreground">
            Level up! You reached level {newLevel}!
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              setCurrentIndex(0)
              setCorrectCount(0)
              setShowResult(false)
              setFinished(false)
              setResults([])
            }}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-card px-5 py-2.5 font-bold text-foreground transition-colors hover:bg-muted"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="size-4" />
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  const progressPct = Math.round((currentIndex / questions.length) * 100)

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col gap-6 px-4 py-6">
      <div className="flex items-center gap-3">
        <Link
          href="/materias"
          className="grid size-10 place-items-center rounded-xl border border-border bg-card transition-colors hover:bg-muted"
        >
          <span className="text-lg">←</span>
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-xl font-extrabold text-foreground">{activity.title}</h1>
          <p className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
          <Zap className="size-3" />+{activity.xpReward} XP
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        {renderQuestion(question, activity, showResult, handleAnswer)}
      </div>

      {showResult && (
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {isLast ? 'Finish' : 'Next'}
          </button>
        </div>
      )}
    </div>
  )
}

function renderQuestion(
  question: import('@/lib/adventure/types').Question,
  activity: Activity,
  showResult: boolean,
  onAnswer: (correct: boolean) => void,
) {
  switch (activity.type) {
    case 'multiple-choice':
      return <MultipleChoice question={question} onAnswer={onAnswer} showResult={showResult} />
    case 'true-false':
      return <TrueFalse question={question} onAnswer={onAnswer} showResult={showResult} />
    case 'complete-word':
      return <CompleteWord question={question} onAnswer={onAnswer} showResult={showResult} />
    case 'match-concepts':
      return <MatchConcepts question={question} onAnswer={onAnswer} showResult={showResult} />
    case 'order-elements':
      return <OrderElements question={question} onAnswer={onAnswer} showResult={showResult} />
    case 'image-question':
      return <ImageQuestion question={question} onAnswer={onAnswer} showResult={showResult} />
    case 'memory':
      return <Memory question={question} onAnswer={onAnswer} showResult={showResult} />
    case 'timed-quiz':
      return (
        <TimedQuiz
          question={question}
          onAnswer={onAnswer}
          showResult={showResult}
          timeLimitSec={activity.timeLimitSec ?? 30}
        />
      )
    case 'sentence-building':
      return <SentenceBuilding question={question} onAnswer={onAnswer} showResult={showResult} />
    case 'match-images':
      return <MatchImages question={question} onAnswer={onAnswer} showResult={showResult} />
    default:
      return <p className="text-center text-muted-foreground">Unsupported activity type</p>
  }
}