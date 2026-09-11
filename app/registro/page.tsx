'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, Users, UserPlus } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { useSession } from '@/components/session-provider'
import { persistStudent } from '@/lib/adventure/data'
import { cn } from '@/lib/utils'

const GRADES = [1, 2, 3, 4, 5, 6]
const DIVISIONS = ['A', 'B']
import { buttonVariants } from '@/components/ui/button'

type Role = 'alumno' | 'profesor'

export default function RegistroPage() {
  const router = useRouter()
  const { setStudent } = useSession()
  const [role, setRole] = useState<Role>('alumno')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [grade, setGrade] = useState(4)
  const [division, setDivision] = useState('A')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name || !username || !password) {
      setError('Completa todos los campos para crear tu cuenta.')
      return
    }

    if (role === 'alumno') {
      // Creamos un alumno nuevo y lo guardamos para que no se pierda al recargar.
      const newStudent = {
        id: `st-${Date.now()}`,
        name,
        username: username.toLowerCase(),
        role: 'alumno' as const,
        avatar: '',
        courseId: 'c-4a',
        grade,
        division,
        level: 1,
        xp: 0,
        streakDays: 0,
        badgeIds: [],
      }
      persistStudent(newStudent)
      setStudent(newStudent)
      router.push('/dashboard')
      return
    }
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

        {role === 'alumno' && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Grado">
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/40"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}°
                  </option>
                ))}
              </select>
            </Field>

            <Field label="División">
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/40"
              >
                {DIVISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

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
