import { useState, useEffect } from "react";
import { postService } from "../services/myPostService";
import { toast } from "sonner";

const STATUS_TOGGLE_MAP = {
  PUBLISHED: "DRAFT",
  DRAFT: "PUBLISHED",
  REJECTED: "DRAFT",
};

export function useMyPosts(currentPage) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [confirmState, setConfirmState] = useState({
        open: false,
        postId: null,
        type: null, //delete OR toggleStatus
        currentStatus: null,
    });

    useEffect(() => {
        loadPosts(currentPage);
    }, [currentPage]);
    
    //Confirm dialog State


  const loadPosts = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const data = await postService.getAll(page, 10);
      setPosts(data.content ?? []);
      setTotalPages(data.page?.totalPages ?? 0);
      setTotalElements(data.page?.totalElements ?? 0);
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
        await postService.delete(postId);
        setPosts((prev) => prev.filter((p) => p.id != postId));
        setTotalElements(prev => prev - 1);
        toast.success("Post eliminado correctamente");
      } catch {
        toast.error("Error al eliminar el post");
      }
      return; // If it's a delete action, we don't need to continue to toggle status logic
    }

    //initialize variables
    let newStatus = null;
    let previousPosts = null;

    if (type == "toggleStatus") {

      newStatus = STATUS_TOGGLE_MAP[currentStatus] ?? "DRAFT";
      previousPosts = posts;

      // Optimistic UI update
      setPosts(prev => prev.map((p) => (p.id === postId ? { ...p, status: newStatus } : p)));
    }

    try {
      await postService.updateStatus(postId, newStatus);
      toast.success(
        currentStatus === "REJECTED"
          ? "Post movido a borrador. Ya puedes editarlo y reenviarlo."
          : newStatus === "PUBLISHED"
            ? "Post publicado"
            : "Post guardado como borrador",
      );
    } catch {
      setPosts(previousPosts); //Revert to previous state
      toast.error("Error al cambiar el estado");
    }
  };

  const confirmDialogProps = {
    delete: {
      title: "¿Eliminar este post?",
      description: "Esta acción es permanente y no se puede deshacer.",
      confirmLabel: "Sí, eliminar",
    },
    toggleStatus:
      confirmState.currentStatus === "REJECTED"
        ? {
            title: "¿Volver a borrador para editar?",
            description: "Podrás editar el contenido y volver a enviarlo para revisión.",
            confirmLabel: "Volver a borrador",
          }
        : {
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

  return{
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
    confirmDialogProps,
    handleConfirm,
    loadPosts,
  };
  
}
