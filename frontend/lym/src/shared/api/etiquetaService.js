const API_BASE = "/api_lym";

const EtiquetaService = {
  async getEtiquetas() {
    const res = await fetch(`${API_BASE}/etiquetas`);
    if (!res.ok) throw new Error("Error cargando etiquetas");
    return res.json();
  },

  async getEtiqueta(id) {
    const res = await fetch(
      `${API_BASE}/etiquetas?id=${encodeURIComponent(id)}`
    );
    if (!res.ok) throw new Error("Error obteniendo etiqueta");
    return res.json();
  },

  async createEtiqueta(data) {
    const res = await fetch(`${API_BASE}/etiquetas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error creando etiqueta");
    return res.json();
  },

  async updateEtiqueta(id, data) {
    const payload = { ...data, id };
    const res = await fetch(`${API_BASE}/etiquetas`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error actualizando etiqueta");
    return res.json();
  },

  async deleteEtiqueta(id) {
    const res = await fetch(`${API_BASE}/etiquetas`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Error eliminando etiqueta");
    return res.json();
  },
};

export default EtiquetaService;
