'use client'

import { useState } from 'react'
import type { Activity, Question } from '@/lib/adventure/types'
import { Button } from '@/components/ui/button'
import { useSession } from '@/components/session-provider'
import { getTodayCompletion, recordCompletion } from '@/lib/adventure/progress'
import { newlyEarnedBadges, scoreActivity } from '@/lib/adventure/gamification'
import { getBadge } from '@/lib/adventure/data'

function QuestionImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null
  return <div className="flex justify-center rounded-3xl bg-secondary/10 p-5"><img src={src} alt={alt} className="h-44 w-44 object-contain" /></div>
}

function ImageQuestion({ question, onAnswer }: { question: Question; onAnswer: (index: number) => void }) {
  return <div className="flex flex-col gap-5"><QuestionImage src={question.image} alt="Activity illustration" /><div className="grid gap-3">{question.options?.map((option, index) => <Button key={option} type="button" variant="outline" className="min-h-14 justify-start rounded-2xl border-2 px-5 text-left text-base" onClick={() => onAnswer(index)}>{option}</Button>)}</div></div>
}

function CompleteWord({ question, onAnswer }: { question: Question; onAnswer: (answer: string) => void }) {
  const [value, setValue] = useState('')
  return <form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); onAnswer(value) }}><QuestionImage src={question.image} alt="Word clue illustration" /><label htmlFor="answer" className="text-sm font-bold">{question.prompt}</label><input id="answer" value={value} onChange={(event) => setValue(event.target.value)} className="h-14 rounded-2xl border-2 bg-background px-4 text-lg" autoComplete="off" /><Button type="submit" className="h-12 rounded-2xl">Check answer</Button></form>
}

function Matching({ question, onAnswer }: { question: Question; onAnswer: () => void }) {
  const [selected, setSelected] = useState<Record<string, string>>({})
  const pairs = question.pairs ?? []
  const options = pairs.map((pair) => pair.right).sort()
  const complete = pairs.every((pair) => selected[pair.left])
  return <div className="flex flex-col gap-4"><div className="grid gap-3 sm:grid-cols-2">{pairs.map((pair) => <label key={pair.left} className="flex items-center gap-3 rounded-2xl border-2 bg-card p-3"><QuestionImage src={pair.left} alt="Matching item" /><select value={selected[pair.left] ?? ''} onChange={(event) => setSelected({ ...selected, [pair.left]: event.target.value })} className="min-w-0 flex-1 rounded-xl border bg-background p-2"><option value="">Choose a word</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>)}</div><Button type="button" disabled={!complete} onClick={onAnswer}>Check matches</Button></div>
}

function Memory({ question, onAnswer }: { question: Question; onAnswer: () => void }) {
  const [revealed, setRevealed] = useState<string[]>([])
  const cards = (question.pairs ?? []).flatMap((pair) => [{ id: `${pair.left}-image`, label: 'Picture', image: pair.left }, { id: `${pair.right}-word`, label: pair.right }])
  return <div className="flex flex-col gap-4"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{cards.map((card) => { const isOpen = revealed.includes(card.id); return <button key={card.id} type="button" className="flex min-h-28 items-center justify-center rounded-2xl border-2 bg-card p-3 text-center text-lg font-bold" onClick={() => !isOpen && setRevealed([...revealed, card.id])}>{isOpen ? (card.image ? <img src={card.image} alt="Memory card" className="h-20 w-20 object-contain" /> : card.label) : '?'}</button> })}</div><Button type="button" disabled={revealed.length < cards.length} onClick={onAnswer}>Finish game</Button></div>
}

