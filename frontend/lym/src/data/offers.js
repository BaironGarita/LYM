const API_BASE_URL = "http://localhost:81/api_lym";

/**
 * Obtener ofertas activas desde el API
 */
export const getOfertasActivas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ofertas/activas`);
    if (!response.ok) {
      throw new Error("Error al cargar las ofertas");
    }
    const ofertas = await response.json();
    return ofertas || [];
  } catch (error) {
    console.error("Error fetching ofertas activas:", error);
    return [];
  }
};

/**
 * Obtener ofertas por categoría desde el API
 */
export const getOfertasPorCategoria = async (categoriaId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ofertas/categoria?categoria_id=${categoriaId}`
    );
    if (!response.ok) {
      throw new Error("Error al cargar las ofertas por categoría");
    }
    const ofertas = await response.json();
    return ofertas || [];
  } catch (error) {
    console.error("Error fetching ofertas por categoría:", error);
    return [];
  }
};

/**
 * Obtener oferta de un producto específico desde el API
 */
export const getOfertaPorProducto = async (productoId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ofertas/producto?producto_id=${productoId}`
    );
    if (!response.ok) {
      throw new Error("Error al cargar la oferta del producto");
    }
    const oferta = await response.json();
    return oferta;
  } catch (error) {
    console.error("Error fetching oferta por producto:", error);
    return null;
  }
};

/**
 * Obtener todas las ofertas desde el API
 */
export const getAllOfertas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ofertas`);
    if (!response.ok) {
      throw new Error("Error al cargar todas las ofertas");
    }
    const ofertas = await response.json();
    return ofertas || [];
  } catch (error) {
    console.error("Error fetching todas las ofertas:", error);
    return [];
  }
};

// Datos de ejemplo para desarrollo (fallback)
export const ofertasEjemplo = [
  {
    id: 1,
    nombre: "Descuento Temporada",
    descripcion: "Gran descuento en toda la colección",
    porcentaje: 30,
    tipo: "categoria",
    categoria_id: 1,
    categoria_nombre: "Ropa",
    fecha_inicio: "2025-07-01 00:00:00",
    fecha_fin: "2025-08-31 23:59:59",
    activo: 1,
  },
  {
    id: 2,
    nombre: "Oferta Flash",
    descripcion: "Descuento especial en productos seleccionados",
    porcentaje: 25,
    tipo: "producto",
    producto_id: 123,
    producto_nombre: "Producto Premium",
    fecha_inicio: "2025-07-20 00:00:00",
    fecha_fin: "2025-07-30 23:59:59",
    activo: 1,
  },
];
