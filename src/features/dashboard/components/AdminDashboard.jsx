import { ClipboardList, Folder, LayoutDashboard, ShieldCheck, UserCog } from "lucide-react";
import { PanelCardSkeleton } from "./PanelCardSkeleton";
import { PageError } from "@/shared/components/PageError";
import { DashboardHero } from "../shared/DashboardHero";
import { StatCard } from "../shared/StatCard";
import { RecentPostsList } from "../shared/RecentPostsList";
import { useAdminDashboard } from "../hooks/useAdminDashboard";

export function AdminDashboard() {
  const { user, stats, ownPosts, hasOwnPosts, loading, error, reload } = useAdminDashboard();

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
        eyebrow="Administración"
        title={`Bienvenido, ${user?.name ?? "administrador"}.`}
        description="Supervisa solicitudes, moderación, usuarios y categorías desde un solo lugar."
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
          helper="Esperando tu revisión"
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
