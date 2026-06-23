import { useCallback, useEffect, useState } from "react";
import { userService } from "@/features/profile/services/userService";
import { postService } from "@/features/posts/services/myPostService";
import { moderatorPostService } from "@/features/moderation/services/moderatorPostService";
import { getErrorMessage } from "@/lib/apiError";

const STATS_PAGE_SIZE = 50;
const PREVIEW_COUNT = 3;

export function useModeratorDashboard() {
  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [ownPosts, setOwnPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [profile, queueResponse, ownPostsResponse] = await Promise.all([
        userService.getProfile(),
        moderatorPostService.list("DRAFT", 0, 1),
        postService.getAll(0, STATS_PAGE_SIZE),
      ]);

      setUser(profile);
      setPendingCount(queueResponse.page?.totalElements ?? 0);
      setOwnPosts(ownPostsResponse.content ?? []);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo cargar la información."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const published = ownPosts.filter((post) => post.status === "PUBLISHED").length;
  const drafts = ownPosts.filter((post) => post.status === "DRAFT").length;

  return {
    user,
    pendingCount,
    ownPosts: ownPosts.slice(0, PREVIEW_COUNT),
    hasOwnPosts: ownPosts.length > 0,
    stats: { published, drafts },
    loading,
    error,
    reload: load,
  };
}
