const API_URL = 'http://localhost:8080/api';
const USE_MOCK = false; // ← Cambia a false cuando quieras usar la API real

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
      const errorText = await res.text();
      console.error("❌ Error del servidor:", errorText);
      throw new Error(`Error al obtener las categorías: ${res.status} - ${errorText}`);
    }

    console.log("📊 Status:", res.status);
    console.log("📋 Headers:", [...res.headers.entries()]);
    
    const data = await res.json();
    return data;
  },

};

// ===== SELECTOR DE SERVICIO =====
const service = USE_MOCK ? mockService : realService;

// ===== EXPORTACIÓN =====
export const categoryService = {
  getAllCategories: () => service.getAllCategories(),
};
