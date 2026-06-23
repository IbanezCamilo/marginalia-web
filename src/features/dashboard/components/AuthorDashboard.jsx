import { ArrowRight, BookOpen, FileText, PenLine, UserRound, XCircle } from "lucide-react";
import { PanelCardSkeleton } from "./PanelCardSkeleton";
import { PageError } from "@/shared/components/PageError";
import { DashboardHero } from "../shared/DashboardHero";
import { StatCard } from "../shared/StatCard";
import { QuickActionsCard } from "../shared/QuickActionsCard";
import { RecentPostsList } from "../shared/RecentPostsList";
import { useAuthorDashboard } from "../hooks/useAuthorDashboard";

export function AuthorDashboard() {
  const { user, recentPosts, stats, mostRecentDraft, loading, error, reload } = useAuthorDashboard();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <PanelCardSkeleton key={item} type="stats" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <PanelCardSkeleton type="list" />
          <PanelCardSkeleton type="actions" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <PageError
        icon={BookOpen}
        title="No pudimos abrir el panel"
        message={error}
        onRetry={reload}
      />
    );
  }

  const quickActions = [
    { label: "Escribir nueva entrada", to: "/user/create-post", icon: PenLine },
    mostRecentDraft
      ? { label: "Continuar borrador", to: `/user/edit-post/${mostRecentDraft.id}`, icon: FileText, variant: "outline" }
      : { label: "Ajustar perfil público", to: "/user/profile", icon: UserRound, variant: "outline" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <DashboardHero
        eyebrow="Mesa de trabajo"
        title={`Bienvenido, ${user?.name ?? "autor"}.`}
        description="Revisa el estado de tu archivo, continúa textos pendientes y conserva el ritmo editorial desde un solo lugar."
        actions={[
          { label: "Nuevo post", to: "/user/create-post", icon: PenLine },
          { label: "Ver archivo", to: "/user/posts", icon: ArrowRight, variant: "outline" },
        ]}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Publicaciones" value={stats.total} helper="Total en tu archivo" icon={FileText} />
        <StatCard label="Publicadas" value={stats.published} helper="Visibles para lectores" icon={BookOpen} />
        <StatCard label="Borradores" value={stats.drafts} helper="Pendientes de cierre" icon={PenLine} />
        <StatCard label="Rechazados" value={stats.rejected} helper="Necesitan revisión" icon={XCircle} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <RecentPostsList
          eyebrow="Archivo reciente"
          heading="Últimas publicaciones"
          posts={recentPosts}
          viewAllTo="/user/posts"
          emptyState={{
            icon: BookOpen,
            iconSize: 38,
            title: "Tu primera publicación espera",
            description: "Crea un borrador para comenzar a construir el archivo editorial del blog.",
            action: { label: "Crear post", to: "/user/create-post" },
          }}
        />

        <QuickActionsCard actions={quickActions} />
      </section>
    </div>
  );
}
