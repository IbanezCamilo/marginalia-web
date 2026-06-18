import { useCallback, useEffect, useState } from "react";
import { publicPostService } from "@/features/posts/services/publicPostService";
import { getErrorMessage } from "@/lib/apiError";

export function usePublicPosts(page = 0, size = 9) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await publicPostService.getAll(page, size);
      setPosts(data.content ?? []);
      setTotalPages(data.page?.totalPages ?? 0);
      setTotalElements(data.page?.totalElements ?? 0);
    } catch (err) {
      setError(getErrorMessage(err, "Error al cargar los articulos."));
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return {
    posts,
    loading,
    error,
    totalPages,
    totalElements,
    reload: loadPosts,
  };
}

