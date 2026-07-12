import { apiClient } from "@/lib/apiClient";

export const publicAuthorService = {
  getById: (id) => apiClient.get(`/public/authors/${id}`),

  getPosts: (id, page = 0, size = 12) =>
    apiClient.get(`/public/authors/${id}/posts?page=${page}&size=${size}`),
};