import { apiClient } from '../lib/apiClient';

export const categoryService = {
    //public endpoints
    getAllCategories: () => apiClient.get('/public/categories'),

    getCategoryById: (id) => apiClient.get(`/public/categories/${id}`),

    //Only admin endpoints
    createCategory: (dto) => apiClient.post('/admin/categories', {name}),

    updateCategory: (id, dto) => apiClient.put(`/admin/categories/${id}`, {name}),

    deleteCategory: (id) => apiClient.delete(`/admin/categories/${id}`),
};