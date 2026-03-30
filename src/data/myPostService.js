import { apiClient } from "../lib/apiClient"; 

const BASE_ENDPOINT = "/me/posts";

const myPostService = {
    
    createPost: async (postData, imageFile) => {
      const createdPost = await apiClient.post(BASE_ENDPOINT, {
        title: postData.title,
        content: postData.content,
        categoryId: postData.categoryId,
        status: postData.status,
      });

    //Image exist
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      //Use apiClient to handle auth and content-type automatically
      return apiClient.postForm(`${BASE_ENDPOINT}/${createdPost.id}/cover-image`, formData);
    }
    return createdPost;
  },

  getAllMyPosts: async (page = 0, size = 10) =>
    apiClient.get(`${BASE_ENDPOINT}?page=${page}&size=${size}&sort=createdAt,desc`),

  getPostById: (postId) =>
    apiClient.get(`${BASE_ENDPOINT}/${postId}`),

  updatePost: async (postId, postData, imageFile) => {
      const updatedPost = await apiClient.put(`${BASE_ENDPOINT}/${postId}`, {
          title:      postData.title,
          content:    postData.content,
          categoryId: postData.categoryId,
          status:     postData.status,
      });

      if (imageFile) {
          const formData = new FormData();
          formData.append('image', imageFile);
          return apiClient.postForm(`${BASE_ENDPOINT}/${postId}/cover-image`, formData);
      }

      return updatedPost;
  },

  updateStatus: (postId, newStatus) =>
      apiClient.patch(`${BASE_ENDPOINT}/${postId}/status`, { status: newStatus }),

  deletePost: (postId) =>
      apiClient.delete(`${BASE_ENDPOINT}/${postId}`),

};
export const MyPostService = {
  createPost: (postData, imageFile) => myPostService.createPost(postData, imageFile),
  getAllMyPosts: (page, size) => myPostService.getAllMyPosts(page, size),
  getPostById: (postId) => myPostService.getPostById(postId),
  updatePost: (postId, postData, imageFile) => myPostService.updatePost(postId, postData, imageFile),
  updateStatus: (postId, newStatus) => myPostService.updateStatus(postId, newStatus),
  deletePost: (postId) => myPostService.deletePost(postId),
};