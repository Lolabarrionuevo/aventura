'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { getActivity } from '@/lib/adventure/data'
import { GamePlayer } from '@/components/games/game-player'

export default function ActividadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const activity = getActivity(id)

  if (!activity) {
    return notFound()
  }

  return <GamePlayer activity={activity} />
}
