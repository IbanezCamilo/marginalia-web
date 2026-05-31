import { toProfileImageUrl } from "@/utils/imageUtils";
import { apiClient } from "@/lib/apiClient";

const defaultAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=44403c&color=fafaf9&bold=true`;

const BASE_ENDPOINT = '/me/profile';

export const userService = {

    login: async (credentials) => {
        const data = await apiClient.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
        });
        localStorage.setItem('token', data.token);
        return data;
    },

    register: async ({ name, email, password }) => {
        const data = await apiClient.post('/auth/register', { name, email, password });
        localStorage.setItem('token', data.token);
        return data;
    },
    
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    logout: () => {
      localStorage.removeItem('token');
    },

    getProfile: async () => {
        const data = await apiClient.get(`${BASE_ENDPOINT}`);
        return {
            userId:      data.id,
            name:        data.name,
            email:       data.email,
            description: data.description || '',
            image:       toProfileImageUrl(data.profilePicture) ?? defaultAvatar(data.name),
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
        return apiClient.postForm(`${BASE_ENDPOINT}/upload-image`, formData);
    },

};