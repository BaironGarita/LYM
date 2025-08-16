const API_BASE = "/api_lym";

const CategoriaService = {
  async getCategorias() {
    const res = await fetch(`${API_BASE}/categorias`);
    if (!res.ok) throw new Error("Error cargando categorías");
    return res.json();
  },

  async getCategoria(id) {
    const res = await fetch(
      `${API_BASE}/categorias?id=${encodeURIComponent(id)}`
    );
    if (!res.ok) throw new Error("Error obteniendo categoría");
    return res.json();
  },

  async createCategoria(data) {
    const res = await fetch(`${API_BASE}/categorias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error creando categoría");
    return res.json();
  },

  async updateCategoria(id, data) {
    const payload = { ...data, id };
    const res = await fetch(`${API_BASE}/categorias`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error actualizando categoría");
    return res.json();
  },

  async deleteCategoria(id) {
    const res = await fetch(`${API_BASE}/categorias`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Error eliminando categoría");
    return res.json();
  },
};

export default CategoriaService;
