import { apiClient } from "@/lib/apiClient";

const BASE_ENDPOINT = "/public/posts";

export const publicPostService = {
  getAll: (page = 0, size = 9) =>
    apiClient.get(
      `${BASE_ENDPOINT}?page=${page}&size=${size}&sort=featured`,
    ),

  getBySlug: (slug) => apiClient.get(`${BASE_ENDPOINT}/${slug}`),

  // Generic facet passthrough: whatever params the facet registry produces are appended
  // as-is (null/empty skipped). New facets need no changes here.
  getCatalog: ({ page = 0, size = 12, ...filters } = {}) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value != null && value !== "") params.set(key, value);
    }
    params.set("page", page);
    params.set("size", size);
    return apiClient.get(`${BASE_ENDPOINT}?${params.toString()}`);
  },
};

