'use client'

import { useState } from 'react'
import type { Activity, Question } from '@/lib/adventure/types'
import { Button } from '@/components/ui/button'

function QuestionImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null
  return (
    <div className="flex justify-center rounded-2xl bg-muted/40 p-4">
      <img src={src} alt={alt} className="h-40 w-40 object-contain" />
    </div>
  )
}

function ImageQuestion({ question, onAnswer }: { question: Question; onAnswer: (index: number) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <QuestionImage src={question.image} alt="Activity illustration" />
      <div className="flex flex-col gap-3">
        {question.options?.map((option, index) => (
          <Button key={option} type="button" variant="outline" className="min-h-12 justify-start text-left" onClick={() => onAnswer(index)}>
            {option}
          </Button>
        ))}
      </div>
    </div>
  )
}

function CompleteWord({ question, onAnswer }: { question: Question; onAnswer: (answer: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); onAnswer(value) }}>
      <QuestionImage src={question.image} alt="Word clue illustration" />
      <label htmlFor="answer" className="text-sm font-medium">{question.prompt}</label>
      <input id="answer" value={value} onChange={(event) => setValue(event.target.value)} className="h-12 rounded-xl border bg-background px-4 text-lg" autoComplete="off" />
      {question.hint ? <p className="text-sm text-muted-foreground">{question.hint}</p> : null}
      <Button type="submit">Check answer</Button>
    </form>
  )
}

function Matching({ question, onAnswer }: { question: Question; onAnswer: () => void }) {
  const [selected, setSelected] = useState<Record<string, string>>({})
  const pairs = question.pairs ?? []
  const options = pairs.map((pair) => pair.right).sort()
  const complete = pairs.every((pair) => selected[pair.left])
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {pairs.map((pair) => (
          <label key={pair.left} className="flex items-center gap-3 rounded-xl border p-3">
            <QuestionImage src={pair.left} alt="Matching item" />
            <select value={selected[pair.left] ?? ''} onChange={(event) => setSelected({ ...selected, [pair.left]: event.target.value })} className="min-w-0 flex-1 rounded-lg border bg-background p-2">
              <option value="">Choose a word</option>
              {options.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        ))}
      </div>
      <Button type="button" disabled={!complete} onClick={onAnswer}>Check matches</Button>
    </div>
  )
}

function Memory({ question, onAnswer }: { question: Question; onAnswer: () => void }) {
  const [revealed, setRevealed] = useState<string[]>([])
  const cards = (question.pairs ?? []).flatMap((pair) => [
    { id: `${pair.left}-image`, value: pair.left, label: 'Picture', image: pair.left },
    { id: `${pair.right}-word`, value: pair.right, label: pair.right },
  ])
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((card) => {
          const isOpen = revealed.includes(card.id)
          return <button key={card.id} type="button" className="flex min-h-28 items-center justify-center rounded-xl border bg-card p-3 text-center" onClick={() => !isOpen && setRevealed([...revealed, card.id])}>
            {isOpen ? (card.image ? <img src={card.image} alt="Food card" className="h-20 w-20 object-contain" /> : card.label) : '?'}
          </button>
        })}
      </div>
      <Button type="button" disabled={revealed.length < cards.length} onClick={onAnswer}>Finish game</Button>
    </div>
  )
}

export function GamePlayer({ activity }: { activity: Activity }) {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const question = activity.questions[index]

  function answer(value: number | string) {
    const correct = typeof value === 'number' ? value === question.answerIndex : value.trim().toLowerCase() === question.answer?.toLowerCase()
    if (correct) setScore((current) => current + 1)
    if (index >= activity.questions.length - 1) setFinished(true)
    else setIndex((current) => current + 1)
  }

  function finishSpecial() {
    setScore(activity.questions.length)
    setFinished(true)
  }

  if (finished) return <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 p-6 text-center"><p className="text-sm font-medium text-muted-foreground">Activity complete</p><h1 className="text-3xl font-bold">{activity.title}</h1><p className="text-lg">You got {score} out of {activity.questions.length} correct.</p><Button type="button" onClick={() => { setIndex(0); setScore(0); setFinished(false) }}>Play again</Button></main>

  return <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6"><header className="flex flex-col gap-2"><p className="text-sm text-muted-foreground">Question {index + 1} of {activity.questions.length}</p><h1 className="text-3xl font-bold">{activity.title}</h1><p className="text-muted-foreground">{question.prompt}</p></header>{activity.type === 'image-question' ? <ImageQuestion question={question} onAnswer={answer} /> : activity.type === 'complete-word' ? <CompleteWord question={question} onAnswer={answer} /> : activity.type === 'match-concepts' ? <Matching question={question} onAnswer={finishSpecial} /> : activity.type === 'memory' ? <Memory question={question} onAnswer={finishSpecial} /> : <ImageQuestion question={question} onAnswer={answer} />}</main>
}
