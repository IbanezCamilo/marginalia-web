import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/shared/components/Logo";
import { useResendVerification } from "@/features/auth/hooks/useResendVerification";

export default function CheckEmailPage() {
  const location = useLocation();
  const knownEmail = location.state?.email ?? "";
  const [email, setEmail] = useState(knownEmail);
  const { resend, sending, cooldown } = useResendVerification();

  const handleResend = (e) => {
    e.preventDefault();
    resend(email);
  };

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
              Verificación
            </p>
            <h1 className="font-serif text-4xl text-foreground">Revisa tu bandeja</h1>
            <p className="text-sm italic text-muted-foreground">
              {knownEmail
                ? <>Enviamos un enlace de verificación a <span className="not-italic font-medium text-foreground">{knownEmail}</span>.</>
                : "Enviamos un enlace de verificación a tu correo."}
            </p>
          </div>

          <div className="border-t border-border" />

          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Abre el enlace para activar tu cuenta. Caduca en 24 horas.
              Si no lo encuentras, revisa la carpeta de spam.
            </p>

            <form onSubmit={handleResend} className="space-y-3">
              {!knownEmail && (
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
                    disabled={sending}
                    className="h-10"
                  />
                </div>
              )}

              <Button
                type="submit"
                variant="outline"
                disabled={sending || cooldown > 0 || !email.trim()}
                className="h-10 w-full font-medium transition-colors"
              >
                {sending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Reenviando…
                  </>
                ) : cooldown > 0 ? (
                  `Reenviar en ${cooldown} s`
                ) : (
                  "Reenviar correo de verificación"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya verificaste tu correo?{" "}
              <Link
                to="/auth/login"
                className="text-rose-500 hover:text-rose-400 transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
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
          <span className="font-serif text-[16rem] leading-none text-stone-800 dark:text-stone-200 rotate-3 translate-y-6">
            V
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500 dark:text-stone-400">
            — Marginalia —
          </p>

          <blockquote className="max-w-xs space-y-3">
            <p className="font-serif text-2xl italic leading-relaxed text-stone-200 dark:text-stone-700">
              "Escribir cartas significa desnudarse ante los fantasmas."
            </p>
            <cite className="block text-xs text-stone-500 dark:text-stone-400 not-italic">
              — Franz Kafka
            </cite>
          </blockquote>

          <div className="w-14 border-t border-stone-700 dark:border-stone-300" />

          <div className="flex items-end gap-1.5" aria-hidden="true">
            <div className="h-12 w-2 rounded-sm bg-stone-400 dark:bg-stone-600" />
            <div className="h-16 w-2.5 rounded-sm bg-rose-900" />
            <div className="h-11 w-2 rounded-sm bg-stone-300 dark:bg-stone-700" />
            <div className="h-14 w-3 rounded-sm bg-stone-200 dark:bg-stone-800" />
            <div className="h-10 w-2 rounded-sm bg-rose-800" />
            <div className="h-14 w-3 rounded-sm bg-stone-500 dark:bg-stone-400" />
            <div className="h-16 w-2.5 rounded-sm bg-stone-500" />
          </div>
        </div>
      </section>

    </div>
  );
}
