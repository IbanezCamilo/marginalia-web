import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

export function usePublicPostsByCategory(slug, page = 0, size = 12) {
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      setPosts([]); // Clear old posts immediately when loading new category
      setCategory(null);

      // 1. Find category by slug
      const category = await apiClient.get(`/public/categories/${slug}`); 
      if (!category) throw new Error("Categoría no encontrada.");
      setCategory(category);

      // 2. Fetch posts for that category
      const data = await apiClient.get(
        `/public/posts?categoryId=${category.id}&page=${page}&size=${size}&sort=createdAt,desc`
      );
      setPosts(data.content ?? []);
      setTotalElements(data.page?.totalElements ?? 0);
      setTotalPages(data.page?.totalPages ?? 0);
    } catch (err) {
      setError(err.message || "Error al cargar la categoría.");
    } finally {
      setLoading(false);
    }
  }, [slug, page, size]);

  useEffect(() => {
    load();
  }, [load]);

  return { category, posts, loading, error, totalElements, totalPages, reload: load };
}