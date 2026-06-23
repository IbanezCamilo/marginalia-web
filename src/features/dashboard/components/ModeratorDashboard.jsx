import { BookOpen, PenLine, ShieldCheck } from "lucide-react";
import { PanelCardSkeleton } from "./PanelCardSkeleton";
import { PageError } from "@/shared/components/PageError";
import { DashboardHero } from "../shared/DashboardHero";
import { StatCard } from "../shared/StatCard";
import { RecentPostsList } from "../shared/RecentPostsList";
import { useModeratorDashboard } from "../hooks/useModeratorDashboard";

export function ModeratorDashboard() {
  const { user, pendingCount, ownPosts, hasOwnPosts, stats, loading, error, reload } = useModeratorDashboard();

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <PanelCardSkeleton type="actions" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <PanelCardSkeleton key={item} type="stats" />
          ))}
        </div>
        <PanelCardSkeleton type="list" />
      </div>
    );
  }

  if (error) {
    return (
      <PageError
        icon={ShieldCheck}
        title="No pudimos abrir el panel"
        message={error}
        onRetry={reload}
      />
    );
  }

  const description =
    pendingCount > 0
      ? `Tienes ${pendingCount} publicaci${pendingCount === 1 ? "ón" : "ones"} esperando revisión.`
      : "La cola de moderación está al día.";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <DashboardHero
        eyebrow="Moderación"
        title={`Bienvenido, ${user?.name ?? "moderador"}.`}
        description={description}
        actions={[
          { label: "Ir a moderación", to: "/user/moderacion", icon: ShieldCheck },
          { label: "Ver mis publicaciones", to: "/user/posts", variant: "outline" },
        ]}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Pendientes de revisión"
          value={pendingCount}
          helper="En la cola de moderación"
          icon={ShieldCheck}
          attention={pendingCount > 0}
        />
        <StatCard label="Mis publicadas" value={stats.published} helper="Visibles para lectores" icon={BookOpen} />
        <StatCard label="Mis borradores" value={stats.drafts} helper="Pendientes de cierre" icon={PenLine} />
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
