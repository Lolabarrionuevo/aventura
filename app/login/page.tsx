'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, Users, Eye, EyeOff, LogIn } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { useSession } from '@/components/session-provider'
import { getStudentByUsername, getTeacherByUsername } from '@/lib/adventure/data'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

type Role = 'alumno' | 'profesor'

export default function LoginPage() {
  const router = useRouter()
  const { setStudent, setTeacher } = useSession()
  const [role, setRole] = useState<Role>('alumno')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Escribe tu usuario y contraseña.')
      return
    }

    if (role === 'alumno') {
      const student = getStudentByUsername(username)
      if (!student) {
        setError('No encontramos ese alumno. Prueba con "sofia".')
        return
      }
      setStudent(student)
      router.push('/dashboard')
      return
    }

    const teacher = getTeacherByUsername(username)
    if (!teacher) {
      setError('No encontramos ese profesor. Prueba con "laura".')
      return
    }
    setTeacher(teacher)
    router.push('/profesor')
  }

  return (
    <AuthShell
      title="¡Bienvenido de nuevo! 👋"
      subtitle="Inicia sesión para continuar tu aventura."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <RoleToggle role={role} onChange={setRole} />

        <Field label="Usuario">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={role === 'alumno' ? 'sofia' : 'laura'}
            autoComplete="username"
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/40"
          />
        </Field>

        <Field label="Contraseña">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-12 w-full rounded-xl border border-input bg-background px-4 pr-12 text-base outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
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
          <LogIn className="size-5" aria-hidden="true" />
          Entrar
        </button>

        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="font-bold text-primary hover:underline">
            Regístrate
          </Link>
        </p>

        <p className="rounded-xl bg-muted px-4 py-3 text-center text-xs text-muted-foreground">
          Demo: entra como alumno con usuario <strong>sofia</strong> o como profesor con{' '}
          <strong>laura</strong> (cualquier contraseña).
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
