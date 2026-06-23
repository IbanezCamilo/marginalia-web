import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, Folder, LayoutDashboard, ShieldCheck, UserCog, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanelCard } from "./PanelCard";
import { PanelCardSkeleton } from "./PanelCardSkeleton";
import { PageError } from "@/shared/components/PageError";
import { DashboardHero } from "../shared/DashboardHero";
import { StatCard } from "../shared/StatCard";
import { RecentPostsList } from "../shared/RecentPostsList";
import { useAdminDashboard } from "../hooks/useAdminDashboard";

export function OwnerDashboard() {
  const { user, stats, ownPosts, hasOwnPosts, loading, error, reload } = useAdminDashboard({
    includeAdminTeam: true,
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <PanelCardSkeleton type="actions" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <PanelCardSkeleton key={item} type="stats" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <PageError
        icon={LayoutDashboard}
        title="No pudimos abrir el panel"
        message={error}
        onRetry={reload}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <DashboardHero
        eyebrow="Propietario"
        title={`Bienvenido, ${user?.name ?? "propietario"}.`}
        description="Supervisa solicitudes, moderación, usuarios y categorías desde un solo lugar."
        accent="violet"
        actions={[
          { label: "Gestionar usuarios", to: "/user/usuarios", icon: UserCog },
          { label: "Solicitudes", to: "/user/solicitudes", icon: ClipboardList, variant: "outline" },
          { label: "Moderación", to: "/user/moderacion", icon: ShieldCheck, variant: "outline" },
          { label: "Categorías", to: "/user/categories", icon: Folder, variant: "outline" },
        ]}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Solicitudes pendientes"
          value={stats.pendingRequests}
          helper="Esperando revisión"
          icon={ClipboardList}
          attention={stats.pendingRequests > 0}
        />
        <StatCard
          label="En moderación"
          value={stats.moderationQueue}
          helper="Publicaciones por revisar"
          icon={ShieldCheck}
          attention={stats.moderationQueue > 0}
        />
        <StatCard label="Usuarios" value={stats.totalUsers} helper="Cuentas registradas" icon={UserCog} />
        <StatCard label="Categorías" value={stats.categoryCount} helper="Temas disponibles" icon={Folder} />
      </section>

      <PanelCard>
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-400">
            <Users size={18} strokeWidth={1.8} />
          </span>
          <h2 className="font-serif text-2xl text-foreground">Equipo administrativo</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {stats.adminCount === 0
            ? "Aún no hay administradores con acceso elevado."
            : `${stats.adminCount} administrador${stats.adminCount === 1 ? "" : "es"} con acceso elevado.`}
        </p>
        <div className="mt-4">
          <Button asChild variant="outline" className="border-border bg-transparent">
            <Link to="/user/usuarios">
              Ver equipo
              <ArrowRight size={15} />
            </Link>
          </Button>
        </div>
      </PanelCard>

      {hasOwnPosts && (
        <RecentPostsList
          eyebrow="Tu archivo"
          heading="Mis publicaciones"
          posts={ownPosts}
          viewAllTo="/user/posts"
          compact
        />
      )}
    </div>
  );
}
