import { cn } from '@/lib/utils'

export function ProgressBar({
  value,
  className,
  barClassName,
  label,
}: {
  value: number
  className?: string
  barClassName?: string
  label?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn('h-3 w-full overflow-hidden rounded-full bg-muted', className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={cn(
          'h-full rounded-full bg-primary transition-[width] duration-700 ease-out',
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
