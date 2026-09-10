import { cn } from '@/lib/utils'

const PALETTE = [
  'bg-primary text-primary-foreground',
  'bg-secondary text-secondary-foreground',
  'bg-accent text-accent-foreground',
  'bg-chart-4 text-primary-foreground',
  'bg-chart-5 text-primary-foreground',
]

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

function colorFor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

const SIZES = {
  sm: 'size-9 text-xs',
  md: 'size-12 text-sm',
  lg: 'size-16 text-lg',
  xl: 'size-24 text-2xl',
}

export function Avatar({
  name,
  size = 'md',
  className,
}: {
  name: string
  size?: keyof typeof SIZES
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full font-display font-bold shadow-sm ring-2 ring-background',
        SIZES[size],
        colorFor(name),
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
