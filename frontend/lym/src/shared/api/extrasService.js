const API_BASE = "/api_lym";

const ExtrasService = {
  async getExtras() {
    const res = await fetch(`${API_BASE}/extras`);
    if (!res.ok) throw new Error("Error cargando extras");
    return res.json();
  },

  async getExtra(id) {
    const res = await fetch(`${API_BASE}/extras?id=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error("Error obteniendo extra");
    return res.json();
  },

  async createExtra(data) {
    const res = await fetch(`${API_BASE}/extras`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error creando extra");
    return res.json();
  },

  async updateExtra(id, data) {
    const payload = { ...data, id };
    const res = await fetch(`${API_BASE}/extras`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error actualizando extra");
    return res.json();
  },

  async deleteExtra(id) {
    const res = await fetch(`${API_BASE}/extras`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Error eliminando extra");
    return res.json();
  },
};

export default ExtrasService;
