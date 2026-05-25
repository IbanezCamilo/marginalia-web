import { apiClient } from "@/lib/apiClient";

const BASE_ENDPOINT = "/public/posts";

export const publicPostService = {
  getAll: (page = 0, size = 9) =>
    apiClient.get(
      `${BASE_ENDPOINT}?page=${page}&size=${size}&sort=createdAt,desc`,
    ),

  getBySlug: (slug) => apiClient.get(`${BASE_ENDPOINT}/${slug}`),
};

