import type {
  Activity,
  Badge,
  Course,
  Student,
  Subject,
  SubjectProgress,
  Teacher,
} from './types'
import { levelFromXp } from './gamification'

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

export const GRADES = [1, 2, 3, 4, 5, 6] as const

export function courseIdForGrade(grade: number): string {
  return `c-${grade}a`
}

export const courses: Course[] = GRADES.map((g) => ({
  id: courseIdForGrade(g),
  name: `${g}° Grado A`,
  grade: 'Primaria',
  gradeLevel: g,
  teacherId: 't-1',
  color: 'primary',
}))

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
    grade: 4,
    courseId: 'c-4a',
    completedActivityIds: [],
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
    grade: 4,
    courseId: 'c-4a',
    completedActivityIds: [],
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
    grade: 4,
    courseId: 'c-4a',
    completedActivityIds: [],
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
    grade: 4,
    courseId: 'c-4a',
    completedActivityIds: [],
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
    grade: 4,
    courseId: 'c-4a',
    completedActivityIds: [],
    level: 3,
    xp: 720,
    streakDays: 1,
    badgeIds: ['b-first'],
  },
]

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

// Las actividades base corresponden a 3° y 4°. Para 1°-2° y 5°-6° se reutilizan
// los mismos juegos con contenido y dificultad adaptados.
type GradeBand = 'inicial' | 'intermedio' | 'avanzado'

type ActivityVariant = Pick<
  Activity,
  'title' | 'description' | 'difficulty' | 'xpReward' | 'questions'
> & { timeLimitSec?: number }

export function gradeBand(grade: number): GradeBand {
  if (grade <= 2) return 'inicial'
  if (grade >= 5) return 'avanzado'
  return 'intermedio'
}

const TF = ['Verdadero', 'Falso']

