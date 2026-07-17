import { useCallback, useEffect, useState } from "react";
import { categoryService } from "@/features/categories/services/categoryService";
import { getErrorMessage } from "@/lib/apiError";

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
      setError(getErrorMessage(err, "Error al cargar las categorías."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, loading, error, reload: loadCategories };
}

