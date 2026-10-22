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

import type { Badge, Student } from './types'
import { badges, getActivitiesForGrade } from './data'
import { getCompletions } from './progress'

export function newlyEarnedBadges(student: Student, activityId: string, score: number): Badge[] {
  const completions = getCompletions(student.id)
  const earned = new Set(student.badgeIds)
  const completedCount = new Set(completions.map((item) => item.activityId)).size
  const conditions: Record<string, boolean> = {
    'b-first': completedCount >= 1,
    'b-streak3': student.streakDays >= 3,
    'b-streak7': student.streakDays >= 7,
    'b-perfect': score === 100,
    'b-words50': completedCount >= 50,
    'b-speed': activityId === 'a-8',
    'b-level5': levelFromXp(student.xp) >= 5,
    'b-champion': false,
  }
  return badges.filter((badge) => conditions[badge.id] && !earned.has(badge.id))
}

export function activityProgress(studentId: string, grade: Student['grade']): { completed: number; total: number; pct: number } {
  const completions = getCompletions(studentId)
  const completed = new Set(completions.map((item) => item.activityId)).size
  const total = getActivitiesForGrade(grade).length
  return { completed, total, pct: total ? Math.round((completed / total) * 100) : 0 }
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
