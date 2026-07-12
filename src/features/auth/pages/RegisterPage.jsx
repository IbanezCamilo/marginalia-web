import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/shared/components/Logo";
import { FieldError } from "@/shared/components/FieldError";
import { useRegister } from "@/features/auth/hooks/useRegister";

export default function RegisterPage() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    loading,
    error,
    fieldErrors,
    handleSubmit,
  } = useRegister();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[45fr_55fr]">

      <section className="flex min-h-screen flex-col justify-between bg-background px-10 py-10 lg:px-14 lg:py-12">

        <Link to={"/"}>
          <div className="group flex items-center gap-2">
            <Logo size={36} className="text-[#be163d] shrink-0 transition-colors group-hover:text-rose-800 dark:group-hover:text-rose-400" />
            <span className="font-serif text-lg tracking-wide text-[#be163d] transition-colors group-hover:text-rose-800 dark:group-hover:text-rose-400">Marginalia</span>
          </div>
        </Link>

        <div className="mx-auto w-full max-w-sm space-y-7">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Crear cuenta
            </p>
            <h1 className="font-serif text-4xl text-foreground">Registrarse</h1>
            <p className="text-sm italic text-muted-foreground">
              Únete a la comunidad literaria.
            </p>
          </div>

          <div className="border-t border-border" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-muted-foreground text-xs uppercase tracking-wide">
                Nombre
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                className="h-10"
              />
              <FieldError id="name-error">{fieldErrors.name}</FieldError>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-muted-foreground text-xs uppercase tracking-wide">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                className="h-10"
              />
              <FieldError id="email-error">{fieldErrors.email}</FieldError>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-muted-foreground text-xs uppercase tracking-wide">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground
                             transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <FieldError id="password-error">{fieldErrors.password}</FieldError>
            </div>

            {error && (
              <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2
                            text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-10 w-full bg-rose-700 hover:bg-rose-800 text-white disabled:opacity-50
                         font-medium transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creando cuenta…
                </>
              ) : (
                "Crear cuenta"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/auth/login"
                className="text-rose-500 hover:text-rose-400 transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={13} />
          Volver al inicio
        </Link>
      </section>

      <section className="relative hidden overflow-hidden bg-stone-900 dark:bg-stone-50 lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-14">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        >
          <span className="font-serif text-[16rem] leading-none text-stone-800 dark:text-stone-200 rotate-6 translate-y-6">
            L
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500 dark:text-stone-400">
            — Marginalia —
          </p>

          <blockquote className="max-w-xs space-y-3">
            <p className="font-serif text-2xl italic leading-relaxed text-stone-200 dark:text-stone-700">
              "Un libro es un sueño que tienes en tus manos."
            </p>
            <cite className="block text-xs text-stone-500 dark:text-stone-400 not-italic">
              — Neil Gaiman
            </cite>
          </blockquote>

          <div className="w-14 border-t border-stone-700 dark:border-stone-300" />

          <div className="flex items-end gap-1.5" aria-hidden="true">
            <div className="h-14 w-3 rounded-sm bg-stone-200 dark:bg-stone-800" />
            <div className="h-10 w-2 rounded-sm bg-rose-800" />
            <div className="h-16 w-2.5 rounded-sm bg-rose-900" />
            <div className="h-12 w-2 rounded-sm bg-stone-400 dark:bg-stone-600" />
            <div className="h-11 w-2 rounded-sm bg-stone-300 dark:bg-stone-700" />
            <div className="h-16 w-2.5 rounded-sm bg-stone-500" />
            <div className="h-14 w-3 rounded-sm bg-stone-500 dark:bg-stone-400" />
          </div>
        </div>
      </section>

    </div>
  );
}
