'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, Users, UserPlus } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { useSession } from '@/components/session-provider'
import { students, teachers, GRADE_OPTIONS, GRADE_LABELS } from '@/lib/adventure/data'
import type { Grade, Student, Teacher } from '@/lib/adventure/types'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

type Role = 'alumno' | 'profesor'

export default function RegistroPage() {
  const router = useRouter()
  const { setStudent, setTeacher } = useSession()
  const [role, setRole] = useState<Role>('alumno')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [grade, setGrade] = useState<Grade | ''>('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name || !username || !password) {
      setError('Completa todos los campos para crear tu cuenta.')
      return
    }
    if (!grade) {
      setError('Seleccioná tu grado para continuar.')
      return
    }

    if (role === 'alumno') {
      const newStudent: Student = {
        id: `st-${Date.now()}`,
        name,
        username: username.toLowerCase(),
        role: 'alumno',
        avatar: '',
        courseId: 'c-4a',
        grade: grade as Grade,
        level: 1,
        xp: 0,
        streakDays: 0,
        badgeIds: [],
      }
      students.push(newStudent)
      setStudent(newStudent)
      router.push('/dashboard')
      return
    }

    const newTeacher: Teacher = {
      id: `t-${Date.now()}`,
      name,
      username: username.toLowerCase(),
      role: 'profesor',
      avatar: '',
      courseIds: ['c-4a'],
      grade: grade as Grade,
    }
    teachers.push(newTeacher)
    setTeacher(newTeacher)
    router.push('/profesor')
  }

  return (
    <AuthShell
      title="Crea tu cuenta 🎒"
      subtitle="Únete a ADVENTURE y empieza a aprender jugando."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <RoleToggle role={role} onChange={setRole} />

        <Field label="Nombre completo">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sofía Martínez"
            autoComplete="name"
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/40"
          />
        </Field>

        <Field label="Usuario">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="sofia"
            autoComplete="username"
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/40"
          />
        </Field>

        <Field label="Contraseña">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/40"
          />
        </Field>

        <Field label={role === 'alumno' ? '¿En qué grado estás?' : '¿A qué grado enseñás?'}>
          <div className="grid grid-cols-3 gap-2">
            {GRADE_OPTIONS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={cn(
                  'rounded-xl border-2 py-3 text-sm font-bold transition-colors',
                  grade === g
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:border-ring/50',
                )}
              >
                {GRADE_LABELS[g]}
              </button>
            ))}
          </div>
        </Field>

        {error && (
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={cn(buttonVariants(), 'h-12 rounded-xl text-base font-extrabold')}
        >
          <UserPlus className="size-5" aria-hidden="true" />
          Crear cuenta
        </button>

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}

function RoleToggle({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  const options: { value: Role; label: string; icon: typeof GraduationCap }[] = [
    { value: 'alumno', label: 'Alumno', icon: GraduationCap },
    { value: 'profesor', label: 'Profesor', icon: Users },
  ]
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1.5" role="tablist">
      {options.map(({ value, label, icon: Icon }) => {
        const active = role === value
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(value)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-colors',
              active
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        )
      })}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-bold text-foreground">{label}</span>
      {children}
    </label>
  )
}