export function GamePlayer({ activity }: { activity: Activity }) {
  const { student, setStudent } = useSession()
  const existing = typeof window !== 'undefined' ? getTodayCompletion(student.id, activity.id) : undefined
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(Boolean(existing))
  const [result, setResult] = useState(existing)
  const [newBadgeIds, setNewBadgeIds] = useState<string[]>([])
  const question = activity.questions[index]

  function finish(correctCount: number) {
    if (result) return
    const scored = scoreActivity({ correctCount, totalCount: activity.questions.length, timeSec: 0, timeLimitSec: activity.timeLimitSec, baseXpReward: activity.xpReward })
    const saved = recordCompletion({ id: `${student.id}-${activity.id}-${Date.now()}`, studentId: student.id, activityId: activity.id, correctCount, totalCount: activity.questions.length, timeSec: 0, score: scored.score, xpEarned: scored.xpEarned, date: new Date().toISOString() })
    const nextStudent = { ...student, xp: student.xp + (saved.alreadyCompletedToday ? 0 : scored.xpEarned) }
    const newBadges = newlyEarnedBadges(nextStudent, activity.id, scored.score)
    nextStudent.badgeIds = [...new Set([...student.badgeIds, ...newBadges.map((badge) => badge.id)])]
    setNewBadgeIds(newBadges.map((badge) => badge.id))
    setStudent(nextStudent)
    setResult(saved.completion)
    setScore(correctCount)
    setFinished(true)
  }

  function answer(value: number | string) {
    const correct = typeof value === 'number' ? value === question.answerIndex : value.trim().toLowerCase() === question.answer?.toLowerCase()
    const nextScore = score + (correct ? 1 : 0)
    if (index >= activity.questions.length - 1) finish(nextScore)
    else { if (correct) setScore(nextScore); setIndex((current) => current + 1) }
  }

  if (finished) {
    const badge = newBadgeIds.map((id) => getBadge(id)).find(Boolean)
    return <main className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center p-5"><section className="w-full rounded-[2rem] border-2 border-primary/20 bg-card p-7 text-center shadow-xl sm:p-10"><div className="mb-4 text-6xl" aria-hidden="true">{result?.score === 100 ? '🏆' : '⭐'}</div><p className="font-bold text-primary">Juego completado</p><h1 className="mt-2 font-display text-3xl font-extrabold text-card-foreground">{activity.title}</h1><p className="mt-3 text-lg text-muted-foreground">Obtuviste {result?.correctCount ?? score} de {activity.questions.length} respuestas correctas.</p><div className="my-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-primary/10 p-4"><p className="text-sm text-muted-foreground">Resultado</p><p className="font-display text-3xl font-extrabold text-primary">{result?.score ?? 0}%</p></div><div className="rounded-2xl bg-accent/15 p-4"><p className="text-sm text-muted-foreground">XP ganados</p><p className="font-display text-3xl font-extrabold text-accent-foreground">+{result?.xpEarned ?? 0}</p></div></div>{badge ? <div className="mb-6 rounded-2xl bg-secondary/10 p-4"><p className="font-bold">Logro desbloqueado</p><p className="mt-1 text-muted-foreground">{badge.emoji} {badge.name}</p></div> : null}<Button type="button" className="h-12 rounded-2xl px-8" onClick={() => window.location.assign('/materias')}>Volver a actividades</Button></section></main>
  }

  return <main className="mx-auto flex max-w-3xl flex-col gap-6 p-5"><header className="rounded-3xl bg-gradient-to-br from-primary to-secondary p-6 text-primary-foreground shadow-lg"><p className="text-sm font-bold opacity-90">Pregunta {index + 1} de {activity.questions.length}</p><h1 className="mt-1 font-display text-3xl font-extrabold">{activity.title}</h1><p className="mt-2 opacity-90">{question.prompt}</p></header>{activity.type === 'image-question' ? <ImageQuestion question={question} onAnswer={answer} /> : activity.type === 'complete-word' ? <CompleteWord question={question} onAnswer={answer} /> : activity.type === 'match-concepts' ? <Matching question={question} onAnswer={() => finish(activity.questions.length)} /> : activity.type === 'memory' ? <Memory question={question} onAnswer={() => finish(activity.questions.length)} /> : <ImageQuestion question={question} onAnswer={answer} />}</main>
}
