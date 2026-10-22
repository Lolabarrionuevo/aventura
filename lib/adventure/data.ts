import type {
  Activity,
  Badge,
  Course,
  Grade,
  Student,
  StudentAnalysis,
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
  { id: 'c-4a', name: 'Primaria', grade: 'Primaria', teacherId: 't-1', color: 'primary' },
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
    grade: '4',
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
    grade: '4',
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
    grade: '4',
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
    grade: '4',
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
    grade: '4',
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
    grade: '4',
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

const gradeThreeActivities: Activity[] = [
  {
    id: 'g3-school-subjects',
    title: 'School Subjects: Look and Choose',
    description: 'Understand what happens in each class.',
    type: 'multiple-choice',
    difficulty: 'medio',
    subjectId: 's-english',
    grade: '3',
    xpReward: 60,
    questions: [
      { id: 'q1', prompt: 'You are painting a picture. Which class are you in?', options: ['Art', 'Math', 'Science'], answerIndex: 0, hint: 'Think about colors and pictures.' },
      { id: 'q2', prompt: 'You are counting numbers. Which class are you in?', options: ['English', 'Math', 'Art'], answerIndex: 1, hint: 'You use numbers in this class.' },
      { id: 'q3', prompt: 'You are learning about plants. Which class are you in?', options: ['Science', 'Music', 'Math'], answerIndex: 0, hint: 'You explore the world in this class.' },
    ],
  },
  {
    id: 'g3-sports',
    title: 'Sports: Can and Can’t',
    description: 'Read a short situation and find the action.',
    type: 'multiple-choice',
    difficulty: 'medio',
    subjectId: 's-english',
    grade: '3',
    xpReward: 65,
    questions: [
      { id: 'q1', prompt: 'Look at the sports scene. What is the girl in the pool doing?', image: '/games/sports-scene.png', options: ['Swimming', 'Skiing', 'Playing chess'], answerIndex: 0 },
      { id: 'q2', prompt: 'Look at the sports scene. What is the boy doing?', image: '/games/sports-scene.png', options: ['Running a race', 'Playing football', 'Riding a bike'], answerIndex: 1 },
      { id: 'q3', prompt: 'Look at the sports scene. What is the girl on the right doing?', image: '/games/sports-scene.png', options: ['Riding a bike', 'Swimming', 'Playing football'], answerIndex: 0 },
    ],
  },
  {
    id: 'g3-animals',
    title: 'Animals: Where and What',
    description: 'Use a scene to understand place and ability.',
    type: 'image-question',
    difficulty: 'medio',
    subjectId: 's-english',
    grade: '3',
    xpReward: 70,
    questions: [
      { id: 'q1', prompt: 'Look at the scene. Where is the cat?', image: '/games/animals-scene.png', options: ['Under the table', 'On the table', 'Next to the table'], answerIndex: 1, hint: 'Look carefully at the picture.' },
      { id: 'q2', prompt: 'Look at the scene. Which animal is flying?', image: '/games/animals-scene.png', options: ['A bird', 'A dog', 'A cat'], answerIndex: 0, hint: 'Look near the window.' },
      { id: 'q3', prompt: 'Look at the scene. Where is the dog?', image: '/games/animals-scene.png', options: ['Next to the table', 'Under the table', 'On the table'], answerIndex: 0 },
    ],
  },
  {
    id: 'g3-clothes',
    title: 'Clothes: Look at Mia',
    description: 'Observe a character and understand what she is wearing.',
    type: 'multiple-choice',
    difficulty: 'medio',
    subjectId: 's-english',
    grade: '3',
    xpReward: 60,
    questions: [
      { id: 'q1', prompt: 'Look at Mia. What is she wearing?', image: '/games/mia-clothes.png', options: ['A skirt', 'Shorts', 'A hat'], answerIndex: 0 },
      { id: 'q2', prompt: 'Look at Mia. Which item is part of her outfit?', image: '/games/mia-clothes.png', options: ['A jacket', 'A swimsuit', 'A helmet'], answerIndex: 0 },
      { id: 'q3', prompt: 'Look at Mia. Which sentence is correct?', image: '/games/mia-clothes.png', options: ['She is wearing a jacket.', 'She is wearing shorts.', 'He is wearing a jacket.'], answerIndex: 0 },
    ],
  },
  {
    id: 'g3-food',
    title: 'Food: Likes and Dislikes',
    description: 'Read what each character likes and choose the food.',
    type: 'image-question',
    difficulty: 'medio',
    subjectId: 's-english',
    grade: '3',
    xpReward: 65,
    questions: [
      { id: 'q1', prompt: 'Look at the food scene. Which food can you see?', image: '/games/food-scene.png', options: ['A burger', 'A shoe', 'A pencil'], answerIndex: 0 },
      { id: 'q2', prompt: 'Look at the food scene. Which fruit can you see?', image: '/games/food-scene.png', options: ['An apple', 'A carrot', 'A sandwich'], answerIndex: 0 },
      { id: 'q3', prompt: 'Look at the food scene. Which dish is in a bowl?', image: '/games/food-scene.png', options: ['Soup', 'Pizza', 'A burger'], answerIndex: 0 },
    ],
  },
  {
    id: 'g3-body',
    title: 'The Monster: Has Got',
    description: 'Look closely and choose the sentence that describes the monster.',
    type: 'true-false',
    difficulty: 'medio',
    subjectId: 's-english',
    grade: '3',
    xpReward: 70,
    questions: [
      { id: 'q1', prompt: 'Look at the monster. It has got three eyes.', image: '/games/monster.png', options: ['True', 'False'], answerIndex: 0 },
      { id: 'q2', prompt: 'Look at the monster. It has got six legs.', image: '/games/monster.png', options: ['True', 'False'], answerIndex: 0 },
      { id: 'q3', prompt: 'Look at the monster. It has got one ear.', image: '/games/monster.png', options: ['True', 'False'], answerIndex: 1 },
    ],
  },
  {
    id: 'g3-beach',
    title: 'At the Beach: What Do They Want?',
    description: 'Read the beach scene and choose the sentence that fits.',
    type: 'order-elements',
    difficulty: 'medio',
    subjectId: 's-english',
    grade: '3',
    xpReward: 75,
    questions: [
      { id: 'q1', prompt: 'I want to build a sandcastle.', sequence: ['I', 'want', 'to', 'build', 'a', 'sandcastle'] },
      { id: 'q2', prompt: 'She doesn\'t want to swim.', sequence: ['She', 'doesn\'t', 'want', 'to', 'swim'] },
      { id: 'q3', prompt: 'He wants to surf.', sequence: ['He', 'wants', 'to', 'surf'] },
    ],
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
    grade: '4',
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
    grade: '4',
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
    grade: '4',
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
    grade: '4',
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
    grade: '4',
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
    grade: '4',
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
    grade: '4',
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
    grade: '4',
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

// --- Datos de análisis para el portal del profesor ---
// Simulados para demostrar la vista de análisis detallado por alumno.

function statusForPct(pct: number): 'dominado' | 'en-progreso' | 'necesita-refuerzo' {
  if (pct >= 80) return 'dominado'
  if (pct >= 60) return 'en-progreso'
  return 'necesita-refuerzo'
}

export const studentAnalyses: Record<string, StudentAnalysis> = {
  'st-1': {
    studentId: 'st-1',
    xp: 1580,
    level: 6,
    streakDays: 5,
    overallProgressPct: 68,
    activitiesCompleted: 6,
    activitiesPending: 3,
    correctPct: 78,
    incorrectPct: 22,
    totalAttempts: 14,
    avgTimeSec: 52,
    performance: [
      { date: 'Sem 1', score: 55 },
      { date: 'Sem 2', score: 62 },
      { date: 'Sem 3', score: 70 },
      { date: 'Sem 4', score: 68 },
      { date: 'Sem 5', score: 78 },
    ],
    skills: [
      { skill: 'Vocabulary', pct: 85, status: 'dominado' },
      { skill: 'Grammar', pct: 58, status: 'en-progreso' },
      { skill: 'Reading', pct: 72, status: 'en-progreso' },
      { skill: 'Listening', pct: 80, status: 'dominado' },
      { skill: 'Writing', pct: 54, status: 'necesita-refuerzo' },
    ],
    topics: [
      { topic: 'Present Simple', skill: 'Grammar', pct: 52, status: 'necesita-refuerzo' },
      { topic: 'Verb to be', skill: 'Grammar', pct: 86, status: 'dominado' },
      { topic: 'Have got', skill: 'Grammar', pct: 68, status: 'en-progreso' },
      { topic: 'Animals', skill: 'Vocabulary', pct: 90, status: 'dominado' },
      { topic: 'Colors', skill: 'Vocabulary', pct: 82, status: 'dominado' },
      { topic: 'Numbers', skill: 'Vocabulary', pct: 78, status: 'en-progreso' },
      { topic: 'Short texts', skill: 'Reading', pct: 72, status: 'en-progreso' },
      { topic: 'Instructions', skill: 'Listening', pct: 80, status: 'dominado' },
      { topic: 'Short sentences', skill: 'Writing', pct: 54, status: 'necesita-refuerzo' },
    ],
    recentActivities: [
      { activityId: 'a-1', title: 'Animales / Animals', score: 100, correctCount: 3, totalCount: 3, timeSec: 35, date: '2026-09-24', status: 'completada' },
      { activityId: 'a-2', title: 'Colores / Colors', score: 75, correctCount: 3, totalCount: 4, timeSec: 40, date: '2026-09-22', status: 'completada' },
      { activityId: 'a-3', title: 'Completa la palabra', score: 67, correctCount: 2, totalCount: 3, timeSec: 68, date: '2026-09-20', status: 'completada' },
      { activityId: 'a-4', title: 'Une los conceptos', score: 75, correctCount: 3, totalCount: 4, timeSec: 55, date: '2026-09-18', status: 'completada' },
      { activityId: 'a-5', title: 'Ordena la oración', score: 50, correctCount: 1, totalCount: 2, timeSec: 72, date: '2026-09-15', status: 'completada' },
      { activityId: 'a-6', title: 'Adivina la imagen', score: 100, correctCount: 2, totalCount: 2, timeSec: 30, date: '2026-09-12', status: 'completada' },
      { activityId: 'a-7', title: 'Juego de memoria', score: 0, correctCount: 0, totalCount: 0, timeSec: 0, date: '', status: 'pendiente' },
      { activityId: 'a-8', title: 'Quiz contra reloj', score: 0, correctCount: 0, totalCount: 0, timeSec: 0, date: '', status: 'pendiente' },
    ],
    weakTopics: [
      { topic: 'Present Simple', skill: 'Grammar', pct: 52, status: 'necesita-refuerzo' },
      { topic: 'Short sentences', skill: 'Writing', pct: 54, status: 'necesita-refuerzo' },
      { topic: 'Have got', skill: 'Grammar', pct: 68, status: 'en-progreso' },
    ],
    recommendation:
      'Sofía tiene buen vocabulario y comprensión auditiva. Conviene reforzar Present Simple y escritura de oraciones cortas con ejercicios prácticos guiados.',
  },
  'st-2': {
    studentId: 'st-2',
    xp: 1920,
    level: 7,
    streakDays: 8,
    overallProgressPct: 75,
    activitiesCompleted: 7,
    activitiesPending: 2,
    correctPct: 83,
    incorrectPct: 17,
    totalAttempts: 16,
    avgTimeSec: 44,
    performance: [
      { date: 'Sem 1', score: 68 },
      { date: 'Sem 2', score: 74 },
      { date: 'Sem 3', score: 78 },
      { date: 'Sem 4', score: 82 },
      { date: 'Sem 5', score: 85 },
    ],
    skills: [
      { skill: 'Vocabulary', pct: 88, status: 'dominado' },
      { skill: 'Grammar', pct: 72, status: 'en-progreso' },
      { skill: 'Reading', pct: 80, status: 'dominado' },
      { skill: 'Listening', pct: 75, status: 'en-progreso' },
      { skill: 'Writing', pct: 68, status: 'en-progreso' },
    ],
    topics: [
      { topic: 'Present Simple', skill: 'Grammar', pct: 72, status: 'en-progreso' },
      { topic: 'Verb to be', skill: 'Grammar', pct: 90, status: 'dominado' },
      { topic: 'Have got', skill: 'Grammar', pct: 75, status: 'en-progreso' },
      { topic: 'Animals', skill: 'Vocabulary', pct: 92, status: 'dominado' },
      { topic: 'Colors', skill: 'Vocabulary', pct: 88, status: 'dominado' },
      { topic: 'Numbers', skill: 'Vocabulary', pct: 85, status: 'dominado' },
      { topic: 'Short texts', skill: 'Reading', pct: 80, status: 'dominado' },
      { topic: 'Instructions', skill: 'Listening', pct: 75, status: 'en-progreso' },
      { topic: 'Short sentences', skill: 'Writing', pct: 68, status: 'en-progreso' },
    ],
    recentActivities: [
      { activityId: 'a-1', title: 'Animales / Animals', score: 100, correctCount: 3, totalCount: 3, timeSec: 28, date: '2026-09-24', status: 'completada' },
      { activityId: 'a-2', title: 'Colores / Colors', score: 100, correctCount: 4, totalCount: 4, timeSec: 32, date: '2026-09-23', status: 'completada' },
      { activityId: 'a-3', title: 'Completa la palabra', score: 100, correctCount: 3, totalCount: 3, timeSec: 45, date: '2026-09-21', status: 'completada' },
      { activityId: 'a-4', title: 'Une los conceptos', score: 100, correctCount: 4, totalCount: 4, timeSec: 50, date: '2026-09-19', status: 'completada' },
      { activityId: 'a-5', title: 'Ordena la oración', score: 50, correctCount: 1, totalCount: 2, timeSec: 60, date: '2026-09-17', status: 'completada' },
      { activityId: 'a-6', title: 'Adivina la imagen', score: 100, correctCount: 2, totalCount: 2, timeSec: 25, date: '2026-09-14', status: 'completada' },
      { activityId: 'a-7', title: 'Juego de memoria', score: 75, correctCount: 3, totalCount: 4, timeSec: 48, date: '2026-09-10', status: 'completada' },
      { activityId: 'a-8', title: 'Quiz contra reloj', score: 0, correctCount: 0, totalCount: 0, timeSec: 0, date: '', status: 'pendiente' },
    ],
    weakTopics: [
      { topic: 'Short sentences', skill: 'Writing', pct: 68, status: 'en-progreso' },
      { topic: 'Instructions', skill: 'Listening', pct: 75, status: 'en-progreso' },
      { topic: 'Present Simple', skill: 'Grammar', pct: 72, status: 'en-progreso' },
    ],
    recommendation:
      'Mateo va muy bien en vocabulario y lectura. Para llegar al dominio total, conviene practicar escritura de oraciones cortas y comprensión auditiva con audios más variados.',
  },
  'st-3': {
    studentId: 'st-3',
    xp: 2350,
    level: 8,
    streakDays: 12,
    overallProgressPct: 88,
    activitiesCompleted: 8,
    activitiesPending: 1,
    correctPct: 92,
    incorrectPct: 8,
    totalAttempts: 20,
    avgTimeSec: 38,
    performance: [
      { date: 'Sem 1', score: 80 },
      { date: 'Sem 2', score: 85 },
      { date: 'Sem 3', score: 88 },
      { date: 'Sem 4', score: 90 },
      { date: 'Sem 5', score: 92 },
    ],
    skills: [
      { skill: 'Vocabulary', pct: 95, status: 'dominado' },
      { skill: 'Grammar', pct: 88, status: 'dominado' },
      { skill: 'Reading', pct: 90, status: 'dominado' },
      { skill: 'Listening', pct: 85, status: 'dominado' },
      { skill: 'Writing', pct: 82, status: 'dominado' },
    ],
    topics: [
      { topic: 'Present Simple', skill: 'Grammar', pct: 88, status: 'dominado' },
      { topic: 'Verb to be', skill: 'Grammar', pct: 96, status: 'dominado' },
      { topic: 'Have got', skill: 'Grammar', pct: 90, status: 'dominado' },
      { topic: 'Animals', skill: 'Vocabulary', pct: 98, status: 'dominado' },
      { topic: 'Colors', skill: 'Vocabulary', pct: 95, status: 'dominado' },
      { topic: 'Numbers', skill: 'Vocabulary', pct: 92, status: 'dominado' },
      { topic: 'Short texts', skill: 'Reading', pct: 90, status: 'dominado' },
      { topic: 'Instructions', skill: 'Listening', pct: 85, status: 'dominado' },
      { topic: 'Short sentences', skill: 'Writing', pct: 82, status: 'dominado' },
    ],
    recentActivities: [
      { activityId: 'a-1', title: 'Animales / Animals', score: 100, correctCount: 3, totalCount: 3, timeSec: 22, date: '2026-09-24', status: 'completada' },
      { activityId: 'a-2', title: 'Colores / Colors', score: 100, correctCount: 4, totalCount: 4, timeSec: 25, date: '2026-09-23', status: 'completada' },
      { activityId: 'a-3', title: 'Completa la palabra', score: 100, correctCount: 3, totalCount: 3, timeSec: 35, date: '2026-09-21', status: 'completada' },
      { activityId: 'a-4', title: 'Une los conceptos', score: 100, correctCount: 4, totalCount: 4, timeSec: 40, date: '2026-09-19', status: 'completada' },
      { activityId: 'a-5', title: 'Ordena la oración', score: 100, correctCount: 2, totalCount: 2, timeSec: 45, date: '2026-09-17', status: 'completada' },
      { activityId: 'a-6', title: 'Adivina la imagen', score: 100, correctCount: 2, totalCount: 2, timeSec: 20, date: '2026-09-14', status: 'completada' },
      { activityId: 'a-7', title: 'Juego de memoria', score: 100, correctCount: 4, totalCount: 4, timeSec: 38, date: '2026-09-10', status: 'completada' },
      { activityId: 'a-8', title: 'Quiz contra reloj', score: 80, correctCount: 4, totalCount: 5, timeSec: 38, date: '2026-09-07', status: 'completada' },
    ],
    weakTopics: [
      { topic: 'Short sentences', skill: 'Writing', pct: 82, status: 'dominado' },
      { topic: 'Instructions', skill: 'Listening', pct: 85, status: 'dominado' },
      { topic: 'Present Simple', skill: 'Grammar', pct: 88, status: 'dominado' },
    ],
    recommendation:
      'Valentina domina todas las habilidades. Se sugieren actividades de desafío avanzado y escritura libre para mantenerla motivada.',
  },
  'st-4': {
    studentId: 'st-4',
    xp: 980,
    level: 4,
    streakDays: 2,
    overallProgressPct: 42,
    activitiesCompleted: 4,
    activitiesPending: 5,
    correctPct: 55,
    incorrectPct: 45,
    totalAttempts: 9,
    avgTimeSec: 68,
    performance: [
      { date: 'Sem 1', score: 40 },
      { date: 'Sem 2', score: 45 },
      { date: 'Sem 3', score: 52 },
      { date: 'Sem 4', score: 50 },
      { date: 'Sem 5', score: 55 },
    ],
    skills: [
      { skill: 'Vocabulary', pct: 62, status: 'en-progreso' },
      { skill: 'Grammar', pct: 42, status: 'necesita-refuerzo' },
      { skill: 'Reading', pct: 55, status: 'necesita-refuerzo' },
      { skill: 'Listening', pct: 58, status: 'necesita-refuerzo' },
      { skill: 'Writing', pct: 40, status: 'necesita-refuerzo' },
    ],
    topics: [
      { topic: 'Present Simple', skill: 'Grammar', pct: 38, status: 'necesita-refuerzo' },
      { topic: 'Verb to be', skill: 'Grammar', pct: 55, status: 'necesita-refuerzo' },
      { topic: 'Have got', skill: 'Grammar', pct: 42, status: 'necesita-refuerzo' },
      { topic: 'Animals', skill: 'Vocabulary', pct: 70, status: 'en-progreso' },
      { topic: 'Colors', skill: 'Vocabulary', pct: 60, status: 'en-progreso' },
      { topic: 'Numbers', skill: 'Vocabulary', pct: 55, status: 'necesita-refuerzo' },
      { topic: 'Short texts', skill: 'Reading', pct: 55, status: 'necesita-refuerzo' },
      { topic: 'Instructions', skill: 'Listening', pct: 58, status: 'necesita-refuerzo' },
      { topic: 'Short sentences', skill: 'Writing', pct: 40, status: 'necesita-refuerzo' },
    ],
    recentActivities: [
      { activityId: 'a-1', title: 'Animales / Animals', score: 67, correctCount: 2, totalCount: 3, timeSec: 55, date: '2026-09-22', status: 'completada' },
      { activityId: 'a-2', title: 'Colores / Colors', score: 50, correctCount: 2, totalCount: 4, timeSec: 60, date: '2026-09-20', status: 'completada' },
      { activityId: 'a-3', title: 'Completa la palabra', score: 33, correctCount: 1, totalCount: 3, timeSec: 80, date: '2026-09-18', status: 'completada' },
      { activityId: 'a-6', title: 'Adivina la imagen', score: 100, correctCount: 2, totalCount: 2, timeSec: 40, date: '2026-09-15', status: 'completada' },
      { activityId: 'a-4', title: 'Une los conceptos', score: 0, correctCount: 0, totalCount: 0, timeSec: 0, date: '', status: 'pendiente' },
      { activityId: 'a-5', title: 'Ordena la oración', score: 0, correctCount: 0, totalCount: 0, timeSec: 0, date: '', status: 'pendiente' },
      { activityId: 'a-7', title: 'Juego de memoria', score: 0, correctCount: 0, totalCount: 0, timeSec: 0, date: '', status: 'pendiente' },
      { activityId: 'a-8', title: 'Quiz contra reloj', score: 0, correctCount: 0, totalCount: 0, timeSec: 0, date: '', status: 'pendiente' },
    ],
    weakTopics: [
      { topic: 'Present Simple', skill: 'Grammar', pct: 38, status: 'necesita-refuerzo' },
      { topic: 'Short sentences', skill: 'Writing', pct: 40, status: 'necesita-refuerzo' },
      { topic: 'Have got', skill: 'Grammar', pct: 42, status: 'necesita-refuerzo' },
    ],
    recommendation:
      'Thiago necesita refuerzo general. Se sugiere empezar con actividades de vocabulario visual (animales, colores) y luego introducir Present Simple con ejercicios muy guiados.',
  },
  'st-5': {
    studentId: 'st-5',
    xp: 720,
    level: 3,
    streakDays: 1,
    overallProgressPct: 28,
    activitiesCompleted: 3,
    activitiesPending: 6,
    correctPct: 48,
    incorrectPct: 52,
    totalAttempts: 6,
    avgTimeSec: 75,
    performance: [
      { date: 'Sem 1', score: 30 },
      { date: 'Sem 2', score: 35 },
      { date: 'Sem 3', score: 42 },
      { date: 'Sem 4', score: 45 },
      { date: 'Sem 5', score: 48 },
    ],
    skills: [
      { skill: 'Vocabulary', pct: 52, status: 'necesita-refuerzo' },
      { skill: 'Grammar', pct: 35, status: 'necesita-refuerzo' },
      { skill: 'Reading', pct: 45, status: 'necesita-refuerzo' },
      { skill: 'Listening', pct: 50, status: 'necesita-refuerzo' },
      { skill: 'Writing', pct: 30, status: 'necesita-refuerzo' },
    ],
    topics: [
      { topic: 'Present Simple', skill: 'Grammar', pct: 30, status: 'necesita-refuerzo' },
      { topic: 'Verb to be', skill: 'Grammar', pct: 45, status: 'necesita-refuerzo' },
      { topic: 'Have got', skill: 'Grammar', pct: 38, status: 'necesita-refuerzo' },
      { topic: 'Animals', skill: 'Vocabulary', pct: 60, status: 'en-progreso' },
      { topic: 'Colors', skill: 'Vocabulary', pct: 50, status: 'necesita-refuerzo' },
      { topic: 'Numbers', skill: 'Vocabulary', pct: 45, status: 'necesita-refuerzo' },
      { topic: 'Short texts', skill: 'Reading', pct: 45, status: 'necesita-refuerzo' },
      { topic: 'Instructions', skill: 'Listening', pct: 50, status: 'necesita-refuerzo' },
      { topic: 'Short sentences', skill: 'Writing', pct: 30, status: 'necesita-refuerzo' },
    ],
    recentActivities: [
      { activityId: 'a-1', title: 'Animales / Animals', score: 67, correctCount: 2, totalCount: 3, timeSec: 60, date: '2026-09-21', status: 'completada' },
      { activityId: 'a-2', title: 'Colores / Colors', score: 50, correctCount: 2, totalCount: 4, timeSec: 70, date: '2026-09-19', status: 'completada' },
      { activityId: 'a-6', title: 'Adivina la imagen', score: 50, correctCount: 1, totalCount: 2, timeSec: 45, date: '2026-09-16', status: 'completada' },
      { activityId: 'a-3', title: 'Completa la palabra', score: 0, correctCount: 0, totalCount: 0, timeSec: 0, date: '', status: 'pendiente' },
      { activityId: 'a-4', title: 'Une los conceptos', score: 0, correctCount: 0, totalCount: 0, timeSec: 0, date: '', status: 'pendiente' },
      { activityId: 'a-5', title: 'Ordena la oración', score: 0, correctCount: 0, totalCount: 0, timeSec: 0, date: '', status: 'pendiente' },
      { activityId: 'a-7', title: 'Juego de memoria', score: 0, correctCount: 0, totalCount: 0, timeSec: 0, date: '', status: 'pendiente' },
      { activityId: 'a-8', title: 'Quiz contra reloj', score: 0, correctCount: 0, totalCount: 0, timeSec: 0, date: '', status: 'pendiente' },
    ],
    weakTopics: [
      { topic: 'Present Simple', skill: 'Grammar', pct: 30, status: 'necesita-refuerzo' },
      { topic: 'Short sentences', skill: 'Writing', pct: 30, status: 'necesita-refuerzo' },
      { topic: 'Have got', skill: 'Grammar', pct: 38, status: 'necesita-refuerzo' },
    ],
    recommendation:
      'Emma está comenzando. Conviene priorizar actividades visuales de vocabulario (animales, colores) y reforzar "Verb to be" con ejercicios cortos antes de avanzar a escritura.',
  },
}

// Helpers de acceso (sustituibles por consultas reales a la base de datos).
export function getStudentByUsername(username: string): Student | undefined {
  const normalized = username.trim().toLowerCase()
  const stored = typeof window !== 'undefined'
    ? (JSON.parse(localStorage.getItem('adventure-users') ?? '[]') as Student[])
    : []
  const allStudents = [...students, ...stored.filter((user) => !students.some((item) => item.id === user.id))]
  return allStudents.find((s) => s.username === normalized)
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

export function getStudentAnalysis(id: string): StudentAnalysis | undefined {
  return studentAnalyses[id]
}

export const GRADE_LABELS: Record<Grade, string> = {
  '1': '1.º grado',
  '2': '2.º grado',
  '3': '3.º grado',
  '4': '4.º grado',
  '5': '5.º grado',
  '6': '6.º grado',
}

export const GRADE_OPTIONS: Grade[] = ['1', '2', '3', '4', '5', '6']

export function getActivitiesForGrade(grade: Grade): Activity[] {
  if (grade === '3') return gradeThreeActivities

  const baseDifficulty = grade === '1' || grade === '2' ? 'facil' : grade === '4' ? 'medio' : 'dificil'
  const isEarlyGrade = grade === '1' || grade === '2'
  const isAdvancedGrade = grade === '5' || grade === '6'

  return activities
    .filter((activity) => !isEarlyGrade || activity.difficulty !== 'dificil')
    .map((activity) => ({
      ...activity,
      grade,
      difficulty: baseDifficulty,
      description: isEarlyGrade
        ? `${activity.description} Palabras cortas y apoyo visual.`
        : isAdvancedGrade
          ? `${activity.description} Incluye comprensión y razonamiento avanzado.`
          : activity.description,
      questions: isEarlyGrade
        ? activity.questions.slice(0, Math.max(1, Math.ceil(activity.questions.length / 2)))
        : activity.questions,
    }))
}

export function getActivityForGrade(id: string, grade: Grade): Activity | undefined {
  return getActivitiesForGrade(grade).find((activity) => activity.id === id)
}

export function addActivity(activity: Activity): void {
  activities.push(activity)
}
