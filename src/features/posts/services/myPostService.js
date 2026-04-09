import { apiClient } from "@/lib/apiClient"; 

const BASE_ENDPOINT = "/me/posts";

export const postService = {
    getAll: async (page = 0, size = 10) =>
    apiClient.get(`${BASE_ENDPOINT}?page=${page}&size=${size}&sort=createdAt,desc`),
    
    getById: (id) =>
      apiClient.get(`${BASE_ENDPOINT}/${id}`),
    
    create: async (data, imageFile) => {
      const created = await apiClient.post(BASE_ENDPOINT, {
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        status: data.status,
      });

    //Image exist
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      //Use apiClient to handle auth and content-type automatically
      return apiClient.postForm(`${BASE_ENDPOINT}/${created.id}/cover-image`, formData);
    }
    return created;
  },
  
  update: async (id, data, imageFile) => {
      const updated = await apiClient.put(`${BASE_ENDPOINT}/${id}`, {
          title:      data.title,
          content:    data.content,
          categoryId: data.categoryId,
          status:     data.status,
      });

      if (imageFile) {
          const formData = new FormData();
          formData.append('image', imageFile);
          return apiClient.postForm(`${BASE_ENDPOINT}/${id}/cover-image`, formData);
      }

      return updated;
  },

  updateStatus: (id, newStatus) =>
      apiClient.patch(`${BASE_ENDPOINT}/${id}/status`, { status: newStatus }),

  delete: (id) =>
      apiClient.delete(`${BASE_ENDPOINT}/${id}`),

};