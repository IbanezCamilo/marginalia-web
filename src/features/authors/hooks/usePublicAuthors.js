import { useCallback, useEffect, useState } from "react";
import { publicAuthorService } from "@/features/authors/services/publicAuthorService";
import { getErrorMessage } from "@/lib/apiError";

export function usePublicAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAuthors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await publicAuthorService.getAllAuthors();
      setAuthors(data ?? []);
    } catch (err) {
      setError(getErrorMessage(err, "Error al cargar los autores."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuthors();
  }, [loadAuthors]);

  return { authors, loading, error, reload: loadAuthors };
}
