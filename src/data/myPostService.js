const API_URL = "http://localhost:8080/api/me/posts";


const getToken = () => localStorage.getItem("token");


const myPostService = {
    
    createPost: async (postData, imageFile) => {
    const token = getToken();

    if(!token){
      throw new Error('No hay sesion activa');
    }

        // Verificar datos antes de enviar
    console.log('📤 Datos a enviar:', {
      title: postData.title,
      content: postData.content?.substring(0, 50) + '...',
      categoryId: postData.categoryId,
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
};

export const MyPostService = {
  createPost: (postData, imageFile) => myPostService.createPost(postData, imageFile),
};