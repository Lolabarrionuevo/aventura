// Persistencia de demostración en localStorage (solo navegador).
// Guarda las cuentas y el id del alumno con sesión activa para que un refresh
// no pierda el usuario, su grado ni su XP.
import { students, teachers } from './data'
import type { Student, Teacher } from './types'

const ACCOUNTS_KEY = 'adventure:accounts'
const SESSION_KEY = 'adventure:session'

interface StoredAccounts {
  students: Student[]
  teachers: Teacher[]
}

function readAccounts(): StoredAccounts {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    const parsed = raw ? (JSON.parse(raw) as Partial<StoredAccounts>) : {}
    return { students: parsed.students ?? [], teachers: parsed.teachers ?? [] }
  } catch {
    return { students: [], teachers: [] }
  }
}

function writeAccounts(accounts: StoredAccounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function upsert<T extends { id: string }>(list: T[], item: T) {
  const i = list.findIndex((x) => x.id === item.id)
  if (i >= 0) list[i] = item
  else list.push(item)
}

/** Fusiona las cuentas guardadas con los datos en memoria (idempotente). */
export function hydrateAccounts() {
  const stored = readAccounts()
  stored.students.forEach((s) =>
    upsert(students, { ...s, completedActivityIds: s.completedActivityIds ?? [] }),
  )
  stored.teachers.forEach((t) => upsert(teachers, t))
}

export function saveStudent(student: Student) {
  upsert(students, student)
  const stored = readAccounts()
  upsert(stored.students, student)
  writeAccounts(stored)
}

export function saveTeacher(teacher: Teacher) {
  upsert(teachers, teacher)
  const stored = readAccounts()
  upsert(stored.teachers, teacher)
  writeAccounts(stored)
}

export function readSessionStudentId(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

export function writeSessionStudentId(id: string) {
  localStorage.setItem(SESSION_KEY, id)
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
