import type { Activity, ActivityResult, Badge, Student } from './types'
import { badges, getActivitiesForGrade } from './data'

// Persistencia local existente del prototipo. Las claves incluyen al alumno para aislar el progreso.
const ACTIVITY_RESULTS_KEY = 'adventure-activity-results'

export function argentinaDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function getActivityResults(studentId: string): ActivityResult[] {
  if (typeof window === 'undefined') return []
  try {
    const all = JSON.parse(localStorage.getItem(ACTIVITY_RESULTS_KEY) ?? '[]') as ActivityResult[]
    return all.filter((result) => result.studentId === studentId)
  } catch {
    return []
  }
}

export function isActivityCompletedToday(studentId: string, activityId: string): boolean {
  const today = argentinaDateKey()
  return getActivityResults(studentId).some(
    (result) => result.activityId === activityId && result.date === today,
  )
}

export function hasCompletedActivity(studentId: string, activityId: string): boolean {
  return getActivityResults(studentId).some((result) => result.activityId === activityId)
}

export function recordActivityCompletion(result: ActivityResult): boolean {
  if (typeof window === 'undefined') return false
  const all = JSON.parse(localStorage.getItem(ACTIVITY_RESULTS_KEY) ?? '[]') as ActivityResult[]
  const exists = all.some(
    (item) => item.studentId === result.studentId && item.activityId === result.activityId,
  )
  if (exists) return false
  localStorage.setItem(ACTIVITY_RESULTS_KEY, JSON.stringify([...all, result]))
  return true
}

export function getStudentSubjectProgress(student: Student, subjectId: string) {
  const available = getActivitiesForGrade(student.grade).filter((activity) => activity.subjectId === subjectId)
  const completed = new Set(
    getActivityResults(student.id)
      .filter((result) => available.some((activity) => activity.id === result.activityId))
      .map((result) => result.activityId),
  )
  const activitiesCompleted = completed.size
  return {
    subjectId,
    progressPct: available.length ? Math.round((activitiesCompleted / available.length) * 100) : 0,
    level: levelFromXp(student.xp),
    activitiesTotal: available.length,
    activitiesCompleted,
    xpEarned: student.xp,
  }
}

export function newlyUnlockedBadges(student: Student, result: ActivityResult, activity: Activity): Badge[] {
  const results = [...getActivityResults(student.id), result]
  const earned = new Set(student.badgeIds)
  const candidates = badges.filter((badge) => {
    if (earned.has(badge.id)) return false
    if (badge.id === 'b-first') return results.length >= 1
    if (badge.id === 'b-perfect') return result.score === 100
    if (badge.id === 'b-speed') return activity.type === 'timed-quiz'
    if (badge.id === 'b-level5') return levelFromXp(student.xp) >= 5
    if (badge.id === 'b-streak3') return student.streakDays >= 3
    if (badge.id === 'b-streak7') return student.streakDays >= 7
    return false
  })
  return candidates
}


// Reglas de gamificación puras y sin estado.

/** XP acumulado necesario para alcanzar cada nivel. Curva creciente. */
export const XP_PER_LEVEL = 300

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function xpIntoCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL
}

export function levelProgressPct(xp: number): number {
  return Math.round((xpIntoCurrentLevel(xp) / XP_PER_LEVEL) * 100)
}

export function xpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - xpIntoCurrentLevel(xp)
}

/**
 * Calcula la puntuación (0-100) y el XP ganado en una actividad.
 * Premia aciertos y velocidad (bonus si sobra tiempo).
 */
export function scoreActivity(params: {
  correctCount: number
  totalCount: number
  timeSec: number
  timeLimitSec?: number
  baseXpReward: number
}): { score: number; xpEarned: number } {
  const { correctCount, totalCount, timeSec, timeLimitSec, baseXpReward } = params
  const accuracy = totalCount > 0 ? correctCount / totalCount : 0
  const score = Math.round(accuracy * 100)

  let speedBonus = 1
  if (timeLimitSec && timeSec < timeLimitSec) {
    // Hasta +20% por terminar rápido.
    speedBonus = 1 + Math.min(0.2, (timeLimitSec - timeSec) / timeLimitSec / 5)
  }
  const xpEarned = Math.round(baseXpReward * accuracy * speedBonus)
  return { score, xpEarned }
}

export function difficultyLabel(d: 'facil' | 'medio' | 'dificil'): string {
  return { facil: 'Fácil', medio: 'Medio', dificil: 'Difícil' }[d]
}

export const GAME_TYPE_META: Record<
  string,
  { label: string; emoji: string; description: string }
> = {
  'multiple-choice': {
    label: 'Opción múltiple',
    emoji: '📝',
    description: 'Elige la respuesta correcta',
  },
  'true-false': {
    label: 'Verdadero o Falso',
    emoji: '✅',
    description: '¿Es correcto o no?',
  },
  'complete-word': {
    label: 'Completar palabras',
    emoji: '🔤',
    description: 'Escribe la palabra que falta',
  },
  'match-concepts': {
    label: 'Unir conceptos',
    emoji: '🔗',
    description: 'Conecta cada par correcto',
  },
  'order-elements': {
    label: 'Ordenar elementos',
    emoji: '↕️',
    description: 'Coloca todo en el orden correcto',
  },
  'image-question': {
    label: 'Preguntas con imágenes',
    emoji: '🖼️',
    description: 'Responde mirando la imagen',
  },
  memory: {
    label: 'Memoria',
    emoji: '🧠',
    description: 'Encuentra las parejas',
  },
  'timed-quiz': {
    label: 'Quiz contra reloj',
    emoji: '⏱️',
    description: 'Responde antes de que acabe el tiempo',
  },
}
