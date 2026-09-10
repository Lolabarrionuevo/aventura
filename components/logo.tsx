import { cn } from '@/lib/utils'
import { Compass } from 'lucide-react'

export function Logo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Compass className="size-5" aria-hidden="true" />
      </span>
      {showText && (
        <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
          ADVENTURE
        </span>
      )}
    </span>
  )
}
