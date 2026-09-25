'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { students } from '@/lib/adventure/data'
import type { Student, Teacher } from '@/lib/adventure/types'

// Sesión de demostración en memoria. Cuando conectemos Neon + Better Auth,
// este proveedor se reemplaza por la sesión real sin cambiar los consumidores.

interface SessionContextValue {
  student: Student
  setStudent: (s: Student) => void
  teacher: Teacher | null
  setTeacher: (t: Teacher | null) => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student>(students[0])
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  return (
    <SessionContext.Provider value={{ student, setStudent, teacher, setTeacher }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession debe usarse dentro de SessionProvider')
  return ctx
}
