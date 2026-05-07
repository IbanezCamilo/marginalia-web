import { useCallback, useEffect, useState } from "react";
import { categoryService } from "@/features/categories/services/categoryService";

export function usePublicCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll();
      setCategories(data ?? []);
    } catch (err) {
      setError(err.message || "Error al cargar las categorias.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, loading, error, reload: loadCategories };
}

