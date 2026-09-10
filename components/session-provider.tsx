'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { students } from '@/lib/adventure/data'
import type { Student } from '@/lib/adventure/types'

// Sesión de demostración en memoria. Cuando conectemos Neon + Better Auth,
// este proveedor se reemplaza por la sesión real sin cambiar los consumidores.

interface SessionContextValue {
  student: Student
  setStudent: (s: Student) => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student>(students[0])
  return (
    <SessionContext.Provider value={{ student, setStudent }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession debe usarse dentro de SessionProvider')
  return ctx
}
