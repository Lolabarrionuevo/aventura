import Link from 'next/link'
import Image from 'next/image'
import {
  Flame,
  Trophy,
  Medal,
  Sparkles,
  Zap,
  Target,
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { buttonVariants } from '@/components/ui/button'
import { GAME_TYPE_META } from '@/lib/adventure/gamification'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: 'ghost' }), 'h-10 px-4 font-bold')}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className={cn(buttonVariants(), 'h-10 rounded-xl px-4 font-bold')}
          >
            Empezar gratis
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            <Sparkles className="size-4" aria-hidden="true" />
            Inglés para primaria, jugando
          </span>
          <h1 className="text-balance font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
            Aprende inglés como en una gran{' '}
            <span className="text-primary">aventura</span> 🚀
          </h1>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            ADVENTURE combina la diversión de los juegos con el poder de una plataforma educativa.
            Actividades, desafíos, quizzes y un Tutor con IA para que cada alumno avance a su ritmo.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/registro"
              className={cn(buttonVariants(), 'h-12 rounded-xl px-8 text-base font-extrabold')}
            >
              Comenzar ahora
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-12 rounded-xl px-8 text-base font-bold',
              )}
            >
              Ya tengo cuenta
            </Link>
          </div>
          <dl className="mt-2 flex flex-wrap gap-6">
            <Metric value="9" label="tipos de juego" />
            <Metric value="XP" label="y niveles" />
            <Metric value="IA" label="Tutor personal" />
          </dl>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/15 blur-2xl" />
          <Image
            src="/mascot.png"
            alt="Zorro explorador, mascota de ADVENTURE"
            width={420}
            height={420}
            priority
            className="w-full max-w-sm drop-shadow-xl"
          />
          <FloatingCard className="left-0 top-6" icon={<Flame className="size-5 text-accent" />}>
            Racha de 5 días
          </FloatingCard>
          <FloatingCard
            className="bottom-8 right-0"
            icon={<Trophy className="size-5 text-secondary" />}
          >
            +120 XP hoy
          </FloatingCard>
        </div>
      </section>

      {/* Gamificación */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading
          kicker="Gamificación"
          title="Cada acierto suma"
          subtitle="Motivamos a los alumnos con un sistema completo de recompensas."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <FeatureCard icon={<Zap />} title="XP y niveles" text="Gana experiencia y sube de nivel." />
          <FeatureCard icon={<Flame />} title="Rachas" text="Aprende todos los días sin cortar la racha." />
          <FeatureCard icon={<Medal />} title="Medallas" text="Desbloquea logros por tus hazañas." />
          <FeatureCard icon={<Trophy />} title="Ranking" text="Compite sanamente con tu clase." />
        </div>
      </section>

      {/* Tipos de juego */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading
          kicker="Actividades"
          title="9 formas de aprender jugando"
          subtitle="Desde opción múltiple hasta quizzes contra reloj."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {Object.values(GAME_TYPE_META).map((g) => (
            <div
              key={g.label}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-transform hover:-translate-y-1"
            >
              <span className="text-2xl" aria-hidden="true">
                {g.emoji}
              </span>
              <div>
                <p className="font-display font-bold text-card-foreground">{g.label}</p>
                <p className="text-sm text-muted-foreground">{g.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading
          kicker="Para toda la clase"
          title="Pensado para cada rol"
          subtitle="Alumnos, profesores y administradores, cada uno con su espacio."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <RoleCard
            icon={<GraduationCap className="size-6" />}
            title="Alumno"
            points={['Dashboard con XP y medallas', 'Juegos y desafíos diarios', 'Tutor IA que guía sin dar la respuesta']}
          />
          <RoleCard
            icon={<Users className="size-6" />}
            title="Profesor"
            points={['Crea cursos y actividades', 'Asigna tareas con fecha límite', 'Panel de resultados con gráficos']}
          />
          <RoleCard
            icon={<ShieldCheck className="size-6" />}
            title="Administrador"
            points={['Gestiona la institución', 'Roles y permisos seguros', 'Cada quien ve solo lo suyo']}
          />
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center gap-6 rounded-[2rem] bg-primary px-6 py-14 text-center text-primary-foreground">
          <Target className="size-10" aria-hidden="true" />
          <h2 className="text-balance font-display text-3xl font-extrabold md:text-4xl">
            ¿List@ para la aventura? 🎯
          </h2>
          <p className="max-w-xl text-pretty text-lg opacity-90">
            Únete a ADVENTURE y transforma la clase de inglés en un juego que los alumnos aman.
          </p>
          <Link
            href="/registro"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-background px-8 text-base font-extrabold text-foreground transition-colors hover:bg-background/90"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <Logo />
          <p>Hecho con cariño para las aulas de primaria.</p>
        </div>
      </footer>
    </main>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-2xl font-extrabold text-foreground">{value}</dt>
      <dd className="text-sm text-muted-foreground">{label}</dd>
    </div>
  )
}

function FloatingCard({
  children,
  icon,
  className,
}: {
  children: React.ReactNode
  icon: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`absolute flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 text-sm font-bold text-card-foreground shadow-lg ${className}`}
    >
      {icon}
      {children}
    </div>
  )
}

function SectionHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker: string
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-8 flex flex-col items-center gap-2 text-center">
      <span className="text-sm font-extrabold uppercase tracking-wider text-primary">{kicker}</span>
      <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="max-w-xl text-pretty text-muted-foreground">{subtitle}</p>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary [&>svg]:size-5">
        {icon}
      </span>
      <div>
        <p className="font-display font-bold text-card-foreground">{title}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}

function RoleCard({
  icon,
  title,
  points,
}: {
  icon: React.ReactNode
  title: string
  points: string[]
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <span className="grid size-12 place-items-center rounded-2xl bg-secondary/10 text-secondary">
        {icon}
      </span>
      <p className="font-display text-xl font-extrabold text-card-foreground">{title}</p>
      <ul className="flex flex-col gap-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-0.5 text-primary" aria-hidden="true">
              ✓
            </span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
}
