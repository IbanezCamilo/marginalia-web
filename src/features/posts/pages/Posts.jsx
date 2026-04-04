import { useState } from "react";
import { Link } from "react-router-dom";
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
    currentDialogProps,
    requestDeletePost,
    requestToggleStatus,
    handleConfirm,
  } = useMyPosts(currentPage);

  if (loading) return <p className="p-6 text-gray-500">Cargando posts...</p>;

  if (error)
    return (
      <div className="p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => loadPosts(currentPage)}
          className="mt-2 text-sm underline"
        >
          Reintentar
        </button>
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) => setConfirmState((prev) => ({ ...prev, open }))}
        onConfirm={handleConfirm}
        {...currentDialogProps}
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Mis Posts</h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalElements} publicaciones
            </p>
          </div>
          <Button asChild variant="destructive">
            <Link to="/user/create-post">+ Nuevo Post</Link>
          </Button>
        </div>

        {/* List */}
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No tienes posts todavía.
          </p>
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
                onDelete={() => requestDeletePost(post.id)}
                onToggleStatus={() => requestToggleStatus(post.id, post.status)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-500">
              Página {currentPage + 1} de {totalPages}
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
    </div>
  );
}
