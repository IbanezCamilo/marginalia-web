import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MyPostService } from "@/data/myPostService";
import PostListItemCard from "@/panel-components/posts/postsList/PostListItemCard.jsx";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  //Confirm dialog State
  const [confirmState, setConfirmState] = useState({
    open: false,
    postId: null,
    type: null, //delete OR toggleStatus
    currentStatus: null,
  });

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

  const requestDeletePost = (postId) => {
    setConfirmState({
      open: true,
      postId,
      type: "delete",
      currentStatus: null,
    });
  };

  const requestToggleStatus = (postId, currentStatus) => {
    setConfirmState({
      open: true,
      postId,
      type: "toggleStatus",
      currentStatus: currentStatus,
    });
  };

  const handleConfirm = async () => {
    const { postId, type, currentStatus } = confirmState;
    setConfirmState((prev) => ({ ...prev, open: false }));

    if (type == "delete") {
      try {
        await MyPostService.deletePost(postId);
        setPosts((prev) => prev.filter((p) => p.id != postId));
        setTotalElements((prev = prev - 1));
        toast.success("Post eliminado correctamente");
      } catch (error) {
        toast.error("Error al eliminar el post");
      }
    }

    if (type == "toggleStatus") {
      const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      const previusPosts = posts;

      prev.map((p) => (p.id === postId ? { ...p, status: newStatus } : p));
    }

    try {
      await MyPostService.updateStatus(postId, newStatus);
      toast.success(
        newStatus === "PUBLISHED"
          ? "Post publicado"
          : "Post guardado como borrador",
      );
    } catch (err) {
      setPosts(previousPosts);
      toast.error("Error al cambiar el estado");
    }
  };

  const confirmDialogProps = {
    delete: {
      title: "¿Eliminar este post?",
      description: "Esta acción es permanente y no se puede deshacer.",
      confirmLabel: "Sí, eliminar",
    },
    toggleStatus: {
      title:
        confirmState.currentStatus === "PUBLISHED"
          ? "¿Convertir a borrador?"
          : "¿Publicar este post?",
      description:
        confirmState.currentStatus === "PUBLISHED"
          ? "El post dejará de ser visible al público."
          : "El post será visible para todos los lectores.",
      confirmLabel:
        confirmState.currentStatus === "PUBLISHED" ? "Convertir" : "Publicar",
    },
  };

  const currentDialogProps = confirmDialogProps[confirmState.type] ?? {};

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
