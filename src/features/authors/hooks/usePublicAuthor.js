import { useCallback, useEffect, useState } from "react";
import { publicAuthorService } from "../services/publicAuthorService";
import { getErrorMessage } from "@/lib/apiError";

export function usePublicAuthor(authorId) {
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!authorId) return;
    try {
      setLoading(true);
      setError(null);
      const [authorData, postsData] = await Promise.all([
        publicAuthorService.getById(Number(authorId)),
        publicAuthorService.getPosts(Number(authorId)),
      ]);
      setAuthor(authorData);
      setPosts(postsData.content ?? []);
    } catch (err) {
      setError(getErrorMessage(err, "No pudimos cargar la información del autor."));
    } finally {
      setLoading(false);
    }
  }, [authorId]);

  useEffect(() => {
    load();
  }, [load]);

  return { author, posts, loading, error, reload: load };
}