import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { adminPostService } from "@/features/moderation/services/adminPostService";
import { moderatorPostService } from "@/features/moderation/services/moderatorPostService";
import { getErrorMessage } from "@/lib/apiError";

const INITIAL_MODERATION = { open: false, type: null, postId: null, moderationNote: "" };
const INITIAL_RESET = { open: false, postId: null, moderationNote: "" };
const INITIAL_DELETE = { open: false, postId: null };

export function usePostModeration() {
  const { meta: { isAdmin } } = useAuth();
  const service = isAdmin ? adminPostService : moderatorPostService;

  const [posts, setPosts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("DRAFT");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolving, setResolving] = useState(false);

  const [moderationState, setModerationState] = useState(INITIAL_MODERATION);
  const [resetState, setResetState] = useState(INITIAL_RESET);
  const [confirmDeleteState, setConfirmDeleteState] = useState(INITIAL_DELETE);

  const load = useCallback(async (page, status) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.list(status, page);
      setPosts(data.content ?? []);
      setTotalElements(data.page?.totalElements ?? 0);
      setTotalPages(data.page?.totalPages ?? 0);
      setCurrentPage(page);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudieron cargar los posts."));
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    load(0, statusFilter);
  }, [load, statusFilter]);

  const changeFilter = (status) => {
    setStatusFilter(status);
  };

  // Moderation dialog (approve / reject / archive)
  const openModeration = (type, postId) => {
    setModerationState({ open: true, type, postId, moderationNote: "" });
  };

  const closeModeration = () => setModerationState(INITIAL_MODERATION);

  const confirmModeration = async () => {
    const { type, postId, moderationNote } = moderationState;

    if (type === "reject" && !moderationNote.trim()) {
      toast.error("La nota es obligatoria al rechazar un post.");
      return;
    }

    const targetStatus = {
      approve: "PUBLISHED",
      reject: "REJECTED",
      archive: "ARCHIVED",
      toDraft: "DRAFT",
    }[type];

    setResolving(true);
    try {
      await service.updateStatus(postId, targetStatus, moderationNote);
      toast.success(
        type === "approve" ? "Post aprobado y publicado."
        : type === "reject" ? "Post rechazado."
        : type === "archive" ? "Post archivado."
        : "Post movido a borrador.",
      );
      closeModeration();
      await load(currentPage, statusFilter);
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo actualizar el estado del post."));
    } finally {
      setResolving(false);
    }
  };

  // Reset (admin only)
  const openReset = (postId) => setResetState({ open: true, postId, moderationNote: "" });
  const closeReset = () => setResetState(INITIAL_RESET);

  const confirmReset = async () => {
    const { postId, moderationNote } = resetState;
    setResolving(true);
    try {
      await adminPostService.reset(postId, moderationNote);
      toast.success("Post restablecido a borrador.");
      closeReset();
      await load(currentPage, statusFilter);
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo restablecer el post."));
    } finally {
      setResolving(false);
    }
  };

  // Delete (admin only)
  const requestDelete = (postId) => setConfirmDeleteState({ open: true, postId });
  const closeDelete = () => setConfirmDeleteState(INITIAL_DELETE);

  const confirmDelete = async () => {
    const { postId } = confirmDeleteState;
    closeDelete();
    try {
      await adminPostService.remove(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setTotalElements((prev) => prev - 1);
      toast.success("Post eliminado correctamente.");
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo eliminar el post."));
    }
  };

  const confirmDeletePostTitle = posts.find((p) => p.id === confirmDeleteState.postId)?.title;

  return {
    posts,
    totalElements,
    totalPages,
    currentPage,
    statusFilter,
    loading,
    error,
    isAdmin,
    resolving,
    load,
    changeFilter,
    moderationState,
    setModerationState,
    openModeration,
    closeModeration,
    confirmModeration,
    resetState,
    setResetState,
    openReset,
    closeReset,
    confirmDeletePostTitle,
    confirmReset,
    confirmDeleteState,
    setConfirmDeleteState,
    requestDelete,
    closeDelete,
    confirmDelete,
  };
}
