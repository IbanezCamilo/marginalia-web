import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Plus } from "lucide-react";
import PostListItemCard from "@/features/posts/components/PostListItemCard.jsx";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { PageError } from "@/shared/components/PageError";
import { EmptyState } from "@/shared/components/EmptyState";
import { useMyPosts } from "@/features/posts/hooks/useMyPosts";

export default function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    posts,
    loading,
    error,
    totalPages,
    totalElements,
    resolving,
    confirmState,
    setConfirmState,
    currentDialogProps,
    requestDeletePost,
    requestToggleStatus,
    handleConfirm,
    loadPosts,
  } = useMyPosts(currentPage);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-md border border-border bg-card"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <PageError
        icon={FileText}
        title="No pudimos cargar tus posts"
        message={error}
        onRetry={() => loadPosts(currentPage)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState((prev) => ({ ...prev, open }))}
        onConfirm={handleConfirm}
        loading={resolving}
        {...currentDialogProps}
      />

      <div className="mb-6 rounded-md border border-border bg-surface-warm p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-400">
              Archivo personal
            </p>
            <h1 className="mt-2 font-serif text-4xl text-foreground">
              Mis Posts
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {totalElements} publicaciones creadas en tu cuenta.
            </p>
          </div>
          <Button asChild className="bg-rose-700 hover:bg-rose-800">
            <Link to="/user/create-post">
              <Plus size={16} />
              Nuevo Post
            </Link>
          </Button>
        </div>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aun no tienes posts"
          description="Empieza con un borrador y publicalo cuando el texto ya tenga forma."
          action={{ label: "Crear primer post", icon: ArrowRight, to: "/user/create-post" }}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostListItemCard
              key={post.id}
              postId={post.id}
              imageUrl={post.coverImage}
              author={post.authorName}
              title={post.title}
              status={post.status}
              categoryName={post.categoryName}
              moderationNote={post.moderationNote}
              rejectionCount={post.rejectionCount}
              canBeResubmitted={post.canBeResubmitted}
              isLastAttempt={post.isLastAttempt}
              onDelete={() => requestDeletePost(post.id)}
              onToggleStatus={() => requestToggleStatus(post.id, post.status)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between rounded-md border border-border bg-card p-3">
          <span className="text-sm text-muted-foreground">
            Pagina {currentPage + 1} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
