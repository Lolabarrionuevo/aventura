import type {
  Activity,
  Badge,
  Course,
  Student,
  Subject,
  SubjectProgress,
  Teacher,
} from './types'

export const badges: Badge[] = [
  { id: 'b-first', name: 'Primer paso', description: 'Completaste tu primera actividad', emoji: '🌱' },
  { id: 'b-streak3', name: 'En racha', description: '3 días seguidos aprendiendo', emoji: '🔥' },
  { id: 'b-streak7', name: 'Imparable', description: '7 días seguidos', emoji: '⚡' },
  { id: 'b-perfect', name: 'Perfección', description: '100% de aciertos en una actividad', emoji: '🎯' },
  { id: 'b-words50', name: 'Vocabulario', description: 'Aprendiste 50 palabras nuevas', emoji: '📚' },
  { id: 'b-speed', name: 'Veloz', description: 'Ganaste un quiz contra reloj', emoji: '⏱️' },
  { id: 'b-level5', name: 'Explorador', description: 'Alcanzaste el nivel 5', emoji: '🧭' },
  { id: 'b-champion', name: 'Campeón de la clase', description: '#1 en el ranking semanal', emoji: '👑' },
]

export const courses: Course[] = [
  { id: 'c-4a', name: '4° Grado A', grade: 'Primaria', teacherId: 't-1', color: 'primary' },
]

export const subjects: Subject[] = [
  { id: 's-english', name: 'Inglés', emoji: '🇬🇧', courseId: 'c-4a' },
]

export const teachers: Teacher[] = [
  {
    id: 't-1',
    name: 'Miss Laura',
    username: 'laura',
    role: 'profesor',
    avatar: '/avatars/teacher.png',
    courseIds: ['c-4a'],
  },
]

export const students: Student[] = [
  {
    id: 'st-1',
    name: 'Sofía Martínez',
    username: 'sofia',
    role: 'alumno',
    avatar: '/avatars/sofia.png',
    courseId: 'c-4a',
    level: 6,
    xp: 1580,
    streakDays: 5,
    badgeIds: ['b-first', 'b-streak3', 'b-perfect', 'b-words50', 'b-level5'],
  },
  {
    id: 'st-2',
    name: 'Mateo Gómez',
    username: 'mateo',
    role: 'alumno',
    avatar: '/avatars/mateo.png',
    courseId: 'c-4a',
    level: 7,
    xp: 1920,
    streakDays: 8,
    badgeIds: ['b-first', 'b-streak7', 'b-speed', 'b-level5'],
  },
  {
    id: 'st-3',
    name: 'Valentina Ruiz',
    username: 'valentina',
    role: 'alumno',
    avatar: '/avatars/valentina.png',
    courseId: 'c-4a',
    level: 8,
    xp: 2350,
    streakDays: 12,
    badgeIds: ['b-first', 'b-streak7', 'b-perfect', 'b-champion', 'b-level5'],
  },
  {
    id: 'st-4',
    name: 'Thiago Díaz',
    username: 'thiago',
    role: 'alumno',
    avatar: '/avatars/thiago.png',
    courseId: 'c-4a',
    level: 4,
    xp: 980,
    streakDays: 2,
    badgeIds: ['b-first', 'b-streak3'],
  },
  {
    id: 'st-5',
    name: 'Emma López',
    username: 'emma',
    role: 'alumno',
    avatar: '/avatars/emma.png',
    courseId: 'c-4a',
    level: 3,
    xp: 720,
    streakDays: 1,
    badgeIds: ['b-first'],
  },
]

export const subjectProgress: Record<string, SubjectProgress[]> = {
  'st-1': [
    {
      subjectId: 's-english',
      progressPct: 68,
      level: 6,
      activitiesTotal: 9,
      activitiesCompleted: 6,
      xpEarned: 1580,
    },
  ],
}

