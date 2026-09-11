'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { students, loadPersistedStudents } from '@/lib/adventure/data'
import type { Student } from '@/lib/adventure/types'

const CURRENT_STUDENT_KEY = 'adventure:currentStudentId'

// Sesión de demostración en memoria. Cuando conectemos Neon + Better Auth,
// este proveedor se reemplaza por la sesión real sin cambiar los consumidores.

interface SessionContextValue {
  student: Student
  setStudent: (s: Student) => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [student, setStudentState] = useState<Student>(students[0])

  // Al montar, rehidratamos los alumnos guardados y restauramos al que
  // inició sesión, para que los datos no se pierdan al recargar.
  useEffect(() => {
    loadPersistedStudents()
    try {
      const savedId = window.localStorage.getItem(CURRENT_STUDENT_KEY)
      if (savedId) {
        const found = students.find((s) => s.id === savedId)
        if (found) setStudentState(found)
      }
    } catch {
      // Ignoramos errores de almacenamiento.
    }
  }, [])

  function setStudent(s: Student) {
    setStudentState(s)
    try {
      window.localStorage.setItem(CURRENT_STUDENT_KEY, s.id)
    } catch {
      // Ignoramos errores de almacenamiento.
    }
  }

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