const activityVariants: Record<string, Partial<Record<GradeBand, ActivityVariant>>> = {
  'a-1': {
    inicial: {
      title: 'Animales / Animals',
      description: 'Elige el nombre del animal en inglés.',
      difficulty: 'facil',
      xpReward: 40,
      questions: [
        { id: 'q1', prompt: '¿Cómo se dice "perro"?', options: ['Dog', 'Cat', 'Fish'], answerIndex: 0 },
        { id: 'q2', prompt: '¿Cómo se dice "gato"?', options: ['Cow', 'Cat', 'Dog'], answerIndex: 1 },
        { id: 'q3', prompt: '¿Cómo se dice "pez"?', options: ['Bird', 'Pig', 'Fish'], answerIndex: 2 },
      ],
    },
    avanzado: {
      title: 'Animals in sentences',
      description: 'Vocabulario de animales, plurales y oraciones.',
      difficulty: 'dificil',
      xpReward: 90,
      questions: [
        {
          id: 'q1',
          prompt: 'Elige la traducción correcta: "El perro está corriendo en el parque"',
          options: [
            'The dog is running in the park',
            'The dog are running in the park',
            'The dog running is in the park',
            'The dogs is run in the park',
          ],
          answerIndex: 0,
        },
        {
          id: 'q2',
          prompt: 'Which animal lives in the ocean and is the largest mammal?',
          hint: 'Es el mamífero más grande del mundo',
          options: ['Elephant', 'Whale', 'Giraffe', 'Shark'],
          answerIndex: 1,
        },
        {
          id: 'q3',
          prompt: 'Completa: "Birds ___ fly, but penguins can\'t."',
          options: ['can', 'cans', 'could to', 'is'],
          answerIndex: 0,
        },
        {
          id: 'q4',
          prompt: '¿Cuál es el plural de "mouse"?',
          options: ['Mouses', 'Mice', 'Mousies', 'Meese'],
          answerIndex: 1,
        },
      ],
    },
  },
  'a-2': {
    inicial: {
      title: 'Colores / Colors',
      description: '¿Verdadero o falso? Los colores básicos.',
      difficulty: 'facil',
      xpReward: 30,
      questions: [
        { id: 'q1', prompt: '"Red" es rojo', options: TF, answerIndex: 0 },
        { id: 'q2', prompt: '"Blue" es azul', options: TF, answerIndex: 0 },
        { id: 'q3', prompt: '"Green" es amarillo', options: TF, answerIndex: 1 },
      ],
    },
    avanzado: {
      title: 'Colors & grammar',
      description: '¿Verdadero o falso? Colores, adjetivos y gramática.',
      difficulty: 'dificil',
      xpReward: 80,
      questions: [
        { id: 'q1', prompt: '"The sky is blue" significa "El cielo es azul"', options: TF, answerIndex: 0 },
        {
          id: 'q2',
          prompt: 'En inglés el adjetivo va después del sustantivo: "a car red"',
          options: TF,
          answerIndex: 1,
        },
        { id: 'q3', prompt: '"Darker" es el comparativo de "dark"', options: TF, answerIndex: 0 },
        { id: 'q4', prompt: '"She don\'t like purple" es una oración correcta', options: TF, answerIndex: 1 },
        { id: 'q5', prompt: '"Mixing red and white makes pink" es verdadero', options: TF, answerIndex: 0 },
      ],
    },
  },
  'a-3': {
    inicial: {
      title: 'Completa la palabra',
      description: 'Escribe palabras cortas en inglés.',
      difficulty: 'facil',
      xpReward: 50,
      questions: [
        { id: 'q1', prompt: 'Gato en inglés: c_t', answer: 'cat' },
        { id: 'q2', prompt: 'Sol en inglés: s_n', answer: 'sun' },
        { id: 'q3', prompt: 'Perro en inglés: d_g', answer: 'dog' },
      ],
    },
    avanzado: {
      title: 'Completa la oración',
      description: 'Escribe el verbo o la expresión correcta.',
      difficulty: 'dificil',
      xpReward: 110,
      questions: [
        { id: 'q1', prompt: 'Yesterday I ___ to the cinema. (go, en pasado)', answer: 'went' },
        { id: 'q2', prompt: 'She ___ playing tennis right now. (be, presente continuo)', answer: 'is' },
        {
          id: 'q3',
          prompt: 'This book is ___ than that one. (interesting, comparativo)',
          answer: 'more interesting',
        },
        { id: 'q4', prompt: 'We have ___ finished our homework. (ya)', answer: 'already' },
      ],
    },
  },
  'a-4': {
    inicial: {
      title: 'Une los conceptos',
      description: 'Une cada palabra con su significado.',
      difficulty: 'facil',
      xpReward: 50,
      questions: [
        {
          id: 'q1',
          prompt: 'Une cada palabra en inglés con su significado',
          pairs: [
            { left: 'Cat', right: 'Gato' },
            { left: 'Dog', right: 'Perro' },
            { left: 'Sun', right: 'Sol' },
          ],
        },
      ],
    },
    avanzado: {
      title: 'Verbos en pasado / Past tense',
      description: 'Une cada verbo con su forma en pasado.',
      difficulty: 'dificil',
      xpReward: 110,
      questions: [
        {
          id: 'q1',
          prompt: 'Une cada verbo con su pasado irregular',
          pairs: [
            { left: 'Go', right: 'Went' },
            { left: 'Eat', right: 'Ate' },
            { left: 'See', right: 'Saw' },
            { left: 'Write', right: 'Wrote' },
            { left: 'Buy', right: 'Bought' },
          ],
        },
      ],
    },
  },
  'a-5': {
    inicial: {
      title: 'Ordena las palabras',
      description: 'Ordena frases muy cortas.',
      difficulty: 'facil',
      xpReward: 50,
      questions: [
        { id: 'q1', prompt: 'Ordena: "Un gato"', sequence: ['A', 'cat'] },
        { id: 'q2', prompt: 'Ordena: "Yo soy Ana"', sequence: ['I', 'am', 'Ana'] },
      ],
    },
    avanzado: {
      title: 'Ordena la oración',
      description: 'Ordena oraciones largas con distintos tiempos verbales.',
      difficulty: 'dificil',
      xpReward: 130,
      questions: [
        {
          id: 'q1',
          prompt: 'Ordena: "Ayer fui a la escuela en bicicleta"',
          sequence: ['Yesterday', 'I', 'went', 'to', 'school', 'by', 'bike'],
        },
        {
          id: 'q2',
          prompt: 'Ordena: "¿Dónde vive tu mejor amigo?"',
          sequence: ['Where', 'does', 'your', 'best', 'friend', 'live?'],
        },
        {
          id: 'q3',
          prompt: 'Ordena: "Ella nunca ha visitado Londres"',
          sequence: ['She', 'has', 'never', 'visited', 'London'],
        },
      ],
    },
  },
  'a-6': {
    inicial: {
      title: 'Adivina la imagen',
      description: 'Mira la imagen y elige la palabra.',
      difficulty: 'facil',
      xpReward: 40,
      questions: [
        {
          id: 'q1',
          prompt: '¿Qué es?',
          image: '/games/apple.png',
          options: ['Apple', 'Ball', 'Car'],
          answerIndex: 0,
        },
        {
          id: 'q2',
          prompt: '¿Qué animal es?',
          image: '/games/cat.png',
          options: ['Duck', 'Cat', 'Dog'],
          answerIndex: 1,
        },
      ],
    },
    avanzado: {
      title: 'Describe la imagen',
      description: 'Elige la oración correcta sobre cada imagen.',
      difficulty: 'dificil',
      xpReward: 90,
      questions: [
        {
          id: 'q1',
          prompt: 'Which sentence is correct about this picture?',
          image: '/games/apple.png',
          options: ['An apple is a fruit', 'A apple is a vegetable', 'Apples is a drink', 'An apple are a fruit'],
          answerIndex: 0,
        },
        {
          id: 'q2',
          prompt: 'What is this animal and what sound does it make?',
          image: '/games/cat.png',
          options: [
            'A dog — it says "woof"',
            'A cow — it says "moo"',
            'A cat — it says "meow"',
            'A duck — it says "quack"',
          ],
          answerIndex: 2,
        },
      ],
    },
  },
  'a-7': {
    inicial: {
      title: 'Juego de memoria',
      description: 'Encuentra parejas de palabras simples.',
      difficulty: 'facil',
      xpReward: 45,
      questions: [
        {
          id: 'q1',
          prompt: 'Encuentra las parejas',
          pairs: [
            { left: 'Red', right: 'Rojo' },
            { left: 'Blue', right: 'Azul' },
            { left: 'One', right: 'Uno' },
          ],
        },
      ],
    },
    avanzado: {
      title: 'Memoria de opuestos / Opposites',
      description: 'Encuentra cada palabra con su opuesto en inglés.',
      difficulty: 'dificil',
      xpReward: 100,
      questions: [
        {
          id: 'q1',
          prompt: 'Encuentra los opuestos',
          pairs: [
            { left: 'Big', right: 'Small' },
            { left: 'Happy', right: 'Sad' },
            { left: 'Early', right: 'Late' },
            { left: 'Always', right: 'Never' },
            { left: 'Expensive', right: 'Cheap' },
            { left: 'Remember', right: 'Forget' },
          ],
        },
      ],
    },
  },
  'a-8': {
    inicial: {
      title: 'Quiz contra reloj',
      description: 'Los números del 1 al 3, ¡con tiempo de sobra!',
      difficulty: 'facil',
      xpReward: 60,
      timeLimitSec: 60,
      questions: [
        { id: 'q1', prompt: '"One" es...', options: ['Uno', 'Dos', 'Tres'], answerIndex: 0 },
        { id: 'q2', prompt: '"Two" es...', options: ['Tres', 'Dos', 'Uno'], answerIndex: 1 },
        { id: 'q3', prompt: '"Three" es...', options: ['Tres', 'Uno', 'Dos'], answerIndex: 0 },
      ],
    },
    avanzado: {
      title: 'Quiz contra reloj',
      description: 'Números grandes, la hora y los meses en poco tiempo.',
      difficulty: 'dificil',
      xpReward: 150,
      timeLimitSec: 40,
      questions: [
        { id: 'q1', prompt: '"Twenty-five" es...', options: ['25', '52', '15'], answerIndex: 0 },
        { id: 'q2', prompt: '"One hundred" es...', options: ['1000', '100', '10'], answerIndex: 1 },
        { id: 'q3', prompt: '"It\'s half past seven" es...', options: ['7:30', '7:15', '6:30'], answerIndex: 0 },
        { id: 'q4', prompt: '¿Cuál es 30?', options: ['Thirteen', 'Thirty', 'Three'], answerIndex: 1 },
        { id: 'q5', prompt: '15 + 20 = ?', options: ['Fifty-three', 'Twenty-five', 'Thirty-five'], answerIndex: 2 },
        { id: 'q6', prompt: 'The third month of the year is...', options: ['March', 'May', 'January'], answerIndex: 0 },
      ],
    },
  },
}

