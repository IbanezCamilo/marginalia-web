const API_URL = 'http://localhost:8080/api';
const USE_MOCK = false; // ← Cambia a false cuando quieras usar la API real

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

// ===== SERVICIO REAL =====
const realService = {
  createPost: async (postData, imageFile) => {
    const token = getToken();

    if(!token){
      throw new Error('No hay sesion activa');
    }
    
    //Prepare formData
    const formData = new FormData();
    formData.append(
      'postData',
      new Blob([JSON.stringify({
        title: postData.title,
        content: postData.content,
        idCategory: postData.idCategory,
        status: postData.status,
      })], {type: 'application/json'})  
    );
  
    // Append image if exists
    if (imageFile) {
      formData.append("postImage", imageFile);
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

      console.log("Response not ok:", response);

      const error = await response.text();
      throw new Error("Error al crear post: " + error);
    }
    
    return await response.json();
  },

};
// ===== SELECTOR DE SERVICIO =====
const service = USE_MOCK ? mockService : realService;

// ===== EXPORTACIÓN =====
export const postService = {
  createPost: (postData, imageFile) => service.createPost(postData, imageFile),
};