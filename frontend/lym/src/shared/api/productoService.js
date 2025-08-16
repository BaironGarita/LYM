/**
 * Servicio para la gestión de productos
 */
const BASE_URL = "http://localhost:81/api_lym";

// Una función auxiliar para manejar las peticiones y errores de fetch
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      // Intentar leer el mensaje de error del backend
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        errorData.message || `Error en la petición: ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    console.error(`Error en apiRequest para ${url}:`, error);
    throw error; // Re-lanzar el error para que el componente que llama lo pueda manejar
  }
};

const ProductoService = {
  /**
   * Obtener todos los productos
   */
  getProductos: () => {
    return apiRequest(`${BASE_URL}/productos`);
  },

  /**
   * Obtener un producto por ID
   */
  getProducto: (id) => {
    return apiRequest(`${BASE_URL}/productos/${id}`);
  },

  /**
   * Obtener todas las categorías
   */
  getCategorias: () => {
    return apiRequest(`${BASE_URL}/categorias`);
  },

  /**
   * Obtener todas las etiquetas
   */
  getEtiquetas: () => {
    return apiRequest(`${BASE_URL}/etiquetas`);
  },

  /**
   * Crear un nuevo producto
   */
  createProducto: (formData) => {
    return apiRequest(`${BASE_URL}/productos`, {
      method: "POST",
      body: formData, // FormData no necesita 'Content-Type' header, el navegador lo pone
    });
  },

  /**
   * Opciones de personalización (backend)
   */
  getOpcionesPersonalizacion: () => {
    return apiRequest(`${BASE_URL}/opciones`);
  },

  /**
   * Valores de una opción de personalización
   * @param {number|string} opcionId
   */
  getValoresPorOpcion: (opcionId) => {
    return apiRequest(
      `${BASE_URL}/valores_personalizacion?opcion_id=${opcionId}`
    );
  },

  /**
   * Asociar una opción a un producto (producto_personalizacion)
   * @param {object} payload - { producto_id, opcion_id, obligatorio }
   */
  createProductoPersonalizacion: (payload) => {
    return apiRequest(`${BASE_URL}/producto_personalizacion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  /**
   * Eliminar asociación producto-opción
   * Puede recibir un id de asociación o producto_id+opcion_id
   */
  deleteProductoPersonalizacion: ({ id, producto_id, opcion_id } = {}) => {
    if (id) {
      return apiRequest(`${BASE_URL}/producto_personalizacion/${id}`, {
        method: "DELETE",
      });
    }
    if (producto_id && opcion_id) {
      // usar query params
      return apiRequest(
        `${BASE_URL}/producto_personalizacion?producto_id=${producto_id}&opcion_id=${opcion_id}`,
        { method: "DELETE" }
      );
    }
    return Promise.reject(
      new Error("Parámetros insuficientes para eliminar asociación")
    );
  },

  /**
   * Actualizar un producto existente
   */
  updateProducto: (id, formData) => {
    // Para 'update', el backend podría esperar POST en lugar de PUT con FormData
    return apiRequest(`${BASE_URL}/productos/${id}`, {
      method: "POST", // O 'PUT' si tu backend lo soporta correctamente con FormData
      body: formData,
    });
  },

  /**
   * Eliminar un producto
   */
  deleteProducto: (id) => {
    return apiRequest(`${BASE_URL}/productos/${id}`, {
      method: "DELETE",
    });
  },
};

export default ProductoService;
