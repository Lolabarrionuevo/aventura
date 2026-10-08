'use client'

import { FormEvent, useState } from 'react'
import { Bot, Send } from 'lucide-react'
import { StudentNav } from '@/components/student-nav'
import { useSession } from '@/components/session-provider'

export default function TutorPage() {
  const { student } = useSession()
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
            grade: student.grade,
            title: 'Tutor IA de ADVENTURE',
            description: 'Ayuda general para aprender inglés y comprender actividades escolares.',
            type: 'Tutor general',
            question: 'No hay una pregunta de juego activa.',
            options: [],
            vocabulary: '',
            explanation: '',
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
    <div className="min-h-screen bg-background pb-24">
      <StudentNav />
      <main className="mx-auto flex w-full max-w-3xl flex-col px-4 py-8 sm:py-12">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
              <Bot className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="mb-1 text-sm font-bold uppercase tracking-wider text-accent">Tutor IA</p>
              <h1 className="font-display text-3xl font-extrabold text-foreground">¿En qué te ayudo hoy?</h1>
              <p className="mt-2 text-muted-foreground">
                Pregúntame sobre inglés, vocabulario o gramática. Te daré pistas y explicaciones adaptadas a tu grado.
              </p>
            </div>
          </div>

          {answer && <div className="mb-6 rounded-2xl bg-muted p-4 text-sm leading-relaxed text-foreground">{answer}</div>}

          <form onSubmit={ask} className="flex gap-2 rounded-2xl border border-input bg-background p-2 focus-within:ring-2 focus-within:ring-ring">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Escribe tu pregunta..."
              aria-label="Pregunta para el Tutor IA"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-50"
              aria-label="Enviar pregunta"
            >
              <Send className="size-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
