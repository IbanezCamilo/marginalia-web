const API_URL = 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('token');

const categoryService = {

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

// ===== EXPORTACIÓN =====
export {categoryService};
