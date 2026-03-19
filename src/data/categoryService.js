import { apiClient } from './apiClient';

export const categoryService = {
    getAllCategories: () => apiClient.get('/categories'),

    getCategoryById: (id) => apiClient.get(`/categories/${id}`),

    createCategory: (dto) => apiClient.post('/categories', dto),

    updateCategory: (id, dto) => apiClient.put(`/categories/${id}`, dto),

    deleteCategory: (id) => apiClient.delete(`/categories/${id}`),
};