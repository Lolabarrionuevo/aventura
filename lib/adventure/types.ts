// Modelo de dominio de ADVENTURE.
// Esta capa es independiente de la persistencia: hoy usa datos simulados
// (ver ./data.ts) y mañana puede conectarse a Neon sin cambiar la UI.

export type Role = 'alumno' | 'profesor' | 'admin'

export interface User {
  id: string
  name: string
  username: string
  role: Role
  avatar: string
}

export interface Student extends User {
  role: 'alumno'
  courseId: string
  /** Grado escolar del alumno (1 a 6). */
  grade: number
  /** División del grado ('A' o 'B'). */
  division: string
  level: number
  xp: number
  streakDays: number
  badgeIds: string[]
}

export interface Teacher extends User {
  role: 'profesor'
  courseIds: string[]
}

export interface Course {
  id: string
  name: string
  grade: string
  teacherId: string
  color: string
}

export interface Subject {
  id: string
  name: string
  emoji: string
  courseId: string
}

/** Tipos de juego/actividad soportados. */
export type GameType =
  | 'multiple-choice'
  | 'true-false'
  | 'complete-word'
  | 'match-concepts'
  | 'order-elements'
  | 'image-question'
  | 'memory'
  | 'timed-quiz'

export type Difficulty = 'facil' | 'medio' | 'dificil'

export interface Question {
  id: string
  /** Enunciado principal. */
  prompt: string
  /** Traducción o pista bilingüe opcional. */
  hint?: string
  /** Imagen opcional (para image-question). */
  image?: string
  /** Opciones para multiple-choice / image-question / true-false. */
  options?: string[]
  /** Índice de la opción correcta (o respuesta booleana como 0/1). */
  answerIndex?: number
  /** Respuesta textual esperada (complete-word). */
  answer?: string
  /** Pares para match-concepts (left ↔ right). */
  pairs?: { left: string; right: string }[]
  /** Elementos a ordenar (order-elements), en orden correcto. */
  sequence?: string[]
}

export interface Activity {
  id: string
  title: string
  description: string
  type: GameType
  difficulty: Difficulty
  subjectId: string
  xpReward: number
  /** Duración sugerida / límite en segundos para timed-quiz. */
  timeLimitSec?: number
  questions: Question[]
}

export interface Badge {
  id: string
  name: string
  description: string
  emoji: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  goal: number
}

export interface ActivityResult {
  id: string
  studentId: string
  activityId: string
  correctCount: number
  totalCount: number
  timeSec: number
  score: number
  xpEarned: number
  date: string
}

export interface SubjectProgress {
  subjectId: string
  progressPct: number
  level: number
  activitiesTotal: number
  activitiesCompleted: number
  xpEarned: number
}
