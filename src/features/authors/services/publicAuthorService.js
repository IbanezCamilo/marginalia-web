import { apiClient } from "@/lib/apiClient";

export const publicAuthorService = {
  // Gets public author profile  
  getById: (id) => apiClient.get(`/public/authors/${id}`),

  // Gets published posts for a specific author
  getPosts: (id, page = 0, size = 12) =>
    apiClient.get(`/public/authors/${id}/posts?page=${page}&size=${size}`),
};