function adaptToGrade(activity: Activity, grade: number): Activity {
  const variant = activityVariants[activity.id]?.[gradeBand(grade)]
  return variant ? { ...activity, ...variant } : activity
}

// Helpers de acceso (sustituibles por consultas reales a la base de datos).
export function getStudentByUsername(username: string): Student | undefined {
  return students.find((s) => s.username === username.toLowerCase())
}

export function getTeacherByUsername(username: string): Teacher | undefined {
  return teachers.find((t) => t.username === username.toLowerCase())
}

export function isUsernameTaken(username: string): boolean {
  return Boolean(getStudentByUsername(username) || getTeacherByUsername(username))
}

export function getActivity(id: string): Activity | undefined {
  return activities.find((a) => a.id === id)
}

export function getActivityForGrade(id: string, grade: number): Activity | undefined {
  const activity = getActivity(id)
  return activity ? adaptToGrade(activity, grade) : undefined
}

export function getActivitiesForSubject(subjectId: string, grade: number): Activity[] {
  return activities.filter((a) => a.subjectId === subjectId).map((a) => adaptToGrade(a, grade))
}

export function getStudentProgress(student: Student): SubjectProgress {
  const total = activities.length
  const completed = activities.filter((a) => student.completedActivityIds.includes(a.id)).length
  return {
    subjectId: 's-english',
    progressPct: total > 0 ? Math.round((completed / total) * 100) : 0,
    level: levelFromXp(student.xp),
    activitiesTotal: total,
    activitiesCompleted: completed,
    xpEarned: student.xp,
  }
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
