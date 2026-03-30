import { toAbsoluteUrl } from "@/utils/imageUtils";
import { apiClient } from "../lib/apiClient";

const DEFAULT_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg";

const userService = {

    login: async (credentials) => {
        const data = await apiClient.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
        });
        localStorage.setItem('token', data.token);
        return data;
  },

    getProfile: async () => {
        const data = await apiClient.get('/me/profile');
        return {
            userId:      data.id,
            name:        data.name,
            email:       data.email,
            description: data.description || '',
            image:       toAbsoluteUrl(data.profilePicture, DEFAULT_AVATAR),
            role:        data.role,
        };
    },

    updateProfile: async (userData) => {
        const data = await apiClient.put('/me/profile', {
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
        return apiClient.postForm('/me/profile/upload-image', formData);
    },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

export { userService };