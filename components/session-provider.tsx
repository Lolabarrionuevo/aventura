'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { students, teachers } from '@/lib/adventure/data'
import type { Student, Teacher } from '@/lib/adventure/types'

const SESSION_KEY = 'adventure-current-session'
const USERS_KEY = 'adventure-users'

interface SessionContextValue {
  student: Student
  setStudent: (s: Student) => void
  teacher: Teacher | null
  setTeacher: (t: Teacher | null) => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

function saveStudent(student: Student) {
  const stored = JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]') as Student[]
  const users = [...stored.filter((user) => user.id !== student.id), student]
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  const index = students.findIndex((user) => user.id === student.id)
  if (index >= 0) students[index] = student
  else students.push(student)
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [student, setStudentState] = useState<Student>(students[0])
  const [teacher, setTeacherState] = useState<Teacher | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]') as Student[]
    for (const user of storedUsers) {
      const index = students.findIndex((item) => item.id === user.id)
      if (index >= 0) students[index] = user
      else students.push(user)
    }
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as
      | { role: 'alumno' | 'profesor'; id: string }
      | null
    if (session?.role === 'alumno') {
      const current = students.find((user) => user.id === session.id)
      if (current) setStudentState(current)
    } else if (session?.role === 'profesor') {
      setTeacherState(teachers.find((item) => item.id === session.id) ?? null)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && !localStorage.getItem(SESSION_KEY) && pathname !== '/login' && pathname !== '/registro') {
      window.location.replace('/login')
    }
  }, [hydrated, pathname])

  function setStudent(next: Student) {
    setStudentState(next)
    saveStudent(next)
    localStorage.setItem(SESSION_KEY, JSON.stringify({ role: 'alumno', id: next.id }))
  }

  function setTeacher(next: Teacher | null) {
    setTeacherState(next)
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify({ role: 'profesor', id: next.id }))
    else localStorage.removeItem(SESSION_KEY)
  }

  if (!hydrated) return null
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

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
