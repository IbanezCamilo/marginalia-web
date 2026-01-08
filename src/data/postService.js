const API_URL = 'http://localhost:8080/api';
const USE_MOCK = true; // ← Cambia a false cuando quieras usar la API real

const getToken = () => localStorage.getItem('token');

// ===== DATOS MOCK (simulan respuesta del backend) =====
const mockPosts = [
  {
    id: "1",
    title: "El amor en tiempos del cólera",
    date: "2025-01-01",
    author: "Gabriel García Márquez",
    cover: "https://picsum.photos/seed/p1/800/600",
    categoryId: "disertacion",
    excerpt: "Un texto sobre la fuerza del amor a través del tiempo...",
    slug: "el-amor-en-tiempos-del-colera",
    content: "Contenido completo del artículo...",
  }
];

// ===== FUNCIONES MOCK =====
const mockService = {
  getAllPosts: async () => {
    // Simula delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("[MOCK] Obteniendo todos los posts...");
    console.log("[MOCK] Datos:", mockPosts);
    return mockPosts;
  },

  getPostById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log("[MOCK] Obteniendo post con id:", id);
    const post = mockPosts.find(p => p.id === id);
    console.log("[MOCK] Datos:", post);
    return post;
  },
/*
  getPostsByCategory: async (categoryId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log("[MOCK] Obteniendo posts de categoría:", categoryId);
    const filtered = mockPosts.filter(p => p.categoryId === categoryId);
    console.log("[MOCK] Datos:", filtered);
    return filtered;
  },
*/
  createPost: async (postData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log("[MOCK] Creando nuevo post:", postData);
    
    const newPost = {
      id: String(mockPosts.length + 1),
      ...postData,
      date: new Date().toISOString().split('T')[0],
    };
    
    mockPosts.push(newPost);
    console.log("[MOCK] Post creado:", newPost);
    return newPost;
  },
/*
  updatePost: async (id, postData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log("[MOCK] Actualizando post:", id, postData);
    
    const index = mockPosts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPosts[index] = { ...mockPosts[index], ...postData };
      console.log("[MOCK] Post actualizado:", mockPosts[index]);
      return mockPosts[index];
    }
    throw new Error('Post no encontrado');
  },

  deletePost: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log("[MOCK] Eliminando post:", id);
    
    const index = mockPosts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPosts.splice(index, 1);
      console.log("[MOCK] Post eliminado");
      return { success: true };
    }
    throw new Error('Post no encontrado');
  },
  */
};

// ===== SERVICIO REAL =====
const realService = {
/*
  getAllPosts: async () => {
    const res = await fetch(`${API_URL}/posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error('Error al obtener los posts');
    }
    
    const data = await res.json();
    return data;
  },
*/

  getPostById: async (id) => {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error('Error al obtener el post');
    }
    
    const data = await res.json();
    return data;
  },
/*
  getPostsByCategory: async (categoryId) => {
    const res = await fetch(`${API_URL}/posts/category/${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error('Error al obtener los posts de la categoría');
    }
    
    const data = await res.json();
    return data;
  },
*/
  createPost: async (postData, imageFile) => {
    const token = getToken();

    if(!token){
      throw new Error('No hay sesion activa');
    }
    
    //Prepare formData
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify({
        title: postData.title,
        content: postData.content,
        idCategory: postData.idCategory,
        status: postData.status,
      })], {type: 'application/json'})  
    );
  
    // Append image if exists
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Send request
    const response = await fetch(`${API_URL}/posts/create-post`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      const error = await response.text();
      throw new Error("Error al crear post: " + error);
    }
    
    return await response.json();
  },

  updatePost: async (id, postData) => {
    const token = getToken();
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!res.ok) {
      throw new Error('Error al actualizar el post');
    }
    
    const data = await res.json();
    return data;
  },

  deletePost: async (id) => {
    const token = getToken();
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Error al eliminar el post');
    }
    
    return { success: true };
  },
};

// ===== SELECTOR DE SERVICIO =====
const service = USE_MOCK ? mockService : realService;

// ===== EXPORTACIÓN =====
export const postService = {
  getAllPosts: (params) => service.getAllPosts(params),
  getPostById: (id) => service.getPostById(id),
  getPostsByCategory: (categoryId) => service.getPostsByCategory(categoryId),
  createPost: (postData) => service.createPost(postData),
  updatePost: (id, postData) => service.updatePost(id, postData),
  deletePost: (id) => service.deletePost(id),
};