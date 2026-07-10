import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/shared/components/logo";
import { FieldError } from "@/shared/components/FieldError";
import { useLogin } from "@/features/auth/hooks/useLogin";

export default function LoginPage() {
  const {
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
  } = useLogin();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[45fr_55fr]">

      {/* ── Panel izquierdo: formulario oscuro ── */}
      <section className="flex min-h-screen flex-col justify-between bg-stone-950 px-10 py-10 lg:px-14 lg:py-12">

        {/* Marca */}
          <Link to={"/"}>
            <div className="flex items-center gap-2">
              <Logo size={30} className="text-white" />
              <span className="font-serif text-lg tracking-wide text-white">Marginalia</span>
            </div>
          </Link>

        {/* Formulario */}
        <div className="mx-auto w-full max-w-sm space-y-7">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">
              Iniciar sesión
            </p>
            <h1 className="font-serif text-4xl text-white">Acceder</h1>
            <p className="text-sm italic text-stone-400">
              Continúa desde donde lo dejaste.
            </p>
          </div>

          <div className="border-t border-stone-800" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-stone-400 text-xs uppercase tracking-wide">
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
                className="h-10 bg-stone-900 border-stone-700 text-white placeholder:text-stone-600
                           selection:bg-rose-500/30 selection:text-white
                           focus-visible:border-stone-500 focus-visible:ring-stone-500/20"
              />
              <FieldError id="email-error">{fieldErrors.email}</FieldError>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-stone-400 text-xs uppercase tracking-wide">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  className="h-10 bg-stone-900 border-stone-700 text-white placeholder:text-stone-600
                             selection:bg-rose-500/30 selection:text-white
                             pr-10 focus-visible:border-stone-500 focus-visible:ring-stone-500/20"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500
                             transition-colors hover:text-stone-300"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <FieldError id="password-error">{fieldErrors.password}</FieldError>
            </div>

            {error && (
              <p role="alert" className="rounded-md border border-rose-900 bg-rose-950/40 px-3 py-2
                            text-sm text-rose-400">
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
                  Iniciando sesión…
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>

            <p className="text-center text-sm text-stone-500">
              ¿No tienes cuenta?{" "}
              <Link
                to="/auth/register"
                className="text-rose-500 hover:text-rose-400 transition-colors"
              >
                Regístrate
              </Link>
            </p>
          </form>
        </div>

        {/* Volver */}
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-stone-600 transition-colors hover:text-stone-300"
        >
          <ArrowLeft size={13} />
          Volver al inicio
        </Link>
      </section>

      {/* ── Panel derecho: hero editorial (solo desktop) ── */}
      <section className="relative hidden overflow-hidden bg-stone-50 lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-14">

        {/* Letra decorativa de fondo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        >
          <span className="font-serif text-[16rem] leading-none text-stone-200 -rotate-6 translate-y-6">
            M
          </span>
        </div>

        {/* Contenido editorial */}
        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
            — Blog Literario —
          </p>

          <blockquote className="max-w-xs space-y-3">
            <p className="font-serif text-2xl italic leading-relaxed text-stone-700">
              "La lectura es a la mente lo que el ejercicio al cuerpo."
            </p>
            <cite className="block text-xs text-stone-400 not-italic">
              — Joseph Addison
            </cite>
          </blockquote>

          <div className="w-14 border-t border-stone-300" />

          {/* Book spines decorativas */}
          <div className="flex items-end gap-1.5" aria-hidden="true">
            <div className="h-16 w-2.5 rounded-sm bg-rose-900" />
            <div className="h-12 w-2 rounded-sm bg-stone-600" />
            <div className="h-14 w-3 rounded-sm bg-stone-800" />
            <div className="h-10 w-2 rounded-sm bg-rose-800" />
            <div className="h-16 w-2.5 rounded-sm bg-stone-500" />
            <div className="h-11 w-2 rounded-sm bg-stone-700" />
            <div className="h-14 w-3 rounded-sm bg-stone-400" />
          </div>
        </div>
      </section>

    </div>
  );
}
