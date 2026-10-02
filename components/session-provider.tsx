'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getStudent } from '@/lib/adventure/data'
import { levelFromXp } from '@/lib/adventure/gamification'
import {
  clearSession,
  hydrateAccounts,
  readSessionStudentId,
  saveStudent,
  writeSessionStudentId,
} from '@/lib/adventure/storage'
import type { Student } from '@/lib/adventure/types'

// Sesión de demostración persistida en localStorage. Cuando conectemos Neon +
// Better Auth, este proveedor se reemplaza por la sesión real.

const PROTECTED_PREFIXES = ['/dashboard', '/materias', '/ranking', '/logros', '/perfil', '/actividad']

interface SessionContextValue {
  student: Student | null
  setStudent: (s: Student) => void
  logout: (redirectTo?: string) => void
  /** Otorga el XP solo la primera vez que se aprueba la actividad. Devuelve el XP otorgado. */
  rewardActivity: (activityId: string, xpEarned: number) => number
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [student, setStudentState] = useState<Student | null>(null)
  const [ready, setReady] = useState(false)
  const studentRef = useRef<Student | null>(null)

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )

  useEffect(() => {
    hydrateAccounts()
    const id = readSessionStudentId()
    const current = id ? (getStudent(id) ?? null) : null
    if (!current) clearSession()
    studentRef.current = current
    setStudentState(current)
    setReady(true)
  }, [])

  // Tras cerrar sesión navegamos al inicio; evita que el guard redirija a /login.
  const loggingOutRef = useRef(false)

  useEffect(() => {
    if (!isProtected) {
      loggingOutRef.current = false
      return
    }
    if (ready && !student && !loggingOutRef.current) router.replace('/login')
  }, [ready, isProtected, student, router])

  const setStudent = useCallback((s: Student) => {
    saveStudent(s)
    writeSessionStudentId(s.id)
    studentRef.current = s
    setStudentState(s)
  }, [])

  const logout = useCallback(
    (redirectTo?: string) => {
      clearSession()
      studentRef.current = null
      setStudentState(null)
      if (redirectTo) {
        loggingOutRef.current = true
        router.replace(redirectTo)
      }
    },
    [router],
  )

  const rewardActivity = useCallback((activityId: string, xpEarned: number) => {
    const current = studentRef.current
    if (!current || xpEarned <= 0 || current.completedActivityIds.includes(activityId)) return 0
    const xp = current.xp + xpEarned
    const updated: Student = {
      ...current,
      xp,
      level: levelFromXp(xp),
      completedActivityIds: [...current.completedActivityIds, activityId],
    }
    saveStudent(updated)
    studentRef.current = updated
    setStudentState(updated)
    return xpEarned
  }, [])

  const value = useMemo(
    () => ({ student, setStudent, logout, rewardActivity }),
    [student, setStudent, logout, rewardActivity],
  )

  return (
    <SessionContext.Provider value={value}>
      {isProtected && (!ready || !student) ? null : children}
    </SessionContext.Provider>
  )
}

function useSessionContext(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession debe usarse dentro de SessionProvider')
  return ctx
}

/** Para páginas protegidas: el proveedor garantiza que hay un alumno con sesión. */
export function useSession() {
  const { student, ...actions } = useSessionContext()
  if (!student) throw new Error('useSession requiere un alumno con sesión activa')
  return { student, ...actions }
}

/** Para login/registro y acciones que no requieren sesión. */
export function useAuthActions() {
  const { setStudent, logout } = useSessionContext()
  return { setStudent, logout }
}
