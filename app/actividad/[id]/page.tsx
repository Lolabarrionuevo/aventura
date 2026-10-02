'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { getActivityForGrade } from '@/lib/adventure/data'
import { GamePlayer } from '@/components/games/game-player'
import { useSession } from '@/components/session-provider'

export default function ActividadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { student } = useSession()
  const activity = getActivityForGrade(id, student.grade)

  if (!activity) {
    return notFound()
  }

  return <GamePlayer key={`${activity.id}-${student.grade}`} activity={activity} />
}
