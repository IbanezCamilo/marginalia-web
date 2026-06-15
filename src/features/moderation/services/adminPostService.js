import { apiClient } from "@/lib/apiClient";

const BASE = "/admin/posts";

export const adminPostService = {
  list: (status, page = 0, size = 20) =>
    apiClient.get(`${BASE}?page=${page}&size=${size}${status ? `&status=${status}` : ""}`),

  updateStatus: (id, status, moderationNote) =>
    apiClient.put(`${BASE}/${id}/status`, { status, moderationNote: moderationNote || null }),

  reset: (id, moderationNote) =>
    apiClient.put(`${BASE}/${id}/reset`, { moderationNote: moderationNote || null }),

  remove: (id) => apiClient.delete(`${BASE}/${id}`),
};
