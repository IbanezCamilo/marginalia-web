import { useCallback, useEffect, useState } from "react";
import { publicPostService } from "@/features/posts/services/publicPostService";
import { getErrorMessage } from "@/lib/apiError";

export function usePublicPost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPost = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);
      const data = await publicPostService.getBySlug(slug);
      setPost(data);
    } catch (err) {
      setError(getErrorMessage(err, "No pudimos cargar este articulo."));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  return { post, loading, error, reload: loadPost };
}

