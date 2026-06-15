import { apiClient } from "@/lib/apiClient";

const BASE = "/admin/users";

export const adminUserService = {
  list: (page = 0, size = 20) => apiClient.get(`${BASE}?page=${page}&size=${size}`),

  search: (q, page = 0, size = 20) =>
    apiClient.get(`${BASE}/search?q=${encodeURIComponent(q)}&page=${page}&size=${size}`),

  byRole: (roleName, page = 0, size = 20) =>
    apiClient.get(`${BASE}/role/${roleName}?page=${page}&size=${size}`),

  create: (data) => apiClient.post(BASE, data),

  update: (id, data) => apiClient.put(`${BASE}/${id}`, data),

  remove: (id) => apiClient.delete(`${BASE}/${id}`),
};
