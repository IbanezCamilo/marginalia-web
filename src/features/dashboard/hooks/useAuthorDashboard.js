import { useCallback, useEffect, useState } from "react";
import { userService } from "@/features/profile/services/userService";
import { postService } from "@/features/posts/services/myPostService";
import { getErrorMessage } from "@/lib/apiError";

const STATS_PAGE_SIZE = 50;
const PREVIEW_COUNT = 5;

export function useAuthorDashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [profile, postsResponse] = await Promise.all([
        userService.getProfile(),
        postService.getAll(0, STATS_PAGE_SIZE),
      ]);

      setUser(profile);
      setPosts(postsResponse.content ?? []);
      setTotalPosts(postsResponse.page?.totalElements ?? 0);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo cargar la información."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const published = posts.filter((post) => post.status === "PUBLISHED").length;
  const drafts = posts.filter((post) => post.status === "DRAFT").length;
  const rejected = posts.filter((post) => post.status === "REJECTED").length;
  const mostRecentDraft = posts.find((post) => post.status === "DRAFT") ?? null;

  return {
    user,
    recentPosts: posts.slice(0, PREVIEW_COUNT),
    stats: { total: totalPosts, published, drafts, rejected },
    mostRecentDraft,
    loading,
    error,
    reload: load,
  };
}
