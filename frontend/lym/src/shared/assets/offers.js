const API_BASE_URL = "http://localhost:81/api_lym";

/**
 * Función auxiliar para verificar si una oferta está activa
 * @param {Object} oferta - Objeto de oferta
 * @returns {boolean} - True si la oferta está activa
 */
const esOfertaActiva = (oferta) => {
  if (!oferta.activa) return false;

  const ahora = new Date();
  const fechaInicio = new Date(oferta.fecha_inicio);
  const fechaFin = new Date(oferta.fecha_fin);

  return ahora >= fechaInicio && ahora <= fechaFin;
};

/**
 * Función auxiliar para filtrar ofertas activas
 * @param {Array} ofertas - Array de ofertas
 * @returns {Array} - Array de ofertas activas
 */
const filtrarOfertasActivas = (ofertas) => {
  return ofertas.filter(esOfertaActiva);
};

/**
 * Obtener todas las ofertas desde el API
 */
export const getAllOfertas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/promociones`);
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

/**
 * Obtener ofertas activas (filtrando del lado del cliente)
 */
export const getOfertasActivas = async () => {
  try {
    const todasLasOfertas = await getAllOfertas();
    return filtrarOfertasActivas(todasLasOfertas);
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
 * Obtener ofertas activas por categoría (filtrando del lado del cliente)
 */
export const getOfertasActivasPorCategoria = async (categoriaId) => {
  try {
    const ofertas = await getOfertasPorCategoria(categoriaId);
    return filtrarOfertasActivas(ofertas);
  } catch (error) {
    console.error("Error fetching ofertas activas por categoría:", error);
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
 * Obtener oferta activa de un producto específico (validando del lado del cliente)
 */
export const getOfertaActivaPorProducto = async (productoId) => {
  try {
    const oferta = await getOfertaPorProducto(productoId);
    if (!oferta) return null;

    return esOfertaActiva(oferta) ? oferta : null;
  } catch (error) {
    console.error("Error fetching oferta activa por producto:", error);
    return null;
  }
};

/**
 * Función utilitaria para obtener el precio con descuento aplicado
 * @param {number} precioOriginal - Precio original del producto
 * @param {Object} oferta - Objeto de oferta
 * @returns {number} - Precio con descuento aplicado
 */
export const calcularPrecioConDescuento = (precioOriginal, oferta) => {
  if (!oferta || !esOfertaActiva(oferta)) {
    return precioOriginal;
  }

  const descuento = (precioOriginal * oferta.porcentaje) / 100;
  return precioOriginal - descuento;
};

/**
 * Función utilitaria para verificar si una oferta expira pronto
 * @param {Object} oferta - Objeto de oferta
 * @param {number} horasLimite - Número de horas antes de considerar que expira pronto (default: 24)
 * @returns {boolean} - True si la oferta expira pronto
 */
export const ofertaExpiraPronto = (oferta, horasLimite = 24) => {
  if (!esOfertaActiva(oferta)) return false;

  const ahora = new Date();
  const fechaFin = new Date(oferta.fecha_fin);
  const tiempoRestante = fechaFin.getTime() - ahora.getTime();
  const horasRestantes = tiempoRestante / (1000 * 60 * 60);

  return horasRestantes <= horasLimite && horasRestantes > 0;
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
    activa: true,
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
    activa: true,
  },
];

// Exportar funciones utilitarias también
export { esOfertaActiva, filtrarOfertasActivas };
