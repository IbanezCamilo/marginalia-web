import { apiClient } from "@/lib/apiClient";

const BASE = "/moderator/posts";

export const moderatorPostService = {
  list: (status, page = 0, size = 20) =>
    apiClient.get(`${BASE}?page=${page}&size=${size}${status ? `&status=${status}` : ""}`),

  updateStatus: (id, status, moderationNote) =>
    apiClient.put(`${BASE}/${id}/status`, { status, moderationNote: moderationNote || null }),
};
