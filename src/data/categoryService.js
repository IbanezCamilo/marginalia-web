const API_URL = 'http://localhost:8080/api';
const USE_MOCK = true; // ← Cambia a false cuando quieras usar la API real

const getToken = () => localStorage.getItem('token');

const mockCategories = [
  { id: 1, name: "Ensayo", slug: "ensayo", createdAt: "2024-11-12T10:15:00Z" },
  { id: 2, name: "Disertación", slug: "disertacion", createdAt: "2024-11-15T14:42:00Z" },
  { id: 3, name: "Reseña", slug: "resena", createdAt: "2024-11-18T09:30:00Z" },
  { id: 4, name: "Clásicos literarios", slug: "clasicos-literarios", createdAt: "2024-11-20T18:05:00Z" },
  { id: 5, name: "Biografía", slug: "biografia", createdAt: "2024-11-25T11:20:00Z" },
  { id: 6, name: "Entrevista", slug: "entrevista", createdAt: "2024-11-28T16:55:00Z" },
  { id: 7, name: "Reflexión", slug: "reflexion", createdAt: "2024-12-01T08:10:00Z" },
  { id: 8, name: "Ficción", slug: "ficcion", createdAt: "2024-12-03T19:40:00Z" }
];

// ===== FUNCIONES MOCK =====
const mockService = {
  getAllCategories: async () => {
    // Simula delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log("[MOCK] Obteniendo todas las categorías...");
    console.log("[MOCK] Datos:", mockCategories);
    return mockCategories;
  },
/*
  getCategoryById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log("[MOCK] Obteniendo categoría con id:", id);
    const category = mockCategories.find(c => c.id === id);
    console.log("[MOCK] Datos:", category);
    return category;
  },

  getCategoryBySlug: async (slug) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log("[MOCK] Obteniendo categoría con slug:", slug);
    const category = mockCategories.find(c => c.slug === slug);
    console.log("[MOCK] Datos:", category);
    return category;
  },

  createCategory: async (categoryData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log("[MOCK] Creando nueva categoría:", categoryData);
    
    const newCategory = {
      id: Math.max(...mockCategories.map(c => c.id)) + 1,
      ...categoryData,
    };
    
    mockCategories.push(newCategory);
    console.log("[MOCK] Categoría creada:", newCategory);
    return newCategory;
  },

  updateCategory: async (id, categoryData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log("[MOCK] Actualizando categoría:", id, categoryData);
    
    const index = mockCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCategories[index] = { ...mockCategories[index], ...categoryData };
      console.log("[MOCK] Categoría actualizada:", mockCategories[index]);
      return mockCategories[index];
    }
    throw new Error('Categoría no encontrada');
  },

  deleteCategory: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("[MOCK] Eliminando categoría:", id);
    
    const index = mockCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCategories.splice(index, 1);
      console.log("[MOCK] Categoría eliminada");
      return { success: true };
    }
    throw new Error('Categoría no encontrada');
  },
  */
};

// ===== SERVICIO REAL =====
const realService = {

  getAllCategories: async () => {
    const res = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error('Error al obtener las categorías');
    }
    
    const data = await res.json();
    return data;
  },

  getCategoryById: async (id) => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error('Error al obtener la categoría');
    }
    
    const data = await res.json();
    return data;
  },

  getCategoryBySlug: async (slug) => {
    const res = await fetch(`${API_URL}/categories/slug/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error('Error al obtener la categoría');
    }
    
    const data = await res.json();
    return data;
  },

  createCategory: async (categoryData) => {
    const token = getToken();
    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    if (!res.ok) {
      throw new Error('Error al crear la categoría');
    }
    
    const data = await res.json();
    return data;
  },

  updateCategory: async (id, categoryData) => {
    const token = getToken();
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    if (!res.ok) {
      throw new Error('Error al actualizar la categoría');
    }
    
    const data = await res.json();
    return data;
  },

  deleteCategory: async (id) => {
    const token = getToken();
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Error al eliminar la categoría');
    }
    
    return { success: true };
  },
};

// ===== SELECTOR DE SERVICIO =====
const service = USE_MOCK ? mockService : realService;

// ===== EXPORTACIÓN =====
export const categoryService = {
  getAllCategories: () => service.getAllCategories(),
  getCategoryById: (id) => service.getCategoryById(id),
  getCategoryBySlug: (slug) => service.getCategoryBySlug(slug),
  createCategory: (categoryData) => service.createCategory(categoryData),
  updateCategory: (id, categoryData) => service.updateCategory(id, categoryData),
  deleteCategory: (id) => service.deleteCategory(id),
};
