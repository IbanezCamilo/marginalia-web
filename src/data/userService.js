// src/services/userService.js

const API_URL = 'http://localhost:8080/api';
const USE_MOCK = true; // ← Cambia a false cuando quieras usar la API real

const getToken = () => localStorage.getItem('token');

// ===== DATOS MOCK (falsos) =====
const mockUser = {
  idUsuario: 1,
  nombre: "Camilo Ibáñez",
  email: "camilo@example.com",
  descripcion: "Apasionado por la escritura y la tecnología. Me gusta crear contenido que inspire y eduque.",
  fotoPerfil: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg",
  rol: "Autor"
};

// ===== FUNCIONES MOCK =====
const mockService = {
  getProfile: async () => {
    // Simula delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("📦 [MOCK] Obteniendo perfil...");
    return mockUser;
  },

  updateProfile: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log("📦 [MOCK] Actualizando perfil:", userData);
    
    // Actualiza el mock local
    mockUser.nombre = userData.nombre;
    mockUser.descripcion = userData.descripcion;
    
    return mockUser;
  },

  uploadProfileImage: async (imageFile) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("📦 [MOCK] Subiendo imagen:", imageFile.name);
    
    // Simula que devuelve una URL
    const fakeUrl = URL.createObjectURL(imageFile);
    mockUser.fotoPerfil = fakeUrl;
    
    return mockUser;
  },
};

// ===== SERVICIO REAL =====
const realService = {
  getProfile: async () => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error al obtener el perfil');
    return response.json();
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: userData.nombre,
        descripcion: userData.descripcion || '',
      }),
    });
    if (!response.ok) throw new Error('Error al actualizar perfil');
    return response.json();
  },

  uploadProfileImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('imagen', imageFile);
    const response = await fetch(`${API_URL}/users/profile/image`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    });
    if (!response.ok) throw new Error('Error al subir la imagen');
    return response.json();
  },
};

// ===== EXPORTA EL SERVICIO SEGÚN LA CONFIGURACIÓN =====
export const userService = USE_MOCK ? mockService : realService;