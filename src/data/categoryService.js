import { apiClient } from '../lib/apiClient';

export const categoryService = {
    //public endpoints
    getAll: () => apiClient.get('/public/categories'),

    getById: (id) => apiClient.get(`/public/categories/${id}`),

    //Only admin endpoints
    create: (dto) => apiClient.post('/admin/categories', {name}),

    update: (id, dto) => apiClient.put(`/admin/categories/${id}`, {name}),

    delete: (id) => apiClient.delete(`/admin/categories/${id}`),
};