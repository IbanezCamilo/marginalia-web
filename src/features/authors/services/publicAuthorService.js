import { apiClient } from "@/lib/apiClient";

export const publicAuthorService = {
  getAllAuthors: () => apiClient.get("/public/authors"),

  getById: (id) => apiClient.get(`/public/authors/${id}`),

  getPosts: (id, page = 0, size = 12) =>
    apiClient.get(`/public/authors/${id}/posts?page=${page}&size=${size}`),
};