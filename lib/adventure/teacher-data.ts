// Datos simulados del panel docente de ADVENTURE.
// Esta capa es independiente de la persistencia: hoy genera datos de demostración
// de forma determinista (mismos valores en cada render) y mañana puede
// reemplazarse por consultas reales a Neon sin cambiar la interfaz.

import { levelFromXp, levelProgressPct } from './gamification'

export const GRADES = [1, 2, 3, 4, 5, 6] as const
export const DIVISIONS = ['A', 'B', 'C'] as const

export type Grade = (typeof GRADES)[number]
export type Division = (typeof DIVISIONS)[number]

export interface TeacherSubject {
  id: string
  name: string
  emoji: string
}

export const TEACHER_SUBJECTS: TeacherSubject[] = [
  { id: 'mat', name: 'Matemática', emoji: '🔢' },
  { id: 'len', name: 'Lengua', emoji: '📖' },
  { id: 'cie', name: 'Ciencias', emoji: '🔬' },
  { id: 'ing', name: 'Inglés', emoji: '🇬🇧' },
]

export interface CourseStudent {
  id: string
  name: string
  username: string
  grade: Grade
  division: Division
  xp: number
  level: number
  progressPct: number
  activitiesCompleted: number
  activitiesTotal: number
  correctPct: number
  streakDays: number
  badges: number
  status: 'activo' | 'inactivo'
}

export interface StudentSubjectStat {
  subjectId: string
  progressPct: number
  correctPct: number
}

export interface StudentDetail extends CourseStudent {
  subjects: StudentSubjectStat[]
  pendingActivities: string[]
  weakTopics: { topic: string; subjectId: string; errorPct: number }[]
}

export interface CourseActivity {
  id: string
  title: string
  subjectId: string
  topic: string
  grade: Grade
  difficulty: 'facil' | 'medio' | 'dificil'
  studentsDone: number
  studentsTotal: number
  avgPct: number
  status: 'activa' | 'borrador' | 'cerrada'
}

// --- Generador determinista -------------------------------------------------

function makeRng(seed: number): () => number {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

function between(rng: () => number, min: number, max: number): number {
  return Math.round(min + rng() * (max - min))
}

const FIRST_NAMES = [
  'Sofía', 'Tomás', 'Mateo', 'Valentina', 'Martina', 'Benjamín', 'Emma',
  'Thiago', 'Isabella', 'Lucas', 'Catalina', 'Joaquín', 'Julieta', 'Bruno',
  'Renata', 'Santino', 'Delfina', 'Gael', 'Mía', 'Lautaro', 'Bautista', 'Zoe',
]

const LAST_NAMES = [
  'Martínez', 'Gómez', 'Ruiz', 'Díaz', 'López', 'Fernández', 'Pérez',
  'Sosa', 'Romero', 'Torres', 'Álvarez', 'Molina', 'Ríos', 'Herrera', 'Castro',
]

const TOPICS: Record<string, string[]> = {
  mat: ['Sumas y restas', 'Multiplicación', 'División', 'Fracciones', 'Geometría', 'Problemas'],
  len: ['Lectura', 'Ortografía', 'Sustantivos', 'Verbos', 'Comprensión', 'Escritura'],
  cie: ['El cuerpo humano', 'Los animales', 'Las plantas', 'El agua', 'El sistema solar', 'Materiales'],
  ing: ['Colores', 'Animales', 'Números', 'La familia', 'Saludos', 'Verbos'],
}

function courseSeed(grade: Grade, division: Division): number {
  return grade * 100 + (DIVISIONS.indexOf(division) + 1) * 7 + 13
}

function usernameFrom(name: string, index: number): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '')
  return `${base}${index}`
}

// Cache para mantener estabilidad entre llamadas dentro de la misma sesión.
const studentsCache = new Map<string, CourseStudent[]>()
const activitiesCache = new Map<string, CourseActivity[]>()

export function getCourseStudents(grade: Grade, division: Division): CourseStudent[] {
  const key = `${grade}-${division}`
  const cached = studentsCache.get(key)
  if (cached) return cached

  const rng = makeRng(courseSeed(grade, division))
  const count = between(rng, 6, 9)
  const usedNames = new Set<string>()
  const students: CourseStudent[] = []

  for (let i = 0; i < count; i++) {
    let first = pick(rng, FIRST_NAMES)
    let attempts = 0
    while (usedNames.has(first) && attempts < 10) {
      first = pick(rng, FIRST_NAMES)
      attempts++
    }
    usedNames.add(first)
    const last = pick(rng, LAST_NAMES)
    const name = `${first} ${last}`

    // XP crece levemente con el grado.
    const xp = between(rng, 400 + grade * 80, 1400 + grade * 160)
    const level = levelFromXp(xp)
    const activitiesTotal = between(rng, 8, 14)
    const activitiesCompleted = between(rng, 2, activitiesTotal)
    const correctPct = between(rng, 62, 98)
    const streakDays = between(rng, 0, 15)
    const badges = between(rng, 1, 7)
    const status: CourseStudent['status'] = rng() > 0.25 ? 'activo' : 'inactivo'

    students.push({
      id: `${grade}${division}-${i + 1}`,
      name,
      username: usernameFrom(first, i + 1),
      grade,
      division,
      xp,
      level,
      progressPct: Math.round((activitiesCompleted / activitiesTotal) * 100),
      activitiesCompleted,
      activitiesTotal,
      correctPct,
      streakDays,
      badges,
      status,
    })
  }

  students.sort((a, b) => b.xp - a.xp)
  studentsCache.set(key, students)
  return students
}