export const activities: Activity[] = [
  {
    id: 'a-1',
    title: 'Animales / Animals',
    description: 'Aprende los nombres de los animales en inglés.',
    type: 'multiple-choice',
    difficulty: 'facil',
    subjectId: 's-english',
    xpReward: 60,
    questions: [
      {
        id: 'q1',
        prompt: '¿Cómo se dice "perro" en inglés?',
        hint: 'Es la mascota más común',
        options: ['Cat', 'Dog', 'Bird', 'Fish'],
        answerIndex: 1,
      },
      {
        id: 'q2',
        prompt: '¿Cómo se dice "gato"?',
        options: ['Dog', 'Horse', 'Cat', 'Cow'],
        answerIndex: 2,
      },
      {
        id: 'q3',
        prompt: 'Elige la traducción de "pájaro"',
        options: ['Bird', 'Bear', 'Bee', 'Bat'],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'a-2',
    title: 'Colores / Colors',
    description: '¿Verdadero o falso? Repasa los colores.',
    type: 'true-false',
    difficulty: 'facil',
    subjectId: 's-english',
    xpReward: 50,
    questions: [
      { id: 'q1', prompt: '"Red" significa rojo', options: ['Verdadero', 'Falso'], answerIndex: 0 },
      { id: 'q2', prompt: '"Blue" significa verde', options: ['Verdadero', 'Falso'], answerIndex: 1 },
      { id: 'q3', prompt: '"Yellow" significa amarillo', options: ['Verdadero', 'Falso'], answerIndex: 0 },
      { id: 'q4', prompt: '"Black" significa blanco', options: ['Verdadero', 'Falso'], answerIndex: 1 },
    ],
  },
  {
    id: 'a-3',
    title: 'Completa la palabra',
    description: 'Escribe la palabra en inglés que falta.',
    type: 'complete-word',
    difficulty: 'medio',
    subjectId: 's-english',
    xpReward: 80,
    questions: [
      { id: 'q1', prompt: 'Casa en inglés: h___', hint: 'house', answer: 'house' },
      { id: 'q2', prompt: 'Escuela en inglés: s_____', hint: 'school', answer: 'school' },
      { id: 'q3', prompt: 'Libro en inglés: b___', hint: 'book', answer: 'book' },
    ],
  },
  {
    id: 'a-4',
    title: 'Une los conceptos',
    description: 'Conecta cada palabra con su traducción.',
    type: 'match-concepts',
    difficulty: 'medio',
    subjectId: 's-english',
    xpReward: 90,
    questions: [
      {
        id: 'q1',
        prompt: 'Une cada palabra en inglés con su significado',
        pairs: [
          { left: 'Apple', right: 'Manzana' },
          { left: 'Water', right: 'Agua' },
          { left: 'Sun', right: 'Sol' },
          { left: 'Friend', right: 'Amigo' },
        ],
      },
    ],
  },
  {
    id: 'a-5',
    title: 'Ordena la oración',
    description: 'Coloca las palabras en el orden correcto.',
    type: 'order-elements',
    difficulty: 'dificil',
    subjectId: 's-english',
    xpReward: 100,
    questions: [
      { id: 'q1', prompt: 'Ordena: "Me llamo Ana"', sequence: ['My', 'name', 'is', 'Ana'] },
      { id: 'q2', prompt: 'Ordena: "Tengo un gato"', sequence: ['I', 'have', 'a', 'cat'] },
    ],
  },
  {
    id: 'a-6',
    title: 'Adivina la imagen',
    description: 'Mira la imagen y elige la palabra correcta.',
    type: 'image-question',
    difficulty: 'facil',
    subjectId: 's-english',
    xpReward: 70,
    questions: [
      {
        id: 'q1',
        prompt: '¿Qué es esto en inglés?',
        image: '/games/apple.png',
        options: ['Apple', 'Orange', 'Banana', 'Grape'],
        answerIndex: 0,
      },
      {
        id: 'q2',
        prompt: '¿Qué animal es?',
        image: '/games/cat.png',
        options: ['Dog', 'Cat', 'Rabbit', 'Mouse'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'a-7',
    title: 'Juego de memoria',
    description: 'Encuentra las parejas palabra–traducción.',
    type: 'memory',
    difficulty: 'medio',
    subjectId: 's-english',
    xpReward: 85,
    questions: [
      {
        id: 'q1',
        prompt: 'Encuentra las parejas',
        pairs: [
          { left: 'Cat', right: 'Gato' },
          { left: 'Dog', right: 'Perro' },
          { left: 'Sun', right: 'Sol' },
          { left: 'Book', right: 'Libro' },
        ],
      },
    ],
  },
  {
    id: 'a-8',
    title: 'Quiz contra reloj',
    description: 'Responde todo lo que puedas antes de que acabe el tiempo.',
    type: 'timed-quiz',
    difficulty: 'dificil',
    subjectId: 's-english',
    xpReward: 120,
    timeLimitSec: 45,
    questions: [
      { id: 'q1', prompt: '"One" es...', options: ['Uno', 'Dos', 'Tres'], answerIndex: 0 },
      { id: 'q2', prompt: '"Three" es...', options: ['Dos', 'Tres', 'Cuatro'], answerIndex: 1 },
      { id: 'q3', prompt: '"Five" es...', options: ['Cinco', 'Seis', 'Siete'], answerIndex: 0 },
      { id: 'q4', prompt: '"Ten" es...', options: ['Nueve', 'Diez', 'Once'], answerIndex: 1 },
      { id: 'q5', prompt: '"Seven" es...', options: ['Siete', 'Ocho', 'Seis'], answerIndex: 0 },
    ],
  },
]

// Helpers de acceso (sustituibles por consultas reales a la base de datos).
export function getStudentByUsername(username: string): Student | undefined {
  return students.find((s) => s.username === username.toLowerCase())
}

export function getTeacherByUsername(username: string): Teacher | undefined {
  return teachers.find((t) => t.username === username.toLowerCase())
}

export function getActivity(id: string): Activity | undefined {
  return activities.find((a) => a.id === id)
}

export function getActivitiesForSubject(subjectId: string): Activity[] {
  return activities.filter((a) => a.subjectId === subjectId)
}

export function getBadge(id: string): Badge | undefined {
  return badges.find((b) => b.id === id)
}

export function getCourseStudents(courseId: string): Student[] {
  return students
    .filter((s) => s.courseId === courseId)
    .sort((a, b) => b.xp - a.xp)
}

export function getStudent(id: string): Student | undefined {
  return students.find((s) => s.id === id)
}
