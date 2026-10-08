'use client'

import { FormEvent, useState } from 'react'
import { Bot, Send, X } from 'lucide-react'
import type { Activity, Question } from '@/lib/adventure/types'

type Props = { activity: Activity; question: Question; grade: string }

export function ActivityTutor({ activity, question, grade }: Props) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  async function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!message.trim() || loading) return
    const currentMessage = message.trim()
    setMessage('')
    setLoading(true)
    setAnswer('')
    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentMessage,
          context: {
            grade,
            title: activity.title,
            description: activity.description,
            type: activity.type,
            question: question.prompt,
            options: question.options,
            vocabulary: question.sequence?.join(' ') || question.pairs?.map((pair) => `${pair.left} = ${pair.right}`).join(', '),
            explanation: question.hint,
          },
        }),
      })
      const data = await response.json()
      setAnswer(data.answer || data.error || 'No pude responder ahora.')
    } catch {
      setAnswer('No pude conectarme ahora. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-20 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 font-extrabold text-accent-foreground shadow-lg transition-transform hover:scale-105"
        aria-label="Abrir Tutor IA"
      >
        <Bot className="size-5" /> Tutor IA
      </button>
      {open && (
        <div className="fixed inset-x-4 bottom-24 z-30 mx-auto max-w-md rounded-2xl border border-border bg-background p-4 shadow-2xl sm:right-6 sm:left-auto">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-display font-extrabold">Tutor IA</p>
              <p className="text-xs text-muted-foreground">Te ayudo con esta pregunta sin resolverla por ti.</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar Tutor IA" className="rounded-full p-2 hover:bg-muted">
              <X className="size-4" />
            </button>
          </div>
          {answer && <p className="mb-3 rounded-xl bg-muted p-3 text-sm leading-relaxed">{answer}</p>}
          <form onSubmit={ask} className="flex gap-2">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Escribe tu pregunta..."
              aria-label="Pregunta para el Tutor IA"
              className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="submit" disabled={!message.trim() || loading} aria-label="Enviar pregunta" className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50">
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
