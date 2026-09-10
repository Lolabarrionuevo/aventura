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
