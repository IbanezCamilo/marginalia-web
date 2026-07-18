import { apiClient } from "@/lib/apiClient";

export const adminAuthorRequestService = {
  list: (status, page = 0, size = 15) =>
    apiClient.get(
      `/admin/author-requests?page=${page}&size=${size}${status ? `&status=${status}` : ""}`,
    ),

  pendingCount: () =>
    apiClient.get("/admin/author-requests/pending-count"),

  claim: (id) =>
    apiClient.put(`/admin/author-requests/${id}/claim`),

  release: (id) =>
    apiClient.delete(`/admin/author-requests/${id}/claim`),

  approve: (id, adminNote) =>
    apiClient.put(`/admin/author-requests/${id}/approve`, {
      adminNote: adminNote || null,
    }),

  reject: (id, adminNote) =>
    apiClient.put(`/admin/author-requests/${id}/reject`, {
      adminNote: adminNote || null,
    }),
};