export function getStudentDetail(
  grade: Grade,
  division: Division,
  studentId: string,
): StudentDetail | undefined {
  const student = getCourseStudents(grade, division).find((s) => s.id === studentId)
  if (!student) return undefined

  const rng = makeRng(courseSeed(grade, division) + Number(studentId.split('-')[1]) * 31)

  const subjects: StudentSubjectStat[] = TEACHER_SUBJECTS.map((subject) => ({
    subjectId: subject.id,
    progressPct: between(rng, 40, 100),
    correctPct: between(rng, 55, 99),
  }))

  const activities = getCourseActivities(grade)
  const pendingActivities = activities
    .filter(() => rng() > 0.55)
    .slice(0, 3)
    .map((a) => a.title)

  // Los temas con más errores: los de menor porcentaje de aciertos.
  const weakTopics = subjects
    .map((s) => ({
      subjectId: s.subjectId,
      topic: pick(rng, TOPICS[s.subjectId]),
      errorPct: 100 - s.correctPct,
    }))
    .sort((a, b) => b.errorPct - a.errorPct)
    .slice(0, 3)

  return { ...student, subjects, pendingActivities, weakTopics }
}

export function getCourseActivities(grade: Grade): CourseActivity[] {
  const key = `${grade}`
  const cached = activitiesCache.get(key)
  if (cached) return cached

  const rng = makeRng(grade * 1009 + 5)
  const difficulties: CourseActivity['difficulty'][] = ['facil', 'medio', 'dificil']
  const statuses: CourseActivity['status'][] = ['activa', 'activa', 'activa', 'borrador', 'cerrada']
  const activities: CourseActivity[] = []

  let counter = 0
  for (const subject of TEACHER_SUBJECTS) {
    const perSubject = between(rng, 1, 2)
    for (let i = 0; i < perSubject; i++) {
      const topic = pick(rng, TOPICS[subject.id])
      const studentsTotal = between(rng, 6, 9)
      const studentsDone = between(rng, 1, studentsTotal)
      counter++
      activities.push({
        id: `act-${grade}-${counter}`,
        title: `${topic} · Nivel ${grade}`,
        subjectId: subject.id,
        topic,
        grade,
        difficulty: pick(rng, difficulties),
        studentsDone,
        studentsTotal,
        avgPct: between(rng, 60, 96),
        status: pick(rng, statuses),
      })
    }
  }

  activitiesCache.set(key, activities)
  return activities
}

// --- Métricas agregadas -----------------------------------------------------

export interface CourseMetrics {
  studentCount: number
  averagePct: number
  activitiesCompleted: number
  averageXp: number
  activeStudents: number
}

export function getCourseMetrics(grade: Grade, division: Division): CourseMetrics {
  const students = getCourseStudents(grade, division)
  const studentCount = students.length || 1
  const averagePct = Math.round(
    students.reduce((sum, s) => sum + s.correctPct, 0) / studentCount,
  )
  const activitiesCompleted = students.reduce((sum, s) => sum + s.activitiesCompleted, 0)
  const averageXp = Math.round(students.reduce((sum, s) => sum + s.xp, 0) / studentCount)
  const activeStudents = students.filter((s) => s.status === 'activo').length

  return {
    studentCount: students.length,
    averagePct,
    activitiesCompleted,
    averageXp,
    activeStudents,
  }
}

export interface SubjectAverage {
  subjectId: string
  name: string
  emoji: string
  averagePct: number
}

export interface CourseResults {
  overallPct: number
  subjectAverages: SubjectAverage[]
  mostCompleted: CourseActivity[]
  mostErrors: CourseActivity[]
  reinforceTopics: { topic: string; subjectId: string; name: string; errorPct: number }[]
}

export function getCourseResults(grade: Grade, division: Division): CourseResults {
  const rng = makeRng(courseSeed(grade, division) + 401)
  const activities = getCourseActivities(grade)

  const subjectAverages: SubjectAverage[] = TEACHER_SUBJECTS.map((subject) => ({
    subjectId: subject.id,
    name: subject.name,
    emoji: subject.emoji,
    averagePct: between(rng, 72, 95),
  }))

  const overallPct = Math.round(
    subjectAverages.reduce((sum, s) => sum + s.averagePct, 0) / subjectAverages.length,
  )

  const mostCompleted = [...activities]
    .sort((a, b) => b.studentsDone / b.studentsTotal - a.studentsDone / a.studentsTotal)
    .slice(0, 3)

  const mostErrors = [...activities].sort((a, b) => a.avgPct - b.avgPct).slice(0, 3)

  const reinforceTopics = mostErrors.map((a) => {
    const subject = TEACHER_SUBJECTS.find((s) => s.id === a.subjectId)!
    return {
      topic: a.topic,
      subjectId: a.subjectId,
      name: subject.name,
      errorPct: 100 - a.avgPct,
    }
  })

  return { overallPct, subjectAverages, mostCompleted, mostErrors, reinforceTopics }
}

export function getRanking(grade: Grade, division: Division): CourseStudent[] {
  // Ya viene ordenado por XP desde getCourseStudents.
  return getCourseStudents(grade, division)
}

export function subjectMeta(subjectId: string): TeacherSubject {
  return TEACHER_SUBJECTS.find((s) => s.id === subjectId) ?? TEACHER_SUBJECTS[0]
}

export function levelProgress(xp: number): number {
  return levelProgressPct(xp)
}
