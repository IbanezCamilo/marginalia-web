import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanelCard } from "./PanelCard";

export function ReaderDashboard({ user }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="rounded-md border border-border bg-surface-warm p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700 dark:text-rose-400">
          Tu cuenta
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
          Bienvenido, {user?.name ?? "lector"}.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Tu cuenta de lector está activa en Marginalia.
        </p>
      </section>

      <PanelCard>
        <div className="flex items-start gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-muted text-rose-800 dark:text-rose-400">
            <BadgeCheck size={18} strokeWidth={1.8} />
          </span>
          <div className="flex-1">
            <h2 className="font-serif text-2xl text-foreground">
              Conviértete en autor
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Solicita el rol de autor para publicar artículos y reseñas en el
              blog. El equipo revisará tu solicitud.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild className="bg-rose-700 hover:bg-rose-800">
                <Link to="/user/author-request">
                  <BadgeCheck size={15} />
                  Solicitar autoría
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-border bg-transparent">
                <Link to="/">
                  Ver blog
                  <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </PanelCard>

      <PanelCard>
        <div className="flex items-start gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-muted text-rose-800 dark:text-rose-400">
            <UserRound size={18} strokeWidth={1.8} />
          </span>
          <div className="flex-1">
            <h2 className="font-serif text-2xl text-foreground">
              Perfil público
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Actualiza tu nombre y descripción para que aparezcan correctamente
              si publicas en el futuro.
            </p>
            <div className="mt-4">
              <Button asChild variant="outline" className="border-border bg-transparent">
                <Link to="/user/profile">
                  Editar perfil
                  <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </PanelCard>
    </div>
  );
}
