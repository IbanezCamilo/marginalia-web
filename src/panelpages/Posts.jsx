import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MyPostService } from "@/data/myPostService";
import PostListItemCard from "@/panel-components/posts/postsList/PostListItemCard.jsx";
import { Button } from "@/components/ui/button";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const loadPosts = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const data = await MyPostService.getAllMyPosts(page, 10);
      setPosts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError("Error al cargar los posts: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await MyPostService.deletePost(postId);
      // We update the local state without refetch — faster for the user
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setTotalElements((prev) => prev - 1);
    } catch (err) {
      setError("Error al eliminar el post: " + err.message);
    }
  };

  /**
   * Changes the status of a post locally and in the backend.
   *
   * "Optimistic Update" Pattern:
   * First we update the local state (UI responds immediately),
   * then we call the backend. If the backend fails, we revert.
   * This improves the perceived user experience.
   */
  const handleToggleStatus = async (postId, currentStatus) => {
    // Determine the new state according to the valid transition
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const actionLabel =
      newStatus === "PUBLISHED" ? "publicar" : "convertir a borrador";

    if (!window.confirm(`¿Quieres ${actionLabel} este post?`)) return;

    // Save previous state to revert if it fails
    const previousPosts = posts;

    // Optimistic update: update UI before the server responds
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, status: newStatus } : post,
      ),
    );

    try {
      await MyPostService.updateStatus(postId, newStatus);
      // If the server confirms, the optimistic state is already correct. We do nothing.
    } catch (err) {
      // If it fails, we revert to the previous state
      setPosts(previousPosts);
      setError("Error al cambiar el estado: " + err.message);
    }
  };

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
                onDelete={() => handleDeletePost(post.id)}
                onToggleStatus={() => handleToggleStatus(post.id, post.status)}
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
