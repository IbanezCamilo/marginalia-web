const API_URL = 'http://localhost:8080/api';
const USE_MOCK = false; // ← Cambia a false cuando quieras usar la API real

const getToken = () => localStorage.getItem('token');

// ===== DATOS MOCK (simulan respuesta del backend) =====
const mockUser = {
  userId: 1,
  name: "Camilo Ibáñez",
  email: "camilo@example.com",
  description: "Apasionado por la escritura y la tecnología. Me gusta crear contenido que inspire y eduque.",
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg",
  role: "Autor"
};

// ===== FUNCIONES MOCK =====
const mockService = {
    login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("[MOCK] Login simulado:", credentials.email);
    
    // Simula validación (en el mock siempre es exitosa)
    if (!credentials.email || !credentials.password) {
      throw new Error('Email y contraseña son requeridos');
    }

    // Genera un token falso
    const fakeToken = `mock-token-${Date.now()}-${Math.random()}`;
    console.log("[MOCK] Token generado:", fakeToken);
    
    // Guarda el token automáticamente
    localStorage.setItem('token', fakeToken);
    
    return { token: fakeToken };
  },
  
  getProfile: async () => {
    // Simula delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("[MOCK] Obteniendo perfil...");
    console.log("[MOCK] Datos:", mockUser);
    return mockUser; // ← Devuelve el objeto completo
  },

  updateProfile: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log("[MOCK] Actualizando perfil:", userData);
    
    // Actualiza el mock local
    mockUser.name = userData.name;
    mockUser.description = userData.description;
    
    console.log("[MOCK] Usuario actualizado:", mockUser);
    return mockUser;
  },

  uploadProfileImage: async (imageFile) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("[MOCK] Subiendo imagen:", imageFile.name);
    
    // Simula que devuelve una URL
    const fakeUrl = URL.createObjectURL(imageFile);
    mockUser.image = fakeUrl; // ← IMPORTANTE: usar "image", no "profilePicture"
    
    console.log("[MOCK] Nueva imagen:", mockUser.image);
    return mockUser;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const isAuth = !!token;
    console.log("[MOCK] ¿Autenticado?", isAuth, "| Token:", token?.substring(0, 20) + "...");
    return isAuth;
  },

  logout: () => {
    console.log("[MOCK] Cerrando sesión...");
    localStorage.removeItem('token');
  },
  
};

// ===== SERVICIO REAL =====
const realService = {

  login: async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

  if (!res.ok) {
  setError("Credenciales incorrectas");
  return;
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  return data;
  },
getProfile: async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No hay sesión activa. Por favor inicia sesión.');
  }

  const response = await fetch(`${API_URL}/user/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
    }
    throw new Error('Error al obtener el perfil');
  }

  const data = await response.json();

  console.log('📥 Perfil recibido:', data);

  //Convertir URL relativa a absoluta
  let imageUrl = data.image || "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg";
  
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `http://localhost:8080${imageUrl}`;
  }

  console.log('🖼️ URL de imagen procesada:', imageUrl);

  return {
    userId: data.id,
    name: data.name,
    email: data.email,
    description: data.description || "",
    image: imageUrl, // URL absoluta
    role: data.role,
  };
},

  updateProfile: async (userData) => {
    const token = getToken();
    if (!token) {
      throw new Error('No hay sesión activa');
    }

    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        description: userData.description || '',
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sesión expirada');
      }
      throw new Error('Error al actualizar perfil');
    }

    const data = await response.json();
    
    // Mapear respuesta
    return {
      name: data.name,
      description: data.description || "",
    };
  },

  uploadProfileImage: async (imageFile) => {
    const token = getToken();
    if (!token) {
      throw new Error('No hay sesión activa');
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    console.log("Subiendo imagen al servidor:", imageFile.name);
    const response = await fetch(`${API_URL}/user/profile/upload-image`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        // NO incluir Content-Type con FormData
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir la imagen');
    }

    const data = await response.json();
    
    // Mapear respuesta
    return {
      imageUrl: data.imageUrl,
    };
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// ===== EXPORTA EL SERVICIO SEGÚN LA CONFIGURACIÓN =====
export const userService = USE_MOCK ? mockService : realService;