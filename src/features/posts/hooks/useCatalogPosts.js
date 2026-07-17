import { useCallback, useEffect, useState } from "react";
import { publicPostService } from "@/features/posts/services/publicPostService";
import { getErrorMessage } from "@/lib/apiError";

export function useCatalogPosts({ apiParams = {}, size = 12 } = {}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setPage(0);
      const data = await publicPostService.getCatalog({ ...apiParams, page: 0, size });
      setPosts(data.content ?? []);
      setTotalElements(data.page?.totalElements ?? 0);
      setTotalPages(data.page?.totalPages ?? 0);
    } catch (err) {
      setError(getErrorMessage(err, "Error al cargar las publicaciones."));
    } finally {
      setLoading(false);
    }
  }, [apiParams, size]);

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    if (nextPage >= totalPages) return;
    try {
      setLoadingMore(true);
      const data = await publicPostService.getCatalog({ ...apiParams, page: nextPage, size });
      setPosts((prev) => [...prev, ...(data.content ?? [])]);
      setPage(nextPage);
      setTotalElements(data.page?.totalElements ?? totalElements);
      setTotalPages(data.page?.totalPages ?? totalPages);
    } catch (err) {
      setError(getErrorMessage(err, "Error al cargar más publicaciones."));
    } finally {
      setLoadingMore(false);
    }
  }, [apiParams, size, page, totalPages, totalElements]);

  return {
    posts,
    loading,
    loadingMore,
    error,
    hasMore: page + 1 < totalPages,
    totalElements,
    loadMore,
    reload: load,
  };
}
