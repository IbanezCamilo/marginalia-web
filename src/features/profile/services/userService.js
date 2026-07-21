import { apiClient } from "@/lib/apiClient";

const BASE_ENDPOINT = '/me/profile';

export const userService = {

    login: async (credentials) => {
        return apiClient.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
        });
    },

    register: async ({ name, email, password }) => {
        return apiClient.post('/auth/register', { name, email, password });
    },

    logout: async () => {
        await apiClient.post('/auth/logout', {});
    },

    getProfile: async () => {
        const data = await apiClient.get(`${BASE_ENDPOINT}`);
        return {
            userId:      data.id,
            name:        data.name,
            email:       data.email,
            description: data.description || '',
            image:       data.profilePicture ?? null,
            role:        data.role,
        };
    },

    updateProfile: async (userData) => {
        const data = await apiClient.put(`${BASE_ENDPOINT}`, {
            name:        userData.name,
            description: userData.description || '',
        });
        return {
            name:        data.name,
            description: data.description || '',
        };
    },

    uploadProfileImage: async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        return apiClient.postForm(`${BASE_ENDPOINT}/image`, formData);
    },

    deleteProfileImage: () =>
        apiClient.delete(`${BASE_ENDPOINT}/image`),

    changePassword: (currentPassword, newPassword) =>
        apiClient.put(`${BASE_ENDPOINT}/password`, { currentPassword, newPassword }),

    // Requests an email change; requires the current password. Responds 202 — the change
    // is not applied until the new address is confirmed via the emailed link.
    changeEmail: ({ newEmail, currentPassword }) =>
        apiClient.put(`${BASE_ENDPOINT}/email`, { newEmail, currentPassword }),

};