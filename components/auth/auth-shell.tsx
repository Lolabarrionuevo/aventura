import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/logo'

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Panel de marca */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <Link href="/" aria-label="Volver al inicio">
          <Logo className="[&_span:last-child]:text-primary-foreground [&>span:first-child]:bg-primary-foreground [&>span:first-child]:text-primary" />
        </Link>
        <div className="flex flex-col items-center gap-6">
          <Image
            src="/mascot.png"
            alt="Mascota de ADVENTURE"
            width={300}
            height={300}
            className="drop-shadow-xl"
          />
          <p className="max-w-xs text-balance text-center font-display text-2xl font-extrabold leading-snug">
            Aprende inglés jugando y sube de nivel cada día 🚀
          </p>
        </div>
        <p className="text-sm opacity-80">La aventura de aprender empieza aquí.</p>
      </div>

      {/* Panel de formulario */}
      <div className="flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center gap-2 text-center lg:hidden">
            <Link href="/" aria-label="Volver al inicio">
              <Logo />
            </Link>
          </div>
          <h1 className="text-balance font-display text-3xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-pretty text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  )
}
