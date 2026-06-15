import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Plus, RefreshCw } from "lucide-react";
import PostListItemCard from "@/features/posts/components/PostListItemCard.jsx";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useMyPosts } from "@/features/posts/hooks/useMyPosts";

export default function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    posts,
    loading,
    error,
    totalPages,
    totalElements,
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
            className="h-36 animate-pulse rounded-md border border-stone-200 bg-white"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center text-center">
        <FileText size={40} strokeWidth={1.5} className="text-rose-700" />
        <h1 className="mt-5 font-serif text-4xl text-stone-950">
          No pudimos cargar tus posts
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">{error}</p>
        <Button
          onClick={() => loadPosts(currentPage)}
          className="mt-6 bg-rose-700 hover:bg-rose-800"
        >
          <RefreshCw size={16} />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState((prev) => ({ ...prev, open }))}
        onConfirm={handleConfirm}
        {...currentDialogProps}
      />

      <div className="mb-6 rounded-md border border-stone-200 bg-[#fbf8f3] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">
              Archivo personal
            </p>
            <h1 className="mt-2 font-serif text-4xl text-stone-950">
              Mis Posts
            </h1>
            <p className="mt-2 text-sm text-stone-600">
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
        <div className="flex min-h-80 flex-col items-center justify-center rounded-md border border-dashed border-stone-300 bg-white p-8 text-center">
          <FileText size={42} strokeWidth={1.5} className="text-stone-400" />
          <h2 className="mt-5 font-serif text-3xl text-stone-950">
            Aun no tienes posts
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
            Empieza con un borrador y publicalo cuando el texto ya tenga forma.
          </p>
          <Button asChild className="mt-6 bg-rose-700 hover:bg-rose-800">
            <Link to="/user/create-post">
              Crear primer post
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
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
        <div className="mt-6 flex items-center justify-between rounded-md border border-stone-200 bg-white p-3">
          <span className="text-sm text-stone-500">
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
