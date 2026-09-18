'use client'

import { useState } from 'react'
import { LayoutDashboard, Users, ClipboardList, BarChart3, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from '@/components/session-provider'
import { TeacherHeader } from '@/components/teacher/teacher-header'
import { CourseSelector } from '@/components/teacher/course-selector'
import { OverviewSection } from '@/components/teacher/overview-section'
import { StudentsSection } from '@/components/teacher/students-section'
import { StudentDetail } from '@/components/teacher/student-detail'
import { ActivitiesSection } from '@/components/teacher/activities-section'
import { ResultsSection } from '@/components/teacher/results-section'
import { RankingSection } from '@/components/teacher/ranking-section'
import type { Grade, Division } from '@/lib/adventure/teacher-data'

type SectionId = 'resumen' | 'alumnos' | 'actividades' | 'resultados' | 'ranking'

const SECTIONS: { id: SectionId; label: string; icon: typeof Users }[] = [
  { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
  { id: 'alumnos', label: 'Mis alumnos', icon: Users },
  { id: 'actividades', label: 'Actividades', icon: ClipboardList },
  { id: 'resultados', label: 'Resultados', icon: BarChart3 },
  { id: 'ranking', label: 'Ranking', icon: Trophy },
]

export default function ProfesorPage() {
  const { teacherName } = useSession()
  const displayName = teacherName || 'Profesor/a'
  const [grade, setGrade] = useState<Grade>(4)
  const [division, setDivision] = useState<Division>('A')
  const [section, setSection] = useState<SectionId>('resumen')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  function changeGrade(g: Grade) {
    setGrade(g)
    setSelectedStudent(null)
  }

  function changeDivision(d: Division) {
    setDivision(d)
    setSelectedStudent(null)
  }

  function changeSection(s: SectionId) {
    setSection(s)
    setSelectedStudent(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <TeacherHeader teacherName={displayName} />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        <div className="mb-6 flex flex-col gap-4">
          <CourseSelector
            grade={grade}
            division={division}
            onGradeChange={changeGrade}
            onDivisionChange={changeDivision}
          />

          {/* Navegación de secciones */}
          <nav
            className="flex gap-2 overflow-x-auto pb-1"
            aria-label="Secciones del panel docente"
          >
            {SECTIONS.map(({ id, label, icon: Icon }) => {
              const active = section === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => changeSection(id)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-card text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </button>
              )
            })}
          </nav>
        </div>

        {section === 'resumen' && (
          <OverviewSection teacherName={displayName} grade={grade} division={division} />
        )}

        {section === 'alumnos' &&
          (selectedStudent ? (
            <StudentDetail
              grade={grade}
              division={division}
              studentId={selectedStudent}
              onBack={() => setSelectedStudent(null)}
            />
          ) : (
            <StudentsSection
              grade={grade}
              division={division}
              onSelectStudent={setSelectedStudent}
            />
          ))}

        {section === 'actividades' && <ActivitiesSection grade={grade} />}

        {section === 'resultados' && <ResultsSection grade={grade} division={division} />}

        {section === 'ranking' && <RankingSection grade={grade} division={division} />}
      </main>
    </div>
  )
}
