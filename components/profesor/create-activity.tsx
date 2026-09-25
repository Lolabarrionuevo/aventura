'use client'

import { useState } from 'react'
import { Plus, Trash2, Check, BookPlus, Gamepad2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { addActivity, GRADE_LABELS } from '@/lib/adventure/data'
import type { Activity, Difficulty, Grade, Question } from '@/lib/adventure/types'

type Tab = 'ejercicio' | 'juego'

interface QuestionDraft {
  id: string
  prompt: string
  options: string[]
  answerIndex: number
}

let qCounter = 0
function newQId() {
  qCounter += 1
  return `q-${Date.now()}-${qCounter}`
}

export function CreateActivityPanel({
  teacherGrade,
  onCreated,
}: {
  teacherGrade: Grade
  onCreated: () => void
}) {
  const [tab, setTab] = useState<Tab>('ejercicio')

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Plus className="size-5" />
        </span>
        <div>
          <h2 className="font-display text-lg font-extrabold text-card-foreground">
            Crear contenido
          </h2>
          <p className="text-sm text-muted-foreground">
            Para {GRADE_LABELS[teacherGrade]}
          </p>
        </div>
      </div>

      {/* Tabs internos */}
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1.5">
        <TabButton active={tab === 'ejercicio'} onClick={() => setTab('ejercicio')} icon={<BookPlus className="size-4" />}>
          Crear ejercicio
        </TabButton>
        <TabButton active={tab === 'juego'} onClick={() => setTab('juego')} icon={<Gamepad2 className="size-4" />}>
          Crear juego
        </TabButton>
      </div>

      {tab === 'ejercicio' ? (
        <ExerciseForm teacherGrade={teacherGrade} onCreated={onCreated} />
      ) : (
        <GameForm teacherGrade={teacherGrade} onCreated={onCreated} />
      )}
    </section>
  )
}

function ExerciseForm({
  teacherGrade,
  onCreated,
}: {
  teacherGrade: Grade
  onCreated: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [prompt, setPrompt] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    if (!title || !prompt || !answer) {
      setError('Completa el título, la pregunta y la respuesta correcta.')
      return
    }

    const activity: Activity = {
      id: `a-${Date.now()}`,
      title,
      description: description || 'Ejercicio creado por el profesor',
      type: 'complete-word',
      difficulty: 'medio',
      subjectId: 's-english',
      grade: teacherGrade,
      xpReward: 50,
      questions: [
        {
          id: newQId(),
          prompt,
          answer: answer.toLowerCase().trim(),
        },
      ],
      createdByTeacher: true,
    }
    addActivity(activity)
    setSuccess(true)
    setTitle('')
    setDescription('')
    setPrompt('')
    setAnswer('')
    onCreated()
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField label="Título del ejercicio">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Practicar los colores"
          className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </FormField>

      <FormField label="Consigna (opcional)">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Escribí el nombre del color en inglés"
          className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </FormField>

      <FormField label="Pregunta">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: ¿Cómo se dice &quot;rojo&quot; en inglés?"
          rows={2}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </FormField>

      <FormField label="Respuesta correcta">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Ej: red"
          className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </FormField>

      {error && <ErrorMsg msg={error} />}
      {success && <SuccessMsg msg="Ejercicio creado. Ya está disponible para tus alumnos." />}

      <button
        type="submit"
        className={cn(buttonVariants(), 'h-11 rounded-xl font-bold')}
      >
        <Plus className="size-4" />
        Publicar ejercicio
      </button>
    </form>
  )
}

