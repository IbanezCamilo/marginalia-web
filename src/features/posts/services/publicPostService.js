import { apiClient } from "@/lib/apiClient";

const BASE_ENDPOINT = "/public/posts";

export const publicPostService = {
  getAll: (page = 0, size = 9) =>
    apiClient.get(
      `${BASE_ENDPOINT}?page=${page}&size=${size}&sort=featured`,
    ),

  getBySlug: (slug) => apiClient.get(`${BASE_ENDPOINT}/${slug}`),

  getCatalog: ({ categoryId, sort = "featured", page = 0, size = 12 } = {}) => {
    const params = new URLSearchParams();
    if (categoryId != null) params.set("categoryId", categoryId);
    params.set("sort", sort);
    params.set("page", page);
    params.set("size", size);
    return apiClient.get(`${BASE_ENDPOINT}?${params.toString()}`);
  },
};

