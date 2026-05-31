import { apiClient } from "@/lib/apiClient";

export const authorRequestService = {
  submit: (motivation) =>
    apiClient.post('/me/author-request', { motivation }),

  getHistory: (page = 0, size = 10, sort = 'createdAt,desc') =>
    apiClient.get(`/me/author-request/history?page=${page}&size=${size}&sort=${sort}`),
};