function GameForm({
  teacherGrade,
  onCreated,
}: {
  teacherGrade: Grade
  onCreated: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('facil')
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    { id: newQId(), prompt: '', options: ['', '', '', ''], answerIndex: 0 },
  ])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function addQuestion() {
    setQuestions((qs) => [
      ...qs,
      { id: newQId(), prompt: '', options: ['', '', '', ''], answerIndex: 0 },
    ])
  }

  function removeQuestion(id: string) {
    setQuestions((qs) => qs.filter((q) => q.id !== id))
  }

  function updateQuestion(id: string, field: keyof QuestionDraft, value: string | number) {
    setQuestions((qs) =>
      qs.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    )
  }

  function updateOption(qId: string, optIndex: number, value: string) {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.map((o, i) => (i === optIndex ? value : o)) }
          : q,
      ),
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!title) {
      setError('El juego necesita un título.')
      return
    }
    const valid = questions.filter((q) => q.prompt.trim() && q.options.every((o) => o.trim()))
    if (valid.length === 0) {
      setError('Agregá al menos una pregunta completa con todas las opciones.')
      return
    }

    const builtQuestions: Question[] = valid.map((q) => ({
      id: q.id,
      prompt: q.prompt.trim(),
      options: q.options.map((o) => o.trim()),
      answerIndex: q.answerIndex,
    }))

    const activity: Activity = {
      id: `a-${Date.now()}`,
      title,
      description: description || 'Juego creado por el profesor',
      type: 'multiple-choice',
      difficulty,
      subjectId: 's-english',
      grade: teacherGrade,
      xpReward: difficulty === 'facil' ? 60 : difficulty === 'medio' ? 80 : 100,
      questions: builtQuestions,
      createdByTeacher: true,
    }
    addActivity(activity)
    setSuccess(true)
    setTitle('')
    setDescription('')
    setQuestions([{ id: newQId(), prompt: '', options: ['', '', '', ''], answerIndex: 0 }])
    onCreated()
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField label="Título del juego">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Quiz de animales"
          className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </FormField>

      <FormField label="Descripción (opcional)">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Responde rápido y suma XP"
          className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </FormField>

      <FormField label="Dificultad">
        <div className="grid grid-cols-3 gap-2">
          {(['facil', 'medio', 'dificil'] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={cn(
                'rounded-xl border-2 py-2.5 text-sm font-bold transition-colors',
                difficulty === d
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-ring/50',
              )}
            >
              {d === 'facil' ? 'Fácil' : d === 'medio' ? 'Medio' : 'Difícil'}
            </button>
          ))}
        </div>
      </FormField>

      {/* Preguntas */}
      <div className="flex flex-col gap-4">
        {questions.map((q, qi) => (
          <div key={q.id} className="rounded-2xl border border-border bg-muted/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-extrabold text-foreground">
                Pregunta {qi + 1}
              </span>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  className="text-destructive hover:text-destructive/80"
                  aria-label="Eliminar pregunta"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
            <input
              type="text"
              value={q.prompt}
              onChange={(e) => updateQuestion(q.id, 'prompt', e.target.value)}
              placeholder="Escribí la pregunta"
              className="mb-3 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            <p className="mb-2 text-xs font-bold text-muted-foreground">
              Opciones (tocá la correcta para marcarla)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  type="button"
                  onClick={() => updateQuestion(q.id, 'answerIndex', oi)}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm transition-colors',
                    q.answerIndex === oi
                      ? 'border-success bg-success/10 text-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-ring/50',
                  )}
                >
                  {q.answerIndex === oi && <Check className="size-4 shrink-0 text-success" />}
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(q.id, oi, e.target.value)}
                    placeholder={`Opción ${oi + 1}`}
                    className="w-full bg-transparent text-sm outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addQuestion}
        className={cn(buttonVariants({ variant: 'outline' }), 'h-10 rounded-xl font-bold')}
      >
        <Plus className="size-4" />
        Agregar otra pregunta
      </button>

      {error && <ErrorMsg msg={error} />}
      {success && <SuccessMsg msg="Juego creado. Ya está disponible para tus alumnos." />}

      <button
        type="submit"
        className={cn(buttonVariants(), 'h-11 rounded-xl font-bold')}
      >
        <Gamepad2 className="size-4" />
        Publicar juego
      </button>
    </form>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors',
        active
          ? 'bg-card text-primary shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      {children}
    </button>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-bold text-foreground">{label}</span>
      {children}
    </label>
  )
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
      <X className="size-4 shrink-0" />
      {msg}
    </div>
  )
}

function SuccessMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm font-semibold text-success">
      <Check className="size-4 shrink-0" />
      {msg}
    </div>
  )
}
