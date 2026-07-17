import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanelCard } from "../components/PanelCard";
import { EmptyState } from "@/shared/components/EmptyState";
import { getPostStatusConfig } from "@/features/posts/utils/postStatus";
import { cn } from "@/lib/utils";

const formatDate = (date) => {
  if (!date) return "Sin fecha";

  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export function RecentPostsList({
  eyebrow,
  heading,
  posts,
  viewAllTo,
  viewAllLabel = "Todas",
  emptyState,
  compact = false,
}) {
  return (
    <PanelCard>
      <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700 dark:text-rose-400">
              {eyebrow}
            </p>
          )}
          <h2 className={cn("mt-2 font-serif text-foreground", compact ? "text-xl" : "text-3xl")}>
            {heading}
          </h2>
        </div>
        {viewAllTo && (
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link to={viewAllTo}>
              {viewAllLabel}
              <ArrowRight size={16} />
            </Link>
          </Button>
        )}
      </div>

      {posts.length === 0 ? (
        emptyState ? (
          <EmptyState
            variant="plain"
            className={compact ? "min-h-32" : "min-h-56"}
            headingAs="h3"
            {...emptyState}
          />
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No hay publicaciones todavía.
          </p>
        )
      ) : (
        <div className="divide-y divide-border">
          {posts.map((post) => {
            const statusConfig = getPostStatusConfig(post.status);

            return (
              <Link
                key={post.id}
                to={`/user/edit-post/${post.id}`}
                className="group grid gap-3 py-4 transition-colors hover:bg-muted sm:grid-cols-[1fr_auto] sm:px-2"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <span>{post.categoryName ?? "Sin categoría"}</span>
                    <span className="text-muted-foreground">/</span>
                    <time>{formatDate(post.createdAt)}</time>
                  </div>
                  <h3
                    className={cn(
                      "mt-2 line-clamp-2 font-serif leading-tight text-foreground transition-colors group-hover:text-rose-800 dark:group-hover:text-rose-400",
                      compact ? "text-lg" : "text-2xl",
                    )}
                  >
                    {post.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 sm:justify-end">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusConfig.badgeClass}`}
                  >
                    {statusConfig.label}
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-rose-800 dark:group-hover:text-rose-400"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PanelCard>
  );
}
