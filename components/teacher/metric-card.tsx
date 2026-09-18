import { cn } from '@/lib/utils'

export function MetricCard({
  icon,
  value,
  label,
  hint,
  accent = 'primary',
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  hint?: string
  accent?: 'primary' | 'secondary' | 'accent' | 'chart-4'
}) {
  const accentClasses: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/20 text-accent-foreground',
    'chart-4': 'bg-chart-4/15 text-chart-4',
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5">
      <span
        className={cn(
          'grid size-11 place-items-center rounded-2xl',
          accentClasses[accent],
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div>
        <p className="font-display text-2xl font-extrabold leading-none text-card-foreground">
          {value}
        </p>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  )
}
