import Link from 'next/link'
import { Users, ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default function ProfesorPlaceholderPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <Logo />
        <span className="grid size-20 place-items-center rounded-3xl bg-secondary/10 text-secondary">
          <Users className="size-9" aria-hidden="true" />
        </span>
        <h1 className="text-balance font-display text-3xl font-extrabold tracking-tight text-foreground">
          El panel del profesor llega pronto 👩‍🏫
        </h1>
        <p className="text-pretty text-muted-foreground">
          Estamos preparando el espacio para crear cursos, actividades y ver los resultados de la
          clase con gráficos. Es la siguiente entrega de ADVENTURE.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'outline' }), 'h-11 rounded-xl px-6 font-bold')}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
