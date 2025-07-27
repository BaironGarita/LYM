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
