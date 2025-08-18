const API_BASE = "/api_lym";

// Service para manejar asignaciones producto <-> extras
// Supone rutas:
// GET    /producto_extras?producto_id=ID -> lista extras del producto
// POST   /producto_extras (body { producto_id, extra_id }) -> asigna
// DELETE /producto_extras/{producto_id}/{extra_id} -> desasigna
// GET    /producto_extras/assignments -> (opcional) lista todas las asignaciones

const ProductoExtraService = {
  async getExtrasByProducto(productoId) {
    const res = await fetch(
      `${API_BASE}/producto_extras?producto_id=${encodeURIComponent(productoId)}`
    );
    if (!res.ok) throw new Error("Error obteniendo extras del producto");
    return res.json();
  },

  async attachExtra(productoId, extraId) {
    const res = await fetch(`${API_BASE}/producto_extras`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ producto_id: productoId, extra_id: extraId }),
    });
    if (!res.ok) throw new Error("Error asignando extra");
    return res.json();
  },

  async detachExtra(productoId, extraId) {
    const res = await fetch(
      `${API_BASE}/producto_extras/${encodeURIComponent(productoId)}/${encodeURIComponent(extraId)}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) throw new Error("Error removiendo extra");
    return res.json();
  },

  async getAllAssignments() {
    const res = await fetch(`${API_BASE}/producto_extras/assignments`);
    if (!res.ok) throw new Error("Error listando asignaciones");
    return res.json();
  },
};

export default ProductoExtraService;
