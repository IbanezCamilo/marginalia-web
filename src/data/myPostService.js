const API_URL = "http://localhost:8080/api/me/posts";


const getToken = () => localStorage.getItem("token");

const myPostService = {
    
    createPost: async (postData, imageFile) => {
    const token = getToken();

    if(!token){
      throw new Error('No hay sesion activa');
    }

        // Verify required fields
    console.log('📤 Datos a enviar:', {
      title: postData.title,
      content: postData.content?.substring(0, 50) + '...',
      categoryId: postData.categoryId,
      status: postData.status,
    });

    // Send request
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: postData.title,
        content: postData.content,
        categoryId: postData.categoryId,
        status: postData.status,
      }),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error("Error al crear el post");
    }
      
    const createdPost = await response.json();
    console.log("Post creado:", createdPost);

    //Image exist
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      const imgResponse = await fetch(`${API_URL}/${createdPost.id}/cover-image`, {
        method : "POST",
        headers: {"Authorization": `Bearer ${token}`},
        body: formData,
      });

      if(!imgResponse.ok){
        console.warn("Post creado pero fallo la subida de la imagen", await imgResponse.text())
      }else{
        return await imgResponse.json();
      }
    }
    return createdPost;
  },

  getAllMyPosts: async (page = 0, size = 10) => {
    const token = getToken();

    if(!token){
      throw new Error('No hay sesion activa');
    }

    //Send request
    const response = await fetch(`${API_URL}?page=${page}&size=${size}&sort=createdAt,desc`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      if (response.status === 401)throw new Error("Sesión expirada");
      const errorText = await response.text();
      throw new Error(`Error al obtener los posts: ${response.status} -- ${errorText}`);
    }

    return await response.json();
  },

  getPostById: async (postId) => {
    const token = getToken();

    if(!token){
      throw new Error('No hay sesion activa');
    }

    const response = await fetch(`${API_URL}/${postId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    })

    if(!response.ok){
      if (response.status === 401)throw new Error("Sesión expirada");
      if(response.status === 404)throw new Error("Post no encontrado");
      const errorText = await response.text();
      throw new Error(`Error al obtener el post: ${response.status} -- ${errorText}`);
    }

    return await response.json();
  },

  updatePost: async (postId, postData, imageFile) => {
    const token = getToken();
    
    if(!token) throw new Error('No hay sesion activa');

        const response = await fetch(`${API_URL}/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: postData.title,
        content: postData.content,
        categoryId: postData.categoryId,
        status: postData.status,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("Sesión expirada");
      const errorText = await response.text();
      throw new Error("Error al actualizar el post: " + errorText);
    }

    const updatedPost = await response.json();

    // Upload new image if provided
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      const imgResponse = await fetch(
        `${API_URL}/${postId}/cover-image`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!imgResponse.ok) {
        console.warn("Post actualizado pero falló la subida de la imagen");
      } else {
        return await imgResponse.json();
      }
    }

    return updatedPost;
  },

  /// Update Post Status
  updateStatus: async (postId, newStatus) => {
    const token = getToken();

    if (!token) throw new Error("No hay sesión activa");

    const response = await fetch(`${API_URL}/${postId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok){
      if(response.status === 401) throw new Error("Sesión expirada");
      const errorText = await response.text();
      throw new Error(`Error al actualizar el estado del post: ${response.status} -- ${errorText}`);
    }

    return await response.json();
  },

    // Delete Posts
  deletePost: async (postId) => {
    const token = getToken();
    if (!token) throw new Error("No hay sesion activa");

    const response = await fetch(`${API_URL}/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("Sesión expirada");
      throw new Error("Error al eliminar el post");
    }

    // 204 No Content
    return true;
  },
    
};
export const MyPostService = {
  createPost: (postData, imageFile) => myPostService.createPost(postData, imageFile),
  getAllMyPosts: (page, size) => myPostService.getAllMyPosts(page, size),
  getPostById: (postId) => myPostService.getPostById(postId),
  updatePost: (postId, postData, imageFile) => myPostService.updatePost(postId, postData, imageFile),
  updateStatus: (postId, newStatus) => myPostService.updateStatus(postId, newStatus),
  deletePost: (postId) => myPostService.deletePost(postId),
};