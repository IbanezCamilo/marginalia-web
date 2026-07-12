import { apiClient } from '@/lib/apiClient';

export const categoryService = {
    getAll: () => apiClient.get('/public/categories'),

    getById: (id) => apiClient.get(`/public/categories/${id}`),

    create: (dto) => apiClient.post('/admin/categories', {name: dto.name}),

    update: (id, dto) => apiClient.put(`/admin/categories/${id}`, {name: dto.name}),

    delete: (id) => apiClient.delete(`/admin/categories/${id}`),
};