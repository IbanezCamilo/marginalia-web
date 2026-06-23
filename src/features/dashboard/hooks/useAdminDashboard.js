import { useCallback, useEffect, useState } from "react";
import { userService } from "@/features/profile/services/userService";
import { postService } from "@/features/posts/services/myPostService";
import { categoryService } from "@/features/categories/services/categoryService";
import { adminAuthorRequestService } from "@/features/admin/services/adminAuthorRequestService";
import { adminUserService } from "@/features/admin/services/adminUserService";
import { adminPostService } from "@/features/moderation/services/adminPostService";
import { getErrorMessage } from "@/lib/apiError";

const STATS_PAGE_SIZE = 50;
const PREVIEW_COUNT = 3;

export function useAdminDashboard({ includeAdminTeam = false } = {}) {
  const [user, setUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [moderationQueue, setModerationQueue] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [ownPosts, setOwnPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [profile, pendingRequestsCount, moderationResponse, usersResponse, categories, ownPostsResponse, adminResponse] =
        await Promise.all([
          userService.getProfile(),
          adminAuthorRequestService.pendingCount(),
          adminPostService.list("DRAFT", 0, 1),
          adminUserService.list(0, 1),
          categoryService.getAll(),
          postService.getAll(0, STATS_PAGE_SIZE),
          includeAdminTeam ? adminUserService.byRole("ADMIN", 0, 1) : Promise.resolve(null),
        ]);

      setUser(profile);
      setPendingRequests(pendingRequestsCount ?? 0);
      setModerationQueue(moderationResponse.page?.totalElements ?? 0);
      setTotalUsers(usersResponse.page?.totalElements ?? 0);
      setCategoryCount(categories?.length ?? 0);
      setOwnPosts(ownPostsResponse.content ?? []);
      setAdminCount(adminResponse?.page?.totalElements ?? 0);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo cargar la información."));
    } finally {
      setLoading(false);
    }
  }, [includeAdminTeam]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    user,
    stats: { pendingRequests, moderationQueue, totalUsers, categoryCount, adminCount },
    ownPosts: ownPosts.slice(0, PREVIEW_COUNT),
    hasOwnPosts: ownPosts.length > 0,
    loading,
    error,
    reload: load,
  };
}
