import { StudentNav } from '@/components/student-nav'
import { cn } from '@/lib/utils'

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="min-h-screen bg-background">
      <StudentNav />
      <main className={cn('mx-auto max-w-6xl px-4 pb-24 pt-6 md:pb-10', className)}>
        {children}
      </main>
    </div>
  )
}
